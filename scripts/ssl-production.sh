#!/bin/bash

# Production SSL Certificate Script
# Run this after testing with staging certificates

set -e

# Load environment variables
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
else
    echo "Error: .env file not found."
    exit 1
fi

if [ -z "$DOMAIN_NAME" ] || [ -z "$LETSENCRYPT_EMAIL" ]; then
    echo "Error: DOMAIN_NAME and LETSENCRYPT_EMAIL must be set in .env file"
    exit 1
fi

echo "Creating production SSL certificate for: $DOMAIN_NAME"

# Remove staging certificate
docker-compose run --rm certbot delete --cert-name $DOMAIN_NAME

# Create production certificate
docker-compose run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/html \
    --email $LETSENCRYPT_EMAIL \
    --agree-tos \
    --no-eff-email \
    -d $DOMAIN_NAME

# Test nginx configuration
docker-compose exec nginx nginx -t

if [ $? -eq 0 ]; then
    # Reload nginx
    docker-compose exec nginx nginx -s reload
    echo "Production SSL certificate installed successfully!"
else
    echo "Error: Nginx configuration test failed"
    exit 1
fi