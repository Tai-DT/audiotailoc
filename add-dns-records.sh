#!/bin/bash

# Vercel DNS Configuration Script for audiotailoc.com

DOMAIN="audiotailoc.com"

echo "🌐 Adding DNS records for domain: $DOMAIN"
echo "========================================"

echo "📍 Adding A Records..."
vercel dns add $DOMAIN @ A 198.49.23.144
vercel dns add $DOMAIN @ A 198.49.23.145
vercel dns add $DOMAIN @ A 198.185.159.145
vercel dns add $DOMAIN @ A 198.185.159.144

echo "🔗 Adding CNAME Record..."
vercel dns add $DOMAIN www CNAME ext-sq.squarespace.com

echo "🔒 Adding HTTPS Record..."
vercel dns add $DOMAIN @ HTTPS '1 . alpn="h2,http/1.1" ipv4hint="198.185.159.144,198.185.159.145,198.49.23.144,198.49.23.145"'

echo "✅ DNS Records Addition Complete!"
echo ""
echo "📋 Listing all DNS records for verification:"
vercel dns ls

echo ""
echo "🔍 Verification commands (run manually after propagation):"
echo "dig A $DOMAIN +short"
echo "dig CNAME www.$DOMAIN +short"
echo "dig HTTPS $DOMAIN +short"