import Profile from "@/components/common/auth/Profile";
import { createFileRoute, redirect } from "@tanstack/react-router";
import type { RouterContext } from "../../api/types";

export const Route = createFileRoute("/auth/profile")({
  component: Profile,
    beforeLoad: ({ context }) => {
      const ctx = context as RouterContext;
  
      if (!ctx.isAuthenticated) {
        throw redirect({
          to: "/login",
        });
      }
    },
});
