import { createLazyFileRoute } from "@tanstack/react-router";
import MultiChoicePage from "../components/MultiChoicePage.tsx";
export const Route = createLazyFileRoute("/mchoiceq")({
  component: MultiChoicePage,
});
