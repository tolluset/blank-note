# Blank Note

A simple analog-style digital notepad with page tearing and note collection features.

## Features

- **Dual-page notebook interface**: Write and edit on left/right pages
- **Page tearing**: Remove pages from the notebook (irreversible, like real paper)
- **Page collection**: View and organize torn pages freely (like Miro)
- **Trash system**: Manage discarded pages
- **No authentication required**: Start writing immediately

## Quick Start

### Prerequisites

- Node.js 22+
- pnpm
- Docker (for PostgreSQL)

### Setup

1. **Install dependencies**

   ```bash
   pnpm install
   ```

2. **Database setup**

   ```bash
   cd packages/server
   docker-compose -f docker-compose.db.yml up -d
   ```

3. **Environment configuration**

   Create `packages/server/.env`:

   ```env
   POSTGRES_USER=example
   POSTGRES_PASSWORD=example
   POSTGRES_DB=blank-note
   POSTGRES_PORT=5432
   SERVER_PORT=8787
   ```

4. **Start development servers**

   ```bash
   # Start both web and server
   pnpm dev

   # Or start individually
   pnpm dev:web    # Frontend only
   pnpm dev:server # Backend only
   ```

5. **Access the application**
   - Frontend: <http://localhost:3000>
   - Backend API: <http://localhost:8787>

### Production Build

```bash
pnpm build
```

## Usage

1. Open the app - no login required
2. Write on the left/right pages
3. Tear pages using the tear button
4. View torn pages in the collection view
5. Send unwanted pages to trash
