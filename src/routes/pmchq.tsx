import { createFileRoute, redirect } from "@tanstack/react-router";
import MultiQuestionForm from "../components/MultiQuestionCreate.tsx";
import type { RouterContext } from "../api/types";
export const Route = createFileRoute("/pmchq")({
  component: MultiQuestionForm,
  beforeLoad: ({ context }) => {
    const ctx = context as RouterContext;

    if (!ctx.isAuthenticated) {
      throw redirect({
        to: "/login",
      });
    }
  },
});
