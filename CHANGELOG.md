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

### Session 4 - 2026-03-31 (Continued)

#### Auto-Approval Flow
- Full Members with validated Riverhead address now auto-approved on submission
- Supabase `inviteUserByEmail()` called automatically on approval
- Payment link (Stripe checkout) generated and shown on success screen
- Friends remain in admin approval queue
- Apply page rewritten with proper success screen (no alert() popups)
- Different success messages for auto-approved vs pending applications

#### Admin Applications Page
- Removed browser confirm() popup
- Added inline decline modal with optional reason
- Fixed Next.js API caching with `export const dynamic = 'force-dynamic'`
- Fixed RLS issue - service role key now hardcoded in client.ts

#### Auth Automation
- Approve route now calls `supabaseAdmin.auth.admin.inviteUserByEmail()`
- Auth user ID linked back to member record
- Tested end-to-end - invite email received, auth account created in Supabase

#### Domain
- Registered riverheadcommunity.org.nz
- Pending DNS activation

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

### Session 4 - 2026-03-31

#### Full Member Auto-Approval
- Full Members with validated Riverhead address now auto-approved instantly
- Supabase `inviteUserByEmail()` called on approval - sends invite email automatically
- Auth user linked to member record (`auth_user_id`) on invite
- Payment link generated and shown on success screen for primary household members
- Friends still go through admin approval queue

#### Apply Page Rewrite
- Removed all `alert()` popups - replaced with proper success screen
- Full Members see "Welcome to RCA!" with payment link if applicable
- Friends see "Application received, we'll be in touch"
- Branded with Layout component and RCA colors

#### Admin Applications UX
- Removed `confirm()` popup from approve button
- Added inline decline modal with optional reason text field
- Applications disappear immediately after approval
- Added `force-dynamic` to all admin API routes to prevent caching

#### Bug Fixes
- Fixed `supabaseAdmin` using anon key instead of service role key (RLS was blocking queries)
- Fixed syntax error in members API route
- Fixed Next.js route caching causing stale data

#### Domain
- Registered `riverheadcommunity.org.nz`
- Pending DNS activation

### Session 5 - 2026-04-01

#### Deployment
- Successfully deployed to Netlify at rcamembership.netlify.app
- Fixed Netlify build errors (Python version, Stripe API version, TypeScript)
- Fixed API routes (removed bad redirects from netlify.toml)
- Fixed logo 400 error (set unoptimized images in next.config.js)
- Added all environment variables to Netlify
- Domain riverheadcommunity.org.nz registered and DNS propagating
- Supabase redirect URLs updated for production

#### Known Issues
- /forgot-password page not yet created (404)
- NEXT_PUBLIC_APP_URL needs updating to riverheadcommunity.org.nz once domain propagates

### Session 5 continued - 2026-04-01

#### Admin Navigation
- Created AdminNav component with tab bar across all admin pages
- Links to: Dashboard, Applications, Members, Payments, Renewals, Audit
- Active page highlighted in forest green
- Horizontally scrollable on mobile

#### Admin Pages Refactored
- All admin pages now use Layout + AdminNav components
- Removed all alert()/confirm() popups - replaced with inline feedback
- Facebook page shows "not configured" message instead of broken UI
- Consistent RCA branding across all admin pages

#### Membership Year & Fee Management
- Added membership_years table support in admin
- Renewals page now shows all membership years with fees
- Admins can edit fee for any year inline
- Admins can add new membership years (April 1 - March 31)
- Created /api/admin/membership-years API (GET, POST, PATCH)
- 2026-2027 year created in database with $10 fee


### Session 6 - 2026-04-01

#### Custom SMTP & Email Templates
- Configured custom SMTP in Supabase using riverheadcommunity.org.nz domain
- Customised Supabase email templates with RCA branding
- Tested password reset flow - emails sending correctly from noreply@riverheadcommunity.org.nz

#### Stripe Production Setup
- Configured production webhook endpoint in Stripe Dashboard (riverheadcommunity.org.nz/api/webhooks/stripe)
- Tested payment flow with test card (4242 4242 4242 4242) - checkout and webhook working
- Payment records updating correctly in database

#### Stripe Go-Live
- Completed Stripe account activation (business details, bank account, identity verification)
- Switched from sandbox to live mode
- Created live webhook endpoint with events: checkout.session.completed, payment_intent.succeeded, payment_intent.payment_failed
- Updated STRIPE_WEBHOOK_SECRET in Netlify
- Deployed to production - ready for real payments

#### Audit Logging Wired Up
- Added audit logging to all admin actions:
  - Member approval (member_approved)
  - Member decline (member_declined)
  - Payment reconciliation (payment_reconciliation)
  - Announcement create/update/delete
  - Document upload/update/delete
  - Membership year create and fee updates
- All actions now log before/after values for compliance

#### Member Update Details Form
- Enhanced update details page to show email and address (read-only)
- Added contact email for address/email change requests
- Cleaner layout with editable fields (name, phone) separated from read-only fields


### Session 7 - 2026-04-02

#### End-to-End Testing Complete 🎉
- First real member signup completed successfully
- Full flow tested: Apply → Stripe Payment → Email → Password Setup → Login → Admin Access
- Real $10 payment processed through Stripe live mode

#### Bug Fixes
- Fixed double-submit bug on apply form (was showing "email already registered" after successful submission)
- Fixed Stripe secret key in Netlify (was using pk_live instead of sk_live)
- Created new Stripe API key "RCA Website" for production
- Improved error messages in apply API to show actual error details

#### UX Improvements
- Added email reminder box to payment success page ("Check your email to set up your password")
- Shortened session ID display on success page (shows last 8 chars only)

#### Delete Member Script
- Fixed corrupted delete_member.sql script
- Script now properly cleans up: payments, admins, members, households

#### Production Status
- System is now fully live at riverheadcommunity.org.nz
- Ready for real member signups


### Session 7 continued - 2026-04-02

#### Navigation Cleanup
- Redesigned AdminNav and MemberNav components with cleaner styling
- Nav bars now use rounded button groups with gaps between buttons
- Admin nav: slate gray background, green active state, "Portal →" link
- Member nav: emerald green background, white active state, "Admin →" link (if admin)
- Removed "Apply", "My Portal", "Admin" links from header
- Added Members and Households stat cards to header (top right)
- Added AdminNav to admin dashboard and applications pages (were missing)
- Fixed households count query in stats API

#### Stats API
- Added totalHouseholds count to /api/admin/stats endpoint
- Stats now displayed in header on all authenticated pages


### Session 7 continued - 2026-04-02 (Donations)

#### Donations System
- Created public donation page at /donate (no login required)
- Created member donation page at /member/donate (for logged-in members)
- Added Stripe checkout integration for donations
- Added donation card on Friend signup success screen
- Added donation mention on Full Member signup success screen
- Added Donate link to member nav bar with icon
- Updated Stripe webhook to handle donation payments
- Created donations database migration (payment_method, payment_status, stripe_session_id columns)

#### Navigation Updates
- Added icons to all nav bar buttons (both admin and member)
- Added Facebook and Donate links to member nav bar
- Removed duplicate portal link cards from member dashboard (now all in nav)

#### Announcements Fix
- Added separate checkboxes for "Show on Public Page" and "Show on Members Portal"
- Announcements can now appear on both, one, or neither
- Added show_members column to announcements table

#### Important Note
- Removed "tax-deductible" wording from all donation text
- RCA is not registered as a charity with IRD, so donations are NOT tax-deductible
- Simple thank-you receipts will be sent (not IRD-compliant)
