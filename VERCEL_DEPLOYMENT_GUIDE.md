# Vercel Deployment Troubleshooting Guide

## Issue: Admin Panel Not Opening on Vercel

### What We've Done ✅

1. **Created `vercel.json`** - Configures Vercel to properly handle client-side routing for SPA
2. **Removed `public/_redirects`** - Avoids conflicts with `vercel.json`
3. **Added `base: "/"` to vite.config.ts** - Ensures correct asset serving from root
4. **Verified Build** - Production build passes with no errors (npm run build)

### Root Causes & Solutions

#### 1. **Client-Side Routing Issue** (Most Likely)
**Problem:** Vercel was serving 404 for `/admin`, `/admin/auth`, etc. because it doesn't know how to handle these routes.

**Solution Applied:**
- Added `vercel.json` with route rules that redirect all non-static routes to `/index.html`
- This allows React Router to handle the route matching on the client side
- Added `_redirects` file as additional fallback




**How to Verify:**
```bash
# Build locally and test
npm run build
npm run preview
# Navigate to http://localhost:4173/admin - should work
```

#### 2. **Environment Variables Not Passed**
**Problem:** Vercel environment variables might not be properly set.

**Solution:**
On Vercel Dashboard:
1. Go to Project Settings → Environment Variables
2. Add these variables:
   ```
   VITE_SUPABASE_URL=https://unlrrrhslnpqpuwaixqt.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVubHJycmhzbG5wcXB1d2FpeHF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3OTE2MjMsImV4cCI6MjA3ODM2NzYyM30.bLLBxcm-p5R2pEopz1Phl7JD38MO1RHFSHIgMwDIbSs
   ```
3. Make sure these are available for "Production" and "Preview"
4. Re-deploy after adding variables

#### 3. **Base URL Configuration**
**Problem:** Assets might be served from wrong path.

**Solution Applied:**
- Set `base: "/"` in vite.config.ts
- This is correct for root domain deployment

#### 4. **Session Storage on Client Side**
**Problem:** SessionStorage works fine in browsers and persists during session.

**Note:** This is by design - when user closes browser tab, session is cleared (8-hour expiry also applied)

### Deployment Steps (Complete)

1. **Push code to Git:**
   ```bash
   git add .
   git commit -m "Fix: Add Vercel SPA routing configuration"
   git push origin main
   ```

2. **Vercel will auto-deploy**, OR manually trigger:
   - Go to Vercel Dashboard
   - Click "Deployments"
   - Click "Redeploy" on latest commit
   - OR connect GitHub for auto-deployments

3. **Test the deployment:**
   - Visit `https://your-domain.vercel.app/`
   - Click "Admin Login"
   - Enter password: `admin` (or your `VITE_ADMIN_PASSWORD`)
   - Should redirect to `/admin` dashboard

4. **If still not working:**
   - Check Vercel logs: Settings → Logs
   - Check browser console (F12) for errors
   - Verify environment variables are set in Vercel
   - Check that build completed successfully

### File Changes Made

#### `vercel.json` (NEW)
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "routes": [
    {
      "src": "^/(?!api|_next|static|favicon.ico|robots.txt|sitemap.xml).*",
      "dest": "/index.html",
      "status": 200
    }
  ],
  "env": {
    "VITE_SUPABASE_URL": "https://unlrrrhslnpqpuwaixqt.supabase.co",
    "VITE_SUPABASE_PUBLISHABLE_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVubHJycmhzbG5wcXB1d2FpeHF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3OTE2MjMsImV4cCI6MjA3ODM2NzYyM30.bLLBxcm-p5R2pEopz1Ph7JD38MO1RHFSHIgMwDIbSs"
  }
}
```

#### `public/_redirects` (REMOVED)
Removed to prevent conflicts with `vercel.json`.

#### `vite.config.ts` (UPDATED)
- Added `base: "/"` to ensure correct asset serving

### Testing Locally Before Deployment

```bash
# Build production bundle
npm run build

# Preview the production build locally
npm run preview

# Open browser to http://localhost:4173
# Test admin login at /admin route
```

### Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| 404 on /admin route | SPA routing not configured | vercel.json applied ✓ |
| 404 on /admin/classes | SPA routing not configured | vercel.json applied ✓ |
| Blank admin page | Missing components | All files present ✓ |
| Auth redirect loop | Session storage issue | SessionStorage works client-side ✓ |
| Missing styles | CSS not bundled | Build successful, CSS included ✓ |

### Rollback Plan

If deployment breaks:
1. Go to Vercel Dashboard
2. Click "Deployments"
3. Find the last working deployment
4. Click the menu (⋮) and select "Redeploy"

### Next Steps

1. **Push changes to production**
   ```bash
   git push origin main
   ```

2. **Wait for Vercel to deploy** (usually 1-2 minutes)

3. **Test in production:**
   - Visit your Vercel domain
   - Click "Admin Login"
   - Enter: `admin`
   - Verify all pages load (Dashboard, Classes, Programs, etc.)

4. **Monitor for errors:**
   - Check Vercel deployment logs
   - Check browser console (F12 → Console tab)
   - Check application tab for sessionStorage

### Contact Points

If issues persist after deployment:
1. Check Vercel deployment logs
2. Check browser DevTools console for JavaScript errors
3. Verify all admin pages exist in code
4. Confirm environment variables are set in Vercel

---

**Last Updated:** November 11, 2025
**Status:** Configuration applied, ready for deployment
