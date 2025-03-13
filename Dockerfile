# Build stage
FROM node:20-alpine as build

# Add build arguments
ARG VITE_COMMIT_HASH=development
ARG VITE_APP_VERSION

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code (excluding .env)
COPY . .

# Copy .env first (for other environment variables)
COPY .env .

# Add version and commit hash to .env
RUN echo "VITE_COMMIT_HASH=${VITE_COMMIT_HASH}" >> .env && \
    echo "VITE_APP_VERSION=${VITE_APP_VERSION}" >> .env

# Build the application with all environment variables
RUN npm run build

# Production stage
FROM nginx:alpine

WORKDIR /app

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
