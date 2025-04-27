import { createFileRoute } from "@tanstack/react-router";
import TetelDetails from "../../components/TetelDetails.tsx";

export const Route = createFileRoute("/tetelek/$id")({
  component: TetelDetails,
});
