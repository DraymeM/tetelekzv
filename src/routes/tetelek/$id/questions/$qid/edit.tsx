import { createFileRoute, redirect } from "@tanstack/react-router";
import MultiQuestionEdit from "@/components/pages/MultiquestionEdit";
import type { RouterContext } from "../../../../../api/types";

export const Route = createFileRoute("/tetelek/$id/questions/$qid/edit")({
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
