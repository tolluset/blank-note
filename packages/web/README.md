# Web

The frontend for Blank Note, built with Next.js and shadcn/ui components.

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **UI Components**: shadcn/ui

## Development Setup

### Prerequisites

- Node.js 22+
- pnpm

### Getting Started

1. **Install dependencies**

   ```bash
   pnpm install
   ```

2. **Environment configuration**

   Create `.env.local`:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8787
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
   ```

3. **Start development server**

   ```bash
   pnpm dev
   ```

   The application will be available at [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
pnpm build
pnpm start
```

## Project Structure

- `app/` - Next.js App Router pages and layouts
- `components/` - Reusable UI components
- `lib/` - Utility functions and configurations
- `hooks/` - Custom React hooks
- `types/` - TypeScript type definitions

## Deployment

The frontend is deployed on Vercel with automatic deployments from the main branch.
