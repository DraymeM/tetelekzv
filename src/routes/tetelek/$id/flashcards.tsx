import FlashcardGamePage from "@/components/FlashcardGamePage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/tetelek/$id/flashcards")({
  component: FlashcardGamePage,
});
