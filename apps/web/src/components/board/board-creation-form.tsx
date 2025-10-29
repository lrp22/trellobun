import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { z } from "zod";
import { trpc } from "@/utils/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const BoardCreationForm = () => {
  const navigate = useNavigate();

  const createBoardMutation = useMutation(
    trpc.board.create.mutationOptions({
      onSuccess: () => {
        toast.success("Board created successfully!");
        navigate({ to: "/dashboard" });
      },
      onError: (error) => {
        toast.error(error.message || "Failed to create board");
      },
    })
  );

  const form = useForm({
    defaultValues: {
      name: "",
    },
    onSubmit: async ({ value }) => {
      await createBoardMutation.mutateAsync(value);
    },
  });

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>Create a New Board</CardTitle>
        <CardDescription>
          Give your board a name to get started organizing your tasks
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field
            name="name"
            validators={{
              onChange: z.string().min(1, "Board name must not be empty"),
            }}
          >
            {(field) => {
              const errorMessage = field.state.meta.errors?.[0];
              const errorText = typeof errorMessage === 'string' 
                ? errorMessage 
                : errorMessage?.message || '';
              
              return (
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Board Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="e.g., Product Roadmap, Marketing Campaign"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    disabled={createBoardMutation.isPending}
                  />
                  {errorText && (
                    <p className="text-sm text-destructive">{errorText}</p>
                  )}
                </div>
              );
            }}
          </form.Field>

          <form.Subscribe
            selector={(state) => ({
              canSubmit: state.canSubmit,
              isSubmitting: state.isSubmitting,
            })}
          >
            {(state) => (
              <div className="flex gap-2">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={!state.canSubmit || state.isSubmitting}
                >
                  {state.isSubmitting ? "Creating..." : "Create Board"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate({ to: "/dashboard" })}
                  disabled={state.isSubmitting}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            )}
          </form.Subscribe>
        </form>
      </CardContent>
    </Card>
  );
};