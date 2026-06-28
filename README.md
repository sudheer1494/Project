# ToolsBase 🧰

**Every tool you need, in one place.** A modern, responsive multi-tool web app offering 30 free online tools across three categories — PDF, Image, and General Utilities. Clean and fast, inspired by iLovePDF, with most tools running **entirely in your browser** so your files never leave your device.

![Tech](https://img.shields.io/badge/React-18-61dafb) ![Tech](https://img.shields.io/badge/Vite-5-646cff) ![Tech](https://img.shields.io/badge/Tailwind-3-38bdf8)

## ✨ Features

- **30 tools** across PDF, Image and Utility categories
- **Homepage** with hero, live search, category filter tabs and a card grid
- **Per-tool pages** with breadcrumbs, drag-&-drop uploads, "How it works", and related tools
- **Dark mode** with system-preference detection and persistence
- **Recently used** & **favorites** stored in `localStorage`
- **Share** button (Web Share API with clipboard fallback)
- **Toast notifications** and processing states
- **SEO-friendly** per-page titles & meta descriptions
- **Fully responsive** — mobile, tablet, desktop
- **Code-split** — heavy libraries (pdf-lib, pdf.js) load only when a tool needs them

## 🗂️ Tools

| Category | Tools |
| --- | --- |
| **PDF** | Merge, Split, Compress, PDF→Word, Word→PDF, PDF→JPG, JPG→PDF, Rotate, Protect\*, Unlock\*, Watermark, Page Numbers |
| **Image** | Compress, Resize, Crop, Convert (JPG/PNG/WebP), Remove Background, Watermark, Rotate/Flip, Image→Base64 |
| **Utilities** | Word Counter, Case Converter, Color Picker, QR Generator, URL Encode/Decode, Base64, Password Generator, JSON Formatter, Markdown→HTML, Character Counter |

\* *Protect/Unlock PDF require secure server-side encryption (PDF passwords can't be applied safely in-browser); the UI explains this. Every other tool is fully functional and runs client-side.*

## 🛠️ Tech Stack

- **React 18** + **React Router 6** (one route per tool)
- **Tailwind CSS 3** with a custom purple brand theme & dark mode
- **Vite 5** build tooling
- **lucide-react** icons, **Inter** font
- Client-side processing: **pdf-lib** & **pdf.js** (PDF), **Canvas API** & **browser-image-compression** (image), **qrcode**, **marked**, and pure JS (utilities)

## 🚀 Getting Started

```bash
npm install      # install dependencies
npm run dev      # start dev server (http://localhost:5173)
npm run build    # production build → dist/
npm run preview  # preview the production build
```

## 📁 Project Structure

```
src/
├── components/        # Navbar, Footer, ToolCard, DropZone, HowItWorks, ...
├── context/           # ThemeContext (dark mode), ToastContext
├── lib/               # storage, file/download helpers, SEO hook
├── pages/             # HomePage, ToolPage, About, Privacy, Contact, Login, 404
└── tools/
    ├── registry.js    # central catalog of all tools + metadata
    ├── components.js   # lazy-loaded slug → component map
    └── impl/          # tool implementations (utilities / image / pdf)
```

## 🔐 Privacy

The vast majority of tools process files locally using client-side JavaScript — nothing is uploaded. Only small preferences (theme, recent tools, favorites) are stored in `localStorage`.
