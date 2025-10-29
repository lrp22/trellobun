import { authClient } from "@/lib/auth-client";
import { trpc } from "@/utils/trpc";
import { useQuery, useMutation } from "@tanstack/react-query";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, MoreVertical, Trash2, Edit2, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Loader from "@/components/loader";

export const Route = createFileRoute("/board/$id")({
  component: BoardDetailComponent,
  beforeLoad: async () => {
    const session = await authClient.getSession();
    if (!session.data) {
      redirect({
        to: "/login",
        throw: true,
      });
    }
    return { session };
  },
});

function BoardDetailComponent() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [newListName, setNewListName] = useState("");
  const [newCardTitles, setNewCardTitles] = useState<Record<string, string>>(
    {}
  );
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [editingCardTitle, setEditingCardTitle] = useState("");

  const board = useQuery(trpc.board.getById.queryOptions({ id }));

  const createListMutation = useMutation(
    trpc.board.list.create.mutationOptions({
      onSuccess: () => {
        board.refetch();
        setNewListName("");
        toast.success("List created!");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to create list");
      },
    })
  );

  const createCardMutation = useMutation(
    trpc.board.card.create.mutationOptions({
      onSuccess: () => {
        board.refetch();
        toast.success("Card created!");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to create card");
      },
    })
  );

  const handleCreateList = () => {
    if (newListName.trim()) {
      createListMutation.mutate({
        boardId: id,
        name: newListName,
      });
    }
  };

  const handleCreateCard = (listId: string) => {
    const title = newCardTitles[listId];
    if (title?.trim()) {
      createCardMutation.mutate(
        {
          listId,
          title,
        },
        {
          onSuccess: () => {
            setNewCardTitles((prev) => ({ ...prev, [listId]: "" }));
          },
        }
      );
    }
  };

  if (board.isLoading) {
    return <Loader />;
  }

  if (!board.data) {
    return (
      <div className="flex h-full items-center justify-center flex-col gap-4">
        <p className="text-muted-foreground">Board not found</p>
        <Button onClick={() => navigate({ to: "/dashboard" })}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="h-full overflow-x-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate({ to: "/dashboard" })}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">{board.data.name}</h1>
        </div>
      </div>

      <div className="flex gap-4 pb-4">
        {/* Existing Lists */}
        {board.data.lists.map((list) => (
          <Card key={list.id} className="w-72 shrink-0 flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">
                  {list.name}
                </CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit2 className="mr-2 h-4 w-4" />
                      Rename List
                    </DropdownMenuItem>
                    <DropdownMenuItem variant="destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete List
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 flex-1 overflow-y-auto max-h-[calc(100vh-300px)]">
              {/* Cards in this list */}
              {list.cards.map((card) => (
                <Card
                  key={card.id}
                  className="p-3 cursor-pointer hover:bg-accent transition-colors group"
                >
                  {editingCard === card.id ? (
                    <div className="space-y-2">
                      <Input
                        autoFocus
                        value={editingCardTitle}
                        onChange={(e) => setEditingCardTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            // TODO: Update card title
                            setEditingCard(null);
                          }
                          if (e.key === "Escape") {
                            setEditingCard(null);
                          }
                        }}
                        onBlur={() => setEditingCard(null)}
                      />
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-sm">{card.title}</p>
                        {card.description && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {card.description}
                          </p>
                        )}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingCard(card.id);
                              setEditingCardTitle(card.title);
                            }}
                          >
                            <Edit2 className="mr-2 h-4 w-4" />
                            Edit Card
                          </DropdownMenuItem>
                          <DropdownMenuItem variant="destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Card
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                </Card>
              ))}

              {/* Add Card Form */}
              <div className="flex gap-2 pt-2">
                <Input
                  placeholder="Add a card..."
                  value={newCardTitles[list.id] || ""}
                  onChange={(e) =>
                    setNewCardTitles((prev) => ({
                      ...prev,
                      [list.id]: e.target.value,
                    }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleCreateCard(list.id);
                    }
                  }}
                  disabled={createCardMutation.isPending}
                  className="text-sm"
                />
                <Button
                  size="icon"
                  onClick={() => handleCreateCard(list.id)}
                  disabled={
                    createCardMutation.isPending ||
                    !newCardTitles[list.id]?.trim()
                  }
                  className="shrink-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add List Card */}
        <Card className="w-72 shrink-0 h-fit">
          <CardHeader>
            <CardTitle className="text-base">Add a list</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="List name..."
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleCreateList();
                  }
                }}
                disabled={createListMutation.isPending}
              />
              <Button
                size="icon"
                onClick={handleCreateList}
                disabled={createListMutation.isPending || !newListName.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
