# CPS & Robotics Workshop — Master Project Document
> ViTachyon Robotics × IHFC IIT Delhi × PiSquare Academy
> Last updated: May 2026

---

## TABLE OF CONTENTS

1. [Project Overview](#1-project-overview)
2. [Design System — LOCKED](#2-design-system--locked)
3. [Tech Stack](#3-tech-stack)
4. [Pages & File Structure](#4-pages--file-structure)
5. [External Systems](#5-external-systems)
6. [Google Sheet Database Schema](#6-google-sheet-database-schema)
7. [Form Payload — Exact Fields](#7-form-payload--exact-fields)
8. [Complete User Workflow](#8-complete-user-workflow)
9. [Complete Admin Workflow](#9-complete-admin-workflow)
10. [Albato Automations — All Three](#10-albato-automations--all-three)
11. [WhatsApp Message Templates](#11-whatsapp-message-templates)
12. [Email Templates](#12-email-templates)
13. [PayU Configuration](#13-payu-configuration)
14. [All Confirmed Bugs & Fixes](#14-all-confirmed-bugs--fixes)
15. [Access Required From Senior](#15-access-required-from-senior)
16. [Implementation Order](#16-implementation-order)
17. [Working Style & Rules for AI Assistants](#17-working-style--rules-for-ai-assistants)

---

## 1. Project Overview

### Program Details

| Field | Value |
|---|---|
| Program name | CPS & Robotics Workshop + Internship |
| Organizer | PiSquare Academy |
| Industry partner | ViTachyon Robotics |
| Academic partner | IHFC IIT Delhi |
| Format | Fully online, live sessions |
| Duration | 2 weeks (workshop) + optional 2 weeks (internship) |
| Sessions | 16 guided live sessions, 60–90 min each |
| Workshop price | ₹199 (early bird, original ₹500) |
| Internship price | ₹299 (original ₹1,000) — includes workshop |
| Certificate | Digital certificate on completion |
| Recordings | Lifetime access |
| IIT Delhi tour | Live video tour on Day 15 |
| Internship letter | Issued to Week 3–4 participants |
| Countdown deadline | 2026-05-15T23:59:59 |

### Target Audience

- Engineering undergrads — CS, ECE, EEE, Mechanical, any branch
- Diploma / polytechnic students
- School students (Class 11–12)
- No prior programming experience required

### 16-Day Curriculum Summary

| Level | Phase | Days | Topic |
|---|---|---|---|
| L1 | Phase 1 | 1–3 | CPS intro, IDE setup, Arduino/ESP32 basics, programming fundamentals |
| L1 | Phase 2 | 4–6 | LED interfacing, digital I/O, switches, actuators (buzzer, relay, servo, motor) |
| L2 | Phase 3 | 7–9 | ESP32 wireless, RC car, QR-based control, autonomous obstacle-avoidance |
| L2 | Phase 4 | 10–12 | Mecanum drive, MediaPipe gesture recognition, ML-enabled rover control |
| L3 | Phase 5 | 13–14 | Gyro/accelerometer wireless control, drone concepts (roll/pitch/yaw) |
| L4 | Phase 6 | 15–16 | Live IHFC IIT Delhi lab tour, industrial robot teleoperation, closing Q&A |

---

## 2. Design System — LOCKED

> ⚠️ This design system must never be changed. Any AI assistant or developer working on this project must follow these exact values.

### Colors

| Token | Hex | Usage |
|---|---|---|
| `--primary` | `#FF6B00` | Orange — buttons, highlights, badges, CTAs |
| `--primary-dark` | `#E05A00` | Orange hover state |
| `--primary-light` | `#FFF3EB` | Orange tint backgrounds |
| `--secondary` | `#1A1A2E` | Dark navy — hero, topbar, headings |
| `--bg` | `#F8F9FC` | Page background |
| `--white` | `#FFFFFF` | Card backgrounds |
| `--text` | `#1A1A2E` | Primary text |
| `--text-muted` | `#6B7280` | Secondary/muted text |
| `--border` | `#E5E7EB` | Borders, dividers |
| `--success` | `#10B981` | Green — approved, paid, success |
| `--danger` | `#EF4444` | Red — rejected, error, warning |
| `--info` | `#3B82F6` | Blue — internship plan, info |
| `--warning` | `#F59E0B` | Amber — pending states |

### Typography

| Font | Usage |
|---|---|
| `Nunito` | All UI text — weights 400, 600, 700, 800, 900 |
| `JetBrains Mono` | Numbers, prices, timestamps, code, IDs |

### Spacing & Shape

| Property | Value |
|---|---|
| Card border radius | 14px |
| Button border radius | 8–10px |
| Pill/badge border radius | 20px |
| Standard card padding | 18–28px |
| Card border | 1.5px solid `#E5E7EB` |
| Box shadow (cards) | `0 4px 24px rgba(0,0,0,0.06)` |

### Badge Colors

| Badge type | Background | Text color |
|---|---|---|
| Workshop Only | `#FFF3EB` | `#FF6B00` |
| Workshop + Internship | `#EFF6FF` | `#3B82F6` |
| Approved | `#ECFDF5` | `#10B981` |
| Pending | `#FFFBEB` | `#F59E0B` |
| Rejected | `#FEF2F2` | `#EF4444` |
| Paid | `#ECFDF5` | `#10B981` |

### Hero Section

- Background: `linear-gradient(135deg, #1A1A2E 0%, #16213E 55%, #0F3460 100%)`
- Text: white
- Accent: `#FF6B00` (orange highlights in headings)

### Scrollbar

```css
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-thumb { background: #FF6B00; border-radius: 4px; }
```

### Google Fonts Import

```
https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=JetBrains+Mono:wght@400;700&display=swap
```

---

## 3. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Pure HTML5 + CSS3 + Vanilla JavaScript |
| No framework | No React, Vue, Angular, or build step |
| Deployment | Static files — GitHub Pages (dev) → WordPress (production) |
| Admin auth | Client-side username/password (user: `admin`, pass: `cps2025`) |
| Primary database | Google Sheets (via Albato) |
| Secondary storage | localStorage (browser-side, dev/demo only — not production DB) |
| Automation | Albato (iPaaS) |
| Payments | PayU payment gateway |
| WhatsApp | Meta WhatsApp Business Cloud API |
| Email | Gmail / domain SMTP via Albato |
| CRM | Railway-hosted PiSquare CRM |
| Production site | WordPress — `workshop2026.pi2.in` |

---

## 4. Pages & File Structure

```
project-root/
├── index.html                    ← Main landing page
├── css/
│   └── style.css                 ← Main stylesheet
├── js/
│   └── script.js                 ← Main JS (countdown, FAQ, carousel, scroll)
├── assets/
│   ├── images/                   ← Workshop photos (1.jpg–13.jpg)
│   └── videos/                   ← Demo videos (Bot.mp4, Mecanum.mp4 etc.)
├── Registration/
│   ├── form.html                 ← Registration form
│   ├── css/
│   │   └── form.css              ← Form stylesheet
│   └── js/
│       └── form.js               ← Form logic + webhook
└── admin/
    ├── admin.html                ← Admin dashboard
    ├── css/
    │   └── admin.css             ← Admin stylesheet
    └── js/
        └── admin.js              ← Admin logic
```

### Page Descriptions

**index.html** — Landing page with hero, stats strip, glimpse carousel, 2+2 week structure, curriculum accordion, features, speakers, FAQ, bottom CTA, footer.

**Registration/form.html** — Registration form with plan selector (Workshop Only / Workshop + Internship), personal info, academic details, background fields, and submit handler that fires Albato webhook + saves to localStorage.

**admin/admin.html** — Password-protected dashboard with 4 pages: Dashboard (stats + recent table), All Registrations (searchable/filterable table), Internship Requests (approve/reject), Announcements (send + log).

---

## 5. External Systems

| System | URL | Purpose |
|---|---|---|
| Albato webhook | `https://h.albato.com/wh/38/1lfvfuc/P8dQFE_HzIRbObMx-xQOn4r78v572zT-7lXhsOzIt2c/` | Receives form submission data |
| PayU payment | `https://payu.in/web/6FA008C5D64868F877D542B31F86F9C3` | Current single payment link (₹199 only — needs second link for ₹299) |
| PiSquare CRM | `https://student-crm-production.up.railway.app/` | Student management CRM |
| ViTachyon Robotics | `http://vitachyonrobotics.in/` | Industry partner site |
| IHFC IIT Delhi | `https://www.ihfc.co.in/` | Academic partner site |
| WordPress admin | `https://workshop2026.pi2.in/wp-admin/` | Production site admin |
| Meta Graph API | `https://graph.facebook.com/v18.0/{PHONE_NUMBER_ID}/messages` | WhatsApp Business API |

---

## 6. Google Sheet Database Schema

> ⚠️ Row 1 column headers must be spelled exactly as shown below. These match the JSON keys sent by form.js. Any mismatch causes blank or misaligned data.

| Column | Header (exact) | Type | Source | Notes |
|---|---|---|---|---|
| A | `timestamp` | ISO 8601 string | form.js | `new Date().toISOString()` |
| B | `plan` | string | form.js | "Workshop Only" or "Workshop + Internship" |
| C | `fullName` | string | form.js | Full name |
| D | `email` | string | form.js | Email address |
| E | `phone` | string | form.js | E.164 format — `919876543210` (no +, no spaces) |
| F | `college` | string | form.js | College or school name |
| G | `department` | string | form.js | Branch / department |
| H | `yearOfStudy` | string | form.js | "1st Year", "2nd Year" etc. |
| I | `rollNumber` | string | form.js | Roll number or "Not provided" |
| J | `programmingExperience` | string | form.js | none / basic / intermediate / advanced |
| K | `motivation` | string | form.js | Free text or "Not provided" |
| L | `source` | string | form.js | How they heard about it |
| M | `paymentStatus` | string | form.js → Albato | "pending" on submit → "paid" after PayU webhook |
| N | `paymentDate` | string | Albato (PayU webhook) | Blank on submit, filled when payment confirmed |
| O | `wpLinkSent` | boolean | Albato | TRUE after community link is sent |
| P | `followUpSent` | boolean | Albato | TRUE after 24hr follow-up is sent |

---

## 7. Form Payload — Exact Fields

This is the exact JavaScript object that `form.js` must send to Albato. Copy this as the reference.

```javascript
const payload = {
  timestamp: new Date().toISOString(),
  plan: selectedPlan === "internship" ? "Workshop + Internship" : "Workshop Only",
  fullName: document.getElementById("fullName").value.trim(),
  email: document.getElementById("email").value.trim(),
  phone: document.getElementById("phone").value
            .replace(/\D/g, "")        // strip all non-digits
            .replace(/^0+/, "")        // remove leading zeros
            .replace(/^91/, "91"),     // ensure country code
  // Result: "919876543210" — E.164 format required by WhatsApp API
  college: document.getElementById("college").value.trim(),
  department: document.getElementById("dept").value.trim(),
  yearOfStudy: document.getElementById("year").value,
  rollNumber: document.getElementById("rollNo").value.trim() || "Not provided",
  programmingExperience: document.querySelector('input[name="exp"]:checked')?.value || "",
  motivation: document.getElementById("motivation").value.trim() || "Not provided",
  source: document.getElementById("source").value || "Not specified",
  paymentStatus: "pending",            // ← ADD THIS (currently missing)
  paymentDate: ""                      // ← ADD THIS (currently missing)
}
```

### Fetch call to Albato

```javascript
await fetch(WEBHOOK_URL, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
  mode: "cors"   // Change from "no-cors" once Albato confirms CORS support
                 // Until then keep "no-cors" but add proper error logging
})
```

---

## 8. Complete User Workflow

### Stage 1 — Discovery

```
Student finds the workshop via:
Instagram / WhatsApp group / college / LinkedIn / friend
        ↓
Lands on index.html (landing page)
        ↓
Reads about the program, sees pricing, checks curriculum
        ↓
Clicks "Register Now" button
```

### Stage 2 — Registration

```
Lands on Registration/form.html
        ↓
Selects plan:
Fills personal info: name, phone, email
Fills academic info: college, department, year, roll number
Fills background: programming experience, motivation, source
        ↓
Clicks "Complete Registration"
        ↓
Form validates all required fields
        ↓
payload object built with paymentStatus: "pending"
        ↓
Two things happen simultaneously:
  1. POST to Albato webhook (fires Automation 1)
  2. Save to localStorage (for admin demo/dev use)
        ↓
  ┌─────────────────────┐    ┌──────────────────────────────┐
  │  Workshop Only      │    │  Workshop + Internship       │
  │  ₹199               │    │  ₹299                        │
  │  2 weeks · 16 sess  │    │  4 weeks · cert + letter     │
  └─────────────────────┘    └──────────────────────────────┘
        ↓

Student sees success screen: "You're Registered!"
```

### Stage 3 — Immediate Auto-Response (Albato Automation 1)

```
Within seconds of form submission:
        ↓
WhatsApp message sent to student's phone:
  - Registration confirmed
  - WhatsApp community link
  - Payment link (₹199 or ₹299 based on plan)
        ↓
Email sent to student's email:
  - Same content as WhatsApp
  - Formatted as HTML email
        ↓
Google Sheet row created with all 16 fields
paymentStatus = "pending"
wpLinkSent = TRUE
```

### Stage 4 — Payment

```
Student clicks payment link in WhatsApp/email
        ↓
Redirected to PayU payment page
  ┌──────────────┐         ┌──────────────────┐
  │   PAID       │         │   NOT PAID       │
  └──────┬───────┘         └────────┬─────────┘
         ↓                          ↓
PayU fires S2S             Student ignores
webhook to Albato          payment for now
(Automation 3)                      ↓
         ↓                 24 hours later:
Payment confirmed          Albato Automation 2
WhatsApp + Email sent      Follow-up WhatsApp
Sheet updated:             Follow-up Email
paymentStatus: "paid"      Sheet: followUpSent: TRUE
paymentDate: timestamp     After this → "dropped"
```

### Stage 5 — Post-Payment

```
Student receives payment confirmation:
  WhatsApp: "Payment confirmed ✅ Your seat is locked!"
  Email: Same content + session schedule info
        ↓
Student is now in WhatsApp community group
(link was sent in Step 3 immediately after registration)
        ↓
Admin can now see student in dashboard with:
  paymentStatus: "paid"
```

### Stage 6 — Workshop Delivery

```
Admin sends announcements through admin dashboard
        ↓
16 days of live sessions run
        ↓
Day 15: Live IHFC IIT Delhi Industry 4.0 Lab tour
Day 16: Closing Q&A session
        ↓
Workshop Only students → Digital certificate issued
Workshop + Internship students → Continue to Weeks 3–4
```

### Stage 7 — Internship (Weeks 3–4)

```
Internship students:
  - Admin reviews application in Internship tab
  - Only students with paymentStatus: "paid" appear
  - Admin approves or rejects via modal
  - Approved → advanced project work continues
        ↓
End of Week 4:
  - Internship certificate issued
  - Formal internship letter issued
  - CRM updated
```

### Stage 8 — Closure

```
All certificates distributed
CRM updated with completion status
Students directed to community for next cohort
Next batch promotion begins
```

---

## 9. Complete Admin Workflow

### Login

```
Navigate to admin/admin.html
Enter username: admin
Enter password: cps2025
Click Login
```

### Dashboard Page

Stats shown at top (auto-refresh every 5 seconds):

| Stat card | Current | Should be |
|---|---|---|
| Total Registrations | ✅ Working | Keep |
| Workshop Only | ✅ Working | Keep |
| Workshop + Internship | ✅ Working | Keep |
| Pending Approvals | ✅ Working | Keep |
| **Total Paid** | ❌ Missing | Add |
| **Total Pending Payment** | ❌ Missing | Add |
| **Total Dropped** | ❌ Missing | Add |

Recent registrations table shows last 10 entries.

### All Registrations Page

- Search by name, email, college
- Filter by plan (Workshop Only / Workshop + Internship)
- Filter by year of study
- **Filter by payment status (add this)**
- Pagination: 20 per page
- Click row → student detail modal
- Export CSV button — exports all filtered results

CSV must include these columns:
`#, Full Name, Email, Phone, Plan, College, Department, Year, Roll Number, Exp, Source, Payment Status, Payment Date, WP Link Sent, Follow Up Sent, Timestamp`

### Internship Requests Page

- **Only shows students where `paymentStatus === "paid"`** (currently shows all internship applicants regardless of payment — this is wrong)
- Filter by status: All / Pending / Approved / Rejected
- Click "Review" → modal shows full student details
- Modal has: Approve button / Reject button / Cancel
- Approve → sets approval status, shows toast "✅ Approved"
- Reject → sets rejection status, shows toast "❌ Rejected"
- Export Internship CSV button

### Announcements Page

Send bulk messages to filtered student groups.

Recipients options:
- All Registered Students
- Workshop Only Students
- Workshop + Internship Students
- **Paid Students Only (add this)**
- Approved Internship Only

Fields: Recipients selector, Subject/Title, Message body

Sent announcements logged below with: title, timestamp, recipient count, message preview.

> Note: Announcements currently only log to localStorage. They do not actually send emails or WhatsApp. For real sending, integrate with Albato API or use a separate email service.

---

## 10. Albato Automations — All Three

### Automation 1 — Form Submission Trigger

```
TRIGGER:
  Type: Webhook (HTTP POST)
  URL: existing Albato webhook URL
  Receives: full payload JSON from form.js

STEP 1 — Write to Google Sheet:
  Action: Google Sheets → Append Row
  Sheet: [connected sheet name]
  Tab: [Sheet1 or configured tab]
  Column mapping (left = sheet header, right = webhook field):
    timestamp             ← {{timestamp}}
    plan                  ← {{plan}}
    fullName              ← {{fullName}}
    email                 ← {{email}}
    phone                 ← {{phone}}
    college               ← {{college}}
    department            ← {{department}}
    yearOfStudy           ← {{yearOfStudy}}
    rollNumber            ← {{rollNumber}}
    programmingExperience ← {{programmingExperience}}
    motivation            ← {{motivation}}
    source                ← {{source}}
    paymentStatus         ← {{paymentStatus}}   (value: "pending")
    paymentDate           ← {{paymentDate}}     (value: "")
    wpLinkSent            ← TRUE
    followUpSent          ← FALSE

STEP 2 — Send WhatsApp:
  Action: WhatsApp Business → Send Template Message
  To: {{phone}}
  Template: registration_confirmation
  Variables:
    {{1}} = {{fullName}}
    {{2}} = {{plan}}
    {{3}} = https://chat.whatsapp.com/JLSfkWJoHiw0GnllESXnvn
    {{4}} = IF {{plan}} = "Workshop Only"
              THEN [PayU link ₹199]
              ELSE [PayU link ₹299]

STEP 3 — Send Email:
  Action: Gmail / SMTP → Send Email
  To: {{email}}
  From: [domain sender email]
  Subject: You're registered — CPS & Robotics Workshop 2026
  Body: See Email Template 1 below
```

### Automation 2 — 24-Hour Follow-Up (Unpaid)

```
TRIGGER:
  Type: Time delay
  Delay: 24 hours after row created in Google Sheet
  Filter condition: paymentStatus = "pending"
  (Only runs if student has not paid within 24 hours)

STEP 1 — Send Follow-Up WhatsApp:
  Action: WhatsApp Business → Send Template Message
  To: {{phone}}
  Template: payment_followup
  Variables:
    {{1}} = {{fullName}}
    {{2}} = IF {{plan}} = "Workshop Only"
              THEN [PayU link ₹199]
              ELSE [PayU link ₹299]

STEP 2 — Send Follow-Up Email:
  Action: Gmail / SMTP → Send Email
  To: {{email}}
  Subject: Your seat is still reserved — Complete payment
  Body: See Email Template 2 below

STEP 3 — Update Sheet:
  Action: Google Sheets → Update Row
  Find row where: email = {{email}}
  Update column: followUpSent = TRUE
```

### Automation 3 — Payment Confirmation (PayU S2S Webhook)

```
TRIGGER:
  Type: Webhook (HTTP POST) — second Albato webhook URL
  Configured in: PayU merchant dashboard → S2S webhook URL
  PayU sends: txnid, amount, email, phone, firstname, status

CONDITION:
  Only proceed if: status = "success"

STEP 1 — Find Student Row in Sheet:
  Action: Google Sheets → Find Row
  Match condition: email = {{email}} from PayU webhook
  (Fallback match: phone = {{phone}} if email doesn't match)

STEP 2 — Update Sheet Row:
  Action: Google Sheets → Update Row
  Update: paymentStatus = "paid"
  Update: paymentDate = current timestamp

STEP 3 — Send Payment Confirmed WhatsApp:
  Action: WhatsApp Business → Send Template Message
  To: {{phone}}
  Template: payment_confirmed
  Variables:
    {{1}} = {{firstname}} (from PayU) or {{fullName}} (from sheet row)
    {{2}} = {{plan}} (from sheet row)

STEP 4 — Send Payment Confirmed Email:
  Action: Gmail / SMTP → Send Email
  To: {{email}}
  Subject: Payment confirmed ✅ — CPS & Robotics Workshop 2026
  Body: See Email Template 3 below
```

---

## 11. WhatsApp Message Templates

> All three templates must be submitted to Meta for approval before Albato can send them. Approval takes 24–48 hours. Templates cannot be changed after approval without re-submitting.

### Template 1 — `registration_confirmation`

```
Hi {{1}}! 🎉

You've successfully registered for the CPS & Robotics Workshop 2026 by ViTachyon Robotics × IHFC IIT Delhi.

📋 Plan selected: {{2}}

👥 Join our WhatsApp community here:
{{3}}

💳 Complete your payment to confirm your seat:
{{4}}

Seats are limited — pay early to lock yours in!

We'll send you a confirmation as soon as your payment is received.

— Team PiSquare Academy
```

Variables: `{{1}}` = fullName, `{{2}}` = plan, `{{3}}` = WP community link, `{{4}}` = PayU payment link

### Template 2 — `payment_followup`

```
Hi {{1}}! 👋

Your registration for the CPS & Robotics Workshop 2026 is still pending payment.

Your seat is reserved but not yet confirmed. Complete your payment now to lock it in:

💳 {{2}}

Seats are filling up fast — don't miss out!

— Team PiSquare Academy
```

Variables: `{{1}}` = fullName, `{{2}}` = PayU payment link

### Template 3 — `payment_confirmed`

```
Hi {{1}}! ✅

Your payment has been confirmed. Your seat for the {{2}} is locked!

🗓 Sessions start soon. Stay tuned in the WhatsApp community group for schedule updates and joining links.

See you inside!

— Team PiSquare Academy
```

Variables: `{{1}}` = fullName, `{{2}}` = plan

### Technical WhatsApp API Requirements

- API version: Meta Graph API v18+
- Endpoint: `POST https://graph.facebook.com/v18.0/{PHONE_NUMBER_ID}/messages`
- Auth header: `Authorization: Bearer {PERMANENT_ACCESS_TOKEN}`
- Phone number format: **E.164** — `919876543210` (country code + number, no `+`, no spaces, no dashes)
- Message type: `template` (required for outbound to non-initiated contacts)
- WABA ID and Phone Number ID required in Albato configuration

---

## 12. Email Templates

### Email Template 1 — Registration Confirmation

```
Subject: You're registered — CPS & Robotics Workshop 2026

Hi {{fullName}},

You've successfully registered for the CPS & Robotics Workshop 2026!

Plan selected: {{plan}}
Registered on: {{timestamp}}

——————————————————————

NEXT STEP: Complete Your Payment

To confirm your seat, complete payment here:
{{paymentLink}}

Workshop Only: ₹199
Workshop + Internship: ₹299

——————————————————————

JOIN THE COMMUNITY

Connect with fellow participants on our WhatsApp group:
https://chat.whatsapp.com/JLSfkWJoHiw0GnllESXnvn

——————————————————————

WHAT'S INCLUDED

✅ 16 live online sessions (60–90 min each)
✅ Embedded Systems hands-on labs
✅ ML gesture control with MediaPipe
✅ Digital certificate on completion
✅ Lifetime recorded session access
✅ Live IHFC IIT Delhi Industry 4.0 Lab tour

If you have any questions, reply to this email.

— Team PiSquare Academy
ViTachyon Robotics × IHFC IIT Delhi
```

### Email Template 2 — 24-Hour Follow-Up

```
Subject: Your seat is still reserved — Complete payment

Hi {{fullName}},

Your registration for the CPS & Robotics Workshop 2026 is saved, but your seat is not yet confirmed.

Complete payment to lock in your spot:
{{paymentLink}}

Seats are limited and filling up fast.

If you have any questions or need help with payment, reply to this email and we'll sort it out.

— Team PiSquare Academy
```

### Email Template 3 — Payment Confirmed

```
Subject: Payment confirmed ✅ — CPS & Robotics Workshop 2026

Hi {{fullName}},

Your payment has been received and your seat for the {{plan}} is confirmed!

Stay connected in our WhatsApp community for session links, schedules, and updates.

We'll see you inside the sessions!

— Team PiSquare Academy
ViTachyon Robotics × IHFC IIT Delhi
```

---

## 13. PayU Configuration

### Current Status

| Item | Status |
|---|---|
| Payment Link ₹199 (Workshop Only) | ✅ Active |
| Payment Link ₹299 (Workshop + Internship) | ❌ Missing — needs to be created |
| S2S webhook to Albato | ❌ Not configured |

### Required PayU Setup

1. Create second payment link for ₹299 labeled "Workshop + Internship"
2. Configure S2S (server-to-server) webhook URL in PayU dashboard
   - URL: new Albato webhook endpoint (Automation 3 trigger)
   - PayU will POST to this URL on every successful payment
3. Confirm PayU webhook payload includes: `txnid`, `amount`, `email`, `phone`, `firstname`, `status`

### PayU S2S Webhook Payload (what PayU sends)

```json
{
  "txnid": "TXN123456",
  "amount": "199.00",
  "email": "student@email.com",
  "phone": "919876543210",
  "firstname": "Rahul",
  "status": "success",
  "hash": "..."
}
```

---

## 14. All Confirmed Bugs & Fixes

| # | Problem | Technical Cause | Fix Required | Access Needed |
|---|---|---|---|---|
| 1 | Google Sheet DB inconsistency | JSON keys don't match sheet column headers | Rename Row 1 headers to match exact JSON keys | Google Sheet editor access |
| 2 | Column order mismatch | Sheet columns in wrong order vs payload | Reorder columns to match payload sequence | Google Sheet editor access |
| 3 | `mode: no-cors` on fetch | Albato doesn't return CORS header — responses are opaque | Change to `mode: cors` when Albato enables CORS; add proper error logging for now | Albato config check |
| 4 | localStorage as main database | Browser-local, not server-side — admin sees no real data | Admin dashboard must read from Google Sheet or CRM API, not localStorage | CRM API or Google Sheets API access |
| 5 | PayU disconnected from system | No S2S webhook configured | Configure PayU S2S webhook → second Albato webhook | PayU dashboard access |
| 6 | Phone format wrong | Captured as `+91 9XXXX` — WhatsApp API needs `919XXXXXXXXX` | Strip `+`, spaces, dashes in form.js before sending | Code fix only — no access needed |
| 7 | No approved WhatsApp templates | Meta requires pre-approved templates for automated messages | Submit 3 templates for Meta approval | WhatsApp Business Manager access |
| 8 | Duplicate countdown functions | `tick()` targets 2025-08-01 and `updateCountdown()` targets 2026-05-15 — both run on same DOM elements | Delete `tick()` function and its `setInterval` from form.js | Code fix only — no access needed |
| 9 | Live-server script in production | Development WebSocket block left in form.html | Remove entire live-server script block from form.html | Code fix only — no access needed |
| 10 | Single PayU link for both plans | Static URL — no way to pass plan or amount | Create second PayU link for ₹299 | PayU dashboard access |
| 11 | `paymentStatus` missing from payload | Field not in form.js — no payment tracking anywhere | Add `paymentStatus: "pending"` and `paymentDate: ""` to payload | Code fix only — no access needed |
| 12 | Admin dashboard non-functional in production | Reads from localStorage — empty on every new device | Connect to real data source (Google Sheets API or CRM) | CRM API or Sheets API |
| 13 | Two separate sites | WordPress and static HTML both exist with no clear primary | Decide one primary URL and redirect or embed the other | WordPress admin access |
| 14 | No error handling on webhook | `no-cors` + catch block always shows success screen | Add retry logic and failure logging | Code fix only — no access needed |
| 15 | Internship tab shows unpaid students | No payment filter on internship approvals | Filter: only show `paymentStatus === "paid"` | Code fix only — no access needed |

### Fixes That Need No External Access (Do These Now)

1. Add `paymentStatus: "pending"` and `paymentDate: ""` to `form.js` payload
2. Fix phone field — strip `+`, spaces, dashes — format to E.164 before webhook send
3. Delete old `tick()` function and its `setInterval` call from `form.js`
4. Remove live-server WebSocket script block from bottom of `form.html`
5. Add `paymentStatus` column to admin dashboard students table
6. Add "Total Paid" and "Total Pending Payment" stat cards to admin dashboard
7. Filter internship approvals tab: only show `paymentStatus === "paid"`
8. Add `paymentStatus` and `paymentDate` to CSV export headers and rows

---

## 15. Access Required From Senior

Copy this section and send it as-is to your senior.

---

**ACCESS REQUEST — CPS Workshop Registration System**

I need the following access to complete and connect the student registration system:

**Albato**
- Account login (email + password)
- Access to the existing automation workflow
- Confirm the current webhook URL is still active
- Ability to create a second webhook trigger (for PayU payment confirmation)
- Ability to configure time-delayed automations (24-hour follow-up)
- WhatsApp Business API credentials already configured inside Albato (Phone Number ID, Access Token)
- Email sender credentials configured inside Albato

**Google Sheet**
- Editor access to the spreadsheet connected to Albato
- The exact URL of the sheet
- Screenshot or paste of current Row 1 column headers (to identify field mapping mismatch)
- Confirm which tab name Albato is writing to

**PayU**
- Merchant dashboard login
- Confirmation of whether variable-amount payment links are supported
- Create a second payment link for ₹299 (Workshop + Internship plan)
- Ability to configure an S2S (server-to-server) webhook URL that PayU fires on successful payment

**WhatsApp Business API**
- WhatsApp Business Account (WABA) ID
- Phone Number ID
- Permanent access token (must not be a temporary token — these expire)
- Approval / submission of 3 message templates: `registration_confirmation`, `payment_confirmed`, `payment_followup`
- A permanent (non-expiring) WhatsApp community / group invite link to embed in messages

**Email**
- Domain sender email address (e.g. workshop@pi2.in — not a personal Gmail)
- Gmail App Password or SMTP credentials for that address
- Confirm daily sending limits are sufficient for expected registration volume

**WordPress**
- Admin login for `workshop2026.pi2.in/wp-admin`
- Decision: Is WordPress or the static HTML the primary student-facing URL?

**Railway CRM**
- Login credentials for `student-crm-production.up.railway.app`
- API endpoint documentation (what routes exist)
- API key or Bearer token for authenticated requests
- Accepted field schema (what fields the CRM accepts for a student record)

**Hosting**
- Where is the static site (`index.html`, `form.html`, `admin.html`) currently hosted?
- GitHub repository access if hosted on GitHub Pages
- Confirmation that HTTPS is active on the static site (required for Albato webhook to work)

---

## 16. Implementation Order

Complete these steps in this exact order once all access is received.

```
PHASE 1 — Foundation (no external access needed)
  □ 1. Add paymentStatus + paymentDate to form.js payload
  □ 2. Fix phone field to E.164 format in form.js
  □ 3. Delete old tick() countdown function from form.js
  □ 4. Remove live-server WebSocket script from form.html
  □ 5. Add paymentStatus column to admin students table
  □ 6. Add Total Paid + Total Pending stat cards to admin dashboard
  □ 7. Fix internship tab filter — paid students only
  □ 8. Add paymentStatus + paymentDate to CSV export

PHASE 2 — Database (needs Google Sheet access)
  □ 9.  Open Google Sheet connected to Albato
  □ 10. Rename Row 1 headers to match exact payload keys
  □ 11. Reorder columns to match payload field sequence
  □ 12. Confirm tab name matches what Albato is configured to write to

PHASE 3 — Automation (needs Albato access)
  □ 13. Open Albato and review existing automation
  □ 14. Fix field mapping in Automation 1 to match corrected sheet headers
  □ 15. Add WhatsApp send step to Automation 1
  □ 16. Add Email send step to Automation 1
  □ 17. Create Automation 2 — 24-hour delay follow-up for unpaid students
  □ 18. Create new Albato webhook (Automation 3 trigger)

PHASE 4 — Payments (needs PayU access)
  □ 19. Create second PayU payment link for ₹299
  □ 20. Configure PayU S2S webhook URL → new Albato webhook from step 18
  □ 21. Configure Automation 3 — match payment to sheet row, update status, send confirmations

PHASE 5 — WhatsApp (needs Meta access)
  □ 22. Submit 3 message templates for Meta approval
  □ 23. Wait for approval (24–48 hours)
  □ 24. Configure template names and variable slots in Albato
  □ 25. Get permanent WhatsApp community invite link

PHASE 6 — CRM Integration (needs CRM API access)
  □ 26. Review CRM API documentation
  □ 27. Add second fetch() call in form.js → CRM API endpoint
  □ 28. Map form.js payload fields to CRM accepted schema
  □ 29. Test end-to-end: form → Albato → Sheet + CRM

PHASE 7 — Hosting & URL (needs WordPress + hosting access)
  □ 30. Decide: WordPress or static HTML as primary student URL
  □ 31. Configure accordingly (redirect or embed)
  □ 32. Confirm HTTPS active on all pages
  □ 33. Final end-to-end test with real data

PHASE 8 — Admin Dashboard Real Data (needs Sheet or CRM API)
  □ 34. Replace localStorage reads with real API calls
  □ 35. Admin dashboard fetches live data from Google Sheets API or CRM
  □ 36. Test all admin features with real data
```

---

## 17. Working Style & Rules for AI Assistants

> This section defines how any AI assistant (Claude, ChatGPT, Gemini etc.) must behave when working on this project. These rules are non-negotiable.

### Design Rules — Never Break These

1. **Never change the color palette** — all CSS custom properties defined in the design system section above are locked
2. **Never change the fonts** — Nunito and JetBrains Mono only
3. **Never add a JavaScript framework** — pure vanilla JS only, no React, Vue, jQuery
4. **Never add a CSS framework** — no Tailwind, Bootstrap, or any utility library
5. **Never add a build step** — no webpack, vite, parcel, or any bundler
6. **Never break mobile responsiveness** — all changes must work on screens 320px and up
7. **Never remove the countdown timer** — always shows deadline `2026-05-15T23:59:59`
8. **Never change admin credentials** — user: `admin`, pass: `cps2025`

### Code Rules

1. Write clean, commented, production-ready code
2. Keep all pages linkable to each other: `index.html ↔ Registration/form.html ↔ admin/admin.html`
3. When touching `form.js`, always check if the change affects the Albato field mapping
4. When touching the Google Sheet schema, always update the payload in `form.js` to match
5. When touching admin.js, verify the stat cards still work after any data structure change
6. Never use `\n` inside strings for multiline — use template literals or separate elements
7. Always use `let` or `const` — never `var`
8. Always validate forms before submission — never send incomplete data to Albato

### What to Always Check Before Any Change

- Does this affect the Albato webhook payload? → Update sheet columns too
- Does this change a form field? → Update the payload object in form.js
- Does this touch localStorage? → Remember it is dev-only, not production DB
- Does this touch the admin dashboard? → Check stat cards, table rendering, CSV export
- Does this touch the countdown? → Only `updateCountdown()` should run — `tick()` is deleted

### What to Always Flag

- Any change that could break field mapping between form.js and Albato
- Any new external dependency or API call
- Any change to the color system or typography
- Any new page or route that isn't linked from existing pages

### Project Context Summary for AI

This is a **static HTML/CSS/JS** project. There is no backend. All automation is via Albato. The Google Sheet is the primary database. The admin dashboard currently uses localStorage which is a dev/demo limitation — it must eventually read from a real API. PayU handles payments and fires webhooks. WhatsApp uses the Meta Business Cloud API with pre-approved templates. The primary production deployment is WordPress at `workshop2026.pi2.in`. The project is for a student workshop by PiSquare Academy run by ViTachyon Robotics in collaboration with IHFC IIT Delhi.

---

*End of document. Version 1.0 — May 2026.*
