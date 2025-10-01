#!/bin/bash

# DNS Setup for audiotailoc.com using Vercel CLI - Squarespace Defaults
# This script configures DNS records using Vercel MCP with Squarespace default settings

set -e

echo "🌐 Setting up DNS for audiotailoc.com with Squarespace defaults..."

# Team and Project Configuration
TEAM_ID="team_q3xRkP0dEB5IaZ9C3JubQJnA"
PROJECT_ID="prj_N00xKZ0Ru20o4P2ykf8Vkz0YjJt4"
DOMAIN="audiotailoc.com"

echo "📋 Team: Kadev's projects"
echo "📋 Project: audiotailoc-frontend"
echo "📋 Domain: $DOMAIN"
echo ""

# Check if domain is already added to project
echo "🔍 Checking domain status..."
vercel domains ls --scope=kadevs-projects | grep -q "$DOMAIN" && echo "✅ Domain already added to project" || echo "⚠️  Domain not found in project"

echo ""
echo "🚀 Adding DNS records with Squarespace defaults..."

# A Records - Squarespace IPs with 4 hour TTL (14400 seconds)
echo "📌 Adding A records..."
vercel dns add $DOMAIN @ A 198.185.159.145 --scope=kadevs-projects --ttl=14400 || echo "⚠️  A record 198.185.159.145 may already exist"
vercel dns add $DOMAIN @ A 198.49.23.145 --scope=kadevs-projects --ttl=14400 || echo "⚠️  A record 198.49.23.145 may already exist"
vercel dns add $DOMAIN @ A 198.49.23.144 --scope=kadevs-projects --ttl=14400 || echo "⚠️  A record 198.49.23.144 may already exist"
vercel dns add $DOMAIN @ A 198.185.159.144 --scope=kadevs-projects --ttl=14400 || echo "⚠️  A record 198.185.159.144 may already exist"

# CNAME Record - www subdomain
echo "📌 Adding CNAME record..."
vercel dns add $DOMAIN www CNAME ext-sq.squarespace.com --scope=kadevs-projects --ttl=14400 || echo "⚠️  CNAME record may already exist"

# HTTPS Record - HTTPS service binding
echo "📌 Adding HTTPS record..."
vercel dns add $DOMAIN @ HTTPS "1 . alpn=\"h2,http/1.1\" ipv4hint=\"198.185.159.144,198.185.159.145,198.49.23.144,198.49.23.145\"" --scope=kadevs-projects --ttl=14400 || echo "⚠️  HTTPS record may already exist"

echo ""
echo "✅ DNS configuration completed!"

echo ""
echo "🔍 Verifying DNS records..."
vercel dns ls $DOMAIN --scope=kadevs-projects

echo ""
echo "📋 DNS Configuration Summary:"
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                        DNS RECORDS                           ║"
echo "╠═══════════════════════════════════════════════════════════════╣"
echo "║ HOST │ TYPE  │ PRIORITY │ TTL   │ DATA                        ║"
echo "╠═══════════════════════════════════════════════════════════════╣"
echo "║ @    │ A     │ 0        │ 4 hrs │ 198.185.159.145             ║"
echo "║ @    │ A     │ 0        │ 4 hrs │ 198.49.23.145               ║"
echo "║ @    │ A     │ 0        │ 4 hrs │ 198.49.23.144               ║"
echo "║ @    │ A     │ 0        │ 4 hrs │ 198.185.159.144             ║"
echo "║ www  │ CNAME │ 0        │ 4 hrs │ ext-sq.squarespace.com      ║"
echo "║ @    │ HTTPS │ 0        │ 4 hrs │ 1 . alpn=... ipv4hint=...   ║"
echo "╚═══════════════════════════════════════════════════════════════╝"

echo ""
echo "⏳ DNS propagation may take up to 48 hours"
echo "🔍 Check propagation status: dig A $DOMAIN +short"
echo "🌐 Test website: https://$DOMAIN"
echo ""
echo "🎉 DNS setup complete with Squarespace defaults!"