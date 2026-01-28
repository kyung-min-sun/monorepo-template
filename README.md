# Project Template

A full-stack monorepo template using Bun, Turborepo, Elysia, Next.js, and Prisma.

## Architecture

This template follows a **"services in packages, hoisted to apps"** pattern:

```
project-template/
├── apps/
│   ├── backend/
│   │   ├── api-server/        # Main API server
│   │   └── browser-server/    # Puppeteer automation service
│   └── frontend/
│       └── web/               # Next.js web app
├── packages/
│   ├── config/                # Shared configs (TypeScript, Tailwind, oxlint)
│   ├── shared/
│   │   └── server/            # Base Elysia router with logging
│   └── services/
│       ├── database/          # Prisma client
│       ├── storage/           # Bun S3 client
│       ├── api/               # API router definitions
│       └── browser/           # Puppeteer client/server
```

## Prerequisites

- [Bun](https://bun.sh) v1.3.0+
- [Docker](https://docker.com) (for PostgreSQL)
- S3-compatible storage (AWS S3, Cloudflare R2, MinIO, etc.)
- Chrome/Chromium (for browser-server)

## Setup

### 1. Start PostgreSQL

```bash
docker compose up -d
```

This starts PostgreSQL on `localhost:5432` with:
- **User**: `postgres`
- **Password**: `postgres`
- **Database**: `project-template`

To stop: `docker compose down`

To stop and remove data: `docker compose down -v`

### 2. Install dependencies

```bash
bun install
```

### 3. Configure environment variables

Create `.env` files for the backend apps:

**apps/backend/api-server/.env**
```env
NODE_ENV=development
PORT=3001

# URLs
FRONTEND_URL=http://localhost:3000
API_URL=http://localhost:3001

# Database (PostgreSQL)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/project-template

# Storage (S3-compatible)
S3_BUCKET=your-bucket
S3_ACCESS_KEY_ID=your-access-key
S3_SECRET_ACCESS_KEY=your-secret-key
S3_ENDPOINT=http://localhost:9000  # Optional: for MinIO/R2
S3_REGION=us-east-1                # Optional

# Browser server
BROWSER_SERVER_URL=http://localhost:8001
```

**apps/backend/browser-server/.env**
```env
NODE_ENV=development
PORT=8001

# Storage (same as api-server)
S3_BUCKET=your-bucket
S3_ACCESS_KEY_ID=your-access-key
S3_SECRET_ACCESS_KEY=your-secret-key
S3_ENDPOINT=http://localhost:9000
S3_REGION=us-east-1

# Browser - choose one:
BROWSER_EXECUTABLE_PATH=/Applications/Google Chrome.app/Contents/MacOS/Google Chrome
# Or connect to a remote browser:
# BROWSER_WS_ENDPOINT=ws://localhost:3000
```

### 4. Set up the database

```bash
# Generate Prisma client
bun run db:generate

# Push schema to database
bun run db:push

# Open Prisma Studio (optional)
bun run db:studio
```

### 5. Run development servers

```bash
# Run all apps concurrently
bun run dev

# Or run individually:
cd apps/backend/api-server && bun run dev
cd apps/backend/browser-server && bun run dev
cd apps/frontend/web && bun run dev
```

## Services

### Database (`@project-template/db`)

Prisma client with PostgreSQL adapter. Edit the schema at:
```
packages/services/database/prisma/schema/schema.prisma
```

### Storage (`@project-template/storage`)

Uses Bun's native S3 client (no AWS SDK dependency). Works with any S3-compatible provider.

```typescript
import { StorageClient } from "@project-template/storage";

const storage = new StorageClient({
  bucket: "my-bucket",
  accessKeyId: "...",
  secretAccessKey: "...",
});

// Save and get URL
const key = await storage.save(buffer, "image/png");
const url = await storage.getUrl(key);
```

### API (`@project-template/api`)

Elysia-based API with type-safe Eden client.

```typescript
// Server-side: Add routes in packages/services/api/src/server/routers/
import { APIClient } from "@project-template/api";

// Client-side: Type-safe API calls
const api = new APIClient({ API_URL: "http://localhost:3001" });
const { data } = await api.client.users.get();
```

### Browser (`@project-template/browser`)

Puppeteer automation with screenshot, PDF generation, and scraping endpoints.

```typescript
import { BrowserClient } from "@project-template/browser";

const browser = new BrowserClient({ SERVER_URL: "http://localhost:8001" });
const { data } = await browser.client.screenshot.post({
  url: "https://example.com",
  viewport: { width: 1920, height: 1080 },
});
```

## Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start all apps in development mode |
| `bun run build` | Build all packages and apps |
| `bun run lint` | Run oxlint on all packages |
| `bun run lint:fix` | Fix linting issues |
| `bun run format` | Format code with oxfmt |
| `bun run typecheck` | Type-check all packages |
| `bun run db:generate` | Generate Prisma client |
| `bun run db:push` | Push schema to database |
| `bun run db:studio` | Open Prisma Studio |

## Adding a New Service

1. Create the package directory:
   ```bash
   mkdir -p packages/services/my-service/src
   ```

2. Add `package.json`:
   ```json
   {
     "name": "@project-template/my-service",
     "type": "module",
     "private": true,
     "exports": {
       ".": "./src/client.ts"
     }
   }
   ```

3. Implement your client in `src/client.ts`

4. Add to the API services interface in `packages/services/api/src/server/_router.ts`

5. Instantiate in `apps/backend/api-server/src/clients/`

## Tech Stack

- **Runtime**: [Bun](https://bun.sh)
- **Monorepo**: [Turborepo](https://turbo.build)
- **Backend**: [Elysia](https://elysiajs.com)
- **Frontend**: [Next.js](https://nextjs.org)
- **Database**: [Prisma](https://prisma.io) + PostgreSQL
- **Storage**: Bun S3 (native)
- **Browser**: [Puppeteer](https://pptr.dev)
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **Linting**: [oxlint](https://oxc.rs)
- **Formatting**: [oxfmt](https://oxc.rs)
