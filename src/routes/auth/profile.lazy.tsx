import Profile from "@/components/common/auth/Profile";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/auth/profile")({
  component: Profile,
});
