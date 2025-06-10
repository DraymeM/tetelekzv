import { createLazyFileRoute } from "@tanstack/react-router";
import MultiQuestionEdit from "@/components/pages/MultiquestionEdit";
export const Route = createLazyFileRoute("/mquestions/$id/edit")({
  component: MultiQuestionEdit,
});
