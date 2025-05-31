<p align="center">
  <img src="public/logo192.png" alt="Tiomi Logo" width="100"/>
</p>

<h1 align="center">Tiomi – Interactive Learning App</h1>


**Tiomi** is a full-stack, installable, offline-ready **Progressive Web App (PWA)** designed for learners of all kinds. Whether you're preparing for university exams, language certifications, coding interviews, or personal enrichment, Tiomi helps you organize knowledge through topic-based notes, flashcards, and interactive quizzes.

> 🔗 **Live Demo**: [danielmarkus.web.elte.hu/tetelekzv](https://danielmarkus.web.elte.hu/tetelekzv/)

---

## 📌 Highlights

- 💾 **Offline-first**: Caching and React Query ensure content works even without internet
- 📊 **Dashboard**: Live animated progress stats with CountUp.js
- 🗣️ **Text-to-speech reader** (desktop only)
- 📱 **Installable** as a native-like app on mobile and desktop
- 🌓 **Light/Dark Mode** toggle based on system or user preference
- ✍️ **Markdown editor** with syntax highlighting and custom styling
- 🧠 **Flashcard system** with spaced repetition and difficulty-based prioritization
- 🧭 **Step-by-step tutorials** for key features (modular and reusable)
- 🎮 **Gamified quiz engine** with streaks and performance tracking
- 👥 **Authentication & role-based access**:
  - Guests: read-only
  - Users: create, read, edit
  - Superusers: full CRUD access
- 🔐 **Backend rate limiting** to prevent misuse
- 🧪 **Unit/component testing** via ViteTest
- ⚙️ **Minimal PHP backend** with custom-built ORM (due to shared hosting)

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

- ✍️ Focused on **structured, rich-markdown** notes for academic/technical use
- 🧠 Designed for **contextual flashcards** linked to content
- 🎮 Gamified for **active recall** via quizzes
- 🧩 Built around **nested topic organization**
- 🌐 Fully **offline-ready** using IndexedDB
- 🧭 Includes **interactive tutorials** for onboarding

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

> ⚙️ Configure `dev.env.php` and `env.php` with your DB credentials.

---

## ✨ Features in Detail

### 🔥 PWA Capabilities

- Installable on mobile/desktop
- Works offline via:
  - IndexedDB caching of API responses
  - Manual critical resource caching
- Built using vite-plugin-pwa and service workers

---

### 🗣️ Text-to-Speech Reader

- Uses browser-native speech synthesis
- Reads entire topics (main + subsections)
- Great for:
  - 🧑‍🦯 Accessibility
  - 🧠 Learners with dyslexia
  - 🎧 Auditory learners
- **Desktop only** (disabled on mobile/PWA mode)

---

### 📊 Dashboard & Stats

- Counts for:
  - 📚 Topics (Tételek)
  - 🧠 Flashcards
  - ❓ Quiz questions
- Animated via CountUp.js
- Responsive Tailwind layout

---

### 🌓 Light/Dark Mode

- System theme detection + manual toggle
- Applies across UI and markdown content

---

### 🎮 Quiz System

- Create/attempt multiple-choice quizzes
- Tracks progress, scores, and streaks
- Optional timer mode for challenge sessions

---

### ✍️ Markdown Editor

- Markdown saved in DB
- Rendered with:
  - HTML passthrough
  - Syntax-highlighted code blocks
  - Custom styles
- Perfect for structured, academic content

---

### 👥 User Roles & Auth

- Secure, session-based login
- Role permissions:
  - Guests → read-only
  - Users → can create/edit
  - Superusers → full admin CRUD

---

### 🧠 Flashcards

- Rate each card after answer:
  - ✅ Easy → delay increases
  - ⚖️ Medium → shown moderately
  - ❌ Hard → shown soon again
- 6 difficulty levels (custom scale)
- Linked to topic hierarchy
- Dynamic spaced repetition order

---

### 🧭 Universal Tutorial System

- Modular, reusable steps for user onboarding
- Example setup:

```ts
const flashcardTutorialSteps = [
  {
    title: "Kártyapakli",
    content: "Kattints egy kártyára a fókuszhoz.",
    selector: "#card-deck",
  },
  ...
];

// Inside parent:
<CardTutorial
  open={showTutorial}
  onClose={() => setShowTutorial(false)}
  steps={flashcardTutorialSteps}
/>
```

---

### ✅ Form Validation

- Built using **Zod** schemas
- Realtime inline error feedback

---

## 🔒 Backend & Rate Limiting

- Lightweight **vanilla PHP** (due to hosting limits)
- Custom mini ORM for DB operations
- Supports `.env` configs
- Rate limiter with toast feedback for end users

---

## 🧪 Testing

- Unit/component testing via **ViteTest**
- Covers:
  - Forms
  - Zod schemas
  - UI components and logic

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

- 📖 Organize study materials into nested topics
- 🧪 Self-test with flashcards & quizzes
- ✍️ Markdown-powered note-taking
- Ideal for structured learning with:
  - Linked flashcards
  - Active recall testing

---

## 📈 Performance & Lighthouse

- ✅ Lighthouse: 95–100 across categories
  - [Topic Detail](https://pagespeed.web.dev/analysis/https-danielmarkus-web-elte-hu-tetelekzv/ow9fsp10rs)
  - [Home Page](https://pagespeed.web.dev/analysis/https-danielmarkus-web-elte-hu-tetelekzv/5ez963k9ki)
  - [Quiz Game](https://pagespeed.web.dev/analysis/https-danielmarkus-web-elte-hu-tetelekzv/kl3et3z9mi)
- ⚡ Fast, responsive, SEO-optimized
- 📦 Full PWA compliance (installable, background updates)

---

## 🔮 Future Plans

- Migrate backend to a more scalable stack:
  - ✳️ Slim PHP / Lumen (Laravel) / Express.js / Actix
- Group feature with their own adminsown permissions
- Offline sync actions when connectivity is back
