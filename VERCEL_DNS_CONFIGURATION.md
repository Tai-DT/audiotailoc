# Vercel DNS Configuration Guide

## Overview
This guide will help you add the DNS records for your domain using Vercel's DNS management tools.

## Required DNS Records

Based on your configuration, you need to add the following DNS records:

### A Records (IPv4 Address Records)
- **@** → 198.49.23.144
- **@** → 198.49.23.145  
- **@** → 198.185.159.145
- **@** → 198.185.159.144

### CNAME Record
- **www** → ext-sq.squarespace.com

### HTTPS Record
- **@** → 1 . alpn="h2,http/1.1" ipv4hint="198.185.159.144,198.185.159.145,198.49.23.144,198.49.23.145"

## Prerequisites

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Verify your domain is added to your Vercel project**:
   ```bash
   vercel domains ls
   ```

## Method 1: Using Vercel CLI (Recommended)

### Step 1: Add A Records

```bash
# Add first A record
vercel dns add [your-domain.com] @ A 198.49.23.144

# Add second A record  
vercel dns add [your-domain.com] @ A 198.49.23.145

# Add third A record
vercel dns add [your-domain.com] @ A 198.185.159.145

# Add fourth A record
vercel dns add [your-domain.com] @ A 198.185.159.144
```

### Step 2: Add CNAME Record

```bash
# Add CNAME record for www subdomain
vercel dns add [your-domain.com] www CNAME ext-sq.squarespace.com
```

### Step 3: Add HTTPS Record

```bash
# Add HTTPS record (Note: HTTPS records might need special formatting)
vercel dns add [your-domain.com] @ HTTPS '1 . alpn="h2,http/1.1" ipv4hint="198.185.159.144,198.185.159.145,198.49.23.144,198.49.23.145"'
```

## Method 2: Using Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to your project
3. Go to **Settings** → **Domains**
4. Click on your domain
5. Go to **DNS Records** section
6. Add each record manually:

   **For A Records:**
   - Type: A
   - Name: @
   - Value: [IP Address]
   - TTL: 4 hours (14400 seconds)

   **For CNAME Record:**
   - Type: CNAME
   - Name: www
   - Value: ext-sq.squarespace.com
   - TTL: 4 hours

   **For HTTPS Record:**
   - Type: HTTPS
   - Name: @
   - Value: 1 . alpn="h2,http/1.1" ipv4hint="198.185.159.144,198.185.159.145,198.49.23.144,198.49.23.145"
   - TTL: 4 hours

## Verification Commands

After adding the records, verify they are configured correctly:

```bash
# List all DNS records for your domain
vercel dns ls

# Check A records
dig A [your-domain.com] +short

# Check CNAME record  
dig CNAME www.[your-domain.com] +short

# Check HTTPS record
dig HTTPS [your-domain.com] +short

# Verify against Vercel nameservers
dig A [your-domain.com] +short @ns1.vercel-dns.com
```

## Important Notes

1. **Replace `[your-domain.com]`** with your actual domain name
2. **TTL**: All records use 4 hours TTL (14400 seconds)
3. **Propagation**: DNS changes may take up to 48 hours to propagate globally
4. **Multiple A Records**: Having multiple A records provides redundancy and load distribution
5. **HTTPS Records**: This is a newer DNS record type for HTTP service parameters

## Troubleshooting

### If records don't appear:
```bash
# Check current DNS configuration
vercel dns ls

# Verify domain is properly configured
vercel domains ls
```

### If propagation is slow:
```bash
# Check specific nameservers
dig A [your-domain.com] @8.8.8.8
dig A [your-domain.com] @1.1.1.1
```

### Remove incorrect records:
```bash
# List records to get record IDs
vercel dns ls

# Remove specific record by ID
vercel dns rm [record-id]
```

## Additional Resources

- [Vercel DNS Documentation](https://vercel.com/docs/cli/dns)
- [Vercel Domain Configuration](https://vercel.com/docs/domains)
- [DNS Troubleshooting Guide](https://vercel.com/docs/domains/troubleshooting)