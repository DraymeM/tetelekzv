import { createFileRoute } from "@tanstack/react-router";
import MultiQuestionEdit from "@/components/MultiquestionEdit";
export const Route = createFileRoute("/mquestions/$id/edit")({
  component: MultiQuestionEdit,
});
