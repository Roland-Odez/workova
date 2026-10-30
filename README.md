# Workova

Workova is a collaborative project-management app for organizing workspaces, projects, teams, and tasks. It is built with Next.js, React, TypeScript, Neon Postgres, and Neon Auth.

## Features

- **Workspace management** — create workspaces, select between them, and manage members.
- **Projects** — create projects with descriptions, priorities, statuses, dates, team leads, members, and progress.
- **Tasks** — create and assign tasks with types, priorities, due dates, and TODO / in-progress / done statuses.
- **Project collaboration** — manage project members and discuss tasks with comments.
- **Project views** — view project overview, analytics, and task calendars.
- **Dashboard** — see project and task summaries, recent activity, and workspace information.
- **Search** — find projects and tasks from the dashboard navigation.
- **Authentication** — sign in with email and password or Google using Neon Auth.
- **Password recovery** — request an email reset link and set a new password on the reset page.
- **Personalization** — switch between light and dark themes; workspace images are uploaded through Cloudinary.

## Tech stack

- Next.js App Router
- React and TypeScript
- Tailwind CSS v4 and shadcn/ui components
- Neon Serverless Postgres and Neon Auth
- Redux Toolkit for client-side state
- Cloudinary for workspace image uploads

## Requirements

- Node.js compatible with the installed Next.js version
- npm
- A Neon project with a Postgres database and Neon Auth enabled
- A Cloudinary account for workspace image uploads

## Run locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env.local` file in the project root and fill in the values:

   ```dotenv
   DATABASE_URL=postgresql://...
   NEON_AUTH_BASE_URL=https://your-neon-auth-host/your-database/auth
   NEXT_PUBLIC_NEON_AUTH_URL=https://your-neon-auth-host/your-database/auth
   NEON_AUTH_COOKIE_SECRET=replace-with-a-random-secret-at-least-32-characters-long
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   ```

   Use the Neon connection string for the same database used by Neon Auth. The Neon Auth URL is available in your Neon project's Auth settings. Keep the cookie secret and Cloudinary API secret private; do not commit `.env.local`.

3. Ensure Neon Auth is enabled for the database branch and configure email/password sign-up. The app also supports Google sign-in; configure the Google provider in Neon Auth if it is not already enabled.

4. Apply the application schema to the Neon database:

   ```bash
   psql "$DATABASE_URL" -f schema.sql
   ```

   `schema.sql` creates the application tables and expects the `neon_auth` schema and user table to exist. Enable/provision Neon Auth before applying it. If you do not have `psql`, run the contents of `schema.sql` using the Neon SQL Editor.

5. Start the development server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Neon Postgres connection string used by application queries. |
| `NEON_AUTH_BASE_URL` | Neon Auth base URL used by the server-side auth client. |
| `NEXT_PUBLIC_NEON_AUTH_URL` | Neon Auth URL used by the browser-side auth client. |
| `NEON_AUTH_COOKIE_SECRET` | Secret used to sign/authenticate Neon Auth cookies. Use a private random value of at least 32 characters. |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name for workspace image uploads. |
| `CLOUDINARY_API_KEY` | Cloudinary API key. |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret; keep private. |

## Password recovery setup

Password recovery is available at `/forgot-password` and `/reset-password`. In Neon Console, enable **Sign-up with Email** for the relevant branch. Neon sends a time-limited password-reset link (currently 15 minutes). Localhost origins are allowed for development; before deploying, add the app's production origin to Neon Auth's trusted domains.

Neon's shared email provider is suitable for development and testing. For production, configure a custom SMTP provider for better deliverability and higher sending limits. See Neon Auth's [password reset guide](https://neon.com/docs/auth/guides/password-reset), [trusted domains guide](https://neon.com/docs/auth/guides/configure-domains), and [production checklist](https://neon.com/docs/auth/production-checklist).

## Routes

| Route | Description |
| --- | --- |
| `/login` | Sign in with email/password or Google. |
| `/signup` | Create an account with email/password or Google. |
| `/forgot-password` | Request a password-reset email. |
| `/reset-password` | Set a new password using the emailed reset link. |
| `/create-workspace` | Create the initial workspace after sign-up. |
| `/` | Workspace dashboard. |
| `/projects` | Browse workspace projects. |
| `/project-detail?id=<project-id>` | View a project's overview, tasks, calendar, analytics, and settings. |
| `/task-detail?taskId=<task-id>` | View task details and comments. |
| `/teams` | View and invite workspace members. |

## Useful commands

```bash
npm run dev    # Start the development server
npm run lint   # Run ESLint
npm run build  # Create a production build
npm run start  # Serve the production build
```

## Deployment

Deploy as a Next.js application (for example, on Vercel). Configure all required environment variables in the deployment environment, use the production Neon database, apply `schema.sql`, and add the production application origin to Neon Auth's trusted domains. Configure a production SMTP provider in Neon Auth before relying on password-reset email delivery.
