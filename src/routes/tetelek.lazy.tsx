import Tetelek from "@/components/pages/Tetelek";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/tetelek")({
  component: Tetelek,
});
