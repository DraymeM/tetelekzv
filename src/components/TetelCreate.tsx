import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { z } from "zod";
import { FaTimes, FaPlus } from "react-icons/fa";
import FormContainer from "./common/MultiChoiceCreator/FormContainer";
import SubmitButton from "./common/MultiChoiceCreator/SubmitButton";

// Zod schemas with optional fields
const subsectionSchema = z
  .object({
    title: z.string().min(1, "Cím megadása kötelező"),
    description: z.string().min(1, "Leírás megadása kötelező"),
  })
  .optional();

const sectionSchema = z.object({
  content: z.string().min(1, "Szekció tartalma kötelező"),
  subsections: z.array(subsectionSchema).optional(),
});

const flashcardSchema = z
  .object({
    question: z.string().min(1, "Kérdés megadása kötelező"),
    answer: z.string().min(1, "Válasz megadása kötelező"),
  })
  .optional();

const tetelSchema = z.object({
  name: z.string().min(1, "Tétel cím kötelező"),
  osszegzes: z.string().min(1, "Összegzés kötelező"),
  sections: z.array(sectionSchema).min(1, "Legalább egy szekció szükséges"),
  flashcards: z.array(flashcardSchema).optional(),
});

interface Subsection {
  title: string;
  description: string;
}

interface Section {
  content: string;
  subsections: Subsection[];
}

interface Flashcard {
  question: string;
  answer: string;
}

