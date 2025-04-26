import { createFileRoute } from "@tanstack/react-router";
import Tetelek from "../components/Tetelek.tsx";
export const Route = createFileRoute("/tetelek")({
  component: Tetelek,
});
