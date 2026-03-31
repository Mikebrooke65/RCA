# RCA Membership System - TODO

## 🚀 Next Up
1. [ ] Configure custom SMTP in Supabase (use riverheadcommunity.org.nz)
2. [ ] Customise Supabase email templates to look like RCA emails
3. [ ] Wire audit logging to actual actions
4. [ ] Update contact details form (member portal)
5. [ ] Set up Stripe bank account for real payments
6. [ ] Clean up test data from database
7. [ ] Test full auto-approval flow on production end-to-end

## 🔜 Before Going Live
- [ ] Stripe bank account configured
- [ ] Custom SMTP configured (emails from noreply@riverheadcommunity.org.nz)
- [ ] Test data cleaned up
- [ ] Stripe webhook configured in Stripe Dashboard (production URL)
- [ ] Facebook App configured (optional)

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

## 🤔 Open Questions
- Can lapsed members rejoin without reapplying?
- What happens when a household moves address?
- Do we need IRD-compliant donation receipts?
- Should audit logs include member self-service actions?
