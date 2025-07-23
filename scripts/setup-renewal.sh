#!/bin/bash

# Setup automatic SSL certificate renewal
# This script sets up a cron job for automatic certificate renewal

set -e

echo "Setting up automatic SSL certificate renewal..."

# Create renewal script
cat << 'EOF' > /tmp/ssl-renew.sh
#!/bin/bash
cd /path/to/your/nextfij/project

# Attempt renewal
docker-compose run --rm certbot renew --quiet

# Reload nginx if certificates were renewed
if [ $? -eq 0 ]; then
    docker-compose exec nginx nginx -s reload
fi
EOF

# Get current directory for the renewal script
CURRENT_DIR=$(pwd)
sed -i "s|/path/to/your/nextfij/project|$CURRENT_DIR|g" /tmp/ssl-renew.sh

# Make script executable
chmod +x /tmp/ssl-renew.sh

# Move to final location
sudo mv /tmp/ssl-renew.sh /usr/local/bin/nextfij-ssl-renew.sh

# Add cron job (runs twice daily as recommended by Let's Encrypt)
(crontab -l 2>/dev/null; echo "0 */12 * * * /usr/local/bin/nextfij-ssl-renew.sh >> /var/log/nextfij-ssl-renewal.log 2>&1") | crontab -

echo "Automatic renewal setup completed!"
echo "Certificates will be checked for renewal twice daily."
echo "Renewal logs will be written to: /var/log/nextfij-ssl-renewal.log"

# Test the renewal script
echo "Testing renewal script..."
/usr/local/bin/nextfij-ssl-renew.sh --dry-run

if [ $? -eq 0 ]; then
    echo "Renewal test successful!"
else
    echo "Warning: Renewal test failed. Please check your configuration."
fi