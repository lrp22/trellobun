import { Banner } from "@/components/board/banner";
import { BoardCreationForm } from "@/components/board/board-creation-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth-client";
import { trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { Plus, LayoutDashboard } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
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

function RouteComponent() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const boards = useQuery(trpc.board.getMyBoards.queryOptions());

  if (boards.isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-6 w-96" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  const hasBoards = boards.data && boards.data.length > 0;

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Boards</h1>
            <p className="text-muted-foreground">
              Organize your projects and tasks
            </p>
          </div>
          {hasBoards && (
            <Button onClick={() => setShowCreateForm(!showCreateForm)}>
              <Plus className="mr-2 h-4 w-4" />
              New Board
            </Button>
          )}
        </div>
      </div>

      {showCreateForm && (
        <div className="mb-8">
          <BoardCreationForm />
        </div>
      )}

      {!hasBoards && !showCreateForm ? (
        <Banner onCreateClick={() => setShowCreateForm(true)} />
      ) : hasBoards && !showCreateForm ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {boards.data?.map((board) => (
            <Card
              key={board.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <LayoutDashboard className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{board.name}</CardTitle>
                  </div>
                </div>
                <CardDescription>
                  Updated {new Date(board.updatedAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link to="/board/$id" params={{ id: board.id }}>
                    Open Board
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}
    </div>
  );
}
