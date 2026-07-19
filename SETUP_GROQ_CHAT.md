# 🚀 HOW TO ENABLE GROQ CHAT - SETUP GUIDE

## ✅ You Have the API Key!

Use your Groq API key in the next step. Keep it secret!

---

## 🔧 SETUP IN 3 STEPS

### Step 1: Create `.env.local` File
**Location:** Root of the project (same level as `package.json`)

**Content:**
```bash
# Environment variables for DiscoveryOS

# Application
NEXT_PUBLIC_APP_NAME=DiscoveryOS
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Features
NEXT_PUBLIC_ENABLE_DARK_MODE=true

# AI Provider - REQUIRED for chat
GROQ_API_KEY=[YOUR_GROQ_API_KEY_HERE]

# Supabase (optional, for vector search later)
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

### Step 2: Restart Dev Server
```bash
# Kill the current dev server (Ctrl+C)
# Then restart:
npm run dev
```

### Step 3: Test Chat
1. Go to: http://localhost:3000/ai-workspace
2. Type a message
3. See real Groq responses! 🎉

---

## ✨ What You Get

✅ **Real LLM** - `llama-3.3-70b-versatile` model  
✅ **Streaming** - Real-time token output  
✅ **Fast** - Groq is optimized for speed  
✅ **Free** - You're on the free tier  
✅ **No Rate Limits** - For reasonable use  

---

## 🧪 Test Prompts

Try these in the AI Workspace:

1. **Analyze Feedback**
   > "Analyze this customer feedback and identify the main pain points"

2. **Extract Themes**
   > "What are the top 5 themes from the uploaded documents?"

3. **Generate Insights**
   > "Create a product roadmap based on customer feedback"

4. **Sentiment Analysis**
   > "What is the overall sentiment of the feedback? Breakdown by category"

5. **Generate PRD**
   > "Generate a product requirements document from this analysis"

---

## 🔍 How It Works

### Chat Flow
```
You: Send message in /ai-workspace
  ↓
POST /api/chat (server-side)
  ↓
Call Groq API with:
  - Model: llama-3.3-70b-versatile
  - Temperature: 0.7
  - Max tokens: 2000
  ↓
Stream response back to you
  ↓
You: See real-time response
```

### Key Files
- **API Route**: `src/app/api/chat/route.ts`
- **Groq Client**: `src/services/ai/providers/groq.ts`
- **Chat UI**: `src/components/ai-workspace/ConversationArea.tsx`
- **Hook**: `src/hooks/useChat.ts`

---

## 📊 What's Using Groq

| Feature | Status |
|---------|--------|
| **Chat** | ✅ Active |
| **Insights** | ✅ Active |
| **Analysis** | ✅ Active |
| **Evidence** | 🟡 Mock data (Phase 3) |
| **RAG** | 🟡 Scaffolded (Phase 3) |

---

## ⚙️ Configuration Details

**Model Settings:**
- Provider: Groq
- Model: `llama-3.3-70b-versatile`
- Temperature: 0.7 (balanced creativity)
- Max Tokens: 2000
- Streaming: Enabled

**Rate Limits:**
- Free tier is generous
- No strict limits for development
- For production: Consider upgrading

---

## 🚨 Troubleshooting

### "Chat not working?"

**Check 1: Is `.env.local` created?**
```bash
# You should see this file in your project root
ls .env.local
# or on Windows
dir .env.local
```

**Check 2: Is GROQ_API_KEY set?**
```bash
# View the file
cat .env.local
# Should show: GROQ_API_KEY=gsk_...
```

**Check 3: Is dev server restarted?**
```bash
# Kill current server: Ctrl+C
# Restart:
npm run dev
# Wait for "ready - started server on 0.0.0.0:3000"
```

**Check 4: Check browser console**
- Open DevTools (F12)
- Go to Console tab
- Look for error messages
- Check Network tab for `/api/chat` requests

### "API key error?"

1. Copy key exactly (including `gsk_` prefix)
2. No extra spaces at start/end
3. Check `.env.local` is in project root, not subdirectory

### "Slow responses?"

- Groq is normally <1s per response
- Check your internet connection
- Check Groq status: https://console.groq.com/status
- Free tier may have occasional delays

---

## 🔐 Security Notes

✅ `.env.local` is in `.gitignore` - won't be committed  
✅ API key is server-side only - never sent to browser  
✅ Never commit `.env.local` to GitHub  
✅ Keep API key private - don't share in code/repos  

---

## 🎯 Next Steps

### Immediate
✅ Create `.env.local`  
✅ Add Groq API key  
✅ Restart dev server  
✅ Try chat in `/ai-workspace`  

### Soon (Phase 3)
- [ ] Add real Supabase database
- [ ] Activate RAG pipeline
- [ ] Vector embeddings
- [ ] Semantic search

### Future
- [ ] Upload real documents
- [ ] Multi-agent analysis
- [ ] Export reports
- [ ] Team collaboration

---

## 📞 Quick Reference

| What | Where |
|------|-------|
| **Chat** | http://localhost:3000/ai-workspace |
| **Projects** | http://localhost:3000/projects |
| **Dashboard** | http://localhost:3000 |
| **Groq Console** | https://console.groq.com |
| **API Docs** | https://console.groq.com/docs |

---

## ✨ You're All Set!

1. Create `.env.local` with your API key
2. Restart dev server
3. Go to `/ai-workspace`
4. Start chatting!

**Your real AI is now live! 🚀**
