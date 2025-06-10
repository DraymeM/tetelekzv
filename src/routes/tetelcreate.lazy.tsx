import TetelCreate from "../components/pages/TetelCreate";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/tetelcreate")({
  component: TetelCreate,
});
