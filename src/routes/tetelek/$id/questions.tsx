import TetelQuestions from "@/components/TetelQuestions";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/tetelek/$id/questions")({
  component: TetelQuestions,
});
