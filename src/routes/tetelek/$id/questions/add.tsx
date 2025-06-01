import MultiQuestionCreate from "@/components/MultiQuestionCreate";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/tetelek/$id/questions/add")({
  component: MultiQuestionCreate,
});
