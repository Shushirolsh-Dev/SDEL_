# Thesdel Administration Console

This is a separate, highly secure, and isolated administrative environment for Thesdel. It allows administrators to review analytical engagement streams, manage verified subscription revenues, moderate student accounts, and invite read-only investment partners without interfering with the lightweight student app workspace.

## Module Folder Structure

```text
/admin
  /pages         -> Specific page panels (Dashboard, Revenue, Users, Investors, AuditLogs)
  /components    -> Small reusable admin elements
  /layouts       -> Sidebars and frame navigation controllers
  /hooks         -> useAdmin coordination state machine
  /services      -> adminService live/fallback persistence queries
  /types         -> TS interfaces and schema structures
  /charts        -> Pure, lightweight, inline responsive SVG-based charts
  /tests         -> Isolated component integration assertions
  README.md      -> Architecture reference sheet
  SECURITY.md    -> RLS constraints and anti-escalation directives
```

## Setup & Execution

- In development, the administrative entry point is dynamically activated when the URL pathname matches `/admin`.
- Authenticate using the live database, or inspect the system via pre-configured admin or investor clearance levels.
