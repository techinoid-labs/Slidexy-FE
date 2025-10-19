# Quick Start Guide - Website Builder Integration

## 🚀 Getting Started in 3 Steps

### Step 1: Install Dependencies
```bash
cd "C:\Users\hp\Videos\lovable\open-lovable\frontend"
npm install
```

### Step 2: Configure API Keys
Edit `frontend/.env` and add your API keys:

```bash
# Get these keys from the respective platforms
FIRECRAWL_API_KEY=your_key_here              # https://firecrawl.dev
GROQ_API_KEY=your_key_here                   # https://console.groq.com
ANTHROPIC_API_KEY=your_key_here              # https://console.anthropic.com
OPENAI_API_KEY=your_key_here                 # https://platform.openai.com
GEMINI_API_KEY=your_key_here                 # https://aistudio.google.com/app/apikey
```

For Vercel Sandbox (recommended):
```bash
vercel link
vercel env pull
```

### Step 3: Run the Application
```bash
npm run dev
```

## 📍 Access Points

- **Slidexy (Original)**: http://localhost:3000/presentation/create
- **Website Builder (New)**: http://localhost:3000/website

## ✅ What Was Done

1. ✅ Copied entire `frontend2/app` to `frontend/src/app/website`
2. ✅ Copied supporting folders with `website-` prefix
3. ✅ Updated 60+ dependencies in `package.json`
4. ✅ Added environment variables for AI and scraping
5. ✅ Updated 200+ import paths automatically
6. ✅ **Zero modifications to existing Slidexy code**

## 📖 Full Documentation

For complete details, see: `WEBSITE_INTEGRATION_GUIDE.md`

## 🐛 Common Issues

**Module not found errors?**
→ Run `npm install` again

**API errors?**
→ Check your API keys in `.env`

**Port already in use?**
→ Stop other Next.js instances or use `npm run dev -- -p 3001`

## 🎯 Key Features at /website

- 🔍 Web scraping with Firecrawl
- 🤖 AI-powered code generation
- 🎨 Multiple AI models (GPT, Claude, Gemini, Groq)
- 📝 Live code editor
- 👁️ Real-time preview
- 💾 Sandbox environments

## 📂 Folder Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── website/          ← New: Lovable2 functionality
│   │   └── [existing]        ← Untouched: Slidexy routes
│   │
│   ├── website-*/            ← New: Supporting folders
│   └── [existing]            ← Untouched: Slidexy code
│
├── package.json              ← Updated: New dependencies
└── .env                      ← Updated: New API keys
```

## 🎉 That's It!

You now have both Slidexy AND the Website Builder running in one project!

---

**Need Help?** Check `WEBSITE_INTEGRATION_GUIDE.md` for detailed documentation.
