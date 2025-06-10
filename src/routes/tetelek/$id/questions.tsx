import TetelQuestions from "@/components/pages/TetelQuestions";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/tetelek/$id/questions")({
  component: TetelQuestions,
});
