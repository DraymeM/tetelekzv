import Tetelek from "@/components/Tetelek";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/tetelek")({
  component: Tetelek,
});
