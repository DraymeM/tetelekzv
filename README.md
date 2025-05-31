# 📚 Tiomi – Interactive Learning App

**Tiomi** is a full-stack, installable, offline-ready **Progressive Web App (PWA)** designed for learners of all kinds. Whether you're preparing for university exams, language certifications, coding interviews, or personal enrichment, Tiomi helps you organize knowledge through topic-based notes, flashcards, and interactive quizzes.

> 🔗 **Live Demo**: [danielmarkus.web.elte.hu/tetelekzv](https://danielmarkus.web.elte.hu/tetelekzv/)

---

## 📌 Highlights

- 💾 **Offline-first**: Caching and React Query ensure content works even without internet
- 📊 **Dashboard**: Live animated progress stats with CountUp.js
- 🗣️ Text-to-speech reader (desktop only)
- 📱 **Installable** as a native-like app on mobile and desktop
- 🌓 **Light/Dark Mode** toggle based on system or user preference
- ✍️ **Markdown editor** with support for syntax highlighting, code blocks, and custom styling
- 🧠 **Flashcard system** Flashcards with spaced repetition, difficulty rating
- 🧭 Step-by-step tutorials for key features (agnostic & reusable)
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
- 🧭 Interactive step-by-step tutorials to guide new users


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

### 🗣️ Text-to-Speech Reader (Desktop Only)

 - Adds auditory access to study materials via browser-native speech synthesis

 - Reads full topic content in correct structure: main sections followed by their subsections

 - Especially helpful for:

    -  🧑‍🦯 Users with vision impairments

    - 🧠 Learners with dyslexia or reading fatigue

    -  🎧 Those who prefer auditory learning

  - Seamlessly integrated and available on desktop browsers

  - Automatically disabled on mobile/PWA standalone mode to avoid inconsistent support

   > 📌 Note: The speech reader uses the browser's native text-to-speech API and is only available on desktop browsers (not on mobile apps or standalone PWAs).

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
- Each card can be rated after answering:

    - ✅ Easy → shown less frequently

    - ⚖️ Medium → shown with moderate delay

    - ❌ Hard → shown again soon

   - 6 levels of dificculty, these above just the gude lines.
   - Ratings influence deck order dynamically
- Deck reordering logic is designed for fast recall training
- Create and organize cards linked to topics
- Add/edit/delete cards easily
- Ideal for spaced repetition and exam review workflows

### 🧭 Universal Tutorial System
- Modular, reusable step-by-step tutorials
- Based on user onboarding patterns
 example for the tutorial steps:
```ts
const flashcardTutorialSteps = [
  {
    title: "Kártyapakli",
    content: "Kattints egy kártyára a fókuszhoz.",
    selector: "#card-deck",
  },
  ...
];
```
then in the parent you initialize the component:
```ts
<CardTutorial
  open={showTutorial}
  onClose={() => setShowTutorial(false)}
  steps={flashcardTutorialSteps}
/>
```

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
- Any kind of tobic learning enchanced by self test via
  - Flashcards
  - Questions 

---

## 📈 Performance & Lighthouse

- ✅ **Lighthouse scores**: 95–100 in all categories
  - [TopicDetail](https://pagespeed.web.dev/analysis/https-danielmarkus-web-elte-hu-tetelekzv/ow9fsp10rs?form_factor=mobile&category=performance&category=accessibility&category=best-practices&category=seo&hl=hu&utm_source=lh-chrome-ext)
  - [HomePage](https://pagespeed.web.dev/analysis/https-danielmarkus-web-elte-hu-tetelekzv/5ez963k9ki?hl=hu&form_factor=mobile)
  - [MultiQuestionGame](https://pagespeed.web.dev/analysis/https-danielmarkus-web-elte-hu-tetelekzv/kl3et3z9mi?hl=hu&form_factor=desktop)
- ⚡ Responsive, fast, SEO-optimized
- 📦 Fully PWA-compliant: installable and offline-ready

