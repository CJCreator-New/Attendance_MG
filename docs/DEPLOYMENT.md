# Deployment Guide

## Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Appwrite collections created
- [ ] Security permissions set
- [ ] Build succeeds locally
- [ ] Performance tested
- [ ] Security audit completed

---

## Appwrite Setup

### 1. Create Project
1. Login to Appwrite Console
2. Create new project
3. Note Project ID

### 2. Create Database
```bash
appwrite databases create --databaseId attendance-db --name "Attendance DB"
```

### 3. Create Collections
```bash
bash setup-phase7-collections.sh
```

### 4. Set Permissions
```bash
bash update-permissions.sh
```

### 5. Create Storage Bucket
```bash
appwrite storage createBucket \
  --bucketId employee-files \
  --name "Employee Files" \
  --permissions 'read("users")' 'create("users")' 'update("users")' 'delete("users")'
```

---

## Build Application

### Production Build
```bash
npm run build
```

Output: `dist/` folder

### Test Build Locally
```bash
npm run preview
```

---

## Deploy to Vercel

### Method 1: CLI
```bash
npm install -g vercel
vercel login
vercel deploy --prod
```

### Method 2: GitHub Integration
1. Push code to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy

### Environment Variables
```
VITE_APPWRITE_ENDPOINT=https://sgp.cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your-project-id
VITE_APPWRITE_DATABASE_ID=attendance-db
```

---

## Deploy to Netlify

### Method 1: CLI
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=dist
```

### Method 2: Drag & Drop
1. Build project: `npm run build`
2. Go to Netlify dashboard
3. Drag `dist/` folder
4. Configure environment variables

### Build Settings
- Build command: `npm run build`
- Publish directory: `dist`

---

## Deploy to AWS S3 + CloudFront

### 1. Create S3 Bucket
```bash
aws s3 mb s3://attendance-app
aws s3 website s3://attendance-app --index-document index.html
```

### 2. Upload Build
```bash
npm run build
aws s3 sync dist/ s3://attendance-app --delete
```

### 3. Create CloudFront Distribution
```bash
aws cloudfront create-distribution \
  --origin-domain-name attendance-app.s3.amazonaws.com \
  --default-root-object index.html
```

### 4. Configure DNS
Point domain to CloudFront distribution

---

## Deploy to Docker

### Dockerfile
```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### nginx.conf
```nginx
server {
  listen 80;
  location / {
    root /usr/share/nginx/html;
    try_files $uri $uri/ /index.html;
  }
}
```

### Build & Run
```bash
docker build -t attendance-app .
docker run -p 80:80 attendance-app
```

---

## Environment-Specific Configs

### Development
```env
VITE_APPWRITE_ENDPOINT=http://localhost/v1
VITE_APPWRITE_PROJECT_ID=dev-project
```

### Staging
```env
VITE_APPWRITE_ENDPOINT=https://staging.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=staging-project
```

### Production
```env
VITE_APPWRITE_ENDPOINT=https://sgp.cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=prod-project
```

---

## SSL/HTTPS Setup

### Vercel/Netlify
- Automatic SSL (Let's Encrypt)
- Custom domain support

### AWS CloudFront
```bash
aws acm request-certificate --domain-name attendance.company.com
```

### Nginx
```bash
certbot --nginx -d attendance.company.com
```

---

## Monitoring

### Sentry (Error Tracking)
```bash
npm install @sentry/react
```

```javascript
// main.jsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: "production"
});
```

### Google Analytics
```javascript
// index.html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
```

---

## Performance Optimization

### Enable Compression
```nginx
gzip on;
gzip_types text/css application/javascript;
```

### Cache Static Assets
```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico)$ {
  expires 1y;
  add_header Cache-Control "public, immutable";
}
```

### CDN Configuration
- Use CloudFront/Cloudflare
- Enable caching
- Set appropriate TTLs

---

## Backup Strategy

### Database Backup
```bash
# Export collections
appwrite databases listDocuments --databaseId attendance-db --collectionId employees > backup.json
```

### Automated Backups
- Schedule daily backups
- Store in S3/Cloud Storage
- Test restore process

---

## Rollback Plan

### Vercel
```bash
vercel rollback
```

### Netlify
- Go to Deploys
- Click "Publish deploy" on previous version

### Manual
```bash
git revert HEAD
git push
# Redeploy
```

---

## Health Checks

### Endpoint
```javascript
// src/health.js
export const healthCheck = async () => {
  try {
    await databases.listDocuments(DATABASE_ID, 'employees', [Query.limit(1)]);
    return { status: 'healthy' };
  } catch (error) {
    return { status: 'unhealthy', error: error.message };
  }
};
```

### Monitoring
- Set up uptime monitoring (UptimeRobot, Pingdom)
- Alert on downtime
- Monitor response times

---

## Security Hardening

### Content Security Policy
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';">
```

### CORS Configuration
Already handled by Appwrite

### Rate Limiting
Already implemented in services

---

## Post-Deployment

### 1. Verify Deployment
- [ ] Application loads
- [ ] Login works
- [ ] All features functional
- [ ] No console errors

### 2. Performance Check
- [ ] Lighthouse score > 90
- [ ] Load time < 3s
- [ ] No memory leaks

### 3. Security Check
- [ ] HTTPS enabled
- [ ] CSP headers set
- [ ] No exposed secrets

### 4. Monitoring Setup
- [ ] Error tracking active
- [ ] Analytics configured
- [ ] Uptime monitoring enabled

---

## Troubleshooting

### Build Fails
- Check Node version
- Clear node_modules
- Verify environment variables

### 404 on Refresh
- Configure SPA routing
- Add `_redirects` (Netlify) or `vercel.json`

### API Errors
- Verify Appwrite endpoint
- Check project ID
- Confirm permissions

---

## Support

For deployment issues:
- Check logs in hosting platform
- Review Appwrite console
- Contact DevOps team
