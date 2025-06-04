
# LUCID Assistant — LLM-Powered Chatbot for lucidresearch.io

This is the front-end code powering the public-facing **LUCID Assistant**, which answers questions about the LUCID framework and related resources.

It uses:

- OpenAI Assistants API (I use 4.1 mini), not to be confused with the sentence completion API.
- Next.js 14 (App Router)
- Vercel serverless deployment
- Markdown rendering via `marked` and `sanitize-html`
- Fully self-contained — no backend required beyond OpenAI

---

## 🧪 Quick Demo

The assistant is live at:

**[https://helpwithlucid.vercel.app](https://lucid-helper.vercel.app)**

---

## 📦 Deployment Instructions

### 1️⃣ Clone this repository

```bash
git clone https://github.com/blasimon/lucid-helper.git
cd lucid-helper
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Create `.env.local` file

Create a file named `.env.local` in your repo root with the following content:

```env
OPENAI_API_KEY=your-openai-key-here
OPENAI_ASSISTANT_ID=your-assistant-id-here
```

You can obtain these values from your OpenAI API account.

### 4️⃣ Run locally for development

```bash
npm run dev
```

Your app will run at `http://localhost:3000`

### 5️⃣ Deploy to Vercel

- Push your repository to GitHub.
- Connect your repo to Vercel.
- Add the same two environment variables inside Vercel's dashboard:
  - `OPENAI_API_KEY`
  - `OPENAI_ASSISTANT_ID`
- Deploy.

---

## 🧠 How It Works

- The frontend sends chat messages directly to the OpenAI Assistants API.
- Each conversation starts a new OpenAI thread.
- Responses are rendered with full Markdown support, including clickable links.
- Responses are sanitized safely using `sanitize-html` to prevent any XSS injection.

---

## 🔧 Technical Stack

- React (Next.js 14 App Router)
- OpenAI Node SDK 4.x (Beta API)
- `marked` for Markdown parsing
- `sanitize-html` for safe HTML output
- Deployed via Vercel Serverless Edge Runtime

---

## 📄 References

- [lucidresearch.io](https://lucidresearch.io)
- [LUCID Toolkit Reference Paper](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5256150)
- [Original Backend Codebase](https://github.com/amgarv/LUCID_TOOL_BACKEND)

---

## ⚠️ License

For academic, research, and non-commercial use only. Please contact if you'd like to use or adapt this code for other purposes.

---

Made with ❤️ for human-AI interaction research.
