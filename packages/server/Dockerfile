FROM node:22-alpine

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy package files first for better caching
COPY package*.json pnpm-lock.yaml* ./
RUN pnpm install

# Copy .env and source files
COPY .env* ./
COPY src ./src
COPY drizzle ./drizzle
COPY tsconfig.json drizzle.config.ts ./


EXPOSE 8787

CMD ["pnpm", "start"]