const TetelCreate: React.FC = () => {
  const [name, setName] = useState("");
  const [osszegzes, setOsszegzes] = useState("");
  const [sections, setSections] = useState<Section[]>([
    { content: "", subsections: [] },
  ]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (newTetel: any) => {
      const response = await axios.post(
        "/tetelekzv/BackEnd/create_tetel.php",
        newTetel,
        { headers: { "Content-Type": "application/json" } }
      );
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tetelek"] });
      setSuccess(`Sikeres mentés! ID: ${data.tetel_id}`);
      setTimeout(() => setSuccess(null), 3000);
      resetForm();
    },
    onError: (err: any) => {
      setError(err.response?.data?.error || "Hiba történt");
    },
  });

  const resetForm = () => {
    setName("");
    setOsszegzes("");
    setSections([{ content: "", subsections: [] }]);
    setFlashcards([]);
    setFieldErrors({});
    setTouched({});
  };

  useEffect(() => {
    const validateForm = () => {
      const result = tetelSchema.safeParse({
        name,
        osszegzes,
        sections: sections.map((s) => ({
          content: s.content,
          subsections: s.subsections.filter(
            (sub) => sub.title || sub.description
          ),
        })),
        flashcards: flashcards.filter((fc) => fc.question || fc.answer),
      });

      const errors: Record<string, string> = {};
      if (!result.success) {
        result.error.errors.forEach((err) => {
          const path = err.path.join(".");
          errors[path] = err.message;
        });
      }
      setFieldErrors(errors);
    };

    validateForm();
  }, [name, osszegzes, sections, flashcards]);

  // Section handlers
  const addSection = () => {
    setSections([...sections, { content: "", subsections: [] }]);
  };

  const removeSection = (index: number) => {
    if (sections.length === 1) return;
    setSections(sections.filter((_, i) => i !== index));
  };

  const updateSectionContent = (index: number, value: string) => {
    const newSections = [...sections];
    newSections[index].content = value;
    setSections(newSections);
    setTouched({ ...touched, [`sections.${index}.content`]: true });
  };

  // Subsection handlers
  const addSubsection = (sectionIndex: number) => {
    const newSections = [...sections];
    newSections[sectionIndex].subsections.push({ title: "", description: "" });
    setSections(newSections);
  };

  const removeSubsection = (sectionIndex: number, subsectionIndex: number) => {
    const newSections = [...sections];
    newSections[sectionIndex].subsections = newSections[
      sectionIndex
    ].subsections.filter((_, i) => i !== subsectionIndex);
    setSections(newSections);
  };

  const updateSubsection = (
    sectionIndex: number,
    subsectionIndex: number,
    field: keyof Subsection,
    value: string
  ) => {
    const newSections = [...sections];
    newSections[sectionIndex].subsections[subsectionIndex][field] = value;
    setSections(newSections);
    setTouched({
      ...touched,
      [`sections.${sectionIndex}.subsections.${subsectionIndex}.${field}`]:
        true,
    });
  };

  // Flashcard handlers
  const addFlashcard = () => {
    setFlashcards([...flashcards, { question: "", answer: "" }]);
  };

  const removeFlashcard = (index: number) => {
    setFlashcards(flashcards.filter((_, i) => i !== index));
  };

  const updateFlashcard = (
    index: number,
    field: keyof Flashcard,
    value: string
  ) => {
    const newFlashcards = [...flashcards];
    newFlashcards[index][field] = value;
    setFlashcards(newFlashcards);
    setTouched({ ...touched, [`flashcards.${index}.${field}`]: true });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Filter out empty optional fields
    const submissionData = {
      name,
      osszegzes,
      sections: sections.map((section) => ({
        content: section.content,
        subsections: section.subsections.filter(
          (sub) => sub.title && sub.description
        ),
      })),
      flashcards: flashcards.filter((fc) => fc.question && fc.answer),
    };

    const result = tetelSchema.safeParse(submissionData);
    if (!result.success) {
      setError("Kérjük javítsd a hibákat a mentés előtt");
      const errors = result.error.errors.reduce(
        (acc, err) => {
          acc[err.path.join(".")] = err.message;
          return acc;
        },
        {} as Record<string, string>
      );
      setFieldErrors(errors);
      return;
    }

    mutation.mutate(submissionData);
  };

  return (
    <FormContainer error={error} success={success} label="Új Tétel">
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

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-300">Szekciók</h3>
            <button
              type="button"
              onClick={addSection}
              className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors duration-200 cursor-pointer"
            >
              <FaPlus className="w-5 h-5" />
            </button>
          </div>

          {sections.map((section, si) => (
            <div
              key={si}
              className="p-4 border rounded-lg border-gray-700 relative group"
            >
              <button
                type="button"
                onClick={() => removeSection(si)}
                disabled={sections.length === 1}
                className="absolute -top-3 -right-3 text-red-500 bg-gray-900 rounded-full p-1 hover:bg-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaTimes className="w-5 h-5" />
              </button>

              <TextAreaField
                label="Szekció tartalma"
                value={section.content}
                onChange={(e) => updateSectionContent(si, e.target.value)}
                error={
                  touched[`sections.${si}.content`]
                    ? fieldErrors[`sections.${si}.content`]
                    : undefined
                }
              />

              <div className="mt-4 space-y-3">
                {section.subsections.length > 0 && (
                  <div className="flex justify-between items-center">
                    <h4 className="text-md font-medium text-gray-400">
                      Alszekciók
                    </h4>
                    <button
                      type="button"
                      onClick={() => addSubsection(si)}
                      className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors duration-200 cursor-pointer"
                    >
                      <FaPlus className="w-5 h-5" />
                    </button>
                  </div>
                )}
                {section.subsections.map((sub, ssi) => (
                  <div key={ssi} className="space-y-2 relative group">
                    <button
                      type="button"
                      onClick={() => removeSubsection(si, ssi)}
                      className="absolute -top-3 -right-3 text-red-500 bg-gray-900 rounded-full p-1 hover:cursor-pointer hover:bg-red-500/20"
                    >
                      <FaTimes className="w-5 h-5" />
                    </button>
                    <InputField
                      label="Cím"
                      value={sub.title}
                      onChange={(e) =>
                        updateSubsection(si, ssi, "title", e.target.value)
                      }
                      error={
                        touched[`sections.${si}.subsections.${ssi}.title`]
                          ? fieldErrors[
                              `sections.${si}.subsections.${ssi}.title`
                            ]
                          : undefined
                      }
                    />
                    <TextAreaField
                      label="Leírás"
                      value={sub.description}
                      onChange={(e) =>
                        updateSubsection(si, ssi, "description", e.target.value)
                      }
                      error={
                        touched[`sections.${si}.subsections.${ssi}.description`]
                          ? fieldErrors[
                              `sections.${si}.subsections.${ssi}.description`
                            ]
                          : undefined
                      }
                    />
                  </div>
                ))}{" "}
                <div className="flex justify-between items-center">
                  <h4 className="text-md font-medium text-gray-400">
                    Alszekció Hozzáadása
                  </h4>
                  <button
                    type="button"
                    onClick={() => addSubsection(si)}
                    className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors duration-200 cursor-pointer"
                  >
                    <FaPlus className="w-5 h-5" />
                  </button>
                </div>
                {section.subsections.length === 0}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center">
          <h3 className="text-md  text-gray-400">Szekció hozzáadása</h3>
          <button
            type="button"
            onClick={addSection}
            className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors duration-200 cursor-pointer"
          >
            <FaPlus className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center border-t-2 p-1 border-gray-400">
            <h3 className="text-xl font-bold text-gray-300">Flashcardok</h3>
            <button
              type="button"
              onClick={addFlashcard}
              className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors duration-200 cursor-pointer"
            >
              <FaPlus className="w-5 h-5" />
            </button>
          </div>
          {flashcards.length === 0 && (
            <p className="text-gray-400 text-sm">Nincsenek flashcardok</p>
          )}
          {flashcards.map((fc, i) => (
            <div key={i} className="space-y-2 relative group">
              <button
                type="button"
                onClick={() => removeFlashcard(i)}
                className="absolute -top-3 -right-3 text-red-500 bg-gray-900 rounded-full p-1 hover:cursor-pointer hover:bg-red-500/20"
              >
                <FaTimes className="w-5 h-5" />
              </button>
              <InputField
                label="Kérdés"
                value={fc.question}
                onChange={(e) => updateFlashcard(i, "question", e.target.value)}
                error={
                  touched[`flashcards.${i}.question`]
                    ? fieldErrors[`flashcards.${i}.question`]
                    : undefined
                }
              />
              <InputField
                label="Válasz"
                value={fc.answer}
                onChange={(e) => updateFlashcard(i, "answer", e.target.value)}
                error={
                  touched[`flashcards.${i}.answer`]
                    ? fieldErrors[`flashcards.${i}.answer`]
                    : undefined
                }
              />{" "}
              <div className="flex justify-between items-center border-gray-400">
                <h3 className="text-md font-md text-gray-400">
                  Kártya hozzáadása
                </h3>
                <button
                  type="button"
                  onClick={addFlashcard}
                  className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors duration-200 cursor-pointer"
                >
                  <FaPlus className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}{" "}
        </div>

        <SubmitButton
          isPending={mutation.isPending}
          label="Tétel Létrehozása"
        />
      </form>
    </FormContainer>
  );
};

// Reusable components
interface InputFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  error,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-2">
      {label}
    </label>
    <input
      className={`w-full p-2 rounded bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        error ? "border border-red-500" : "border border-gray-700"
      }`}
      value={value}
      onChange={onChange}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

interface TextAreaFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
}

const TextAreaField: React.FC<TextAreaFieldProps> = ({
  label,
  value,
  onChange,
  error,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-2">
      {label}
    </label>
    <textarea
      className={`w-full p-2 rounded bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        error ? "border border-red-500" : "border border-gray-700"
      }`}
      value={value}
      onChange={onChange}
      rows={4}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

export default TetelCreate;
