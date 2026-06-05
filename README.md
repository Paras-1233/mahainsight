# MahaInsight

MahaInsight is a Next.js application for Maharashtra climate and agriculture insights. It tracks district-level rainfall, weather, crop recommendations, demographics, maps, and alerts.

## Project Folder

Work from this folder:

```bash
C:\MahaInsight\mahainsight
```

The outer `C:\MahaInsight` folder is only a container.

## Main Features

- Landing page with overview, capabilities, impact, and getting started sections
- Dashboard for district climate summaries
- Rainfall analytics with live and historical data
- Weather monitoring
- Crop intelligence across Maharashtra districts
- Demographics and map views
- Authentication pages for login and signup
- Railway-ready deployment config

## Tech Stack

- Next.js
- React
- TypeScript
- Prisma
- PostgreSQL
- Tailwind CSS
- Railway deployment

## Setup

Install dependencies:

```bash
npm install
```

Create a local `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Update the values in `.env`, especially:

```bash
DATABASE_URL=
AUTH_SECRET=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
```

`AUTH_SECRET` and `NEXTAUTH_SECRET` should be long random strings.

## Development

Run the local dev server:

```bash
npm run dev
```

Open:

```bash
http://localhost:3000
```

## Database

Generate Prisma client:

```bash
npx prisma generate
```

Run database migrations:

```bash
npx prisma migrate deploy
```

Sync crop and rainfall data through the app/API routes after the database is connected.

## Useful Commands

```bash
npm run lint
npm run typecheck
npm run build
npm run start
```

Run all main checks:

```bash
npm run verify
```

## Deployment

The app is configured for Railway with `railway.json`.

Railway uses:

- Build command: `npm run build`
- Pre-deploy command: `npx prisma migrate deploy`
- Start command: `npm run start`
- Health check: `/health`

Make sure Railway has these environment variables:

```bash
DATABASE_URL
AUTH_SECRET
NEXTAUTH_SECRET
NEXTAUTH_URL
NODE_ENV=production
```

## Notes

- Do not commit `.env`.
- `node_modules`, `.next`, and TypeScript build output are ignored.
- The canonical district data lives in `src/data/districts.ts`.
- Crop profiles live in `src/data/districtCropProfiles.ts`.
