import TetelDetails from "@/components/pages/TetelDetails";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/tetelek/$id/details")({
  component: TetelDetails,
});
