# RCA Membership System - Testing Notes

## Session: March 31, 2026

### ✅ WORKING FEATURES

1. **Application Submission Flow**
   - Full Member and Friend application forms working
   - Address validation with Google Maps API
   - Household detection and creation
   - Application saves to database

2. **Email Verification**
   - Verification token generation working
   - Token stored in database with 24hr expiry
   - Verification endpoint working
   - Redirects to home page with success message

3. **Admin Approval Workflow**
   - Admin can view pending applications
   - Approve/Decline buttons functional
   - Status updates to 'active' on approval
   - date_approved and date_joined timestamps set correctly

4. **Household Logic**
   - Creates household for Full Members
   - Detects existing households by normalized address
   - Fixed: Now checks for active members before marking as additional

---

## 🔧 TEMPORARY FIXES / WORKAROUNDS

### 1. Email Sending (CRITICAL - NEEDS FIXING)
**Issue:** Resend only allows sending to verified email in test mode

**Current Workaround:** 
- Email sending wrapped in try/catch to prevent application failure
- Verification link returned in API response during development
- Manual verification via SQL query: `supabase/get_verification_link.sql`

**Proper Fix Needed:**
- Option A: Verify a domain in Resend (e.g., riverheadcommunity.org.nz)
- Option B: Use different email service for development (e.g., Mailgun, SendGrid)
- Option C: Set up local email testing with something like MailHog

**Files Modified:**
- `app/api/apply/route.ts` - Added try/catch around sendEmail()

---

### 2. Authentication (CRITICAL - NEEDS IMPLEMENTATION)
**Issue:** Member portal requires authentication but Supabase Auth not implemented

**Current Workaround:** 
- Member portal shows "Please log in" message
- No way to actually log in yet

**Proper Fix Needed:**
- Implement Supabase Auth (email/password or magic link)
- Add login/signup pages
- Add session management
- Protect member portal routes
- Update API endpoints to use authenticated user ID

**Files Needing Auth:**
- `app/api/member/profile/route.ts` - Currently uses 'temp-user-id'
- `app/api/member/household/route.ts`
- `app/api/member/payments/route.ts`
- `app/member/*` pages - All need auth protection

---

### 3. Stripe Webhooks for Local Testing (NEEDS SETUP)
**Issue:** Webhooks don't reach localhost automatically

**Current Workaround:** 
- Manual SQL to mark payments as paid: `supabase/mark_payment_paid.sql`
- Payment completes in Stripe but status doesn't update automatically

**Proper Fix for Local Development:**
- Install Stripe CLI: https://stripe.com/docs/stripe-cli
- Run: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
- Update STRIPE_WEBHOOK_SECRET with the webhook signing secret from CLI

**Production:**
- Webhooks will work automatically once deployed
- Configure webhook endpoint in Stripe Dashboard
- Point to: https://yourdomain.com/api/webhooks/stripe
- Select event: `checkout.session.completed`

**Files:**
- `app/api/webhooks/stripe/route.ts` - Webhook handler (already implemented)
**Issue:** Admin dashboard has no authentication

**Current Workaround:** 
- Admin pages are publicly accessible (security risk!)

**Proper Fix Needed:**
- Implement admin authentication
- Add admin role checking
- Protect all `/admin/*` routes
- Create admin login page

---

## 📋 KNOWN ISSUES

### 1. Household Primary Member Detection
**Status:** FIXED in code, manual fix applied to test data

**What Happened:**
- When test member was deleted, household record remained
- New application found existing household and marked as "additional member"
- Should have been marked as "primary" since no active members existed

**Fix Applied:**
- Updated `app/api/apply/route.ts` to check for active members at household
- Manual SQL fix: `supabase/fix_primary_member.sql`

---

### 2. Email Verification in Production
**Status:** NEEDS ATTENTION

**Issue:**
- Verification emails won't send to real users without domain verification
- Users will be stuck at "pending" status

**Required Before Launch:**
- Verify domain in Resend
- Update RESEND_FROM_EMAIL to use verified domain
- Test with real email addresses

---

## 🧪 TESTING COMPLETED

### Application Flow
- ✅ Submit Full Member application
- ✅ Address validation (Google Maps API)
- ✅ Household creation
- ✅ Email verification token generation
- ✅ Manual email verification via SQL
- ✅ Admin approval workflow
- ✅ Status changes (pending → active)

### Payment Flow
- ✅ Payment record creation
- ✅ Stripe checkout session generation
- ✅ Payment link creation API
- ✅ Stripe checkout page loads correctly
- ✅ Test payment completes successfully
- ✅ Success/Cancel pages created
- ⚠️ Webhook processing (needs Stripe CLI for local testing)

