import TetelEdit from "@/components/pages/TetelEdit";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/tetelek/$id/details/edit")({
  component: TetelEdit,
});
