import MultiQuestionCreate from "@/components/MultiQuestionCreate";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/tetelek/$id/questions/add")({
  component: MultiQuestionCreate,
});
