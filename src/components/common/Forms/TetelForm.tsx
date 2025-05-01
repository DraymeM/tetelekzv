import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { tetelSchema } from "../../../validator/tetelSchema";
import type {
  Section,
  Flashcard,
  TetelFormData,
  Subsection,
} from "../../../api/types";
import FormContainer from "./FormContainer";
import SubmitButton from "./SubmitButton";
import InputField from "./InputField";
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
    const result = tetelSchema.safeParse({
      name,
      osszegzes,
      sections,
      flashcards,
    });
    if (!result.success) return;
    onSubmit(result.data);
  };

  const handleAddSection = () => {
    setSections([
      ...sections,
      { id: Date.now() * -1, content: "", subsections: [] },
    ]);
  };

  const handleRemoveSection = (sectionId: number) => {
    setSections(sections.filter((sec) => sec.id !== sectionId));
  };

  const handleSectionUpdate = (sectionId: number, content: string) => {
    setSections(
      sections.map((sec) => (sec.id === sectionId ? { ...sec, content } : sec))
    );
  };

  const handleAddSubsection = (sectionId: number) => {
    setSections(
      sections.map((sec) =>
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
    setSections(
      sections.map((sec) =>
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
    setSections(
      sections.map((sec) =>
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
    setFlashcards([
      ...flashcards,
      { id: Date.now() * -1, question: "", answer: "" },
    ]);
  };

  const handleFlashcardUpdate = (
    id: number,
    field: keyof Flashcard,
    value: string
  ) => {
    setFlashcards(
      flashcards.map((fc) => (fc.id === id ? { ...fc, [field]: value } : fc))
    );
  };

  const handleRemoveFlashcard = (id: number) => {
    setFlashcards(flashcards.filter((fc) => fc.id !== id));
  };

  return (
    <FormContainer error={error} success={success} label={label}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField
          label="Tétel címe"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setTouched({ ...touched, name: true });
          }}
          error={touched.name ? fieldErrors.name : undefined}
        />
        <TextAreaField
          label="Összegzés"
          value={osszegzes}
          onChange={(e) => {
            setOsszegzes(e.target.value);
            setTouched({ ...touched, osszegzes: true });
          }}
          error={touched.osszegzes ? fieldErrors.osszegzes : undefined}
        />
        {sections.map((sec) => (
          <SectionBlock
            key={sec.id}
            index={sec.id!}
            section={sec}
            onUpdateContent={(value) => handleSectionUpdate(sec.id!, value)}
            onAddSubsection={() => handleAddSubsection(sec.id!)}
            onRemoveSection={() => handleRemoveSection(sec.id!)}
            onUpdateSubsection={(index, field, value) =>
              handleSubsectionUpdate(sec.id!, index, field, value)
            }
            onRemoveSubsection={(index) =>
              handleRemoveSubsection(sec.id!, index)
            }
            errors={fieldErrors}
          />
        ))}
        <div className="flex items-center space-x-2 text-emerald-600">
          <button
            type="button"
            onClick={handleAddSection}
            className="flex items-center justify-center p-2 rounded-full bg-emerald-600 hover:cursor-pointer text-white hover:bg-emerald-700"
          >
            <FaPlus size={15} />
          </button>
          <span>Új Szekció</span>
        </div>
        <div className="flex justify-between items-center">
          <h4 className="text-md font-medium text-gray-400">FlashCard</h4>
        </div>
        {flashcards.map((fc) => (
          <FlashcardBlock
            key={fc.id}
            flashcard={fc}
            onUpdate={(field, value) =>
              handleFlashcardUpdate(fc.id!, field, value)
            }
            onRemove={() => handleRemoveFlashcard(fc.id!)}
            errors={fieldErrors}
          />
        ))}
        <div className="flex items-center space-x-2 text-emerald-600">
          <button
            type="button"
            onClick={handleAddFlashcard}
            className="flex items-center justify-center p-2 rounded-full bg-emerald-600 hover:cursor-pointer text-white hover:bg-emerald-700"
          >
            <FaPlus size={15} />
          </button>
          <span>Új flashcard</span>
        </div>
        <SubmitButton isPending={isPending} label={submitLabel} />
      </form>
    </FormContainer>
  );
};

export default TetelForm;
