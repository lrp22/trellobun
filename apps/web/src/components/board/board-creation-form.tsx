import { useForm } from "@tanstack/react-form";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, { message: "name must not be empty" }),
});

type FormSchema = z.infer<typeof formSchema>;

export const BoardCreationForm = () => {
    const form = useForm<FormSchema>({
        defaultValues:{
            name:"",
        },

    });
    const onSubmit = (values: FormSchema) => {
        console.log(values);
    };
    return(
        <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                
            </form>
        </Form>
    )
}