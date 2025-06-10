import FlashCardsPage from "@/components/pages/FlashCardsPage";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/flashcards")({
  component: FlashCardsPage,
});
