# Server

The backend API for Blank Note, built with Hono and PostgreSQL.

## Tech Stack

- **Framework**: Hono
- **ORM**: Drizzle ORM
- **Database**: PostgreSQL
- **Auth**: Google OAuth
- **Runtime**: Node.js 22

## Development Setup

### Prerequisites

- Node.js 22+
- pnpm
- Docker & Docker Compose

### Getting Started

1. **Install dependencies**

   ```bash
   pnpm install
   ```

2. **Environment configuration**

   Create `.env` file:

   ```env
   POSTGRES_USER=example
   POSTGRES_PASSWORD=example
   POSTGRES_DB=blank-note
   POSTGRES_PORT=5432
   SERVER_PORT=8787
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

3. **Database setup**

   ```bash
   # Create Docker network (only needed once)
   docker network create app-network

   # Start PostgreSQL database
   docker-compose -f docker-compose.db.yml up -d

   # Run database migrations
   pnpm db:migrate
   ```

4. **Start development server**

   ```bash
   pnpm dev
   ```

   The API will be available at [http://localhost:8787](http://localhost:8787)

### Development Commands

- `pnpm dev` - Start development server with hot reload
- `pnpm start` - Start production server
- `pnpm build` - Build TypeScript
- `pnpm db:generate` - Generate migration files
- `pnpm db:migrate` - Run database migrations

## Production Deployment

### Prerequisites

- Docker & Docker Compose
- Environment variables configured

### Deployment Steps

1. **Start database**

   ```bash
   docker-compose -f docker-compose.db.yml up -d
   ```

2. **Run migrations**

   ```bash
   docker-compose -f docker-compose.migrate.yml up --build
   ```

3. **Start server**

   ```bash
   docker-compose -f docker-compose.server.yml up --build -d
   ```

### Container Management

- **Database**: `docker-compose.db.yml` - PostgreSQL instance
- **Migration**: `docker-compose.migrate.yml` - One-time migration runner
- **Server**: `docker-compose.server.yml` - Application server

### Stopping Services

```bash
# Stop all services
docker-compose -f docker-compose.server.yml down
docker-compose -f docker-compose.db.yml down
```

## API Endpoints

- `GET /notes` - Get all notes or normal status notes
- `GET /notes/torn` - Get torn pages
- `GET /notes/trashed` - Get trashed notes
- `PATCH /notes/{pageId}` - Update page content and status

## Database Schema

The application uses PostgreSQL with tables for notes, pages, and user sessions.

## Deployment

The backend is containerized and deployed on a Mac Mini server with Docker.
