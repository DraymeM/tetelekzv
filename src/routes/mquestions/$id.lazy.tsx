import { createLazyFileRoute } from "@tanstack/react-router";
import MultiquestionDetails from "@/components/pages/MultiQuestionDetails";
export const Route = createLazyFileRoute("/mquestions/$id")({
  component: MultiquestionDetails,
});
