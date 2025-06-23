import Groups from "@/components/pages/Groups";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/groups")({
  component: Groups,
});
