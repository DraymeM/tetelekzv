import TetelOverview from "@/components/pages/TetelOverview";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/tetelek/$id")({
  component: TetelOverview,
});
