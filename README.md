# TestMe Post Studio

AI-powered social media post generator for language assessment — built with Next.js and Claude (Anthropic).

---

## 🚀 Deploy to Vercel in 5 minutes

### Step 1 — Get your Anthropic API key
1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up / log in
3. Click **API Keys** → **Create Key**
4. Copy the key (starts with `sk-ant-...`)

### Step 2 — Put the code on GitHub
1. Go to [github.com](https://github.com) and create a **new repository** (name it `testme-post-studio`)
2. Upload all the files from this folder into that repository
   - Easiest way: drag and drop the files into the GitHub web interface

### Step 3 — Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) and sign up with your GitHub account
2. Click **Add New Project** → select your `testme-post-studio` repository
3. Click **Environment Variables** and add:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** your key from Step 1
4. Click **Deploy**

✅ Your app will be live at `https://testme-post-studio.vercel.app` (or similar) in about 60 seconds.

---

## 💻 Run locally (optional)

```bash
npm install
cp .env.example .env.local
# Edit .env.local and add your ANTHROPIC_API_KEY
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000)

---

## Features
- 4 post types: Language Trivia, Expert Quote, Assessment Fact, Testing Tip
- LinkedIn & Facebook caption variants
- 10 topic focuses
- Accurate, sourced content via Claude
- Download graphic as 1080×1350 PNG (ready for social media)
- Copy caption + hashtags in one click
