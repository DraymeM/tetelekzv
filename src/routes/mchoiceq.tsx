import { createFileRoute } from "@tanstack/react-router";
import MultiChoicePage from "../components/MultiChoicePage.tsx";
export const Route = createFileRoute("/mchoiceq")({
  component: MultiChoicePage,
});
