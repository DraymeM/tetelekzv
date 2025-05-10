import { describe, expect, it } from "vitest";
import { answerSchema, multiQuestionSchema } from "../validator/questionSchema"; // Adjust the import path if necessary

describe("answerSchema validation", () => {
  it("should pass with valid answer data", () => {
    const validAnswer = {
      text: "This is a valid answer",
      isCorrect: true,
    };

    const result = answerSchema.safeParse(validAnswer);
    expect(result.success).toBe(true);
  });

  it("should fail if text is empty", () => {
    const invalidAnswer = {
      text: "",
      isCorrect: true,
    };

    const result = answerSchema.safeParse(invalidAnswer);
    expect(result.success).toBe(false);
    // Check for the correct error message for the 'text' field
    expect(result.error?.format().text?._errors[0]).toBe(
      "A válasz szövege nem lehet üres"
    );
  });

  it("should fail if isCorrect is not a boolean", () => {
    const invalidAnswer = {
      text: "This is a valid answer",
      isCorrect: "not-a-boolean", // Invalid boolean value
    };

    const result = answerSchema.safeParse(invalidAnswer);
    expect(result.success).toBe(false);
    // Check if 'isCorrect' is properly validated
    expect(result.error?.format().isCorrect?._errors[0]).toBe(
      "Expected boolean, received string"
    );
  });
});

describe("multiQuestionSchema validation", () => {
  it("should pass with a valid multi-question object", () => {
    const validMultiQuestion = {
      question: "What is 2 + 2?",
      answers: [
        { text: "4", isCorrect: true },
        { text: "5", isCorrect: false },
        { text: "3", isCorrect: false },
        { text: "2", isCorrect: false },
      ],
    };

    const result = multiQuestionSchema.safeParse(validMultiQuestion);
    expect(result.success).toBe(true);
  });

  it("should fail if question is missing", () => {
    const invalidMultiQuestion = {
      question: "",
      answers: [
        { text: "4", isCorrect: true },
        { text: "5", isCorrect: false },
        { text: "3", isCorrect: false },
        { text: "2", isCorrect: false },
      ],
    };

    const result = multiQuestionSchema.safeParse(invalidMultiQuestion);
    expect(result.success).toBe(false);
    // Check for the correct error message for the 'question' field
    expect(result.error?.format().question?._errors[0]).toBe(
      "A kérdés megadása kötelező"
    );
  });

  it("should fail if answers length is not exactly 4", () => {
    const invalidMultiQuestion = {
      question: "What is 2 + 2?",
      answers: [
        { text: "4", isCorrect: true },
        { text: "5", isCorrect: false },
        { text: "3", isCorrect: false },
      ], // Only 3 answers, should fail
    };

    const result = multiQuestionSchema.safeParse(invalidMultiQuestion);
    expect(result.success).toBe(false);
    // Check for the correct error message for the 'answers' length
    expect(result.error?.format().answers?._errors[0]).toBe(
      "Pontosan négy válasz szükséges"
    );
  });

  it("should fail if no correct answer is provided", () => {
    const invalidMultiQuestion = {
      question: "What is 2 + 2?",
      answers: [
        { text: "4", isCorrect: false },
        { text: "5", isCorrect: false },
        { text: "3", isCorrect: false },
        { text: "2", isCorrect: false },
      ], // No correct answer
    };

    const result = multiQuestionSchema.safeParse(invalidMultiQuestion);
    expect(result.success).toBe(false);
    // Check for the correct error message for the 'answers' not having a correct one
    expect(result.error?.format().answers?._errors[0]).toBe(
      "Legalább egy válasznak helyesnek kell lennie"
    );
  });
});