### Database
- ✅ Members table working
- ✅ Households table working
- ✅ Payments table working
- ✅ Email verification columns added
- ✅ Timestamps recording correctly

---

## 🚧 NOT YET TESTED

1. **Payment Flow**
   - Stripe checkout session creation
   - Payment webhook handling
   - Payment reconciliation

2. **Member Portal**
   - Profile viewing (blocked by auth)
   - Household members view
   - Payment history

3. **Friend Membership**
   - Friend application flow
   - Admin approval for Friends

4. **Renewals**
   - Renewal generation
   - Renewal reminders
   - Renewal payments

5. **Facebook Integration**
   - Group sync
   - Health checks
   - Member invites

---

## 📝 SQL HELPER SCRIPTS CREATED

Located in `supabase/` directory:

1. `add_email_verification.sql` - Adds verification token columns
2. `cleanup_test_data.sql` - Removes test members
3. `get_verification_link.sql` - Gets verification link for testing
4. `check_member_status.sql` - Checks member approval status
5. `check_household.sql` - Views household and member relationships
6. `fix_primary_member.sql` - Fixes primary household member flag

---

## 🎯 NEXT PRIORITIES

1. **Email Service** - Fix or replace Resend for testing
2. **Authentication** - Implement Supabase Auth for members and admins
3. **Payment Flow** - Test Stripe integration
4. **Deployment** - Deploy to Netlify for staging environment

---

## 💡 RECOMMENDATIONS

### For Development
- Consider using a local email testing tool (MailHog, Mailpit)
- Set up proper test/staging environment variables
- Create seed data scripts for testing

### For Production
- MUST verify domain before launch
- MUST implement authentication before launch
- MUST secure admin routes before launch
- Consider adding rate limiting to application endpoint
- Add proper error logging (Sentry, LogRocket, etc.)

---

## 📊 CURRENT STATE

**Database:** ✅ Schema complete, migrations applied
**Application Flow:** ✅ Working (with email workaround)
**Admin Dashboard:** ✅ Basic functionality working
**Member Portal:** ⚠️ Blocked by authentication
**Payments:** ❌ Not tested
**Email:** ⚠️ Temporary workaround in place
**Auth:** ❌ Not implemented
**Deployment:** ❌ Not done

---

*Last Updated: March 31, 2026*

## 📊 SESSION SUMMARY - March 31, 2026

### What We Tested Today
1. Started dev server and tested application submission
2. Fixed email verification flow (added token columns to database)
3. Tested email verification (manual via SQL due to Resend restrictions)
4. Tested admin approval workflow
5. Fixed household primary member detection logic
6. Created payment link generation API
7. Tested Stripe checkout flow end-to-end
8. Created payment success/cancel pages
9. Simulated webhook payment completion

### Key Achievements
- ✅ Complete application-to-payment flow working
- ✅ Database schema validated and working
- ✅ Stripe integration functional
- ✅ Admin approval process working
- ✅ Household logic fixed and tested

### Files Created During Testing
- `supabase/add_email_verification.sql`
- `supabase/cleanup_test_data.sql`
- `supabase/get_verification_link.sql`
- `supabase/check_member_status.sql`
- `supabase/check_household.sql`
- `supabase/fix_primary_member.sql`
- `supabase/check_payments.sql`
- `supabase/create_payment_for_testing.sql`
- `supabase/get_member_id.sql`
- `supabase/mark_payment_paid.sql`
- `app/api/member/payment-link/route.ts`
- `app/test-payment/page.tsx`
- `app/payment/success/page.tsx`
- `app/payment/cancel/page.tsx`
- `TESTING_NOTES.md` (this file)

### Critical Issues Identified
1. Email service needs domain verification or alternative solution
2. Authentication not implemented (blocking member portal)
3. Webhook testing requires Stripe CLI for local development

### Ready for Next Steps
- Member portal (needs auth)
- Friend membership testing
- Renewals system
- Facebook integration
- Deployment to staging


---

## 🐛 CURRENT ISSUE - March 31, 2026 (Late Session)

### Authentication Implementation - RESOLVED ✅

**Problem was:** `supabaseAdmin` (server-only client) was being bundled into browser code
- Error: "supabaseKey is required" - service role key not available in browser
- Fix: Split Supabase clients into `browser.ts` (public key only) and `client.ts` (server only)
- Auth functions in `lib/auth/index.ts` now only import from `browser.ts`
- Admin checks moved to API route (`/api/auth/check-role`) which runs server-side only

**Result:** Login works correctly
- Admin users → redirected to `/admin`
- Regular members → redirected to `/member`
