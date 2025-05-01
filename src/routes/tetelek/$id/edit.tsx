import { createFileRoute } from "@tanstack/react-router";
import TetelEdit from "@/components/TetelEdit";

export const Route = createFileRoute("/tetelek/$id/edit")({
  component: TetelEdit,
});
