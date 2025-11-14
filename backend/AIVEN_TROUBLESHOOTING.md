# Aiven PostgreSQL Connection Troubleshooting

## ❌ Current Problem
Cannot connect to Aiven PostgreSQL database.

### Error Details
```
Error: P1001: Can't reach database server at `pg-audio-tai-loc-kadev.b.aivencloud.com:26566`
DNS Error: Could not resolve host: pg-audio-tai-loc-kadev.b.aivencloud.com
```

## 🔍 Root Causes

### 1. DNS Resolution Failed
- Hostname cannot be resolved
- Possible reasons:
  - ❌ Service not created yet on Aiven
  - ❌ Incorrect hostname
  - ❌ DNS not propagated
  - ❌ Service is stopped/terminated

### 2. Network/Firewall Issues
- IP address not whitelisted on Aiven
- Local firewall blocking outbound connections
- Aiven service in different region

## ✅ Solutions to Try

### Step 1: Verify Aiven Service Status
1. Login to [Aiven Console](https://console.aiven.io/)
2. Navigate to your PostgreSQL service
3. Check service status (should be **Running**)
4. Copy the correct connection string from **Connection Information**

### Step 2: Check Connection Information
In Aiven Console, verify:
- ✅ **Host**: Should match `pg-audio-tai-loc-kadev.b.aivencloud.com`
- ✅ **Port**: Should be `26566`
- ✅ **Database**: `defaultdb`
- ✅ **User**: `avnadmin`
- ✅ **Password**: Check if matches your Aiven password from console

### Step 3: Add IP to Allowlist
1. In Aiven Console → Your Service → **Overview**
2. Find **Allowed IP Addresses** section
3. Click **Change**
4. Add your current IP address (or use `0.0.0.0/0` for testing)
5. Save changes

### Step 4: Test Connection
```bash
# Get your current IP
curl -s https://api.ipify.org

# Test DNS resolution
nslookup pg-audio-tai-loc-kadev.b.aivencloud.com

# Test PostgreSQL connection with psql
psql "postgres://avnadmin:YOUR_PASSWORD@pg-audio-tai-loc-kadev.b.aivencloud.com:26566/defaultdb?sslmode=require"
```

### Step 5: Update Connection String
If hostname changed, update `.env`:
```bash
DATABASE_URL="postgres://avnadmin:NEW_PASSWORD@CORRECT_HOSTNAME:26566/defaultdb?sslmode=require"
```

## 🔄 Temporary Solution: Use Local PostgreSQL

While waiting for Aiven setup:

```bash
# Start local PostgreSQL
brew services start postgresql@15

# Switch to local database in .env
DATABASE_URL="postgresql://macbook@localhost:5432/audiotailoc"
DIRECT_DATABASE_URL="postgresql://macbook@localhost:5432/audiotailoc"
POSTGRES_URL="postgresql://macbook@localhost:5432/audiotailoc"

# Restart backend
npm run start:dev
```

## 📋 Checklist Before Retrying

- [ ] Aiven service status is **Running**
- [ ] Hostname is correct and resolvable
- [ ] IP address is whitelisted
- [ ] Password is up to date
- [ ] Port 26566 is not blocked by firewall
- [ ] SSL mode is set to `require`

## 🎯 Next Steps

1. **Contact Aiven Support** if service exists but DNS fails
2. **Create new service** if none exists:
   - Go to Aiven Console
   - Create PostgreSQL service
   - Select plan and region (close to your location)
   - Wait for service to become ready (~5 minutes)
3. **Use Prisma Accelerate** (optional, for better performance):
   ```
   DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=YOUR_KEY"
   DIRECT_DATABASE_URL="postgres://avnadmin:...@pg-audio-tai-loc-kadev.b.aivencloud.com:26566/defaultdb?sslmode=require"
   ```

## 📞 Support Resources

- [Aiven Documentation](https://docs.aiven.io/)
- [Prisma Accelerate Docs](https://www.prisma.io/docs/accelerate)
- [Aiven Community Forum](https://aiven.io/community)
