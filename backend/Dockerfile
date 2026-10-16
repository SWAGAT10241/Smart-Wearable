FROM node:22-alpine AS base
WORKDIR /app
RUN npm install -g pnpm@11.20.0

FROM base AS dependencies
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

# Run as non-root user
USER node

EXPOSE 3000

CMD ["node", "server.js"]
