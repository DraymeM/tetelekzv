import { createFileRoute } from "@tanstack/react-router";
import Tetelek from "../components/pages/Tetelek.tsx";
export const Route = createFileRoute("/tetelek")({
  component: Tetelek,
});
