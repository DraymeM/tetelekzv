import { createFileRoute } from "@tanstack/react-router";
import TetelCreate from "../components/TetelCreate";

export const Route = createFileRoute("/tetelcreate")({
  component: TetelCreate,
});
