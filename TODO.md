# RCA Membership System - TODO

## Setup Tasks (Do First)
- [x] Run `npm install`
- [x] Create Supabase project at supabase.com
- [x] Run `supabase/schema.sql` in Supabase SQL Editor
- [x] Set up Supabase Auth (Email provider enabled)
- [x] Set up Stripe account + get API keys (test mode)
- [x] Set up Resend account + get API key
- [x] Get Google Maps API key (Geocoding + Places API)
- [x] Copy `.env.local.example` to `.env.local` and fill in keys
- [x] Test `npm run dev` works

## Immediate Next Steps
1. [x] Wire member portal to authenticated user session
2. [x] Add route protection (redirect to /login if not authenticated)
3. [x] Add logout button to header/nav
4. [x] Automate auth account creation on approval (Supabase invite)
5. [x] Auto-approve Full Members with validated address
6. [x] Test Friend membership application flow
7. [x] Admin navigation bar across all admin pages
8. [x] Membership year & fee management
9. [ ] Configure custom SMTP in Supabase (riverheadcommunity.org.nz) - waiting for domain
10. [ ] Customise Supabase email templates to look like RCA emails
11. [ ] Update NEXT_PUBLIC_APP_URL to riverheadcommunity.org.nz once domain propagates
12. [ ] Create forgot password page
13. [ ] Test full auto-approval flow for Full Members end-to-end on production
14. [ ] Wire audit logging to actual actions
15. [ ] Deploy to Netlify (done - rcamembership.netlify.app)
16. [ ] Set up Stripe bank account for real payments
17. [ ] Clean up test data from database
7. [x] Auto-approve Full Members when address validates
8. [ ] Test full auto-approval flow end to end
9. [ ] Set up Stripe CLI for local webhook testing
10. [ ] Free up disk space on dev machine (currently at 0GB!)
11. [ ] Deploy to Netlify once domain active

## Phase 1: Core Application Flow ✅ COMPLETE
- [x] Build application form (Full Member + Friend)
- [x] Implement email verification flow
- [x] Create address validation UI (Google Maps integration)
- [x] Build household duplicate detection
- [x] Create admin approval workflow
- [x] Build welcome email system (templates ready)
- [x] Wire up forms to API endpoints

## Phase 2: Payment System ✅ COMPLETE
- [x] Implement Stripe checkout flow
- [x] Create Stripe webhook handler (`/api/webhooks/stripe`)
- [x] Build payment status tracking
- [x] Create ASB CSV upload + reconciliation UI
- [x] Build payment history view for members

## Phase 3: Member Portal 🔄 IN PROGRESS
- [x] Member login/authentication - COMPLETE (Supabase Auth working)
- [x] Member dashboard (view details, household, payments)
- [x] Wire member portal to authenticated user (uses auth session)
- [ ] Member portal navigation bar (similar to admin nav)
- [ ] Welcome text and announcements section on member portal landing page
- [ ] File repository (minutes, accounts, constitution, planning docs etc)
- [ ] Update contact details form
- [x] View renewal history
- [ ] Download receipts
- [x] Request household member addition
- [ ] Resignation flow

## Phase 4: Admin Dashboard 🔄 IN PROGRESS
- [x] Admin authentication + role detection - COMPLETE
- [x] Admin navigation bar across all admin pages
- [x] Protect admin routes (redirect to login if not authenticated)
- [x] Membership overview dashboard
- [x] Application approval queue
- [x] Household management UI
- [x] Payment reconciliation interface
- [x] Member search and filtering
- [x] Audit log viewer
- [x] Membership year & fee management
- [ ] Wire audit logging to actual actions
- [ ] Announcements management (create/edit announcements for landing page and member portal)
- [ ] File repository management (upload minutes, accounts, constitution etc)
- [ ] CSV export functionality

## Phase 5: Renewal System ✅ COMPLETE
- [x] Create renewal auto-draft job (runs April 1)
- [x] Build renewal email templates
- [x] Implement reminder schedule (April 15, May 1)
- [ ] Create renewal confirmation flow
- [ ] Handle lapsed member logic (after May 31)

## Phase 6: Facebook Integration ✅ COMPLETE
- [x] Generate and send invite links
- [x] Build Facebook group health dashboard
- [x] Track member join/leave status
- [x] Flag members for removal

## Phase 7: Communications 🔄 IN PROGRESS
- [x] Email template management (templates created)
- [ ] Bulk email sending
- [ ] Communication log viewer
- [x] Template variable system

## Phase 8: Polish & Deploy
- [x] Deploy to Netlify (rcamembership.netlify.app)
- [ ] Configure custom domain (riverheadcommunity.org.nz - DNS propagating)
- [ ] Landing page - add welcome text and announcements section
- [ ] Member portal landing page - welcome text and announcements
- [ ] File repository for members (minutes, accounts, constitution, planning docs)
- [ ] Forgot password page
- [ ] Error handling and validation
- [ ] Loading states and UX polish
- [ ] Set up Stripe bank account for real payments
- [ ] Configure custom SMTP in Supabase
- [ ] Customise Supabase email templates
- [ ] Clean up test data from database
- [ ] Test production webhooks (Stripe)

## Open Questions to Resolve
- Can lapsed members rejoin without reapplying?
- What happens when a household moves?
- Should Friends be notified when removed from Facebook group?
- Do we need IRD-compliant donation receipts?
- Should audit logs include member self-service actions?
