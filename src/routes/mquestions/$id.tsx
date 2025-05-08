import { createFileRoute } from "@tanstack/react-router";
import MultiquestionDetails from "@/components/MultiQuestionDetails";
export const Route = createFileRoute("/mquestions/$id")({
  component: MultiquestionDetails,
});
