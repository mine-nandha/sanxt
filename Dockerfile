# --- Builder: install deps and build ---
FROM oven/bun:latest AS builder
WORKDIR /app

# Copy lockfile & package manifest first to leverage docker cache for deps
COPY package.json bun.lockb* ./

# Install only production deps (fast, smaller)
RUN bun install --production

# Copy rest of app and run optional build step (if you have one)
COPY . .
# If you have a build script (e.g. `bun run build`) uncomment next line
RUN bun run build

# --- Runtime: minimal bun image with non-root user ---
FROM oven/bun:latest AS runtime
WORKDIR /app

# Create non-root user for safety (some base images already have one; this is safe)
RUN addgroup -S app && adduser -S app -G app || true

# Copy only what we need from builder (node_modules + built assets + package.json)
COPY --chown=app:app --from=builder /app /app

ENV NODE_ENV=production
USER app

# Expose the port your app listens on
EXPOSE 3000

# Basic healthcheck (adjust path/port to your app)
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Start command — expects "start" script in package.json: "start": "bun index.js" or similar
CMD ["bun", "run", "start"]
