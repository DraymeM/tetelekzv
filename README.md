<p align="center">
  <img src="public/logo192.png" alt="Tiomi Logo" width="100"/>
</p>

<h1 align="center">Tiomi – Interactive Topic Learning App</h1>

**Tiomi** is a full-stack, installable, offline-ready **Progressive Web App (PWA)** designed for learners of all kinds. Whether you're preparing for university exams, language certifications, coding interviews, or personal enrichment, Tiomi helps you organize knowledge through topic-based notes, flashcards, and interactive quizzes.

> 🔗 **Live Demo**: [danielmarkus.web.elte.hu/tetelekzv](https://danielmarkus.web.elte.hu/tetelekzv/)

---

## 📌 Highlights

- 💾 **Offline-first**: Caching and React Query ensure content works even without internet
- 📊 **Dashboard**: Live animated progress stats with CountUp.js
- 🗣️ **Text-to-speech reader** with adjustable speed, pitch, and multiple voices; shows reading time per topic
- 📱 **Installable** as a native-like app on mobile and desktop
- 🌓 **Light/Dark Mode** toggle based on system or user preference
- ✍️ **Markdown editor** with syntax highlighting and custom styling
- 🧠 **Flashcard system** with spaced repetition and difficulty-based prioritization
- 🧭 **Step-by-step tutorials** for key features (modular, handles resize & interaction-required fallback)
- 🎮 **Gamified quiz engine** with streaks, progress %, feedback messages with icons, and optional timer mode
- 👥 **Authentication & role-based access**:
  - Guests: read-only
  - Users: create, read, edit
  - Superusers: full CRUD access
  - Collaborative platform, open content like Wikipedia (future group fragmentation & permissions)
- 🔐 **Backend rate limiting** to prevent misuse with toast notifications
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
### 💾 Offline Data Enhancements

Tiomi now includes more robust handling of IndexedDB via `idb-keyval`:

```ts
import { get, set } from "idb-keyval";

// Example: Cache user quiz state
const cacheQuizState = async (key: string, state: QuizState) => {
  await set(key, state);
};

const restoreQuizState = async (key: string): Promise<QuizState | undefined> => {
  return await get(key);
};
```
  - 🧠 Used for persistent quiz progress, flashcard ratings, and user settings.

  - ⚙️ IndexedDB acts as a local cache layer with fallbacks for offline-first experience.

  - 🚀 Enables resume-where-you-left-off functionality in offline mode.

  - 📤 Automatic sync when connection is restored (planned).
---

### 🗣️ Text-to-Speech Reader
Tiomi’s TTS leverages the browser-native **Web Speech API** to read full topics, including main content and nested subsections. This makes it ideal for:

- 🧑‍🦯 Accessibility (e.g., screen reader support)  
- 🧠 Learners with dyslexia  
- 🎧 Auditory learners  


### Key Features

- Reads **long texts** (up to ~10,000 characters) by chunking into ~300-character segments, ensuring no words are split.
- Adjustable **speed**, **pitch**, and **volume** controls.
- Supports **multiple voices** (browser-dependent, e.g., Siri on iOS Safari).
- Displays **estimated reading time** per topic (~200 words/minute).
- Full playback controls: **play**, **pause**, **resume**, and **stop**.
- **Skip forward** and **previous chunk** navigation to move through text segments.
- **Progress bar** with draggable seek support, similar to common audio players.
- Mobile-friendly with **swipe down to stop** gesture and animations.
- Smooth **chunk-based playback** to handle very long texts efficiently.
- **Improved chunk navigation** and enhanced UI options fully implemented.


### How it works: Important details

### 1. Chunking and Playback Logic

The core `useSpeech` hook splits the text into manageable chunks (~300 characters) at whitespace boundaries to avoid splitting words mid-sentence. Playback is queued chunk-by-chunk for smooth long-text reading:
   ```ts
    // useSpeech.ts snippet
    const speak = (text: string, voiceName?: string, rate = 1, pitch = 1, volume = 1) => {
      if (!text || !isSupported || !synthRef.current || isLoadingVoices) {
        setError("Cannot speak: Voices are still loading or not supported.");
        return;
      }
      stop(); // reset any ongoing speech
      pendingParams.current = { rate, pitch, volume };
      const cleanText = text.trim().replace(/\s+/g, " ");
      const sentences = cleanText.match(/\S.{0,298}\s/g) || [cleanText]; // chunk by whitespace
      console.log(`Total chunks: ${sentences.length}`);
      utteranceQueue.current = [
        createUtterance(sentences[0] || "", voiceName, rate, pitch, volume),
      ];
      remainingText.current = sentences.slice(1).join("");
      currentUtteranceIndex.current = 0;
      synthRef.current.cancel();
      if (utteranceQueue.current.length > 0) {
        synthRef.current.speak(utteranceQueue.current[0]);
      }
    };
   ```


### 2. Preparing Text Content from Markdown

The TTS text is prepared by cleaning Markdown content and concatenating all topic sections and subsections into a single string for speech:
   ```ts
    // TetelDetails.tsx snippet
    const getTextFromMarkdown = (markdown: string) =>
      markdown
        .replace(/[#_*>\-`]/g, "")
        .replace(/$$   .*?   $$$$   .*?   $$/g, "")
        .replace(/!$$   .*?   $$$$   .*?   $$/g, "")
        .replace(/`{1,3}[\s\S]*?`{1,3}/g, "")
        .replace(/\s+/g, " ")
        .trim();

    const textToSpeak = [
      getTextFromMarkdown(tetel.name),
      ...sections.flatMap((section) => [
        getTextFromMarkdown(section.content),
        ...(section.subsections?.flatMap((sub) => [
          getTextFromMarkdown(sub.title || ""),
          getTextFromMarkdown(sub.description || ""),
        ]) ?? []),
      ]),
      osszegzes?.content ? "Összegzés: " + getTextFromMarkdown(osszegzes.content) + " Vége" : "",
    ]
      .filter((text) => text && text.length > 0)
      .join(" ")
      .trim();

    // Usage in JSX
    <SpeechController text={textToSpeak} />;
   ```


### 3. UI Controls & Features

- **Play/Pause/Resume/Stop:** Toggle playback with intuitive buttons.
- **Skip Forward/Previous Chunk:** Jump between text chunks — useful for revisiting or skipping parts.
- **Timer Display:** Shows elapsed and total estimated reading time based on current rate (~200 words/minute).
- **Progress Bar with Drag Seek:** Drag or click on the progress bar to jump to any chunk.
- **Mobile Gesture Support:** Swipe down anywhere on the player to stop playback, with smooth fade and slide animations.
- **Settings Menu:** Lazy-loaded voice selector and sliders for rate, pitch, and volume.

### Notes:

> Chunks are processed **one at a time** to maintain performance with very long texts.

> Mobile-specific **resume logic** handles iOS Safari’s quirks.

> The estimated reading time dynamically updates with playback rate changes.

> The progress bar and chunk navigation provide a familiar audio player experience.


This architecture and UI provide a **robust, accessible**, and **user-friendly** text-to-speech experience designed for deep content consumption and accessibility.

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
- Shows progress feedback in % with CountUp.js and encouraging messages + icons  
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

---

## 📱 Responsive Sidebar & Footer Navigation

Tiomi features a sidebar navigation that **transforms into a footer on mobile devices** to ensure easier reach and better usability for mobile users.

- On desktop and larger screens, the sidebar provides quick access to navigation links and the "Vissza" (Back) button.
- On mobile, the sidebar collapses into a footer bar placed at the bottom of the screen, improving thumb accessibility without sacrificing functionality.
This design choice enhances navigation ergonomics, making the app more user-friendly across devices.
---

### 🧭 Universal Tutorial System

- Modular, reusable steps for user onboarding
- - Handles resize edge cases and fallback steps with "requires interaction" flag 
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

### Lighthouse Scores Summary

📱 Mobile Lighthouse Scores

| Page              | Performance ⚡ | Accessibility ♿ | Best Practices ✅ | SEO 🔍 |
|------------------|-------------|---------------|----------------|-------|
| Home Page        | 93          | 98            | 100            | 100   |
| Topic Detail     | 92          | 100           | 100            | 100   |
| Quiz Game        | 98          | 100           | 100            | 100   |
| FlashCardGame    | 94          | 100           | 100            | 100   |
| Topic List       | 98          | 100           | 100            | 100   |
| Topic LandingPage| 97          | 100           | 100            | 100   |
| Random Flashcards| 98          | 100           | 100            | 100   |


💻 Desktop Lighthouse Scores

| Page              | Performance ⚡ | Accessibility ♿ | Best Practices ✅ | SEO 🔍 |
|------------------|-------------|---------------|----------------|-------|
| Home Page        | 100         | 98            | 100            | 100   |
| Topic Detail     | 99          | 100           | 100            | 100   |
| Quiz Game        | 100         | 100           | 100            | 100   |
| FlashCardGame    | 100         | 100           | 100            | 100   |
| Topic List       | 100         | 100           | 100            | 100   |
| Topic LandingPage| 100         | 100           | 100            | 100   |
| Random Flashcards| 100         | 100           | 100            | 100   |

- ✅ Lighthouse: 92–100 across categories
  - [Home Page](https://pagespeed.web.dev/analysis/https-danielmarkus-web-elte-hu-tetelekzv/zvzxy2kbw0?form_factor=mobile&category=performance&category=accessibility&category=best-practices&category=seo&hl=hu&utm_source=lh-chrome-ext)
  - [Topic Detail](https://pagespeed.web.dev/analysis/https-danielmarkus-web-elte-hu-tetelekzv/q2n1m2r5wa?form_factor=mobile&category=performance&category=accessibility&category=best-practices&category=seo&hl=hu&utm_source=lh-chrome-ext)
  - [Quiz Game](https://pagespeed.web.dev/analysis/https-danielmarkus-web-elte-hu-tetelekzv/g6ulklf2yj?form_factor=mobile&category=performance&category=accessibility&category=best-practices&category=seo&hl=hu&utm_source=lh-chrome-ext)
  - [FlashCardGame](https://pagespeed.web.dev/analysis/https-danielmarkus-web-elte-hu-tetelekzv/je5fjk0ick?form_factor=mobile&category=performance&category=accessibility&category=best-practices&category=seo&hl=hu&utm_source=lh-chrome-ext)
  - [Topic List](https://pagespeed.web.dev/analysis/https-danielmarkus-web-elte-hu-tetelekzv/tgz4ybr8ay?form_factor=mobile&category=performance&category=accessibility&category=best-practices&category=seo&hl=hu&utm_source=lh-chrome-ext)
  - [Topic LandingPage](https://pagespeed.web.dev/analysis/https-danielmarkus-web-elte-hu-tetelekzv/o7x7gfk97y?form_factor=mobile&category=performance&category=accessibility&category=best-practices&category=seo&hl=hu&utm_source=lh-chrome-ext)
  - [Random Flashcards](https://pagespeed.web.dev/analysis/https-danielmarkus-web-elte-hu-tetelekzv/ipvvh5u020?form_factor=mobile&category=performance&category=accessibility&category=best-practices&category=seo&hl=hu&utm_source=lh-chrome-ext)
- ⚡ Fast, responsive, SEO-optimized
- 📦 Full PWA compliance (installable, background updates)
  

---

## 🔮 Future Plans

- Migrate backend to a more scalable stack:
  - ✳️ Slim PHP / Lumen (Laravel) / Express.js / Actix
- Group feature with their own admins own permissions
- Offline sync actions when connectivity is back

## Additional Notes

- Quiz questions and Flashcards are tied to topics (tételek) mainly help learning specific topics  
- Open collaboration model currently; planned group fragmentation for better access control  
- Tutorial engine now handles resize edge cases and supports fallback steps requiring user interaction before continuing  
- Card game enhancements improve engagement and learning effectiveness  
- Text-to-speech scaffolds all available voices with speed and pitch adjustment, making it ideal for diverse learners  
- Reading time estimates help learners manage study sessions effectively
