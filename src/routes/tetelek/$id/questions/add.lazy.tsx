import MultiQuestionCreate from "@/components/pages/MultiQuestionCreate";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/tetelek/$id/questions/add")({
  component: MultiQuestionCreate,
});
