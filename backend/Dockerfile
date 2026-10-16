# syntax=docker/dockerfile:1
FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

FROM base AS dependencies
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml* ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --prod

FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000

# Run container as non-root user
USER node

WORKDIR /app

COPY --chown=node:node --from=dependencies /app/node_modules ./node_modules
COPY --chown=node:node package.json ./
COPY --chown=node:node app.js server.js ./
COPY --chown=node:node config/ ./config/
COPY --chown=node:node controllers/ ./controllers/
COPY --chown=node:node middleware/ ./middleware/
COPY --chown=node:node models/ ./models/
COPY --chown=node:node realtime/ ./realtime/
COPY --chown=node:node routes/ ./routes/
COPY --chown=node:node services/ ./services/
COPY --chown=node:node utils/ ./utils/

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

CMD ["node", "server.js"]
