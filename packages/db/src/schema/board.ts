import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";
import { user } from "./auth"; // Import the user schema

// --- Core Trello Schemas (Board -> List -> Card) ---

export const board = pgTable("board", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const boardRelations = relations(board, ({ one, many }) => ({
  user: one(user, {
    fields: [board.userId],
    references: [user.id],
  }),
  lists: many(list),
  auditLogs: many(auditLog), // A board has many audit log entries
}));

export const list = pgTable("list", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  position: integer("position").notNull(),
  boardId: text("board_id")
    .notNull()
    .references(() => board.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const listRelations = relations(list, ({ one, many }) => ({
  board: one(board, {
    fields: [list.boardId],
    references: [board.id],
  }),
  cards: many(card),
}));

export const card = pgTable("card", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  position: integer("position").notNull(),
  listId: text("list_id")
    .notNull()
    .references(() => list.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const cardRelations = relations(card, ({ one }) => ({
  list: one(list, {
    fields: [card.listId],
    references: [list.id],
  }),
}));

// --- Audit Log / Activity Feed Schema ---

export const auditActionEnum = pgEnum("audit_action", [
  "CREATE",
  "UPDATE",
  "DELETE",
]);

export const auditEntityEnum = pgEnum("audit_entity", [
  "BOARD",
  "LIST",
  "CARD",
]);

export const auditLog = pgTable("audit_log", {
  id: text("id").primaryKey(),
  boardId: text("board_id")
    .notNull()
    .references(() => board.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  action: auditActionEnum("action").notNull(), // CREATE, UPDATE, DELETE
  entityId: text("entity_id").notNull(), // ID of the board, list, or card
  entityType: auditEntityEnum("entity_type").notNull(), // BOARD, LIST, or CARD
  entityTitle: text("entity_title").notNull(), // Name/title of the item at the time of action

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const auditLogRelations = relations(auditLog, ({ one }) => ({
  board: one(board, {
    fields: [auditLog.boardId],
    references: [board.id],
  }),
  user: one(user, {
    fields: [auditLog.userId],
    references: [user.id],
  }),
}));

// --- Inferred Types for Zod/API usage ---

export type Board = typeof board.$inferSelect;
export type NewBoard = typeof board.$inferInsert;

export type List = typeof list.$inferSelect;
export type NewList = typeof list.$inferInsert;

export type Card = typeof card.$inferSelect;
export type NewCard = typeof card.$inferInsert;

export type AuditLog = typeof auditLog.$inferSelect;
export type NewAuditLog = typeof auditLog.$inferInsert;