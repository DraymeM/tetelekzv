# 📚 Tiomi – Interactive Learning App

**Tiomi** is a full-stack, installable, offline-ready **Progressive Web App (PWA)** designed for learners of all kinds. Whether you're preparing for university exams, language certifications, coding interviews, or personal enrichment, Tiomi helps you organize knowledge through topic-based notes, flashcards, and interactive quizzes.

> 🔗 **Live Demo**: [danielmarkus.web.elte.hu/tetelekzv](https://danielmarkus.web.elte.hu/tetelekzv/)

---

## 📌 Highlights

- 💾 **Offline-first**: Caching and React Query ensure content works even without internet
- 📊 **Dashboard**: Live animated progress stats with CountUp.js
- 📱 **Installable** as a native-like app on mobile and desktop
- 🌓 **Light/Dark Mode** toggle based on system or user preference
- ✍️ **Markdown editor** with support for syntax highlighting, code blocks, and custom styling
- 🧠 **Flashcard system** for spaced repetition learning
- 🎮 **Gamified quiz engine** with streak tracking and performance feedback
- 👥 **Authentication & user roles** with dynamic permissions:
  - Guests: read-only
  - Users: create, read, edit
  - Superusers: full CRUD access
- 🔐 **Rate limiting** on backend to prevent misuse
- 🧪 **Unit and component testing** via ViteTest
- ⚙️ **Minimal PHP backend** with custom-built ORM due to shared hosting constraints

---

## 🧩 Tech Stack

| Layer             | Technologies |
|------------------|--------------|
| **Frontend**      | React (Vite), TypeScript, TanStack Router |
| **UI & Styling**  | TailwindCSS, Headless UI, Toastify |
| **Data & Schema** | React Query, Zod |
| **Markdown**      | react-markdown, rehype-highlight |
| **Backend**       | Vanilla PHP, custom ORM, MySQL |
| **Auth**          | Session-based with role handling |
| **Testing**       | ViteTest |
| **PWA Support**   | vite-plugin-pwa, Service Workers |

---

## 🥇 Why Tiomi?

Unlike Anki, Quizlet, or Notion, Tiomi is:

- ✍️ Focused on **structured, rich markdown** notes for academic or technical use
- 🧠 Designed for **contextual flashcards** tied to content
- 🎮 Gamified for active recall through quizzes
- 🧩 Organized with **nested topics and subtopics**
- 🌐 Works **offline** using IndexedDB
- 🔧 Open-source and **self-hostable**

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

> ⚙️ Don't forget to configure `dev.env.php` and `env.php` with your database credentials.

---

## ✨ Features in Detail

### 🔥 PWA Capabilities

- Fully installable on mobile and desktop

- Works offline thanks to:

   - Custom IndexedDB caching for selected API responses

   - Manual selection of critical resources for offline use

- Built with vite-plugin-pwa and service workers for seamless install flow and background updates


### 📊 Dashboard & Stats

- Displays total created items:
  - 📚 Topics (Tételek)
  - 🧠 Flashcards
  - ❓ Quiz questions
- Animated counters via CountUp.js
- Tailwind-based UI with card layout and responsive design

### 🌓 Light/Dark Mode

- Automatic theme detection or manual toggle
- Applies consistently across UI and markdown-rendered content

### 🎮 Quiz System

- Users can create and attempt multichoice quizzes
- Tracks user progress and quiz performance
- Includes streaks, score analytics, and optional timers
- Designed for fast-paced learning and revision

### ✍️ Markdown Editor

- Markdown is stored in the DB and rendered with:
  - HTML passthrough
  - Syntax-highlighted code blocks
  - Alignment and style support
- Optimized for academic use: structured answers, code, nested blocks

### 👥 User Roles & Auth

- Users register and log in via a secure session-based flow
- Role-based access:
  - Unauthenticated users → view-only
  - Users → full content creation/editing
  - Superusers → admin powers (delete, manage users)

### 🧠 Flashcards

- Create and organize cards linked to topics
- Add/edit/delete cards easily
- Ideal for spaced repetition and exam review workflows

### ✅ Form Validation

- All forms validated using **Zod**
- Inline error messages ensure quick user feedback

---

## 🔒 Backend & Rate Limiting

- Built using minimal **vanilla PHP** to fit server limitations
- Includes a custom lightweight ORM for DB operations
- Supports `.env` configs for different environments
- Backend includes rate limiter with toast notifications for graceful fallback

---

## 🧪 Testing

- Includes component and hook-level tests with **ViteTest**
- Covers:
  - Form logic
  - Schema validation
  - UI rendering and behavior

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

- 📖 Structure course materials into nested, linked topics
- 🧪 Review content with flashcards and quizzes
- ✍️ Write markdown-powered notes with examples and formatting
- 👨‍🎓 Ideal for Hungarian university students preparing for:
  - ZH (zhárthelyi dolgozat)
  - Vizsga (exams)
  - Thesis defense prep

---

## 📈 Performance & Lighthouse

- ✅ **Lighthouse scores**: 95–100 in all categories
- ⚡ Responsive, fast, SEO-optimized
- 📦 Fully PWA-compliant: installable and offline-ready

