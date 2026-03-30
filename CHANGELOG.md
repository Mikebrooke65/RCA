# Changelog - RCA Membership System

All notable changes to this project will be documented in this file.

## [Unreleased]

### Documentation
- Created CONVERSATION_HISTORY.md for session tracking
- Created CHANGELOG.md for version control
- Created TODO.md with phased development plan
- Created .kiro/steering/project-documentation.md for automatic doc updates

### Application Flow (Phase 1)
- Application form with membership type selection
- Address autocomplete component with AddressFinder integration
- Email verification system
- Household duplicate detection
- Admin approval workflow UI
- Application API endpoints (submit, approve, decline)

### Payment System (Phase 2)
- Stripe webhook handler for payment events
- Payment reconciliation UI for ASB CSV uploads
- Payment reconciliation API with auto-matching logic
- Checkout session creation
- Payment status tracking

### Member Portal (Phase 3 - Complete)
- Member dashboard with profile overview
- Household members view with address display
- Payment history view with receipt download
- Profile API endpoints
- Navigation to household, payments, renewals, documents

### Admin Dashboard (Phase 4 - Complete)
- Dashboard with key statistics
- Applications approval queue
- Members management with search and filtering
- Renewals management with cycle controls
- Facebook group health dashboard
- Audit log viewer with filtering
- Payment reconciliation interface
- Navigation structure for all admin features

### Renewal System (Phase 5 - Complete)
- Renewal generation API (April 1 automation)
- Renewal management UI with controls
- Email templates for reminders
- Lapsed member logic (ready for implementation)

### Facebook Integration (Phase 6 - Complete)
- Facebook sync API
- Group health dashboard
- Member join/leave tracking
- Invite link generation

### Email System (Phase 7 - Partial)
- Email template library (6 core templates)
- Template variable system
- Communication logging structure
- TODO: Bulk sending, template management UI

### Deployment Configuration
- Netlify configuration (netlify.toml)
- Git ignore file
- Deployment guide (DEPLOYMENT.md)

### Session 3 - 2026-03-31

#### Authentication System
- Implemented Supabase Auth login flow
- Created `/app/login/page.tsx` with branded login form
- Created `lib/supabase/browser.ts` - browser-safe Supabase client (public key only)
- Fixed critical bug: `supabaseAdmin` was being bundled into browser, causing "supabaseKey is required" error
- Split client into `browser.ts` (client-side) and `client.ts` (server-side only)
- Created `/api/auth/check-role` endpoint for server-side role detection
- Login now redirects admins to `/admin` and members to `/member`
- Created `lib/auth/index.ts` with signIn, signOut, getCurrentUser helpers

#### Branding & UI
- Added forest green and black brand colors to Tailwind config
- Created reusable `Layout` component with header, nav, and footer
- Added RCA logo to header
- Updated home page with branded card layout
- Home page now shows "Apply" and "Login" instead of direct portal links
- Created payment success and cancel pages

#### Database Migrations
- Added `email_verification_token` and `email_verification_token_expires` columns to members
- Added `auth_user_id` to members table (links to Supabase Auth)
- Added `user_id` to admins table (links to Supabase Auth)
- Created indexes for auth lookups

#### Bug Fixes
- Fixed household primary member detection (was marking sole member as "additional")
- Fixed email verification endpoint to use token lookup instead of member ID
- Fixed application route to catch email send failures gracefully

#### Testing Completed
- Full application submission flow ✅
- Email verification (manual via SQL) ✅
- Admin approval workflow ✅
- Stripe payment checkout ✅
- Login and role-based redirect ✅

#### Known Issues / Temporary Fixes
- Email sending blocked by Resend domain verification requirement
- Supabase anon key hardcoded in `browser.ts` (env vars not loading in browser - needs investigation)
- Member portal still uses `temp-user-id` placeholder
- Admin routes not yet protected (no auth check)
- Switched from AddressFinder to Google Maps API for address validation
- Wired up application forms to API endpoints
- Configured environment variables for all services
- Updated address validation logic for Google Maps Geocoding API
- Renamed lib/addressfinder to lib/address
- Updated all import references

### Environment Configuration Complete
- Supabase: Database schema deployed, RLS enabled, Auth configured
- Stripe: Test mode keys configured, webhook endpoint created
- Resend: API key configured, using onboarding@resend.dev for testing
- Google Maps: Integration code ready (API key pending)

### Technical Decisions - Session 2
- Chose Google Maps API over AddressFinder for cost (free tier vs $50-150/month)
- Using Resend onboarding email for testing (can verify Gmail later)
- Stripe webhook pointing to webhook.site for testing
- Will update webhook URL when deployed to production

### Added - 2026-03-30
- Initial project scaffolding
- Next.js 14 configuration with TypeScript
- Supabase database schema with full legal compliance:
  - Members table with household relationships
  - Households table with address validation
  - Renewals and membership years tracking
  - Payments table with Stripe and ASB reconciliation fields
  - Admins table with role-based access
  - Audit log for compliance
  - Email templates and communication log
  - Donations table (future module)
- Integration modules:
  - AddressFinder NZ for address validation
  - Stripe for payment processing
  - Facebook Graph API for group management
- TypeScript type definitions for core entities
- Environment variable template
- Tailwind CSS configuration
- Basic app layout and home page

### Technical Decisions
- Chose AddressFinder NZ over Google Maps for NZ-specific accuracy
- Implemented Row Level Security (RLS) on sensitive tables
- Used UUID for all primary keys
- Created composite indexes for query optimization
- Separated admin roles (super_admin, membership_admin, communications_admin)

## [0.1.0] - 2026-03-30

### Project Initialized
- Repository structure created
- Core dependencies defined
- Database schema designed
- Integration stubs implemented
