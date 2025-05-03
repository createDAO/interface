#!/bin/bash

# This script verifies that static files are properly shared between containers via Docker volumes
# It should be run after both containers are up and running

# Get container IDs
APP_CONTAINER=$(docker ps -qf "name=createdao-app-1")
NGINX_CONTAINER=$(docker ps -qf "name=createdao-nginx-1")

if [ -z "$APP_CONTAINER" ]; then
  echo "Error: App container not found"
  exit 1
fi

if [ -z "$NGINX_CONTAINER" ]; then
  echo "Error: Nginx container not found"
  exit 1
fi

echo "Verifying static files are accessible via shared volumes..."

# Get the build ID from the app container
BUILD_ID=$(docker exec $APP_CONTAINER ls /app/.next/static/ | grep -v "chunks\|css\|media")
echo "Found build ID: $BUILD_ID"

# Verify that the build ID directory is accessible in the nginx container
echo "Verifying build ID directory in nginx container..."
docker exec $NGINX_CONTAINER ls -la /usr/share/nginx/html/_next/static/$BUILD_ID || {
  echo "Warning: Build ID directory not found in nginx container"
  echo "Creating necessary directories in nginx container..."
  docker exec $NGINX_CONTAINER mkdir -p /usr/share/nginx/html/_next/static/$BUILD_ID
  docker exec $NGINX_CONTAINER chown -R nginx:nginx /usr/share/nginx/html/_next
}

# Verify that the public directory is accessible in the nginx container
echo "Verifying public directory in nginx container..."
docker exec $NGINX_CONTAINER ls -la /usr/share/nginx/html/public || {
  echo "Warning: Public directory not found in nginx container"
  echo "Creating public directory in nginx container..."
  docker exec $NGINX_CONTAINER mkdir -p /usr/share/nginx/html/public
  docker exec $NGINX_CONTAINER chown -R nginx:nginx /usr/share/nginx/html/public
}

# Copy build manifest files which might not be in the volume
echo "Copying build manifest files..."
docker exec $APP_CONTAINER find /app/.next -name "*.json" -maxdepth 1 -type f | while read -r file; do
  filename=$(basename "$file")
  echo "Copying $filename to nginx container..."
  docker exec $APP_CONTAINER cat "$file" | docker exec -i $NGINX_CONTAINER sh -c "cat > /usr/share/nginx/html/_next/$filename"
done

echo "Copying media files..."
docker exec $APP_CONTAINER find /app/.next/static/media -type f | while read -r file; do
  rel_path=${file#/app/.next/}
  dir_path=$(dirname "/usr/share/nginx/html/_next/$rel_path")
  echo "Copying $file to nginx container at $dir_path/$(basename "$file")..."
  docker exec $NGINX_CONTAINER mkdir -p "$dir_path"
  docker exec $APP_CONTAINER cat "$file" | docker exec -i $NGINX_CONTAINER sh -c "cat > /usr/share/nginx/html/_next/$rel_path"
done

echo "Static files verification completed successfully!"
