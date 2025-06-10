import TetelDetails from "@/components/pages/TetelDetails";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/tetelek/$id/details")({
  component: TetelDetails,
});
