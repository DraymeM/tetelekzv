import { createFileRoute } from "@tanstack/react-router";
import Register from "../components/common/auth/Register";
export const Route = createFileRoute("/register")({
  component: Register,
});
