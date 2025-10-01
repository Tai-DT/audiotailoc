#!/bin/bash

# DNS Verification Script for audiotailoc.com
DOMAIN="audiotailoc.com"

echo "🔍 Verifying DNS records for $DOMAIN"
echo "====================================="
echo ""

echo "📋 Current DNS records in Vercel:"
vercel dns ls
echo ""

echo "🌐 Checking A records:"
echo "----------------------"
dig A $DOMAIN +short
echo ""

echo "🔗 Checking CNAME record for www:"
echo "--------------------------------"
dig CNAME www.$DOMAIN +short
echo ""

echo "🔒 Checking HTTPS record:"
echo "------------------------"
dig HTTPS $DOMAIN +short
echo ""

echo "🔍 Checking against Vercel nameservers:"
echo "--------------------------------------"
dig A $DOMAIN +short @ns1.vercel-dns.com
dig A $DOMAIN +short @ns2.vercel-dns.com
echo ""

echo "🌎 Checking against public DNS servers:"
echo "--------------------------------------"
echo "Google DNS (8.8.8.8):"
dig A $DOMAIN +short @8.8.8.8

echo "Cloudflare DNS (1.1.1.1):"
dig A $DOMAIN +short @1.1.1.1
echo ""

echo "📊 DNS propagation status:"
echo "-------------------------"
echo "Expected A records:"
echo "- 198.49.23.144"
echo "- 198.49.23.145"
echo "- 198.185.159.145"
echo "- 198.185.159.144"
echo ""
echo "Expected CNAME: ext-sq.squarespace.com"
echo ""

# Check nameservers
echo "📡 Current nameservers:"
echo "----------------------"
dig NS $DOMAIN +short
echo ""

echo "✅ Verification complete!"
echo ""
echo "💡 Note: DNS propagation can take up to 48 hours globally"
echo "If records don't match expected values, wait and re-run this script"