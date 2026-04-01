# RCA Membership System - TODO

## 🚀 Next Up
1. [x] Configure custom SMTP in Supabase (use riverheadcommunity.org.nz) ✅
2. [x] Customise Supabase email templates to look like RCA emails ✅
3. [x] Wire audit logging to actual actions ✅
4. [x] Update contact details form (member portal) ✅
5. [x] Set up Stripe for live payments ✅
6. [ ] Clean up test data from database
7. [ ] Test full flow with real members

## 🔜 Before Going Live - ALL DONE ✅
- [x] Stripe account activated and live ✅
- [x] Stripe bank account configured (for payouts) ✅
- [x] Live webhook configured in Stripe Dashboard ✅
- [x] Custom SMTP configured (emails from noreply@riverheadcommunity.org.nz) ✅
- [ ] Test data cleaned up
- [ ] Facebook App configured (optional - not required for launch)

## ✅ Completed

### Infrastructure
- [x] Supabase database deployed
- [x] Netlify deployment (riverheadcommunity.org.nz)
- [x] Domain registered and configured
- [x] Supabase Auth configured
- [x] Stripe test mode configured
- [x] Google Maps API configured
- [x] Resend email configured

### Application Flow
- [x] Full Member application form with address validation
- [x] Friend application form
- [x] Household detection and creation
- [x] Full Members auto-approved when address validates
- [x] Friends go through admin approval queue
- [x] Supabase Auth account created automatically on approval
- [x] Invite email sent to new members on approval
- [x] Payment link generated for primary household members

### Member Portal
- [x] Login with role-based redirect (admin vs member)
- [x] Logout button
- [x] Forgot password / reset password pages
- [x] Member dashboard with profile details
- [x] Member navigation bar
- [x] Household members page
- [x] Payment history page
- [x] Announcements on member portal
- [x] Document repository (download minutes, accounts, constitution etc)

### Admin Dashboard
- [x] Admin navigation bar
- [x] Route protection (redirects to login)
- [x] Dashboard with stats
- [x] Applications approval queue (no popups, inline decline modal)
- [x] Member management with search/filter
- [x] Payment reconciliation (ASB CSV upload)
- [x] Renewal management
- [x] Membership year & fee management
- [x] Announcements management (create/edit/delete with images)
- [x] Document repository management (upload/edit/delete by category)
- [x] Audit log viewer
- [x] Facebook page (placeholder - not configured)

### Landing Page
- [x] Branded with RCA logo and forest green colours
- [x] Apply and Login cards
- [x] Public announcements section

## 🤔 Open Questions - RESOLVED
- ~~Can lapsed members rejoin without reapplying?~~ → Yes, they can always log in but system shows outstanding fees. Facebook access removed for non-payers.
- ~~What happens when a household moves address?~~ → Manual process - member contacts admin (handled in update details page)
- ~~Do we need IRD-compliant donation receipts?~~ → Yes, for donations (not membership fees). Add to future work.
- ~~Should audit logs include member self-service actions?~~ → Yes, add audit logging to member update actions.

## 📋 Future Work
- [ ] Donation receipts (IRD-compliant) for donation payments
- [x] Add audit logging to member self-service changes (profile updates) ✅
- [ ] Facebook integration - disconnect non-paying members from group access
- [ ] Show outstanding fees prominently on member dashboard for lapsed members
