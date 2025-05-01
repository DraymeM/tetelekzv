import { createFileRoute, redirect } from "@tanstack/react-router";
import TetelCreate from "../components/TetelCreate";
import type { RouterContext } from "../api/types";

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
