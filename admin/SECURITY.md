# Thesdel Administrative Security Directives

## 1. Browser Trust Boundary

- **The browser is strictly untrusted**. All permissions, write capabilities, and access rights are enforced at the database level using Supabase Row Level Security (RLS) policies and RPC execution gates.
- No client-side variable toggling can escalate standard user roles to administrative or investor privileges.

## 2. Investor Privacy Sandbox

- **Read-Only Enforcements**: Accounts holding the read-only `investor` role are strictly prohibited from viewing personally identifiable information (PII).
- **Prohibited Data Reads**: Investors must **never** be served queries exposing:
  - Full names, email addresses, phone numbers, WhatsApp links, or avatars.
  - Individual student group memberships or private messages.
  - Raw event streams or geolocation traces.
  - Individual attendance registers.
- **Anonymization Threshold**: Aggregate charts, DAU/WAU indexes, and general analytics are held back if the total active database count falls under **10 distinct student profiles**.

## 3. Account Moderation Blocks

- Banned or suspended accounts must be barred from performing insert, update, or select queries. This is secured at the schema level using PostgreSQL triggers (`check_user_active_trigger`).
