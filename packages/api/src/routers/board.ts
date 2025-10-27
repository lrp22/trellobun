import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@trellobun/db";
import {
  auditLog as auditLogSchema,
  board as boardSchema,
  card as cardSchema,
  list as listSchema,
} from "@trellobun/db/schema/board";

import { createId } from "@paralleldrive/cuid2";
import { protectedProcedure, router } from "../index";

// We will build routers for cards and lists separately for organization,
// then merge them into the main boardRouter.

// =================================================================
// Card Router
// Handles operations specific to cards (create, update, move, etc.)
// =================================================================
const cardRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        listId: z.string(),
        title: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Transaction ensures that both the card creation and the audit log
      // either succeed together or fail together.
      return db.transaction(async (tx) => {
        // 1. Authorize: Check if the user has access to the list's board.
        const list = await tx.query.list.findFirst({
          where: eq(listSchema.id, input.listId),
          columns: { boardId: true },
        });

        if (!list) {
          throw new Error("List not found");
        }

        const board = await tx.query.board.findFirst({
          where: and(
            eq(boardSchema.id, list.boardId),
            eq(boardSchema.userId, ctx.session.user.id)
          ),
          columns: { id: true },
        });

        if (!board) {
          throw new Error("Board access denied");
        }

        // 2. Determine the position for the new card (append to the end).
        const lastCard = await tx.query.card.findFirst({
          where: eq(cardSchema.listId, input.listId),
          orderBy: (c, { desc }) => [desc(c.position)],
          columns: { position: true },
        });
        const newPosition = lastCard ? lastCard.position + 1 : 0;

        // 3. Create the card.
        const newCardId = createId();
        await tx.insert(cardSchema).values({
          id: newCardId,
          listId: input.listId,
          title: input.title,
          position: newPosition,
        });

        // 4. Create an audit log entry.
        await tx.insert(auditLogSchema).values({
          id: createId(),
          boardId: board.id,
          userId: ctx.session.user.id,
          action: "CREATE",
          entityType: "CARD",
          entityId: newCardId,
          entityTitle: input.title,
        });

        return { id: newCardId };
      });
    }),

  // Add more card procedures here: updateTitle, updateDescription, delete, etc.
});

// =================================================================
// List Router
// Handles operations specific to lists (create, rename, etc.)
// =================================================================
const listRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        boardId: z.string(),
        name: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return db.transaction(async (tx) => {
        // 1. Authorize: Check if the user owns the board.
        const board = await tx.query.board.findFirst({
          where: and(
            eq(boardSchema.id, input.boardId),
            eq(boardSchema.userId, ctx.session.user.id)
          ),
          columns: { id: true },
        });

        if (!board) {
          throw new Error("Board access denied");
        }

        // 2. Determine the position for the new list.
        const lastList = await tx.query.list.findFirst({
          where: eq(listSchema.boardId, input.boardId),
          orderBy: (l, { desc }) => [desc(l.position)],
          columns: { position: true },
        });
        const newPosition = lastList ? lastList.position + 1 : 0;

        // 3. Create the list.
        const newListId = createId();
        await tx.insert(listSchema).values({
          id: newListId,
          boardId: input.boardId,
          name: input.name,
          position: newPosition,
        });

        // 4. Create an audit log entry.
        await tx.insert(auditLogSchema).values({
          id: createId(),
          boardId: board.id,
          userId: ctx.session.user.id,
          action: "CREATE",
          entityType: "LIST",
          entityId: newListId,
          entityTitle: input.name,
        });

        return { id: newListId };
      });
    }),

  // Add more list procedures here: rename, delete, reorder, etc.
});

// =================================================================
// Board Router (Main)
// Handles top-level board operations and merges the nested routers.
// =================================================================
export const boardRouter = router({
  // Procedure to create a brand new board.
  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return db.transaction(async (tx) => {
        const newBoardId = createId();

        // 1. Create the board.
        await tx.insert(boardSchema).values({
          id: newBoardId,
          name: input.name,
          userId: ctx.session.user.id, // Assign ownership
        });

        // 2. Create an audit log entry for board creation.
        await tx.insert(auditLogSchema).values({
          id: createId(),
          boardId: newBoardId,
          userId: ctx.session.user.id,
          action: "CREATE",
          entityType: "BOARD",
          entityId: newBoardId,
          entityTitle: input.name,
        });

        return { id: newBoardId };
      });
    }),

  // Procedure to get all boards owned by the current user (for a dashboard page).
  getMyBoards: protectedProcedure.query(async ({ ctx }) => {
    return db.query.board.findMany({
      where: eq(boardSchema.userId, ctx.session.user.id),
      orderBy: (b, { desc }) => [desc(b.updatedAt)],
    });
  }),

  // Procedure to get a single board with all its lists and cards.
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      // We use Drizzle's relational queries (`with:`) to fetch everything in one go.
      const board = await db.query.board.findFirst({
        // Security check is built-in: find the board where the ID matches
        // AND the userId matches the logged-in user.
        where: and(
          eq(boardSchema.id, input.id),
          eq(boardSchema.userId, ctx.session.user.id)
        ),
        with: {
          lists: {
            orderBy: (l, { asc }) => [asc(l.position)], // Order lists by position
            with: {
              cards: {
                orderBy: (c, { asc }) => [asc(c.position)], // Order cards by position
              },
            },
          },
        },
      });

      if (!board) {
        throw new Error("Board not found or access denied.");
      }

      return board;
    }),

  // Nest the other routers to create logical API endpoints
  // e.g., `board.list.create`, `board.card.create`
  list: listRouter,
  card: cardRouter,
});
