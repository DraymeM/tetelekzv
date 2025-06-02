import TetelQuestions from "@/components/TetelQuestions";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/tetelek/$id/questions")({
  component: TetelQuestions,
});
