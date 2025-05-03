import { createLazyFileRoute } from "@tanstack/react-router";
import Login from "../components/common/auth/Login";
export const Route = createLazyFileRoute("/login")({
  component: Login,
});
