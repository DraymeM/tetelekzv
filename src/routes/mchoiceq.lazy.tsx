import { createLazyFileRoute } from "@tanstack/react-router";
import MultiChoicePage from "../components/pages/MultiChoicePage.tsx";
export const Route = createLazyFileRoute("/mchoiceq")({
  component: MultiChoicePage,
});
