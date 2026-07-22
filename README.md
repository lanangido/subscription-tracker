# Tools Subscription & Renewal Tracker

A modern, full-stack web application to manage company software subscriptions, tracking their renewal dates, monthly costs, and automated statuses.

Built with **Next.js 14+ (App Router)**, **TypeScript**, **Prisma**, **PostgreSQL**, and **Tailwind CSS**.

## Features
- **Dynamic Statuses**: Automatically calculates `Active`, `Expiring Soon` (≤ 7 days), and `Expired` based on the renewal date.
- **Manual Overrides**: Quickly cancel or reactivate a subscription.
- **Summary Metrics**: View total spend, active counts, and expired alerts at a glance.
- **Search & Filter**: Find tools by name, department, or status instantly.
- **Export**: Download your subscription list to a CSV file.
- **Sleek UI**: Fully responsive with dark mode support.

## Prerequisites
- Node.js 18+
- npm / pnpm / yarn

## Setup Instructions

### 1. Database Setup (Neon PostgreSQL)
To run this project, you need a PostgreSQL database. We recommend [Neon.tech](https://neon.tech) for a free, serverless-friendly database.
1. Sign up / Log in to [Neon Console](https://console.neon.tech).
2. Create a new project.
3. Once created, copy the connection string from your dashboard. It looks like:
   `postgresql://[user]:[password]@[host]/[dbname]?sslmode=require`

### 2. Environment Variables
1. Rename `.env.example` to `.env`.
2. Open `.env` and replace the placeholder `DATABASE_URL` with your actual Neon connection string.
   ```env
   DATABASE_URL="postgresql://your_user:your_password@your_host.neon.tech/your_db_name?sslmode=require"
   ```

### 3. Install Dependencies
```bash
npm install
```

### 4. Database Migration & Seeding
Push the Prisma schema to your database and generate the Prisma Client:
```bash
npx prisma migrate dev --name init
```
*Note: If you run into issues, you can also use `npx prisma db push` followed by `npx prisma generate`.*

Populate the database with sample data (around 10 subscriptions varying across Active, Expiring Soon, Expired, and Cancelled):
```bash
npm run prisma:seed
# Or: npx prisma db seed
```

### 5. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to see the dashboard.

## Project Structure
- `app/api/subscriptions/` - REST API endpoints.
- `app/components/` - Reusable UI components (Table, Form, Cards, Badges).
- `app/page.tsx` - Main Dashboard UI and client-side logic.
- `lib/statusHelper.ts` - Logic for computing subscription status dynamically.
- `prisma/schema.prisma` - Database schema definition.
- `prisma/seed.ts` - Seed script for demo data.
