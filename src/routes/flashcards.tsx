import { createFileRoute } from "@tanstack/react-router";
import FlashCardsPage from "../components/FlashCardsPage.tsx";
export const Route = createFileRoute("/flashcards")({
  component: FlashCardsPage,
});
