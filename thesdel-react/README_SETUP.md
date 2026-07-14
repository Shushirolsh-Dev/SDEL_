# Thesdel Supabase Database Setup & App Launch Guide

This guide walks you through setting up a brand new Supabase project, deploying the schema, configuring Authentication, setting up environment variables, and testing the offline sync features.

---

## 🛠️ Step 1: Create a Supabase Project

1. Go to [Supabase](https://supabase.com/) and log in or sign up.
2. Click **New Project** and select your organization.
3. Enter a project name (e.g., `Thesdel`) and set a secure database password.
4. Select a region close to your users and click **Create New Project**.
5. Wait a minute or two for Supabase to provision your database.

---

## 🗄️ Step 2: Deploy the Database Schema

1. Once your project is ready, navigate to the **SQL Editor** tab in the left sidebar.
2. Click **New Query**.
3. Open the `supabase/schema.sql` file in this project, copy its entire contents, and paste them into the Supabase SQL editor.
4. Click **Run** at the bottom right.
5. You should see a success message indicating that all tables, constraints, RLS policies, triggers, and functions were created correctly.

---

## 🔐 Step 3: Configure Authentication

1. Go to the **Authentication** tab (user icon) in the left sidebar.
2. Select **Providers** under Settings.
3. Click on **Email** and ensure that **Email Provider** is enabled.
4. (Optional) For easy testing without confirming email links, turn off **Confirm Email** during development, then click **Save**.
5. Go to **User Management** if you want to inspect registered users.

---

## ⚙️ Step 4: Configure Environment Variables

1. Go to **Project Settings** (gear icon) -> **API** in the left sidebar.
2. Copy your **Project URL** and the **anon public API key**.
3. Create a `.env` file in the root directory of this project (based on `.env.example`):
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-actual-anon-key-here
   ```

---

## 🚀 Step 5: Start & Run the Application

1. Open your terminal in the project root.
2. Install any remaining dependencies (if not already done):
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open the displayed URL (typically `http://localhost:3000`) in your browser.

---

## 🔋 Step 6: Testing Core Features

### 1. Registration & Profiling
- Go to the **Sign Up** tab.
- Enter a name, email, phone number (e.g., `+2348100240137`), password, and select a role (Representative or Student).
- Submit the form. This will:
  1. Call Supabase Auth to register your user.
  2. Automatically trigger the `handle_new_user` Postgres function to create your record in `public.profiles`.

### 2. Class Operations
- **Create a Class**: Under the **Class** tab, click **Create Class**. Enter a class name and code. Once created, you are registered as the Representative (owner) of that class.
- **Join a Class**: Log in as another user, go to **Class** -> **Join Class**, enter the code, and join. You are now added to `public.class_members`.

### 3. Timetable, Cancellations, & Venue Shifts
- As a Representative or Assistant, edit any timetable slot or reschedule a class.
- The updates are logged in the `public.updates` table and instantly propagate to all members of that class.

### 4. Offline Mode & Synchronization
- Disconnect your computer from the internet (or toggle Offline in your browser's DevTools Network panel).
- Perform action events: mark a class attended, add a timetable slot, or join a class.
- Notice that the action succeeds instantly in the UI (optimistic UI update) and a status bar indicating **"1 pending offline update"** appears.
- Reconnect to the internet.
- The app automatically detects connection recovery, processes the queue, writes changes to Supabase, and updates status to **"All changes synced!"**
