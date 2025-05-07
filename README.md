# TételekZV 📚

**TételekZV** is a modern full-stack web application for organizing and preparing **tételek** (topics) for oral or written exams. Built with **React + TypeScript** and a **PHP backend**, it provides a sleek, form-based interface to structure learning into sections, subsections, and flashcards.

---

## ✨ Features

- ✅ **Create, edit, and manage** tételek with nested structure
- ✍️ Markdown-style rich text editing (WIP)
- 📦 Section/subsection logic with validation using [Zod](https://zod.dev)
- 🧠 Flashcard system for spaced repetition
- 💅 [Headless UI](https://headlessui.com/) for accessible, animated components
- 🔄 Modular structure with reusable form components
- 🚀 Minimal PHP backend for persistence (WIP)

---

## 🧑‍💻 Tech Stack

| Frontend      | Backend       | UI/UX & Validation               |
|---------------|---------------|----------------------------------|
| React (Vite)  | PHP (vanilla) | TailwindCSS, Headless UI         |
| TypeScript    |               | Zod,                             |
| TanStack Router|              | Toastify, React Icons            |

---

## 📦 Project Structure



## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/DraymeM/tetelekzv.git
cd tetelekzv
```

## Setup Frontend
```bash
npm install
npm run dev
```

##Setup Backend (PHP)
```bash
cd BackEnd
php -S localhost:8000
```

##🧪 Example: Section Block Component
```typescript
// components/SectionBlock.tsx
import { Fragment } from "react";
import { Disclosure } from "@headlessui/react";
import { FaChevronDown, FaTrash } from "react-icons/fa";

const SectionBlock = ({ section, onUpdateContent, onAddSubsection, ... }) => {
  return (
    <div className="bg-white shadow rounded-xl p-4 space-y-4">
      <input
        type="text"
        value={section.content}
        onChange={(e) => onUpdateContent(e.target.value)}
        placeholder="Szekció tartalma..."
        className="w-full border border-gray-300 rounded-md p-2"
      />

      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-emerald-900 bg-emerald-100 rounded-lg hover:bg-emerald-200">
              <span>Alszekciók</span>
              <FaChevronDown
                className={`${open ? "rotate-180 transform" : ""} h-5 w-5`}
              />
            </Disclosure.Button>
            <Disclosure.Panel className="p-4 text-sm text-gray-500 space-y-3">
              {section.subsections.map((sub, idx) => (
                <div key={sub.id} className="space-y-2">
                  <input
                    className="w-full border border-gray-300 rounded-md p-2"
                    value={sub.title}
                    placeholder="Alszekció cím"
                    onChange={(e) =>
                      onUpdateSubsection(idx, "title", e.target.value)
                    }
                  />
                  <textarea
                    className="w-full border border-gray-300 rounded-md p-2"
                    value={sub.description}
                    placeholder="Leírás"
                    onChange={(e) =>
                      onUpdateSubsection(idx, "description", e.target.value)
                    }
                  />
                  <button
                    type="button"
                    onClick={() => onRemoveSubsection(idx)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={onAddSubsection}
                className="px-4 py-1 text-sm text-white bg-emerald-600 rounded hover:bg-emerald-700"
              >
                Új alszekció
              </button>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
};
```

🧠 What this shows:
  Elegant UI using TailwindCSS

  Interactive UI logic via @headlessui/react

  Controlled inputs for live validation

✅ Validation with Zod
Zod ensures your forms never break the schema.
```typescript
export const tetelSchema = z.object({
  name: z.string().min(1, "Tétel cím megadása kötelező!"),
  osszegzes: z.string().min(1, "Összegzés megadása kötelező!"),
  sections: z.array(sectionSchema).min(1, "Legalább egy szekció legyen!"),
  flashcards: z
    .array(flashcardSchema)
    .nullable()
    .transform((val) => val || []),
});
```

##DB setup
I tried to make the setup as db agnostic as possible
you will need a dev.env.php for the backend to coccect to your db and an env.php for production.
connect.php contains a boolean thats switches between production and local file.
