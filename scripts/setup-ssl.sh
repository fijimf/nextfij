#!/bin/bash

# SSL Setup Script for NextFij with Let's Encrypt
# This script helps set up SSL certificates and configure nginx

set -e

# Load environment variables
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
else
    echo "Error: .env file not found. Please copy .env.example to .env and configure it."
    exit 1
fi

# Check required variables
if [ -z "$DOMAIN_NAME" ] || [ -z "$LETSENCRYPT_EMAIL" ]; then
    echo "Error: DOMAIN_NAME and LETSENCRYPT_EMAIL must be set in .env file"
    exit 1
fi

echo "Setting up SSL for domain: $DOMAIN_NAME"

# Replace domain placeholder in nginx config
sed -i.bak "s/DOMAIN_PLACEHOLDER/$DOMAIN_NAME/g" nginx/conf.d/default.conf

# Create initial certificate (staging)
echo "Creating initial SSL certificate (staging mode)..."
docker-compose run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/html \
    --email $LETSENCRYPT_EMAIL \
    --agree-tos \
    --no-eff-email \
    --staging \
    -d $DOMAIN_NAME

# Test nginx configuration
echo "Testing nginx configuration..."
docker-compose exec nginx nginx -t

if [ $? -eq 0 ]; then
    echo "Nginx configuration is valid!"
    
    # Reload nginx
    docker-compose exec nginx nginx -s reload
    
    echo ""
    echo "SSL setup completed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Test your site at https://$DOMAIN_NAME"
    echo "2. If everything works, run production certificates:"
    echo "   ./scripts/ssl-production.sh"
    echo "3. Set up automatic renewal with cron:"
    echo "   ./scripts/setup-renewal.sh"
else
    echo "Error: Nginx configuration test failed"
    exit 1
fi