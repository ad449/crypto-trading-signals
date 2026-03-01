# ✅ Deployment Checklist

## Pre-Deployment
- [x] Code committed to git
- [x] .gitignore configured (excludes .env.local)
- [x] Build scripts configured in package.json
- [x] All dependencies listed
- [x] App tested locally (http://localhost:3000)

## Deployment Steps

### Step 1: Login
```bash
npx vercel login
```
- [ ] Email verified
- [ ] Logged in successfully

### Step 2: Deploy
```bash
npx vercel --prod
```
- [ ] Answered all prompts
- [ ] Build completed successfully
- [ ] Received deployment URL

### Step 3: Configure Environment Variables
Go to: https://vercel.com/dashboard

- [ ] Added NEXT_PUBLIC_SUPABASE_URL
- [ ] Added NEXT_PUBLIC_SUPABASE_ANON_KEY
- [ ] Added GROQ_API_KEY (optional)
- [ ] Redeployed after adding variables

### Step 4: Test Live App
- [ ] App loads at Vercel URL
- [ ] Can generate signals
- [ ] Technical indicators working
- [ ] UI displays correctly

## Post-Deployment

### Optional Enhancements
- [ ] Add custom domain
- [ ] Set up Supabase properly (if not working)
- [ ] Add Groq API key for AI analysis
- [ ] Share with users!

## Your Deployment URL
Write it here after deployment:
```
https://_____________________.vercel.app
```

## Notes
- Vercel free tier: 100GB bandwidth/month
- Automatic HTTPS enabled
- Auto-deploys on git push (if linked to GitHub)
- Environment variables are encrypted

---

**Ready to deploy?** Open your terminal and start with:
```bash
npx vercel login
```
