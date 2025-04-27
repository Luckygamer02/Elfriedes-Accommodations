import {useState} from "react";
import {useForm, zodResolver} from "@mantine/form";
import httpClient from "@/lib/httpClient";
import {toast} from "sonner";
import {Button, NumberInput, Paper, Text, Textarea, Title} from "@mantine/core";
import {IconMessage} from "@tabler/icons-react";
import {z} from "zod";

type RatingFormProps = {
    accommodationId: number;
};

export default function RatingForm({accommodationId}: RatingFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const reviewSchema = z.object({
        comment: z.string().min(3, "Rating must be at least 10 characters"),
        rating: z.number().min(1).max(5)
    });
    const form = useForm({
        initialValues: {
            comment: '',
            rating: 5
        },
        validate: zodResolver(reviewSchema)
    });

    const handleSubmit = async (values: typeof form.values) => {
        try {
            setIsSubmitting(true);
            await httpClient.post(`/api/ratings`, {
                ...values,
                accommodationId
            });
            form.reset();
            setError(null);
            toast.success("Review submitted successfully!");
        } catch (err) {
            setError("Failed to submit review");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Paper p="md" shadow="sm" mt="lg">
            <Title order={4} mb="md">Write a Review</Title>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <NumberInput
                    label="Rating"
                    {...form.getInputProps('rating')}
                    min={1}
                    max={5}
                />
                <Textarea
                    label="Review"
                    placeholder="Share your experience..."
                    {...form.getInputProps('comment')}
                    mt="sm"
                />
                {error && <Text c="red" mt="sm">{error}</Text>}
                <Button
                    type="submit"
                    mt="md"
                    loading={isSubmitting}
                    leftSection={<IconMessage size={18}/>}
                >
                    Submit Review
                </Button>
            </form>
        </Paper>
    );
}

