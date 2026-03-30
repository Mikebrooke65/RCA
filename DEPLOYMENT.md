# RCA Membership System - Deployment Guide

## Prerequisites

1. **Supabase Project**
   - Create project at supabase.com
   - Run `supabase/schema.sql` in SQL Editor (this automatically enables RLS and creates policies)
   - Set up Supabase Auth (Email + Password):
     - Go to Authentication > Providers
     - Enable Email provider
     - Toggle "Confirm email" to ON

2. **Resend Account** (Email Service)
   - Sign up at resend.com (free tier: 3,000 emails/month)
   - Get API key from dashboard
   - Verify your Gmail address:
     - Go to Domains > Add Domain > Verify single email address
     - Enter: riverheadcommunityassociation@gmail.com
     - Check Gmail for verification link and confirm
   - Add API key to environment variables

3. **Stripe Account**
   - Create account at stripe.com
   - Get API keys (publishable + secret)
   - Set up webhook endpoint: `https://your-domain.com/api/webhooks/stripe`
   - Add webhook events: `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`

4. **Google Maps API** (Address Validation)
   - Go to https://console.cloud.google.com
   - Create a new project or select existing
   - Enable **Geocoding API**:
     - Go to APIs & Services > Library
     - Search "Geocoding API"
     - Click Enable
   - Create API key:
     - Go to APIs & Services > Credentials
     - Click Create Credentials > API Key
     - Copy the key
   - Restrict the key (recommended):
     - Click on the key name
     - Under "API restrictions", select "Restrict key"
     - Choose "Geocoding API"
     - Save

5. **Facebook App** (Optional - for deeper integration)
   - Create app at developers.facebook.com
   - Get App ID and App Secret
   - Request group permissions
   - Get your Facebook Group ID

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Resend (Email)
RESEND_API_KEY=re_xxx
RESEND_FROM_EMAIL=riverheadcommunityassociation@gmail.com

# AddressFinder NZ
ADDRESSFINDER_API_KEY=xxx

# Facebook (Optional)
FACEBOOK_APP_ID=xxx
FACEBOOK_APP_SECRET=xxx
FACEBOOK_GROUP_ID=xxx

# App
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## Netlify Deployment

1. **Connect Repository**
   - Push code to GitHub
   - Connect repository to Netlify
   - Netlify will auto-detect Next.js

2. **Configure Build**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: 20

3. **Add Environment Variables**
   - Go to Site Settings > Environment Variables
   - Add all variables from `.env.local`

4. **Deploy**
   - Trigger deploy
   - Netlify will build and deploy automatically

5. **Configure Webhooks**
   - Update Stripe webhook URL to production domain
   - Test webhook delivery

## Post-Deployment

1. **Create Admin User**
   - Sign up through Supabase Auth
   - Manually add record to `admins` table with `super_admin` role

2. **Test Core Flows**
   - Application submission
   - Email verification
   - Address validation
   - Payment processing
   - Admin approval

3. **Configure Email Service**
   - Integrate with Resend, SendGrid, or Supabase Edge Functions
   - Update email template functions in `lib/email/templates.ts`

4. **Set Up Monitoring**
   - Enable Netlify Analytics
   - Set up error tracking (Sentry, etc.)
   - Monitor Stripe webhook logs

## Custom Domain

1. Add custom domain in Netlify
2. Configure DNS records
3. Enable HTTPS (automatic with Netlify)
4. Update `NEXT_PUBLIC_APP_URL` environment variable

## Maintenance

- **Renewals**: Run renewal generation on April 1st each year
- **Backups**: Supabase handles automatic backups
- **Updates**: Deploy updates via Git push
- **Monitoring**: Check Netlify and Supabase dashboards regularly
