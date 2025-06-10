import TetelOverview from "@/components/pages/TetelOverview";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/tetelek/$id")({
  component: TetelOverview,
});
