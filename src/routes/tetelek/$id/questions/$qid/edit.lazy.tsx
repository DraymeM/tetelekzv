import MultiQuestionEdit from "@/components/MultiquestionEdit";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/tetelek/$id/questions/$qid/edit")({
  component: MultiQuestionEdit,
});
