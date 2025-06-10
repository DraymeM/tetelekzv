import { createFileRoute } from "@tanstack/react-router";
import MultiChoicePage from "../components/pages/MultiChoicePage.tsx";
export const Route = createFileRoute("/mchoiceq")({
  component: MultiChoicePage,
});
