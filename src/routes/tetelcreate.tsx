import { createFileRoute, redirect } from "@tanstack/react-router";
import type { RouterContext } from "../api/types";
import TetelCreate from "../components/pages/TetelCreate";

export const Route = createFileRoute("/tetelcreate")({
  component: TetelCreate,
  beforeLoad: ({ context }) => {
    const ctx = context as RouterContext;

    if (!ctx.isAuthenticated) {
      throw redirect({
        to: "/login",
      });
    }
  },
});
