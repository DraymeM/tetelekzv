import TetelDetails from "@/components/TetelDetails";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/tetelek/$id/details")({
  component: TetelDetails,
});
