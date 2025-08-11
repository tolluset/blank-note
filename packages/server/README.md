# Server

The backend API for Blank Note, built with Hono and PostgreSQL.

## Tech Stack

- **Runtime**: Hono
- ORM: drizzle-orm
- **Database**: PostgreSQL

## Development Setup

### Prerequisites

- Node.js 22+
- pnpm
- Docker(docker-compose) for PostgreSQL

### Getting Started

1. **Install dependencies**

   ```bash
   pnpm install
   ```

2. **Database setup**

   ```bash
   # Create Docker network
   docker network create app-network

   # Start PostgreSQL
   docker-compose -f docker-compose.db.yml up -d

   # Run database migrations
   pnpm db:migrate
   ```

3. **Environment configuration**

   Create `.env`:

   ```env
   POSTGRES_USER=example
   POSTGRES_PASSWORD=example
   POSTGRES_DB=blank-note
   POSTGRES_PORT=5432
   SERVER_PORT=8787
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

4. **Start development server**

   ```bash
   pnpm dev
   ```

   The API will be available at [http://localhost:8787](http://localhost:8787)

### Production Deployment

```bash
# Start database and server containers
docker-compose -f docker-compose.db.yml up -d
docker-compose -f docker-compose.server.yml up -d
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
