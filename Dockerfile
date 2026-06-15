# Single-stage Bun: build the static SPA, then serve it (+ /api/health).
FROM oven/bun:1 AS app
WORKDIR /app
COPY package.json bun.lock* ./
RUN bun install
COPY . .
RUN bun run build
ENV PORT=8080
EXPOSE 8080
CMD ["bun", "server.mjs"]
