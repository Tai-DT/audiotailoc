# Audio Tài Lộc Backend - Heroku Deployment Guide

## Prerequisites
- Heroku account
- GitHub repository connected
- Database (PostgreSQL) and Redis instances
- Payment gateway credentials (PayOS)
- Cloud storage (Cloudinary)

## Deployment Steps

### 1. Create Heroku App
1. Go to [Heroku Dashboard](https://dashboard.heroku.com/apps)
2. Click "New" → "Create new app"
3. App name: `audiotailoc-backend`
4. Choose your region

### 2. Connect to GitHub
1. Go to your app's "Deploy" tab
2. Connect to GitHub
3. Search for repository: `Tai-DT/audiotailoc`
4. Connect the repository

### 3. Configure Deployment
1. **Deployment Method**: Enable "Automatic deploys" from `master` branch
2. **App connected to GitHub**: ✅
3. **Automatic deploys**: ✅

### 4. Environment Variables
Go to "Settings" → "Config Vars" and add:

```bash
DATABASE_URL=postgresql://username:password@host:port/database
JWT_ACCESS_SECRET=your-super-secure-jwt-secret-here
JWT_REFRESH_SECRET=your-super-secure-refresh-secret-here
REDIS_URL=rediss://username:password@host:port
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
PAYOS_CLIENT_ID=your-payos-client-id
PAYOS_API_KEY=your-payos-api-key
PAYOS_CHECKSUM_KEY=your-payos-checksum-key
NODE_ENV=production
PORT=4000
```

### 5. Database Setup
1. Ensure your PostgreSQL database is accessible from Heroku
2. Run database migrations on deployment
3. Seed initial data if needed

### 6. Deploy
1. Push changes to GitHub `master` branch
2. Heroku will automatically deploy
3. Monitor deployment logs in Heroku dashboard

## Post-Deployment Checklist
- [ ] App is running on Heroku
- [ ] Database connection is working
- [ ] API endpoints are accessible
- [ ] Swagger documentation is available
- [ ] Environment variables are set correctly
- [ ] SSL certificate is active
- [ ] Domain is configured (if custom domain)

## Troubleshooting
- Check Heroku logs: `heroku logs --tail -a audiotailoc-backend`
- Verify environment variables
- Ensure database connectivity
- Check build logs for compilation errors

## API Documentation
Once deployed, API documentation will be available at:
`https://audiotailoc-backend.herokuapp.com/api/docs`

## Health Check
Health endpoint: `https://audiotailoc-backend.herokuapp.com/health`
