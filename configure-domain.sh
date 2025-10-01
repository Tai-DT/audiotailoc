#!/bin/bash

# Configure Custom Domain for audiotailoc.com
# This script configures the custom domain and DNS settings

set -e

echo "🌐 Configuring custom domain for Audio Tài Lộc"
echo "============================================="
echo ""

# Configuration
DOMAIN="audiotailoc.com"
PROJECT_ID="prj_N00xKZ0Ru20o4P2ykf8Vkz0YjJt4"
TEAM_ID="team_q3xRkP0dEB5IaZ9C3JubQJnA"
CURRENT_URL="https://audiotailoc-frontend-3fe8i3jy6-kadevs-projects.vercel.app"

echo "📋 Configuration:"
echo "  Domain: $DOMAIN"
echo "  Project: audiotailoc-frontend"
echo "  Current URL: $CURRENT_URL"
echo ""

# Step 1: Add domain to Vercel project
echo "🔗 Step 1: Adding domain to Vercel project..."
vercel domains add $DOMAIN --scope=$TEAM_ID || echo "Domain might already be added"
echo ""

# Step 2: Configure DNS records
echo "📍 Step 2: DNS Records Configuration"
echo "You need to add these DNS records to your domain registrar:"
echo ""
echo "A Records:"
echo "  @ → 198.49.23.144"
echo "  @ → 198.49.23.145"
echo "  @ → 198.185.159.145"
echo "  @ → 198.185.159.144"
echo ""
echo "CNAME Record:"
echo "  www → ext-sq.squarespace.com"
echo ""
echo "HTTPS Record:"
echo "  @ → 1 . alpn=\"h2,http/1.1\" ipv4hint=\"198.185.159.144,198.185.159.145,198.49.23.144,198.49.23.145\""
echo ""

# Step 3: Use the DNS configuration script
echo "🛠️  Step 3: Running DNS configuration script..."
if [ -f "./add-dns-records.sh" ]; then
    echo "Found DNS script, making it executable..."
    chmod +x ./add-dns-records.sh
    echo "Run this command to add DNS records:"
    echo "  ./add-dns-records.sh"
else
    echo "DNS script not found. Creating basic commands..."
    echo ""
    echo "Run these commands manually:"
    echo "vercel dns add $DOMAIN @ A 198.49.23.144"
    echo "vercel dns add $DOMAIN @ A 198.49.23.145"
    echo "vercel dns add $DOMAIN @ A 198.185.159.145"
    echo "vercel dns add $DOMAIN @ A 198.185.159.144"
    echo "vercel dns add $DOMAIN www CNAME ext-sq.squarespace.com"
fi
echo ""

# Step 4: Environment variables
echo "🔧 Step 4: Environment Variables"
echo "The following URLs are configured:"
echo "  NEXT_PUBLIC_APP_URL=https://$DOMAIN"
echo "  PAYOS_RETURN_URL=https://$DOMAIN/order-success"
echo "  PAYOS_CANCEL_URL=https://$DOMAIN/checkout"
echo "  PAYOS_WEBHOOK_URL=https://$DOMAIN/api/webhook/payos"
echo ""

# Step 5: Verification
echo "🔍 Step 5: Verification Commands"
echo "After DNS propagation (may take up to 48 hours), verify with:"
echo "  dig A $DOMAIN +short"
echo "  dig CNAME www.$DOMAIN +short"
echo "  curl -I https://$DOMAIN"
echo ""

# Step 6: Test current deployment
echo "🧪 Step 6: Testing Current Deployment"
echo "Current deployment is accessible at:"
echo "  $CURRENT_URL"
echo ""
echo "Testing current deployment..."
if curl -s --head "$CURRENT_URL" | head -1 | grep -q "200 OK"; then
    echo "✅ Current deployment is working!"
else
    echo "⚠️  Current deployment might have issues"
fi
echo ""

echo "✅ Domain configuration script completed!"
echo ""
echo "📝 Next Steps:"
echo "1. Add DNS records using the script or manually"
echo "2. Wait for DNS propagation (up to 48 hours)"
echo "3. Verify domain is working with curl/browser"
echo "4. Test all website functionality"
echo ""
echo "📞 Support: If you need help, check the documentation in:"
echo "  - DOMAIN_UPDATE_PLAN.md"
echo "  - HUONG_DAN_DNS_AUDIOTAILOC.md"