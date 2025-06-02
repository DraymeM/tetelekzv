import TetelEdit from "@/components/TetelEdit";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/tetelek/$id/details/edit")({
  component: TetelEdit,
});
