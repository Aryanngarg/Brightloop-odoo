# Connect Brightloop to Supabase

The database-enabled entry point is `index.html`. `brightloop-dashboard.html` is the older standalone demo copy; it does not use the new connection.

## 1. Create the Supabase project

Create a project at [supabase.com](https://supabase.com). In **Project Settings → API**, copy the **Project URL** and the **anon/public key** (sometimes labeled publishable key). Do not use or share the `service_role` secret in a browser app.

## 2. Create the tables and access rules

In **SQL Editor**, open `supabase-schema.sql`, paste its contents, and run it.

## 3. Set the browser connection

Open `supabase-config.js` and replace `YOUR_PROJECT_ID` and `YOUR_SUPABASE_ANON_KEY` with the values from project settings. The public key is expected to be visible in this file; database access is restricted by the SQL policies.

## 4. Create the first admin account

Open `index.html` from this folder, create an account, and confirm the email if Supabase asks. In SQL Editor, run the final commented statement from `supabase-schema.sql`, replacing `you@example.com` with that account's email. New accounts receive the basic User role by default. Sign out and back in after promoting the account so the dashboard reloads the admin role.

## What is connected

- Supabase Auth handles sign-up, login, logout, and password reset.
- Subscription records load from and save to the `subscriptions` table.
- Row Level Security lets signed-in users view subscriptions and restricts subscription changes and profile administration to admins.
- This starter schema treats the Supabase project as one company's workspace. It is not yet a multi-company SaaS setup.

For a deployed site, add its URL to **Authentication → URL Configuration → Redirect URLs** in Supabase. If the browser still shows the demo data, check that `supabase-config.js` has the correct project values and that the SQL script ran successfully.
