# 🚀 Quick Vercel Deployment Guide

## Prerequisites
✅ Code is committed to git
✅ Vercel CLI is available via npx

## Deploy in 3 Commands

### 1. Login to Vercel
```bash
npx vercel login
```
- Enter your email when prompted
- Check your email and click the verification link
- Return to terminal once logged in

### 2. Deploy to Production
```bash
npx vercel --prod
```

Answer the prompts:
- "Set up and deploy?" → **y** (yes)
- "Which scope?" → Select your account (use arrow keys)
- "Link to existing project?" → **N** (no)
- "What's your project's name?" → **crypto-trading-signals** (or press Enter)
- "In which directory is your code located?" → **./** (press Enter)

Wait for deployment... ⏳

### 3. Add Environment Variables

After deployment, go to: https://vercel.com/dashboard

1. Click on your **crypto-trading-signals** project
2. Go to **Settings** → **Environment Variables**
3. Add these three variables:

```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://yjzawzobfnurukiopthi.supabase.co
Environment: Production, Preview, Development
```

```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqemF3em9iZm51cnVraW9wdGhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzNDI4MzIsImV4cCI6MjA4NzkxODgzMn0.hVdtz2nSOl3VRnkzh4VnOcro6M3bsqM63D14-u_MYVc
Environment: Production, Preview, Development
```

```
Name: GROQ_API_KEY
Value: your_groq_api_key_here
Environment: Production, Preview, Development
```

4. Click **Save**
5. Go to **Deployments** tab
6. Click the **⋯** menu on the latest deployment
7. Click **Redeploy**

## 🎉 Done!

Your app will be live at: `https://crypto-trading-signals-xxx.vercel.app`

## Troubleshooting

**Build fails?**
- Check build logs in Vercel dashboard
- Ensure all dependencies are in package.json

**Environment variables not working?**
- Make sure you selected all environments (Production, Preview, Development)
- Redeploy after adding variables

**Want a custom domain?**
- Go to Settings → Domains
- Add your domain and follow DNS instructions

## Useful Commands

```bash
# Check deployment status
npx vercel ls

# View logs
npx vercel logs

# Open project in browser
npx vercel open
```

---

**Ready?** Open your terminal and run:
```bash
npx vercel login
```
