#!/usr/bin/env bash
# ==============================================================================
# One-Step Deployment Script for PrettyVision VPS (srv1121234)
# Run as root in /var/www/pretty-vision
# ==============================================================================
set -euo pipefail

# Auto-detect application directory
if [ -d "/var/www/pretty-vision" ]; then
    APP_DIR="/var/www/pretty-vision"
elif [ -d "/var/www/self-excellence" ]; then
    APP_DIR="/var/www/self-excellence"
else
    APP_DIR="$(pwd)"
fi

echo "=== Starting deployment in ${APP_DIR} ==="

cd "${APP_DIR}"

# 1. Pull latest code
echo "--> Pulling latest code from GitHub..."
git fetch origin main || true
git reset --hard origin/main || git pull origin main || true

# 2. Configure Swap if not already active
if [ -f "${APP_DIR}/deploy/setup-swap.sh" ]; then
    echo "--> Checking swap configuration..."
    bash "${APP_DIR}/deploy/setup-swap.sh" || true
fi

# 3. Setup Logrotate
if [ -f "${APP_DIR}/deploy/logrotate-self-excellence.conf" ]; then
    echo "--> Installing logrotate rule..."
    cp "${APP_DIR}/deploy/logrotate-self-excellence.conf" /etc/logrotate.d/pretty-vision 2>/dev/null || true
fi

# 4. Backend Dependencies & Log Directory
echo "--> Setting up backend..."
cd "${APP_DIR}/backend"
mkdir -p logs
npm install --omit=dev

# 5. Build Frontend
echo "--> Building production frontend..."
cd "${APP_DIR}/frontend"
npm install
npm run build

# 6. PM2 Restart with 1 Worker & 280MB Memory Ceiling
echo "--> Reloading backend via PM2..."
cd "${APP_DIR}/backend"
pm2 delete self-excellence 2>/dev/null || true
pm2 delete pretty-vision 2>/dev/null || true
pm2 start ecosystem.config.cjs
pm2 save

# 7. Nginx Test & Reload
echo "--> Testing and reloading Nginx..."
if [ -f /etc/nginx/sites-available/pretty-vision ]; then
    nginx -t && systemctl reload nginx
elif [ -f /etc/nginx/sites-available/self-excellence ]; then
    nginx -t && systemctl reload nginx
fi

echo "=== Deployment finished successfully! ==="
echo "Memory snapshot:"
free -h || true
echo "PM2 Status:"
pm2 status || true
curl -s http://localhost:5055/api/health || true
echo ""
