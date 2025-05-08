import { createLazyFileRoute } from "@tanstack/react-router";
import MultiquestionDetails from "@/components/MultiQuestionDetails";
export const Route = createLazyFileRoute("/mquestions/$id")({
  component: MultiquestionDetails,
});
