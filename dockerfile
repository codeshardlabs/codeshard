# Stage 1: Dependencies
FROM node:18-alpine AS deps
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
# Make sure sharp is in your package.json if you need image optimization
RUN pnpm install --frozen-lockfile

# Stage 2: Builder
FROM node:18-alpine AS builder
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the Next.js application (standalone mode)
RUN pnpm build

# Stage 3: Runner
FROM node:18-alpine AS runner
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

ENV NODE_ENV=production

# Create a non-root user and group
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy only the necessary files from the builder stage
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# -- Create and set permissions for the cache directory --
# Although standalone mode might not always strictly need it,
# Next.js at runtime may still try to access .next/cache
RUN mkdir -p .next/cache && chown -R nextjs:nodejs .next

# Switch to the non-root user
USER nextjs

# Expose the port
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Command to start the application
CMD ["node", "server.js"]
