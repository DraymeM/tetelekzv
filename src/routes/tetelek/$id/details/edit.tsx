import { createFileRoute, redirect } from "@tanstack/react-router";
import TetelEdit from "@/components/pages/TetelEdit";
import type { RouterContext } from "../../../../api/types";
export const Route = createFileRoute("/tetelek/$id/details/edit")({
  component: TetelEdit,
  beforeLoad: ({ context }) => {
    const ctx = context as RouterContext;

    if (!ctx.isAuthenticated) {
      throw redirect({
        to: "/login",
      });
    }
  },
});
