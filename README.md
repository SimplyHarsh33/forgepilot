# ⚡ ForgePilot — AI-Powered Browser IDE & Sandbox

[![React](https://img.shields.io/badge/React-18.3-blue.svg?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue.svg?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.3-646CFF.svg?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg?style=flat-square&logo=nodedotjs)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.19-000000.svg?style=flat-square&logo=express)](https://expressjs.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Google Gemini API](https://img.shields.io/badge/Gemini_AI-2.0_Flash-4285F4.svg?style=flat-square&logo=google)](https://aistudio.google.com/)
[![License MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

**ForgePilot** is a full-featured, browser-based developer workspace and live sandbox inspired by tools like Replit, CodeSandbox, and Cursor. It combines real-time client-side compilation, an integrated VS Code-style editor, local disk synchronization, and an autonomous AI pair programmer powered by Google Gemini.

---

## 📸 Key Capabilities

* ⚡ **In-Browser Live Sandbox Engine**: Runs React (TSX/JSX) and HTML5 apps in real-time inside an isolated `<iframe>` using Babel Standalone — **zero server build steps required**.
* 🤖 **AI Autonomous Workspace Actions**: Uses a custom `json-workspace-action` protocol with Gemini AI to generate, modify, and delete workspace files automatically based on natural language prompts.
* 💻 **Monaco Code Editor**: Integrated VS Code editor engine featuring syntax highlighting, auto-formatting, multi-tab navigation, unsaved file indicators (`Ctrl+S`), and dual color themes (**Zen Light** & **Midnight Dark**).
* 📟 **Interactive IDE Terminal**: Real-time output and console error streaming drawer with log filtering (`Terminal` vs `Errors`), color-coded channels, auto-scroll, one-click log copy, and terminal flush controls.
* 📦 **One-Click Native ZIP Export**: Pure Node.js in-memory ZIP builder using `zlib` & CRC32 to package and download any workspace into a runnable `.zip` project.
* 📁 **Local Filesystem CRUD & Security**: Express MVC backend performing recursive directory scanning and atomic disk file writes, secured against path traversal attacks.

---

## 🗺️ System Architecture

```
                               ┌──────────────────────────────────────────────┐
                               │           BROWSER (Vite + React 18)          │
                               │                                              │
                               │  ┌────────────┬─────────────┬─────────────┐  │
                               │  │    File    │   Monaco    │ AI Chat &   │  │
                               │  │  Explorer  │ Code Editor │ Sandbox Prev│  │
                               │  └─────┬──────┴──────┬──────┴──────┬──────┘  │
                               │        │             │             │         │
                               │        ▼             ▼             ▼         │
                               │            WorkspaceContext (State)          │
                               │                     │                        │
                               │                     ▼                        │
                               │             Babel iframe Sandbox             │
                               │          (In-Browser React Transpiler)       │
                               └─────────────────────┬────────────────────────┘
                                                     │ REST API (HTTP)
                               ┌─────────────────────▼────────────────────────┐
                               │          EXPRESS BACKEND (Node.js)           │
                               │  /projects   /files   /save   /chat   /export│
                               │         │                      │             │
                               │         ▼                      ▼             │
                               │    Local Disk Storage    Google Gemini API   │
                               │  (./workspaces/...)   (AI Action Engine)     │
                               └──────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technologies Used |
|---|---|
| **Frontend UI** | React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Canvas Confetti |
| **Code Editor** | Monaco Editor (`@monaco-editor/react`) |
| **Preview Runtime** | Babel Standalone 7, Tailwind CDN, Lucide React UMD, HTML5 iFrame |
| **Backend API** | Node.js, Express, TypeScript, ts-node, Nodemon |
| **AI Integration** | Google Gen AI SDK (`@google/genai`), Gemini 2.0 Flash Model |
| **File Compression** | Native Node `zlib` + Buffer CRC32 (Zero npm binary dependencies) |

---

## 🚀 Getting Started

### Prerequisites
* **Node.js**: `v18.0.0` or higher
* **npm**: `v9.0.0` or higher
* **Google Gemini API Key** *(Free at [aistudio.google.com](https://aistudio.google.com/app/apikey))*

### 1. Clone the Repository
```bash
git clone https://github.com/simplyharsh33/forgepilot.git
cd forgepilot
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:
```env
PORT=5000
PROJECTS_DIR=./workspaces
GEMINI_API_KEY=your_gemini_api_key_here
```

Start the backend development server:
```bash
npm run dev
```
*Backend listens at `http://localhost:5000`*

### 3. Frontend Setup
Open a **new terminal tab** and run:
```bash
cd frontend
npm install
npm run dev
```
*Frontend app runs at `http://localhost:5173` (or `5174`)*

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
| Variable | Default | Description |
|---|---|---|
| `PORT` | `5000` | Port for Express server |
| `PROJECTS_DIR` | `./workspaces` | Directory path where projects are stored on disk |
| `GEMINI_API_KEY` | `""` | Default Google Gemini API key for server proxy |

### Frontend (`frontend/.env`)
| Variable | Default | Description |
|---|---|---|
| `VITE_BACKEND_URL` | `http://localhost:5000` | URL of the ForgePilot backend API |

---

## 📡 API Endpoints

### Projects
* `GET /projects` — List all local workspaces
* `POST /projects` — Create & scaffold a new project (`react` or `html`)
* `DELETE /api/projects/:name` — Delete a project directory recursively from disk
* `GET /projects/:name/export` — Download project as a compressed `.zip` file

### Files & Editor
* `GET /files?project=:name` — Scan & read full file tree for workspace
* `POST /save` — Write single file content to disk (`{ project, path, content }`)

### AI Assistant
* `POST /chat` — Proxy user messages and file context to Google Gemini AI

---

## 🌐 Deployment

### Deploy Backend to Render
1. Create a **Web Service** on [Render](https://render.com).
2. Set **Root Directory** to `backend`.
3. Set **Build Command** to `npm run build` and **Start Command** to `npm start`.
4. Set Environment Variable `GEMINI_API_KEY`.

### Deploy Frontend to Vercel
1. Import repository on [Vercel](https://vercel.com).
2. Set **Root Directory** to `frontend`.
3. Add Environment Variable `VITE_BACKEND_URL` pointing to your Render backend service URL.

---

## 📄 License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for details.
