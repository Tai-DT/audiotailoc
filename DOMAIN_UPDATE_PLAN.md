# Domain Configuration Update Script

## Current Deployment URLs

### ✅ Latest Deployment (READY)
- **URL**: `https://audiotailoc-frontend-3fe8i3jy6-kadevs-projects.vercel.app`
- **Status**: READY
- **Commit**: Update frontend dependencies and fix vercel config
- **Date**: October 1, 2025

### 🎯 Target Custom Domain
- **Custom Domain**: `audiotailoc.com`
- **DNS**: Needs configuration with Squarespace IPs

## Configuration Update Plan

### 1. DNS Records for Custom Domain
```bash
# A Records pointing to Squarespace
@ A 198.49.23.144
@ A 198.49.23.145  
@ A 198.185.159.145
@ A 198.185.159.144

# CNAME for www
www CNAME ext-sq.squarespace.com

# HTTPS record
@ HTTPS 1 . alpn="h2,http/1.1" ipv4hint="198.185.159.144,198.185.159.145,198.49.23.144,198.49.23.145"
```

### 2. Environment Variables Update
```env
# Update these in .env.local
NEXT_PUBLIC_APP_URL=https://audiotailoc.com
PAYOS_RETURN_URL=https://audiotailoc.com/order-success
PAYOS_CANCEL_URL=https://audiotailoc.com/checkout
PAYOS_WEBHOOK_URL=https://audiotailoc.com/api/webhook/payos
```

### 3. Vercel Project Domain Configuration
```bash
# Add custom domain to Vercel project
vercel domains add audiotailoc.com --scope=team_q3xRkP0dEB5IaZ9C3JubQJnA
```

## Implementation Steps

1. **Add domain to Vercel project**
2. **Configure DNS records** 
3. **Update environment variables**
4. **Test domain configuration**
5. **Verify SSL certificate**