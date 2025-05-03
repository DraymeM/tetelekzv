import { createFileRoute, redirect } from "@tanstack/react-router";
import type { RouterContext } from "../api/types";
import Login from "../components/common/auth/Login";
export const Route = createFileRoute("/login")({
  component: Login,
  beforeLoad: ({ context }) => {
    const ctx = context as RouterContext;

    if (ctx.isAuthenticated) {
      throw redirect({
        to: "/auth/profile",
      });
    }
  },
});
