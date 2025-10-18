FROM node:20-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --cache /tmp/npm-cache --prefer-offline --no-audit
COPY tsconfig.json ./  
COPY src ./src
RUN npm run build

FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4000
ENV STORAGE_DRIVER=fs
ENV LOCAL_STORE_DIR=/data

# Copy only prod modules from builder:
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

# Copy built JS
COPY --from=builder /app/dist ./dist

# Setup data dir & permissions
RUN mkdir -p /data && chown -R node:node /data /app
USER node

VOLUME ["/data"]
EXPOSE 4000
CMD ["node", "dist/index.js"]
