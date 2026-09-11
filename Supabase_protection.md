# Supabase Protection Setup

Three settings to enable in your Supabase dashboard to stop bots from mass-creating accounts. Takes 2 minutes. Do this before launch.

---

## 1. Rate Limits

Prevents a single IP from creating dozens of accounts per hour.

**Path:** Supabase Dashboard → Authentication → Rate Limits

| Setting | Recommended | Why |
|---|---|---|
| Sign ups per hour (per IP) | `3` | Blocks a single machine from spamming signups |
| Sign ups per hour (global) | `50` | Blocks distributed floods |
| Sign ins per hour (per IP) | `10` | Blocks password-guessing bots |
| Password resets per hour (per IP) | `3` | Blocks reset-link spam |
| Token verifications per hour (per IP) | `10` | Blocks brute-force confirm tokens |
| Email sent per hour | `30` | Caps the total auth emails Supabase sends |

**How to get there:**
1. https://supabase.com/dashboard
2. Click your project
3. Left sidebar → **Authentication**
4. Top tabs → **Rate Limits**
5. Set the values above
6. Click **Save**

---

## 2. Confirm Email

Forces every new account to verify their email before it becomes active.

**Path:** Supabase Dashboard → Authentication → Providers → Email

- [x] **Enable Email Provider**
- [x] **Confirm email** — REQUIRED

**Why this matters:** Bots can create fake email addresses but they usually can't receive the confirmation email. Without verification, the account never activates. This alone stops 95% of mass-signup abuse.

**How to get there:**
1. Supabase Dashboard → your project
2. **Authentication** → **Providers** → **Email**
3. Turn on **Confirm email**
4. Save

Also check: **Authentication → Email Templates** — make sure the "Confirm signup" template has a working `{{ .ConfirmationURL }}`.

---

## 3. CAPTCHA (Cloudflare Turnstile)

Server-verified bot check. Free. The strongest defense.

**Path:** Supabase Dashboard → Authentication → Settings → Bot and Abuse Protection

### Step 1 — Get a Turnstile key

1. Go to https://dash.cloudflare.com/
2. Sign up (free) or log in
3. Left sidebar → **Turnstile**
4. **Add Site**
   - Site name: `THESDEL`
   - Domain: your production domain (e.g. `thesdel.vercel.app`)
   - Widget mode: **Managed** (recommended)
5. Copy the **Site Key** and **Secret Key**

### Step 2 — Add the keys to Supabase

1. Supabase Dashboard → your project
2. **Authentication** → **Settings**
3. Scroll to **Bot and Abuse Protection**
4. Turn on **Enable CAPTCHA protection**
5. Provider: **Turnstile**
6. Paste your **Secret Key** (from Cloudflare)
7. Save

### Step 3 — Add the Site Key to your app

In your project root, create `.env.local` (if it doesn't exist):
