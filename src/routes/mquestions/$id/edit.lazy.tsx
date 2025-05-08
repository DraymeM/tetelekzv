import { createLazyFileRoute } from "@tanstack/react-router";
import MultiQuestionEdit from "@/components/MultiquestionEdit";
export const Route = createLazyFileRoute("/mquestions/$id/edit")({
  component: MultiQuestionEdit,
});
