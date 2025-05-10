import { describe, expect, it } from "vitest";
import { tetelSchema } from "../validator/tetelSchema"; // Adjust the import path if necessary

describe("tetelSchema validation", () => {
  it("should pass with a valid object", () => {
    const validData = {
      name: "Sample Tétel",
      osszegzes: "This is a valid summary.",
      sections: [
        {
          id: 1,
          content: "Valid section content",
          subsections: [
            {
              id: 1,
              title: "Subsection 1",
              description: "This is a valid subsection description.",
            },
          ],
        },
      ],
      flashcards: [
        {
          id: 1,
          question: "What is this?",
          answer: "This is an answer.",
        },
      ],
    };

    const result = tetelSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should fail if name is missing", () => {
    const invalidData = {
      osszegzes: "This is a valid summary.",
      sections: [
        {
          id: 1,
          content: "Valid section content",
          subsections: [],
        },
      ],
      flashcards: [],
    };

    const result = tetelSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    // Check if the error is in the correct format
    expect(result.error?.format().name?._errors[0]).toBe("Required");
  });

  it("should fail if sections are empty", () => {
    const invalidData = {
      name: "Sample Tétel",
      osszegzes: "This is a valid summary.",
      sections: [],
      flashcards: [],
    };

    const result = tetelSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    // Check for the actual error message in the 'sections' field
    expect(result.error?.format().sections?._errors[0]).toBe(
      "Legalább egy szekció legyen!"
    );
  });

  it("should fail if flashcards have invalid data", () => {
    const invalidData = {
      name: "Sample Tétel",
      osszegzes: "This is a valid summary.",
      sections: [
        {
          id: 1,
          content: "Valid section content",
          subsections: [],
        },
      ],
      flashcards: [
        {
          id: 1,
          question: "",
          answer: "This is an answer.",
        },
      ],
    };

    const result = tetelSchema.safeParse(invalidData);
    console.log(result.error?.format()); // Log the error to inspect its structure

    expect(result.success).toBe(false);
    // Check if the 'question' field in 'flashcards' contains the expected error message
    const questionErrors =
      result.error?.format().flashcards?.[0]?.question?._errors;
    expect(questionErrors && questionErrors[0]).toBe(
      "Üresen ne hagyd, zárd be ha nem akarsz."
    );
  });

  it("should pass with a valid object even with optional id fields", () => {
    const validData = {
      name: "Sample Tétel",
      osszegzes: "This is a valid summary.",
      sections: [
        {
          content: "Valid section content",
          subsections: [],
        },
      ],
      flashcards: [],
    };

    const result = tetelSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should fail when description in subsection is missing", () => {
    const invalidData = {
      name: "Sample Tétel",
      osszegzes: "This is a valid summary.",
      sections: [
        {
          content: "Valid section content",
          subsections: [
            {
              title: "Valid Subsection",
              id: 1,
            },
          ],
        },
      ],
      flashcards: [],
    };

    const result = tetelSchema.safeParse(invalidData);
    console.log(result.error?.format()); // Log the error to inspect its structure

    expect(result.success).toBe(false);
    // Check if the 'description' field in 'subsections' contains the 'Required' error message
    expect(
      result.error?.format().sections?.[0]?.subsections?.[0]?.description
        ?._errors?.[0]
    ).toBe("Required");
  });
});
