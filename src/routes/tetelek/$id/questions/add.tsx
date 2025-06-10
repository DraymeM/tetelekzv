import MultiQuestionCreate from "@/components/pages/MultiQuestionCreate";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/tetelek/$id/questions/add")({
  component: MultiQuestionCreate,
});
