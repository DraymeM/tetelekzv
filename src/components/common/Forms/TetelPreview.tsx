// TetelPreview.tsx
import React, { Suspense } from "react";
import type { TetelFormData } from "../../../api/types";
const MarkdownHandler = React.lazy(() => import("../markdown/MarkdownHandler"));
const FlashCard = React.lazy(() => import("../FlashCard"));
import Spinner from "@/components/Spinner";

export default function TetelPreview({ data }: { data: TetelFormData }) {
  return (
    <Suspense fallback={<Spinner />}>
      <div className="space-y-6">
        {/* Title */}
        <h2 className="text-3xl font-bold text-center">{data.name}</h2>

        {/* Sections */}
        {data.sections.map((section) => (
          <div
            key={section.id}
            className="bg-secondary rounded-lg p-6 shadow transition-colors hover:border-border border border-transparent"
          >
            <div className="text-xl font-semibold mb-4">
              <MarkdownHandler content={section.content} />
            </div>
            {section.subsections.map((sub) => (
              <div key={sub.id} className="ml-4 mb-4 p-4 bg-muted rounded-lg">
                <div className="font-medium mb-2">
                  <MarkdownHandler content={sub.title} />
                </div>
                <div className="prose prose-invert">
                  <MarkdownHandler content={sub.description} />
                </div>
              </div>
            ))}
          </div>
        ))}

        {/* Summary */}
        {data.osszegzes && (
          <div className="bg-secondary rounded-lg p-6 shadow transition-colors hover:border-border border border-transparent">
            <h3 className="text-2xl font-bold mb-4">Összegzés</h3>
            <div className="whitespace-pre-wrap prose prose-invert">
              <MarkdownHandler content={data.osszegzes} />
            </div>
          </div>
        )}

        {/* Flashcards */}
        {data.flashcards.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Flashcards</h3>
            <div className="flex  ml-5 md:ml-15 mr-5 flex-wrap gap-2">
              {data.flashcards.map((fc) => (
                <FlashCard
                  key={fc.id}
                  question={fc.question}
                  answer={fc.answer}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </Suspense>
  );
}
