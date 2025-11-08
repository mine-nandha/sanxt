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

# Create non-root user for safety (robust across Debian/Alpine)
# - prefers groupadd/useradd, falls back to addgroup/adduser, falls back to /etc/passwd entry
RUN set -eux; \
    if command -v groupadd >/dev/null 2>&1 && command -v useradd >/dev/null 2>&1; then \
      groupadd -r app && useradd -r -g app -d /app -s /sbin/nologin app; \
    elif command -v addgroup >/dev/null 2>&1 && command -v adduser >/dev/null 2>&1; then \
      addgroup -S app && adduser -S -G app -h /app -s /bin/sh app; \
    else \
      echo "app:x:1000:1000::/app:/sbin/nologin" >> /etc/passwd; \
    fi; \
    mkdir -p /app && chown -R app:app /app

# Copy files from builder (user now exists so --chown is safe)
COPY --chown=app:app --from=builder /app /app

ENV NODE_ENV=production
USER app

# Expose the port your app listens on
EXPOSE 3000

# Start command — expects "start" script in package.json
CMD ["bun", "run", "start"]
