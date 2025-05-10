import React, { useState, useEffect, Suspense } from "react";
import { FaPlus } from "react-icons/fa";
import { tetelSchema } from "../../../validator/tetelSchema";
import { toast } from "react-toastify";
import type {
  Section,
  Flashcard,
  TetelFormData,
  Subsection,
} from "../../../api/types";
import Spinner from "@/components/Spinner";
const FormContainer = React.lazy(() => import("./FormContainer"));
const SubmitButton = React.lazy(() => import("./SubmitButton"));
const InputField = React.lazy(() => import("./InputField"));
import TextAreaField from "./TextAreaField";
import SectionBlock from "./SectionBlock";
import FlashcardBlock from "./FlashcardBlock";

interface TetelFormProps {
  initialData?: TetelFormData;
  onSubmit: (data: TetelFormData) => void;
  isPending: boolean;
  error: string | null;
  success: string | null;
  label: string;
  submitLabel: string;
}

const TetelForm: React.FC<TetelFormProps> = ({
  initialData,
  onSubmit,
  isPending,
  error,
  success,
  label,
  submitLabel,
}) => {
  const [name, setName] = useState(initialData?.name || "");
  const [osszegzes, setOsszegzes] = useState(initialData?.osszegzes || "");
  const [sections, setSections] = useState<Section[]>(
    initialData?.sections || [{ content: "", subsections: [] }]
  );
  const [flashcards, setFlashcards] = useState<Flashcard[]>(
    initialData?.flashcards || []
  );

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Validate on field change
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
      return;
    }

    onSubmit(result.data);
    toast.success("Sikeres mentés!");
  };

  const handleAddSection = () => {
    setSections((prev) => [
      ...prev,
      { id: Date.now() * -1, content: "", subsections: [] },
    ]);
  };

  const handleRemoveSection = (sectionId: number) => {
    setSections((prev) => prev.filter((sec) => sec.id !== sectionId));
  };

  const handleSectionUpdate = (sectionId: number, content: string) => {
    setSections((prev) =>
      prev.map((sec) => (sec.id === sectionId ? { ...sec, content } : sec))
    );
  };

  const handleAddSubsection = (sectionId: number) => {
    setSections((prev) =>
      prev.map((sec) =>
        sec.id === sectionId
          ? {
              ...sec,
              subsections: [
                ...sec.subsections,
                { id: Date.now() * -1, title: "", description: "" },
              ],
            }
          : sec
      )
    );
  };

  const handleSubsectionUpdate = (
    sectionId: number,
    index: number,
    field: keyof Subsection,
    value: string
  ) => {
    setSections((prev) =>
      prev.map((sec) =>
        sec.id === sectionId
          ? {
              ...sec,
              subsections: sec.subsections.map((sub, i) =>
                i === index ? { ...sub, [field]: value } : sub
              ),
            }
          : sec
      )
    );
  };

  const handleRemoveSubsection = (sectionId: number, index: number) => {
    setSections((prev) =>
      prev.map((sec) =>
        sec.id === sectionId
          ? {
              ...sec,
              subsections: sec.subsections.filter((_, i) => i !== index),
            }
          : sec
      )
    );
  };

  const handleAddFlashcard = () => {
    setFlashcards((prev) => [
      ...prev,
      { id: Date.now() * -1, question: "", answer: "" },
    ]);
  };

  const handleFlashcardUpdate = (
    id: number,
    field: keyof Flashcard,
    value: string
  ) => {
    setFlashcards((prev) =>
      prev.map((fc) => (fc.id === id ? { ...fc, [field]: value } : fc))
    );
  };

  const handleRemoveFlashcard = (id: number) => {
    setFlashcards((prev) => prev.filter((fc) => fc.id !== id));
  };

  // Scroll to top when an error or success message appears
  useEffect(() => {
    if (error || success) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [error, success]);

  return (
    <div>
      <Suspense fallback={<Spinner />}>
        <div className="max-w-6xl mx-auto items-center">
          <FormContainer error={error} success={success} label={label}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <InputField
                label="Tétel címe"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setTouched((t) => ({ ...t, name: true }));
                }}
                error={touched.name ? fieldErrors.name : undefined}
              />

              <TextAreaField
                label="Összegzés"
                value={osszegzes}
                onChange={(e) => {
                  setOsszegzes(e.target.value);
                  setTouched((t) => ({ ...t, osszegzes: true }));
                }}
                error={touched.osszegzes ? fieldErrors.osszegzes : undefined}
              />

              {sections.map((sec, secIndex) => {
                const sectionErrors: Record<string, string> = {};
                Object.entries(fieldErrors).forEach(([key, msg]) => {
                  if (key.startsWith(`sections.${secIndex}.`)) {
                    sectionErrors[key.replace(`sections.${secIndex}.`, "")] =
                      msg;
                  }
                });

                return (
                  <SectionBlock
                    key={sec.id}
                    index={sec.id!}
                    section={sec}
                    onUpdateContent={(value) =>
                      handleSectionUpdate(sec.id!, value)
                    }
                    onAddSubsection={() => handleAddSubsection(sec.id!)}
                    onRemoveSection={() => handleRemoveSection(sec.id!)}
                    onUpdateSubsection={(i, field, val) =>
                      handleSubsectionUpdate(sec.id!, i, field, val)
                    }
                    onRemoveSubsection={(i) =>
                      handleRemoveSubsection(sec.id!, i)
                    }
                    errors={touched.sections ? sectionErrors : {}}
                  />
                );
              })}

              <div className="flex items-center space-x-2 text-emerald-600">
                <button
                  type="button"
                  onClick={handleAddSection}
                  className="flex items-center justify-center p-2 rounded-full hover:cursor-pointer bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  <FaPlus size={15} />
                </button>
                <span>Új Szekció</span>
              </div>

              {flashcards.map((fc, fcIndex) => {
                const flashcardErrors: Record<string, string> = {};
                Object.entries(fieldErrors).forEach(([key, msg]) => {
                  if (key.startsWith(`flashcards.${fcIndex}.`)) {
                    flashcardErrors[key.replace(`flashcards.${fcIndex}.`, "")] =
                      msg;
                  }
                });

                return (
                  <FlashcardBlock
                    key={fc.id}
                    flashcard={fc}
                    onUpdate={(field, value) =>
                      handleFlashcardUpdate(fc.id!, field, value)
                    }
                    onRemove={() => handleRemoveFlashcard(fc.id!)}
                    errors={touched.flashcards ? flashcardErrors : {}}
                  />
                );
              })}

              <div className="flex items-center space-x-2 text-emerald-600">
                <button
                  type="button"
                  onClick={handleAddFlashcard}
                  className="flex items-center justify-center p-2 rounded-full hover:cursor-pointer bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  <FaPlus size={15} />
                </button>
                <span>Új flashcard</span>
              </div>

              <SubmitButton isPending={isPending} label={submitLabel} />
            </form>
          </FormContainer>
        </div>
      </Suspense>
    </div>
  );
};

export default TetelForm;
