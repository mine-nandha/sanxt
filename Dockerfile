# --- Builder: install deps and build ---
FROM oven/bun:latest AS builder
WORKDIR /app

# copy manifest first for cache
COPY package.json bun.lockb* ./

# install full deps (dev + prod) so next build works
RUN bun install --frozen-lockfile

# copy source and build
COPY . .
RUN bun run build

# --- Runtime: minimal image with non-root user ---
FROM oven/bun:latest AS runtime
WORKDIR /app

# create non-root user (robust across bases) BEFORE copying files
RUN set -eux; \
    if command -v groupadd >/dev/null 2>&1 && command -v useradd >/dev/null 2>&1; then \
      groupadd -r app && useradd -r -g app -d /app -s /sbin/nologin app; \
    elif command -v addgroup >/dev/null 2>&1 && command -v adduser >/dev/null 2>&1; then \
      addgroup -S app && adduser -S -G app -h /app -s /bin/sh app; \
    else \
      echo "app:x:1000:1000::/app:/sbin/nologin" >> /etc/passwd; \
    fi; \
    mkdir -p /app && chown -R app:app /app

# copy only runtime artifacts from builder
COPY --chown=app:app --from=builder /app/.next ./.next
COPY --chown=app:app --from=builder /app/public ./public
COPY --chown=app:app --from=builder /app/package.json ./package.json
COPY --chown=app:app --from=builder /app/bun.lockb ./bun.lockb
COPY --chown=app:app --from=builder /app/node_modules ./node_modules

ENV NODE_ENV=production
USER app

EXPOSE 3000
ENV PORT=3000

# Optional: re-enable when app is stable
# HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
#   CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

CMD ["bun", "run", "start"]
