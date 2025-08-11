FROM node:22-alpine

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

COPY package*.json ./
RUN pnpm install

COPY . .

EXPOSE 8787

CMD ["pnpm", "start"]