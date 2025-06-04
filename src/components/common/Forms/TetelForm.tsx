import React, { useState, useEffect, Suspense } from "react";
import { FaPen, FaEye, FaQuestion } from "react-icons/fa";
import { tetelSchema } from "../../../validator/tetelSchema";
import { toast } from "react-toastify";
import type { TetelFormData } from "../../../api/types";
import Spinner from "@/components/Spinner";
import TetelPreview from "./TetelPreview";
import TetelFormHeader from "./TetelFormHeader";
import SectionsList from "./SectionsList";
import FlashcardsList from "./FlashcardsList";
import { useSections } from "../../../hooks/useSections.ts";
import { useFlashcards } from "../../../hooks/useFlashcards.ts";
import { tutorialSteps } from "../../../tutorials/TetelFormTutorial";
const FormContainer = React.lazy(() => import("./FormContainer"));
const SubmitButton = React.lazy(() => import("./SubmitButton"));
const Tutorial = React.lazy(() => import("../Tutorial"));

interface TetelFormProps {
  initialData?: TetelFormData;
  onSubmit: (data: TetelFormData) => void;
  isPending: boolean;
  error: string | null;
  success: string | null;
  label: string;
  submitLabel: string;
}

export default function TetelForm({
  initialData,
  onSubmit,
  isPending,
  error,
  success,
  label,
  submitLabel,
}: TetelFormProps) {
  const {
    sections,
    addSection,
    removeSection,
    updateSection,
    addSub,
    updateSub,
    removeSub,
  } = useSections(initialData?.sections);

  const { flashcards, addFlashcard, updateFlashcard, removeFlashcard } =
    useFlashcards(initialData?.flashcards);
  const [showTutorial, setShowTutorial] = useState(false);
  const [name, setName] = useState(initialData?.name || "");
  const [osszegzes, setOsszegzes] = useState(initialData?.osszegzes || "");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const [openSections, setOpenSections] = useState<Record<number, boolean>>(
    () => sections.reduce((m, s, i) => ({ ...m, [s.id!]: i === 0 }), {})
  );

  const [openFlashcards, setOpenFlashcards] = useState<Record<number, boolean>>(
    () => flashcards.reduce((m, f) => ({ ...m, [f.id!]: false }), {})
  );

  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    const result = tetelSchema.safeParse({
      name,
      osszegzes,
      sections,
      flashcards,
    });
    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.errors.forEach((e) => {
        errs[e.path.join(".")] = e.message;
      });
      setFieldErrors(errs);
    } else {
      setFieldErrors({});
    }
  }, [name, osszegzes, sections, flashcards]);

  useEffect(() => {
    if (error || success) window.scrollTo({ top: 0, behavior: "smooth" });
  }, [error, success]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      name: true,
      osszegzes: true,
      sections: true,
      flashcards: true,
    });

    const result = tetelSchema.safeParse({
      name,
      osszegzes,
      sections,
      flashcards,
    });

    if (!result.success) {
      toast.error("Javítsd ki a hibákat mielőtt mentenél!");

      const secErrs = new Set<number>();
      const fcErrs = new Set<number>();

      result.error.errors.forEach((err) => {
        const [which, idx] = err.path;
        if (which === "sections") {
          const id = sections[idx as number]?.id;
          if (id != null) secErrs.add(id);
        }
        if (which === "flashcards") {
          const id = flashcards[idx as number]?.id;
          if (id != null) fcErrs.add(id);
        }
      });

      setOpenSections((o) => {
        const next = { ...o };
        secErrs.forEach((id) => (next[id] = true));
        return next;
      });

      setOpenFlashcards((o) => {
        const next = { ...o };
        fcErrs.forEach((id) => (next[id] = true));
        return next;
      });

      return;
    }

    onSubmit(result.data);
    toast.success("Sikeres mentés!");
  };

  const handleAddSection = () => {
    const newSection = addSection();
    setOpenSections((prev) => ({ ...prev, [newSection.id!]: true }));
  };
  const handleAddFlashcard = () => {
    const newCard = addFlashcard();
    setOpenFlashcards((prev) => ({ ...prev, [newCard.id!]: true }));
  };

  return (
    <div>
      <Suspense fallback={<Spinner />}>
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-end mb-4">
            <button
              className="fixed top-20 right-5 p-3 bg-blue-600 hover:cursor-pointer text-white rounded-full hover:bg-blue-700 transition-all transform hover:scale-105 z-50"
              onClick={() => setShowTutorial(true)}
              title="Segítség a használathoz"
            >
              <FaQuestion size={20} />
            </button>
            <button
              id="preview"
              onClick={() => setIsPreview((p) => !p)}
              className="fixed md:bottom-7 bottom-14 right-5 p-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 hover:scale-105 transition-all z-50"
              title={isPreview ? "Vissza szerkesztéshez" : "Előnézet"}
            >
              {isPreview ? <FaPen size={20} /> : <FaEye size={20} />}
            </button>
          </div>

          <FormContainer error={error} success={success} label={label}>
            <form onSubmit={handleSubmit} className="space-y-6">
              {isPreview ? (
                <TetelPreview
                  data={{ name, osszegzes, sections, flashcards }}
                />
              ) : (
                <>
                  <TetelFormHeader
                    name={name}
                    handleNameChange={(e) => {
                      setName(e.target.value);
                      setTouched((t) => ({ ...t, name: true }));
                    }}
                    osszegzes={osszegzes}
                    handleOsszegzesChange={(e) => {
                      setOsszegzes(e.target.value);
                      setTouched((t) => ({ ...t, osszegzes: true }));
                    }}
                    errorName={touched.name ? fieldErrors["name"] : undefined}
                    errorOsszegzes={
                      touched.osszegzes ? fieldErrors["osszegzes"] : undefined
                    }
                  />
                  <SectionsList
                    sections={sections}
                    openSections={openSections}
                    setOpenSections={setOpenSections}
                    addSection={handleAddSection}
                    removeSection={removeSection}
                    updateSection={updateSection}
                    addSub={addSub}
                    updateSub={updateSub}
                    removeSub={removeSub}
                    fieldErrors={fieldErrors}
                    showSectionErrors={touched.sections}
                  />
                  <FlashcardsList
                    flashcards={flashcards}
                    openFlashcards={openFlashcards}
                    setOpenFlashcards={setOpenFlashcards}
                    addFlashcard={handleAddFlashcard}
                    removeFlashcard={removeFlashcard}
                    updateFlashcard={updateFlashcard}
                    fieldErrors={fieldErrors}
                    showFlashcardErrors={touched.flashcards}
                  />
                  <SubmitButton isPending={isPending} label={submitLabel} />
                </>
              )}
            </form>
          </FormContainer>
        </div>
        <Tutorial
          open={showTutorial}
          onClose={() => setShowTutorial(false)}
          steps={tutorialSteps}
        />
      </Suspense>
    </div>
  );
}
