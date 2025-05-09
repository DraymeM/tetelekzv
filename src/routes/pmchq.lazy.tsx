import MultiQuestionForm from "@/components/MultiQuestionCreate";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/pmchq")({
  component: MultiQuestionForm,
});
