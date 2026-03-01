#!/bin/bash

echo "🚀 Deploying Crypto Trading Signals to Vercel..."
echo ""
echo "Step 1: Login to Vercel (if not already logged in)"
npx vercel login

echo ""
echo "Step 2: Deploy to Vercel"
npx vercel --prod

echo ""
echo "✅ Deployment complete!"
echo ""
echo "⚠️  Don't forget to add environment variables in Vercel dashboard:"
echo "   - NEXT_PUBLIC_SUPABASE_URL"
echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "   - GROQ_API_KEY (optional)"
