# 🌟 NoorKids — Gamified Islamic Learning Platform for Children

A production-ready, fully interactive, and gamified Islamic education web platform for children, parents, and educators. NoorKids is centered around the complete pedagogical loop:
**Learn → Interact → Practice → Earn → Progress**.

---

## 🚀 Key Features

### 1. Bilingual Child-Friendly Learning Environment
- **English UI Structure:** Menus, buttons, dashboard labels, analytics, forms, and headers.
- **Authentic Arabic Content:** Quranic Surahs (with full Tashkeel), Duas, Hadiths, Prophet stories, and moral terms styled with `dir="rtl"` and Arabic typography (*Cairo*, *Amiri*).
- **Audio Pronunciation Engine:** Built-in Web Audio & Web Speech synthesis for hearing Arabic words and verses with a single tap.

### 2. The 5 Core Learning Paths
1. 📖 **Holy Quran (القرآن الكريم):** Short Surahs (Al-Fatihah, Al-Ikhlas) with verse-by-verse reflections.
2. 💧 **Prayer Journey (رحلة الصلاة):** Sparkling Wudu steps, the 5 daily prayers, and prayer times.
3. 🌙 **Ramadan & Fasting (رمضان المبارك):** Fasting fundamentals, Suhoor & Iftar Duas, and acts of Sadaqah.
4. 🚢 **Stories of the Prophets (قصص الأنبياء):** Adventures of Prophet Nuh and his Ark, Prophet Yusuf and forgiveness.
5. ❤️ **Muslim Character (الأخلاق والآداب):** Truthfulness (الصدق), Kindness to parents (بر الوالدين), and keeping promises.

### 3. Gamification Engine
- **XP System:** Earn XP by reading lessons, completing good deed challenges, and acing quizzes.
- **Level Progression:** Dynamic calculation formula:
  $$\text{Level} = \left\lfloor \frac{\text{XP}}{100} \right\rfloor + 1$$
- **Streak Tracking:** Flame counter tracking consecutive active learning days.
- **Trophy Room (Badges):** Unlockable badges (*Quran Explorer*, *Prayer Star*, *Young Learner*, *Kind Heart*, *Ramadan Explorer*) with confetti animations.
- **Audio Feedback:** Playful chimes on correct answers and victory fanfares on level-up.

### 4. Controlled AI Islamic Tutor ("NoorBot")
- **Child-Safe Guardrails:** Gentle, positive, loving tone designed for kids aged 4–14.
- **Built-in Offline Knowledge Base:** Instant responses for Wudu, Salah, Ramadan, Prophet stories, and Duas even without external LLM keys.
- **Integrated Floating Widget & Dedicated Chat Page.**

### 5. Parent & Admin Portals
- **Parent Portal (`/parent/dashboard`):**
  - Multi-child monitoring (switch between Omar and Sara, or add new children).
  - Per-course completion breakdown across all 5 paths.
  - Full Quiz Results history table.
  - Automatic identification of weak areas where scores are below 70%.
- **Admin Portal (`/admin/dashboard`):**
  - Platform analytics (total users, children, parents, courses, quizzes, pass rates).
  - User management CRUD.
  - Course & Lesson editor (bilingual cards, Arabic highlights, XP rewards).
  - Quiz & Question builder.
  - Badges & XP rules manager.

---

## ⚡ Quick Demo Login (One-Click Evaluator Bar)
NoorKids includes a **"Quick Demo Login" bar** visible on the Landing page, Login page, and Dashboards. You can switch between any role with 1 click:
- 👦 **Child 1 (Omar):** `omar@noorkids.com` / `omar123` (Level 3, 240 XP, 5-day streak)
- 👧 **Child 2 (Sara):** `sara@noorkids.com` / `sara123` (Level 1, 50 XP, 2-day streak)
- 🧕 **Parent (Maryam):** `parent@noorkids.com` / `parent123`
- 🛡️ **Admin (Ustadh Ahmad):** `admin@noorkids.com` / `admin123`

---

## 🛠️ Tech Stack
- **Frontend:** Next.js 14+ (App Router), React 18, TypeScript, Tailwind CSS, Lucide React, Canvas-Confetti, Web Audio API.
- **Backend:** Next.js App Router API Routes (`/api/*`), RBAC Middleware, Jose JWT authentication.
- **Database:** Prisma ORM with SQLite (instant zero-config local file `prisma/dev.db`) and PostgreSQL compatibility.
- **Seed Data:** 10+ bilingual lessons, 30+ quiz questions, 5 core badges, and pre-populated progress.

---

## 💻 Local Setup & Running Instructions

### 1. Clone & Install Dependencies
```bash
npm install
```

### 2. Setup SQLite Database & Apply Schema
```bash
npx prisma generate
npx prisma db push
```

### 3. Seed Database with Rich Initial Data
```bash
npx tsx prisma/seed.ts
```

### 4. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser!

---

## 🧪 Testing the Complete Loop
1. Open [http://localhost:3000](http://localhost:3000).
2. Click **"Omar (Child, Lvl 3)"** in the top Demo bar.
3. On the Child Dashboard, click **"Holy Quran"** or **"Prayer Journey"**.
4. Read through the step-by-step cards, listen to the Arabic audio recitation.
5. Click **"Mark Lesson Complete (+30 XP)"** — watch the confetti fly and XP update.
6. Click **"Take Quiz"** — answer the questions, experience instant visual feedback (Mint Green), and submit.
7. Open **NoorBot AI** (bottom-right widget or top nav) and ask: *"How do I make Wudu?"*.
8. Click **"Parent (Maryam)"** in the Demo bar to inspect Omar's latest score and progress in real time!
9. Click **"Admin (Ustadh)"** in the Demo bar to access user management and curriculum builder.
