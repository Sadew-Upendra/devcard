<p align="center">
  <img src="public/devcard-logo.svg" width="460" alt="DevCard" />
</p>

<p align="center">
  <b>Type a GitHub username. Open your developer player card.</b><br/>
  A FUT-inspired card with a rating, tier, six stats, and global, country and language ranking.
</p>

<p align="center">
  <a href="https://github.com/Sadew-Upendra/devcard/actions/workflows/ci.yml"><img src="https://github.com/Sadew-Upendra/devcard/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
  <img src="https://img.shields.io/badge/Next.js-App_Router-000000?logo=nextdotjs" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/PostgreSQL-Neon_or_Docker-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-green" alt="MIT License" /></a>
</p>

<p align="center">
  <!-- Add your live URL after deploying -->
  <a href="https://devcard-gitrank.vercel.app">Live demo</a> ·
  <a href="https://github.com/Sadew-Upendra/devcard/issues">Report a bug</a> ·
  <a href="https://github.com/Sadew-Upendra/devcard/issues">Request a feature</a>
</p>

<!--
Add a screenshot or GIF here
<p align="center"><img src="docs/screenshots/card.png" width="640" alt="DevCard preview" /></p>
-->

## Table of contents

- [Features](#features)
- [How it works](#how-it-works)
- [How the rating works](#how-the-rating-works)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Scripts](#scripts)
- [Endpoints](#endpoints)
- [Project structure](#project-structure)
- [Caching and rate limits](#caching-and-rate-limits)
- [Deployment](#deployment)
- [Privacy](#privacy)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Player card** with an overall rating (0-99), a tier from Bronze to Icon, a position title, and six stats
- **Pack-opening reveal**, 3D tilt and holographic shine
- **Rankings** globally, by country and by main language, with filterable leaderboards
- **Battle mode:** two usernames, six stats, one winner
- **README badge** and **share image** for every player
- **PNG download** of the card, up to 3x resolution
- Works for **any** public GitHub user instantly, with no crawling needed

## How it works

```mermaid
flowchart LR
  U[User enters a username] --> A[Next.js route]
  A --> C{Fresh card in database?}
  C -- yes --> R[Rank and render]
  C -- no --> L[Per-IP rate limit]
  L --> G[GitHub GraphQL API]
  G --> S[Scoring engine]
  S --> D[(PostgreSQL)]
  D --> R
  R --> O[Card page, PNG, share image, badge]
```

Every searched player is stored, so rankings grow as people use the site. The stored card also acts as a 24-hour cache.

## How the rating works

Each stat is scaled with `min(99, round(k * log10(value + 1)))`. The log scale keeps very large accounts from dominating.

| Stat | Source | Scale `k` | Weight |
|------|--------|-----------|--------|
| COM | Contributions in the last year | 26 | 20% |
| PRS | Merged pull requests | 30 | 20% |
| STR | Stars on owned, non-fork repos (top 100 by stars) | 20 | 20% |
| FOL | Followers | 20 | 15% |
| REV | Code reviews and issues | 30 | 10% |
| STK | Longest daily contribution streak in the last year | 38 | 15% |

The overall rating is the weighted average of the six stats.

| Tier | Overall |
|------|---------|
| Icon | 88+ |
| Rare | 75+ |
| Gold | 60+ |
| Silver | 40+ |
| Bronze | below 40 |

The **position title** comes from a player's highest stat: The Grinder (COM), The Striker (PRS), The Star Maker (STR), The Influencer (FOL), The Gatekeeper (REV), The Iron Man (STK).

Ranks are relative to players stored in DevCard. A "top X%" figure appears only once there are at least 100 stored players.

To tune the formula, edit [`src/lib/scoring/config.ts`](src/lib/scoring/config.ts). Stored cards keep their old scores, so run `TRUNCATE players;` and re-seed after a change.

## Tech stack

| Area | Tools |
|------|-------|
| Framework | Next.js (App Router), React, TypeScript |
| Styling and motion | Tailwind CSS, Framer Motion |
| Images | `next/og` (Satori) for PNG, share image and the default social image |
| Data source | GitHub GraphQL API |
| Database | PostgreSQL through `pg` (Neon or Docker) |
| Rate limiting | Upstash Redis |
| Testing | Vitest |
| CI and hosting | GitHub Actions, Vercel |

## Getting started

### Prerequisites

- Node.js 20.6 or newer
- A [GitHub personal access token](https://github.com/settings/tokens) (classic, no scopes needed)
- A PostgreSQL database, using **either** [Neon](https://neon.tech) (free, nothing to install) **or** Docker

### 1. Clone and install

```bash
git clone https://github.com/Sadew-Upendra/devcard.git
cd devcard
npm install
```

### 2. Create your environment file

```bash
cp .env.example .env.local
```

On Windows `cmd`, use `copy .env.example .env.local` instead. Then set `GITHUB_TOKENS` in `.env.local`.

### 3. Choose a database

**Option A: Neon (free hosted Postgres)**

1. Create a project at [neon.tech](https://neon.tech), in the region closest to you.
2. Click **Connect**, turn on **Connection pooling**, and copy the connection string.
3. Paste it into `.env.local` as `DATABASE_URL`, with no quotes or spaces.

If you get a "channel binding" error, remove `&channel_binding=require` from the end of the string.

**Option B: Docker**

```bash
docker compose up -d db
```

Then set this in `.env.local`:

```
DATABASE_URL=postgresql://devcard:secret@localhost:5432/devcard
```

### 4. Create the tables and run

```bash
npm run db:migrate
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Optional: fill the leaderboard

```bash
npm run seed -- "Sri Lanka" 20 0 300
npm run seed -- "Sri Lanka" 5 19 400
npm run seed -- "Sri Lanka" 1 4 300
```

The arguments are: location, minimum followers, maximum followers (0 means no limit), and how many users to fetch. Seeding several follower ranges gives a fair ranking baseline, instead of only top developers.

## Environment variables

| Name | Required | Purpose |
|------|----------|---------|
| `GITHUB_TOKENS` | Yes | One or more GitHub tokens, comma separated. A single `GITHUB_TOKEN` also works |
| `DATABASE_URL` | For rankings | PostgreSQL connection string. Without it, cards still work but ranks show "—" |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | Production | Per-IP rate limiting. Off when not set |
| `NEXT_PUBLIC_SITE_URL` | Production | Public site URL, used for share links and badges |
| `NEXT_PUBLIC_CONTACT_URL` | Optional | Where people can ask to be removed (issues URL or `mailto:`) |
| `BLOCKED_LOGINS` | Optional | Comma-separated usernames that opted out |

`NEXT_PUBLIC_*` values are baked in at build time, so redeploy after changing them.

## Scripts

| Command | What it does |
|---------|--------------|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm start` | Run the production build |
| `npm test` | Run unit tests |
| `npm run test:users` | Fetch and score a set of sample profiles |
| `npm run db:migrate` | Create the database tables |
| `npm run seed -- "<place>" <min> <max> <limit>` | Add players found by location |

## Endpoints

| Route | Description |
|-------|-------------|
| `/u/<username>` | Card page with reveal and ranks |
| `/battle?a=<user>&b=<user>` | Compare two players |
| `/leaderboard?country=lk&lang=Java` | Leaderboard with filters |
| `/api/card/<username>` | JSON with stats and ranks |
| `/api/card/<username>/image?scale=3` | PNG of the card (scale 1 to 3) |
| `/api/card/<username>/og` | 1200x630 share image |
| `/api/badge/<username>` | SVG badge for READMEs |
| `/api/health` | Health check (database, tokens, rate limiting) |

### Add the badge to your GitHub profile

```markdown
[![DevCard](https://YOUR-DOMAIN/api/badge/USERNAME)](https://YOUR-DOMAIN/u/USERNAME)
```

## Project structure

```
devcard/
├── .github/workflows/ci.yml
├── db/schema.sql
├── public/                      logo and icon
├── scripts/                     migrate, seed, test-users
├── src/
│   ├── app/                     pages and API routes
│   │   ├── api/                 card, image, og, badge, health
│   │   ├── battle/  leaderboard/  u/[username]/
│   ├── assets/fonts/            font used for PNG rendering
│   ├── components/              PlayerCard, TiltCard, Reveal, RankPanel, ...
│   └── lib/
│       ├── github/              GraphQL client, token rotation, search
│       ├── scoring/             stats, tiers, themes, config
│       ├── location/            country detection
│       ├── players.ts           database queries and ranks
│       ├── ratelimit.ts         per-IP limits
│       └── cache.ts             in-memory request cache
├── tests/
├── docker-compose.yml           optional local database
└── next.config.ts
```

## Caching and rate limits

GitHub allows about 5,000 GraphQL points per hour per account, so DevCard avoids unnecessary calls:

- **24-hour cache.** A stored card is reused, so a repeat visit makes no GitHub call.
- **In-flight sharing.** Simultaneous requests for the same user share one GitHub call.
- **Token rotation.** With several tokens configured, rate-limited ones are skipped until they reset. Use only tokens from accounts you control or whose owners agreed.
- **Per-IP limits.** Only fresh GitHub lookups are limited (10 per minute, 60 per hour). Cached cards and badges are never limited.

## Deployment

1. **Database:** create a [Neon](https://neon.tech) project and run `npm run db:migrate` against it.
2. **Rate limiting:** add Upstash Redis from the Vercel Marketplace.
3. **App:** import the repo into [Vercel](https://vercel.com) and set the environment variables above.
4. **Check** `/api/health`, then open a card and paste its link into a social post to confirm the share image.

`next.config.ts` includes the font file for the image routes. Without it, the PNG routes fail on Vercel.

## Privacy

DevCard only uses public GitHub profile data. To be removed, use the link in the site footer. Removed users are also added to `BLOCKED_LOGINS` so they cannot be re-added by a search.

## Contributing

Contributions, bug reports, and feature requests are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/your-feature`)
3. Commit your changes and open a Pull Request

## License

Distributed under the [MIT License](LICENSE).

## Disclaimer

This project is an independent open-source tool and is not affiliated with, endorsed by, or connected to GitHub or EA Sports.


<div align="center">
  <p>
    <sub>If you enjoy DevCard, consider giving the repository a ⭐ star!</sub>
  </p>
</div>
