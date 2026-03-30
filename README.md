# RCA Membership System

Riverhead Community Association membership management system - Incorporated Societies Act 2022 compliant.

## Tech Stack
- Next.js 14 (App Router)
- Supabase (PostgreSQL + Auth)
- Stripe (Payments)
- AddressFinder NZ (Address validation)
- Facebook Graph API (Group integration)
- Netlify (Hosting)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy `.env.local.example` to `.env.local` and fill in your credentials

3. Set up Supabase:
   - Create a new project at supabase.com
   - Run the schema: `supabase/schema.sql`
   - Copy your project URL and keys to `.env.local`

4. Run development server:
```bash
npm run dev
```

## Project Structure
- `/app` - Next.js app router pages
- `/components` - React components
- `/lib` - Utilities and integrations
- `/types` - TypeScript definitions
- `/supabase` - Database schema and migrations

## Key Features
- Dual membership types (Full Members + Friends)
- Household management with address validation
- Annual renewal cycle (April 1 - March 31)
- Stripe + ASB bank reconciliation
- Facebook group integration
- Legal compliance (audit logs, data retention)
- Member self-service portal
- Multi-role admin dashboard

## Next Steps
1. Configure Supabase project
2. Set up Stripe account
3. Get AddressFinder NZ API key
4. Configure Facebook App for Graph API
5. Deploy to Netlify
