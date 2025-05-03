import FlashCardsPage from "@/components/FlashCardsPage";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/flashcards")({
  component: FlashCardsPage,
});
