# 📚 TételekZV – Interactive Exam Preparation App

**TételekZV** is an offline-ready, installable full-stack **progressive web app (PWA)** designed to help university students prepare for exams using collaborative tételek (topic) creation, markdown editing, and flashcard-based revision.

> 🔗 **Live Demo**: [danielmarkus.web.elte.hu/tetelekzv](https://danielmarkus.web.elte.hu/tetelekzv/)

---

## 📌 Highlights

- 💾 **Offline-first** PWA (React Query + service worker cache)
- 📱 **Installable** mobile/desktop app
- 🎨 **Light/Dark Mode** toggle with Tailwind
- ✍️ **Markdown-rich content** rendered from database
- 🧠 Flashcard system (add, edit, learn)
- 👥 **User-driven content with authentication**
- 🧩 **Multichoice quiz game** with user-created questions, streak, and progress tracking
- 🔐 **Role-based permissions**:
  - **Unauthenticated users**: read-only access
  - **Simple users**: create, read, and edit tételek
  - **Superusers**: create, read, edit, and delete tételek
- 🚦 **Rate limit protection** on backend
- 🧪 Component/unit tests with ViteTest
- ⚙️ **Custom PHP ORM** and minimal backend by design due to server limitations

---

## 🧩 Tech Stack

| Category         | Technologies                             |
|------------------|-------------------------------------------|
| Frontend         | React (Vite), TypeScript, TanStack Router |
| Styling/UI       | TailwindCSS, Headless UI, Toastify, Icons |
| State/Caching    | React Query, Zod for schema validation     |
| Markdown Support | react-markdown, rehype-highlight           |
| Backend (Minimal)| PHP (vanilla), custom ORM, env config      |
| Auth             | Session-based authentication with roles    |
| Testing          | ViteTest                                   |
| PWA              | vite-plugin-pwa, service workers           |

---

## 🚀 Getting Started

### 🔧 Clone & Setup

```bash
git clone https://github.com/DraymeM/tetelekzv.git
cd tetelekzv
```

### 🧑‍💻 Frontend

```bash
npm install
npm run dev
```

### 🛠️ Backend (PHP)

```bash
cd BackEnd
php -S localhost:8000
```

> Ensure you've set up `dev.env.php` and `env.php` for DB access.

---

## ✨ Features in Detail

### 🔥 PWA Capabilities

- Installable on mobile and desktop
- Works offline (cached tételek)
- Service worker support with Vite PWA plugin

### 🌓 Dark/Light Mode

- Follows system preference or manual toggle
- Applies to all UI and markdown content

### 🎮 Multichoice Quiz Game

- Users can create, edit, and play multichoice quizzes

- Questions are stored per topic

- Progress is tracked per user

- Streaks and performance data are saved for learning insights

- Fast-paced, game-style review method

- Optional timer function

### ✍️ Markdown Editor

- Tételek stored as markdown in DB
- Rendered with support for:
  - HTML passthrough
  - Code blocks (with syntax highlighting)
  - Alignment, styling, nested blocks
- Ideal for writing structured academic answers

### 👥 User-driven Content & Authentication

- Users can **register and log in**
- **Unauthenticated users** can only **read** tételek
- **Simple users** can **create, read, and edit** tételek
- **Superusers** have full control including **delete** permissions

### 🧠 Flashcards

- Linked to tételek
- Add/edit/delete cards
- Supports revision-based workflows

### ✅ Validation

- **Zod**-based schema validation on all forms
- Inline error messages

---

## 🔒 Backend, ORM & Rate Limit

- Minimal **PHP** backend due to hosting limitations
- Fully custom **ORM** to abstract DB access
- Uses simple env config switching (`dev.env.php` / `env.php`)
- Rate limit logic to prevent overload
- Graceful fallback UI via toast notifications

---

## 🧪 Testing

- Component + hook testing via **ViteTest**
- Covers form logic, validation, and UI components

---

## 🧾 Sample Component

```jsx
<Disclosure>
  <Disclosure.Button>
    <FaChevronDown />
  </Disclosure.Button>
  <Disclosure.Panel>
    {section.subsections.map(...)}
  </Disclosure.Panel>
</Disclosure>
```

---

## 🧠 Use Cases

- 📖 Breakdown course topics into nested structures
- 🧪 Self-test with flashcards before exams
- ✍️ Rich markdown content for definitions and examples
- 👨‍🎓 Designed for university students prepping for ZH, vizsga, or thesis defense
