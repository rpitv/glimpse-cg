# -----------------------------
# Stage 1 — Build
# -----------------------------
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies deterministically
COPY package.json package-lock.json ./
RUN cat package.json
RUN npm ci --legacy-peer-deps

# Copy source
COPY . .

# Build production
RUN npm run build


# -----------------------------
# Stage 2 — Runtime
# -----------------------------
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy built Nitro output only
COPY --from=builder /app/.output ./.output

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
