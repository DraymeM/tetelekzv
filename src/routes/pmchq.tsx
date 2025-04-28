import { createFileRoute } from "@tanstack/react-router";
import MultiQuestionForm from "../components/MultiQuestionForm.tsx";
export const Route = createFileRoute("/pmchq")({
  component: MultiQuestionForm,
});
