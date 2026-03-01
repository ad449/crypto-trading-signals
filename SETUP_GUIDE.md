# Quick Setup Guide

## 1. Install Dependencies
```bash
npm install
```

## 2. Environment Variables

Create `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here
GROQ_API_KEY=your_groq_key_here
```

## 3. Setup Supabase

1. Create account at https://supabase.com
2. Create new project
3. Go to SQL Editor
4. Copy and run `lib/database/schema.sql`
5. Get URL and anon key from Settings > API

## 4. Get Groq API Key (Optional)

1. Go to https://console.groq.com
2. Sign up
3. Create API key
4. Add to `.env.local`

## 5. Run Development Server
```bash
npm run dev
```

## 6. Test the App

Open http://localhost:3000

The app will work without Groq (uses rule-based fallback) and without Supabase (just won't save history).

## Next Steps

- Add your API keys
- Test signal generation
- Deploy to Vercel
