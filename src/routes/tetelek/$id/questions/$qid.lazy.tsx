import MultiquestionDetails from "@/components/pages/MultiQuestionDetails";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/tetelek/$id/questions/$qid")({
  component: MultiquestionDetails,
});
