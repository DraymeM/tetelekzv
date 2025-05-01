import Profile from "@/components/common/auth/Profile";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/profile")({
  component: Profile,
});
