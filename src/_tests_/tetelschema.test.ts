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
    expect(result.error?.format().name).toBe("Required");
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
    expect(result.error?.format().sections).toBe("Array cannot be empty");
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
    expect(result.success).toBe(false);
    expect(result.error?.format().flashcards?.[0]?.question).toBe(
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
    expect(result.success).toBe(false);
    expect(
      result.error?.format().sections?.[0]?.subsections?.[0]?.description
    ).toBe("Required");
  });
});
