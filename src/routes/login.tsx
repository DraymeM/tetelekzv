import { createFileRoute } from "@tanstack/react-router";
import Login from "../components/common/auth/Login";
export const Route = createFileRoute("/login")({
  component: Login,
});
