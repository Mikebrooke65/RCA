# RCA Membership System - TODO

## 🚀 Next Up
1. [x] Configure custom SMTP in Supabase (use riverheadcommunity.org.nz) ✅
2. [x] Customise Supabase email templates to look like RCA emails ✅
3. [x] Wire audit logging to actual actions ✅
4. [x] Update contact details form (member portal) ✅
5. [x] Set up Stripe for live payments ✅
6. [x] Clean up test data from database ✅
7. [x] Test full flow with real members ✅
8. [ ] Navigation cleanup:
   - Clean up nav bar styling (black bars look messy, need button separation)
   - Remove "Apply", "My Portal", "Admin" from header - not needed
   - Admin users: add "Portal" link in admin nav bar
   - Member users: add "Admin" link in member nav bar (if admin)
   - Add stats cards in header: "No. Members" and "No. Households"
9. [ ] Invite existing members to join

## 🎉 SYSTEM IS LIVE
- First real member signup completed (2026-04-02)
- Full end-to-end flow tested: Apply → Payment → Email → Password → Login → Admin

## 🔜 Before Going Live - ALL DONE ✅
- [x] Stripe account activated and live ✅
- [x] Stripe bank account configured (for payouts) ✅
- [x] Live webhook configured in Stripe Dashboard ✅
- [x] Custom SMTP configured (emails from noreply@riverheadcommunity.org.nz) ✅
- [x] Test data cleaned up ✅
- [x] End-to-end testing complete ✅
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
- [x] Facebook integration - manual tracking of FB group membership ✅
- [x] Facebook cleanup report for lapsed members ✅
- [x] Facebook group link on member portal ✅
- [ ] Show outstanding fees prominently on member dashboard for lapsed members

## 🚀 Phase 2 - Future Enhancements
- [ ] Community Board - members can post under topic headings, reply to posts, add emoji reactions
- [ ] Digital Membership Card - downloadable card for Apple Wallet / Google Wallet (or PDF with QR code)
