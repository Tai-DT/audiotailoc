# Troubleshooting Guide - Audio Tài Lộc Backend

## Quick Links

- [Common Issues](#common-issues)
- [Installation Problems](#installation-problems)
- [Development Issues](#development-issues)
- [Database Problems](#database-problems)
- [Authentication Issues](#authentication-issues)
- [API Issues](#api-issues)
- [Performance Issues](#performance-issues)
- [Deployment Issues](#deployment-issues)
- [Getting Help](#getting-help)

---

## Common Issues

### Issue: Cannot Connect to Database

**Symptoms:**
```
Error: Connection timeout
Error: ECONNREFUSED
Error: getaddrinfo ENOTFOUND
```

**Solutions:**

1. **Check Database URL**
   ```bash
   # Verify DATABASE_URL is set
   echo $DATABASE_URL

   # Test connection locally
   psql -h localhost -U postgres -d audiotailoc -c "SELECT 1;"
   ```

2. **For Aiven Cloud Database**
   ```bash
   # Verify credentials in .env
   # Check Aiven console for host/port
   # Ensure IP is whitelisted
   # Check SSL mode is set to 'require'
   ```

3. **Prisma Connection**
   ```bash
   # Reset Prisma client
   npx prisma generate

   # Check connection string format
   # Should be: postgresql://user:password@host:port/database
   # Or: prisma://accelerate.prisma-data.net/?api_key=...
   ```

4. **Network Issues**
   ```bash
   # Test network connectivity
   ping pg-audio-tai-loc-kadev.b.aivencloud.com

   # Test port connectivity
   nc -zv host port
   ```

### Issue: JWT Token Not Working

**Symptoms:**
```
401 Unauthorized: Invalid token
401 Unauthorized: Token expired
403 Forbidden: Insufficient permissions
```

**Solutions:**

1. **Verify Token Format**
   ```bash
   # Check Authorization header
   Authorization: Bearer <token_without_Bearer>

   # Decode token at jwt.io
   # Verify 'sub' and 'role' claims
   ```

2. **Check Secrets**
   ```bash
   # Verify JWT secrets in .env
   echo $JWT_ACCESS_SECRET
   echo $JWT_REFRESH_SECRET

   # Secrets must be at least 32 characters
   # Must be different between access and refresh
   ```

3. **Token Expiration**
   ```bash
   # Check token expiry time in Swagger
   # Access tokens: 15 minutes
   # Refresh tokens: 7 days
   # Use refresh endpoint to get new access token
   ```

4. **Header Configuration**
   ```bash
   # Ensure header is exactly: Authorization: Bearer <token>
   # Case-sensitive
   # No extra spaces
   ```

### Issue: Validation Errors

**Symptoms:**
```json
{
  "statusCode": 422,
  "message": "Validation failed",
  "errors": ["email: must be an email"]
}
```

**Solutions:**

1. **Check DTO Validators**
   ```typescript
   // Verify @IsEmail(), @IsNotEmpty() decorators
   // Check @ValidateIf() conditions
   // Verify regex patterns
   ```

2. **Review Request Body**
   ```bash
   # Ensure JSON is valid
   # Check field names match DTO
   # Verify field types match
   # Check required vs optional fields
   ```

3. **Custom Validation**
   ```bash
   # Check custom validators are registered
   # Verify validator logic
   # Check error messages
   ```

---

## Installation Problems

### Issue: npm install Fails

**Symptoms:**
```
npm ERR! code E404
npm ERR! 404 Not Found
npm ERR! npm notice it probably means you are offline
```

**Solutions:**

1. **Check Internet Connection**
   ```bash
   ping 8.8.8.8
   curl https://registry.npmjs.org
   ```

2. **Clear npm Cache**
   ```bash
   npm cache clean --force
   npm install
   ```

3. **Use npm Audit Fix**
   ```bash
   npm audit fix --force
   npm install
   ```

4. **Reinstall node_modules**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### Issue: Prisma Generate Fails

**Symptoms:**
```
Error: Failed to infer the output location
Error: Can't find index entry
```

**Solutions:**

1. **Validate Schema**
   ```bash
   npx prisma validate

   # Check for syntax errors in schema.prisma
   # Verify all relations are properly defined
   ```

2. **Regenerate Client**
   ```bash
   rm -rf node_modules/.prisma
   npx prisma generate
   ```

3. **Check Node Version**
   ```bash
   node --version  # Should be 20.x or higher
   npm --version   # Should be 10.x or higher
   ```

---

## Development Issues

### Issue: Hot Reload Not Working

**Symptoms:**
```
Changes not reflected when server is running
Have to manually restart server
```

**Solutions:**

1. **Verify Watch Mode**
   ```bash
   npm run dev
   # Should show "Waiting for file changes before restart"
   ```

2. **Check File Watching**
   ```bash
   # Increase file watchers on Linux
   echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
   sudo sysctl -p
   ```

3. **Restart Server**
   ```bash
   # Kill running process
   lsof -i :3010
   kill -9 <PID>

   # Restart
   npm run dev
   ```

### Issue: TypeScript Compilation Errors

**Symptoms:**
```
TS1005: ',' expected
TS2322: Type 'X' is not assignable to type 'Y'
TS7006: Parameter 'x' implicitly has an 'any' type
```

**Solutions:**

1. **Run Type Check**
   ```bash
   npm run typecheck
   # Identifies all type errors
   ```

2. **Strict Mode**
   ```bash
   npm run typecheck:full
   # Enables strict mode checking
   ```

3. **Fix Common Issues**
   ```typescript
   // Add type annotations
   const user: User = { ... };

   // Use optional chaining
   user?.name

   // Use nullish coalescing
   user?.age ?? 0
   ```

### Issue: Linting Errors

**Symptoms:**
```
✖ 5 problems (5 errors, 0 warnings)
Expected indentation of 2 spaces but found 4
```

**Solutions:**

1. **Auto-fix Linting**
   ```bash
   npm run lint:fix
   # Automatically fixes common issues
   ```

2. **Format Code**
   ```bash
   npm run format
   # Formats with Prettier
   ```

3. **Check Configuration**
   ```bash
   # Review .eslintrc.js
   # Review .prettierrc
   # Ensure editor integration (VS Code)
   ```

---

## Database Problems

### Issue: Migration Fails

**Symptoms:**
```
Migration pending
Can't connect to migrate engine
Replica lag too high
```

**Solutions:**

1. **Check Migration Status**
   ```bash
   npm run prisma:migrate:status
   # Shows pending migrations
   ```

2. **Resolve Failed Migrations**
   ```bash
   npm run prisma:migrate:resolve -- --rolled-back migration_name
   # Marks migration as rolled back
   ```

3. **Create New Migration**
   ```bash
   # Edit schema.prisma
   npm run prisma:migrate:dev -- --name fix_issue
   ```

4. **For Production**
   ```bash
   npm run prisma:migrate:prod
   # Requires explicit approval
   ```

### Issue: Prisma Studio Not Starting

**Symptoms:**
```
Error: connect ECONNREFUSED 127.0.0.1:5555
Error: WebSocket error
```

**Solutions:**

1. **Restart Studio**
   ```bash
   npx prisma studio
   # Clear browser cache
   ```

2. **Check Database Access**
   ```bash
   npx prisma db push
   # Syncs schema to database
   ```

3. **Use Direct URL**
   ```bash
   # Studio uses DIRECT_DATABASE_URL
   # Verify it's set correctly
   echo $DIRECT_DATABASE_URL
   ```

### Issue: N+1 Query Problem

**Symptoms:**
```
Slow API responses
High database query count
Timeout errors
```

**Solutions:**

1. **Use include() in Prisma**
   ```typescript
   // Instead of:
   const user = await prisma.user.findUnique({ where: { id } });
   user.orders = await prisma.order.findMany({ where: { userId } });

   // Use:
   const user = await prisma.user.findUnique({
     where: { id },
     include: { orders: true }
   });
   ```

2. **Use select() for Specific Fields**
   ```typescript
   const users = await prisma.user.findMany({
     select: {
       id: true,
       name: true,
       orders: {
         select: { id: true, total: true }
       }
     }
   });
   ```

3. **Enable Query Logging**
   ```env
   # In .env
   DEBUG=prisma:*
   ```

---

## Authentication Issues

### Issue: Cannot Login

**Symptoms:**
```json
{
  "statusCode": 401,
  "message": "Invalid credentials"
}
```

**Solutions:**

1. **Verify User Exists**
   ```bash
   npx prisma studio
   # Check users table for email
   ```

2. **Check Password**
   ```bash
   # Password must be at least 8 characters
   # Must contain: uppercase, lowercase, number, special char
   # Test with simple password first
   ```

3. **Check Account Status**
   ```bash
   # Verify user is not deleted
   # Check role is correct
   ```

### Issue: Token Refresh Fails

**Symptoms:**
```json
{
  "statusCode": 401,
  "message": "Invalid refresh token"
}
```

**Solutions:**

1. **Verify Refresh Token**
   ```bash
   # Refresh token should be in secure HTTP-only cookie
   # Or provided in request body
   ```

2. **Check Token Expiry**
   ```bash
   # Refresh tokens expire after 7 days
   # Need to login again after expiry
   ```

3. **Verify Secrets**
   ```bash
   # JWT_REFRESH_SECRET must be set
   # Must match token signing secret
   ```

### Issue: Password Reset Not Working

**Symptoms:**
```
Email not sent
Reset link invalid
New password not saved
```

**Solutions:**

1. **Check Email Configuration**
   ```bash
   # Verify SMTP credentials
   echo $SMTP_HOST
   echo $SMTP_USER

   # Test email sending manually
   ```

2. **Check Reset Token**
   ```bash
   # Verify token generation
   # Check token expiry
   # Verify reset endpoint
   ```

---

## API Issues

### Issue: CORS Errors

**Symptoms:**
```
Access to XMLHttpRequest blocked by CORS policy
Preflight request failed
Response to preflight is not OK
```

**Solutions:**

1. **Configure CORS**
   ```env
   # In .env
   CORS_ORIGINS="http://localhost:3000,http://localhost:3001"
   ```

2. **Check Allowed Origins**
   ```bash
   # Origin must be in whitelist
   # Check browser console for blocked origin
   ```

3. **Verify Headers**
   ```bash
   # Check allowed headers in CORS config
   # Ensure Content-Type is allowed
   # Ensure Authorization is allowed
   ```

4. **Check Request Method**
   ```bash
   # Verify method is in allowed methods
   # GET, POST, PUT, DELETE, PATCH, OPTIONS
   ```

### Issue: 404 Not Found

**Symptoms:**
```json
{
  "statusCode": 404,
  "message": "Cannot POST /api/v1/products/xyz"
}
```

**Solutions:**

1. **Verify Endpoint Path**
   ```bash
   # Check swagger docs at /docs
   # Verify correct URL and method
   # Check for typos
   ```

2. **Check Module Registration**
   ```bash
   # Verify module is imported in app.module.ts
   # Check controller is registered in module
   # Check route path is correct
   ```

3. **Check Global Prefix**
   ```bash
   # All routes prefixed with /api/v1
   # Swagger shows full paths
   ```

### Issue: 500 Internal Server Error

**Symptoms:**
```json
{
  "statusCode": 500,
  "message": "Internal Server Error"
}
```

**Solutions:**

1. **Check Server Logs**
   ```bash
   # Look at console output
   # Check application logs
   # Enable debug logging
   ```

2. **Enable Debug Mode**
   ```bash
   DEBUG=* npm run dev
   # Shows detailed error traces
   ```

3. **Check Error Filter**
   ```bash
   # Exception is caught by global filter
   # Check exception type
   # Verify error message
   ```

4. **Check Service Methods**
   ```typescript
   // Verify all async methods return promises
   // Check for unhandled exceptions
   // Verify database queries work
   ```

---

## Performance Issues

### Issue: Slow API Response

**Symptoms:**
```
Response time > 500ms
Timeouts
User complaints about slowness
```

**Solutions:**

1. **Profile Request**
   ```bash
   # Check Swagger response time
   # Use browser DevTools Network tab
   # Check server logs for duration
   ```

2. **Identify Bottleneck**
   ```bash
   # Database slow?
   #   - Check indexes
   #   - Check query plan
   #   - Add caching

   # External service slow?
   #   - Add timeout
   #   - Add retry logic
   #   - Cache response

   # Code slow?
   #   - Profile with 0x
   #   - Check algorithm complexity
   #   - Optimize loops
   ```

3. **Enable Caching**
   ```typescript
   // Cache frequently accessed data
   const cached = await this.cache.get(`key:${id}`);
   if (cached) return cached;

   const data = await this.getFromDB(id);
   await this.cache.set(`key:${id}`, data, 3600000);
   return data;
   ```

4. **Add Indexes**
   ```sql
   CREATE INDEX idx_featured ON products(featured);
   CREATE INDEX idx_created_at ON orders(created_at DESC);
   ```

### Issue: High Memory Usage

**Symptoms:**
```
Process using 500MB+
Out of memory errors
Slow server response
```

**Solutions:**

1. **Check Memory Leaks**
   ```bash
   # Use Node profiler
   node --inspect=9229 dist/main.js
   # Open chrome://inspect in Chrome
   ```

2. **Monitor Heap**
   ```bash
   # Check heap size
   node --max-old-space-size=2048 dist/main.js
   ```

3. **Optimize Queries**
   ```typescript
   // Avoid loading all data
   const items = await prisma.item.findMany({
     take: 100,  // Paginate
     select: {   // Only needed fields
       id: true,
       name: true
     }
   });
   ```

4. **Clear Caches**
   ```bash
   # Clear Redis cache
   redis-cli FLUSHALL
   ```

### Issue: High CPU Usage

**Symptoms:**
```
CPU constantly at 100%
Server becomes unresponsive
```

**Solutions:**

1. **Profile CPU Usage**
   ```bash
   # Use clinic.js
   npm install -g clinic
   clinic doctor -- node dist/main.js
   ```

2. **Check Event Loop**
   ```bash
   # Long-running synchronous operations block event loop
   # Use async/await for I/O
   # Offload heavy computation
   ```

3. **Optimize Algorithms**
   ```typescript
   // Check for inefficient loops
   // Sort/filter at database level
   // Use pagination
   ```

---

## Deployment Issues

### Issue: Deployment Fails

**Symptoms:**
```
Build failed
Container won't start
Database migration failed
```

**Solutions:**

1. **Check Build Logs**
   ```bash
   # Vercel: Check deployment logs
   # Docker: docker build --verbose
   # AWS: Check CodeBuild logs
   ```

2. **Verify Environment Variables**
   ```bash
   # All required env vars set?
   # Check for typos in names
   # Verify values are correct
   ```

3. **Check Database Migrations**
   ```bash
   # Migrations run during deployment?
   # Check migration status
   # Verify schema matches
   ```

### Issue: Application Won't Start

**Symptoms:**
```
Container exits immediately
No logs
Port already in use
```

**Solutions:**

1. **Check Port**
   ```bash
   lsof -i :3010
   # Kill if needed
   kill -9 <PID>
   ```

2. **Check Environment**
   ```bash
   # All required env vars?
   # DATABASE_URL set?
   # JWT_ACCESS_SECRET set?
   ```

3. **Check Logs**
   ```bash
   # Docker: docker logs container_name
   # ECS: CloudWatch logs
   # Vercel: Deployment logs
   ```

### Issue: Database Migration Timeout

**Symptoms:**
```
Migration timeout after 2 hours
Replica lag error
Connection pool full
```

**Solutions:**

1. **Increase Timeout**
   ```bash
   # For large migrations
   DATABASE_STATEMENT_TIMEOUT=600000 npm run migrate
   ```

2. **Run During Maintenance Window**
   ```bash
   # Schedule large migrations for off-peak
   # Notify users of downtime
   # Have rollback plan
   ```

3. **Check Replica Lag**
   ```bash
   # For AWS RDS
   aws rds describe-db-instances \
     --db-instance-identifier audiotailoc-postgres
   # Check ReplicationLag
   ```

---

## Redis Issues

### Issue: Redis Connection Failed

**Symptoms:**
```
Error: connect ECONNREFUSED
Error: Cannot authenticate
```

**Solutions:**

1. **Verify Redis URL**
   ```bash
   echo $REDIS_URL
   # Should be: redis://username:password@host:port
   # Or: rediss://... (with SSL)
   ```

2. **Test Connection**
   ```bash
   redis-cli -u $REDIS_URL ping
   # Should respond with PONG
   ```

3. **Check Network**
   ```bash
   # Verify host is reachable
   ping upstash.io
   # Check security groups/firewall
   ```

### Issue: Cache Not Working

**Symptoms:**
```
Cache misses on every request
Cache-set returns error
```

**Solutions:**

1. **Verify Cache Module**
   ```bash
   # Check CacheModule is imported
   # Verify cache service is injected
   # Test cache operations
   ```

2. **Check Key Format**
   ```typescript
   // Keys should be strings
   const key = `product:${id}`;
   await this.cache.get(key);
   ```

3. **Check TTL**
   ```typescript
   // Third parameter is TTL in milliseconds
   await this.cache.set(key, data, 3600000); // 1 hour
   ```

---

## Getting Help

### Debug Information to Provide

When reporting an issue, include:

1. **Environment Information**
   ```bash
   node --version
   npm --version
   npm ls nestjs
   npm ls @nestjs/core
   ```

2. **Error Message and Stack Trace**
   ```bash
   # Copy full error message
   # Include stack trace
   # Note when error occurs
   ```

3. **Reproduction Steps**
   ```bash
   # Exact steps to reproduce
   # Example: POST to endpoint X with payload Y
   # Expected vs actual behavior
   ```

4. **Relevant Logs**
   ```bash
   # Application logs
   # Database logs if applicable
   # Network request/response
   ```

5. **Environment Configuration**
   ```bash
   # NODE_ENV value
   # Database type and version
   # Redis configuration
   # Package versions
   ```

### Resources

- **Documentation:** `/docs` folder in repository
- **API Docs:** http://localhost:3010/docs
- **GitHub Issues:** [Project Repository]
- **Slack Channel:** #backend-support
- **Email:** support@audiotailoc.vn

### Common Commands

```bash
# Check application status
npm run typecheck

# Run tests
npm run test

# Check linting
npm run lint

# Format code
npm run format

# Database management
npx prisma studio
npx prisma migrate status
npx prisma validate

# Clear caches
redis-cli FLUSHALL
npm run cache:clear

# Generate documentation
npm run generate-docs

# Check performance
npm run start:debug
```

### Emergency Procedures

**If application is down in production:**

1. Check recent changes
2. Review error logs
3. Attempt rollback if recent deployment
4. Notify stakeholders
5. Document incident
6. Post-mortem meeting after resolution

**If database is inaccessible:**

1. Check connection string
2. Verify network connectivity
3. Check database service status
4. Restore from backup if needed
5. Run migrations again

**If experiencing data corruption:**

1. Immediately stop writing
2. Create database backup
3. Assess damage scope
4. Restore from clean backup
5. Implement safeguards
6. Contact data recovery service if needed

---

## Frequently Asked Questions

**Q: How do I enable/disable a feature?**
A: Use environment variables (FEATURE_* flags) or the database config table.

**Q: How do I reset the database?**
A: `npx prisma migrate reset` (destroys and recreates all data - dev only!)

**Q: How do I seed test data?**
A: `npm run seed` to run seed scripts in `src/seed*.ts`

**Q: How do I debug a specific endpoint?**
A: Add `console.log()` or use VS Code debugger with launch configuration.

**Q: Where are logs stored?**
A: Console (real-time) and `/var/log/audiotailoc/` (files) or CloudWatch (production).

**Q: How do I check what version is running?**
A: Check `package.json` version and git commit hash in response headers.

**Q: How do I monitor API usage?**
A: Use analytics dashboard or check request logs in CloudWatch.

**Q: How do I backup the database manually?**
A: `pg_dump ... > backup.sql && gzip backup.sql && aws s3 cp backup.sql.gz s3://bucket/`

---

**Last Updated:** November 2024
**Maintainer:** Development Team
**Status:** Active
