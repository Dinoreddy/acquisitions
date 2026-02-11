# Use Node.js 20 Alpine for a lightweight image
FROM node:20-alpine AS base

# Create app directory and set ownership to non-root user 'node'
RUN mkdir -p /app && chown -R node:node /app

# Set working directory
WORKDIR /app

# Switch to non-root user
USER node

# Copy package files first to leverage Docker cache for dependencies
# Use --chown to ensure the files are owned by the node user
COPY --chown=node:node package.json package-lock.json ./

# Install dependencies (production only initially)
# Using npm set progress=false to speed up install in some environments and reduce log noise
RUN npm ci --only=production

# Health Check
# Using wget since it's available in alpine and lighter than installing curl
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Expose the port the app runs on
EXPOSE 3000

# Metadata about the image
LABEL maintainer="Acquisitions Team"
LABEL description="Acquisitions API with Neon Database support"

# --- Development Stage ---
FROM base AS development
ENV NODE_ENV=development
# Install dev dependencies if needed (for tools like nodemon if not in prod deps)
# If your dev dependencies are in package.json under devDependencies, run install again including them
RUN npm install
# Copy source code
COPY --chown=node:node . .
CMD ["npm", "run", "dev"]

# --- Production Stage ---
FROM base AS production
ENV NODE_ENV=production
# Copy source code
COPY --chown=node:node . .
CMD ["npm", "start"]
