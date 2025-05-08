import { createFileRoute, redirect } from "@tanstack/react-router";
import MultiQuestionEdit from "@/components/MultiquestionEdit";
import type { RouterContext } from "../../../api/types";
export const Route = createFileRoute("/mquestions/$id/edit")({
  component: MultiQuestionEdit,
  beforeLoad: ({ context }) => {
    const ctx = context as RouterContext;

    if (!ctx.isAuthenticated) {
      throw redirect({
        to: "/login",
      });
    }
  },
});
