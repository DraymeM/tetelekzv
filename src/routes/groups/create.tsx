import { createFileRoute, redirect } from "@tanstack/react-router";
import GroupCreate from "@/components/pages/groups/GroupCreate";
import type { RouterContext } from "@/api/types";

export const Route = createFileRoute("/groups/create")({
  component: GroupCreate,
  beforeLoad: ({ context }) => {
    const ctx = context as RouterContext;

    if (!ctx.isAuthenticated) {
      throw redirect({
        to: "/login",
      });
    }
  },
});
