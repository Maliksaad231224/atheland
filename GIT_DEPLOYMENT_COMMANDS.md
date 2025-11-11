# Git Commands - Step by Step

## Copy & Paste Ready

### Step 1: Check Status
```bash
git status
```

Expected output (you should see the new files):
```
On branch main
Changes not staged for commit:
  modified:   vite.config.ts

Untracked files:
  vercel.json
  public/_redirects
  
(and documentation files)
```

### Step 2: Add All Changes
```bash
git add .
```

Or add specifically:
```bash
git add vercel.json public/_redirects vite.config.ts
```

### Step 3: Verify Changes
```bash
git status
```

Should show all files ready to commit:
```
Changes to be committed:
  new file:   vercel.json
  new file:   public/_redirects
  modified:   vite.config.ts
```

### Step 4: Commit with Message
```bash
git commit -m "Fix: Add Vercel SPA routing configuration for admin panel

- Add vercel.json with route rules for client-side routing
- Add public/_redirects fallback routing rule
- Update vite.config.ts with base path
- Fixes 404 errors when accessing /admin routes on Vercel"
```

### Step 5: Push to GitHub
```bash
git push origin main
```

Wait for confirmation:
```
Enumerating objects: 5, done.
Counting objects: 100% (5/5), done.
Delta compression using up to 12 threads
Compressing objects: 100% (3/3), done.
Writing objects: 100% (3/3), 1.23 KiB | 1.23 MiB/s, done.
Total 3 (delta 1), reused 0 (delta 0), pack-reused 0
remote: Compressing source objects: 100% (2/2), done.
remote: Total 2 (delta 1), reused 2 (delta 0), deploy-compress to pack all
To github.com:YourUsername/athle-forge-ai.git
   abc1234..def5678  main -> main
```

✅ **Success!** Code is now pushed to GitHub.

---

## What Happens Next

1. **GitHub receives your push** ✅
2. **Vercel automatically detects the change** (if connected)
3. **Vercel starts building** (~1-2 minutes)
4. **Vercel reads your new `vercel.json`** configuration
5. **Your admin panel now works!** ✅

---

## Monitoring Deployment

### Watch in Vercel Dashboard:
1. Go to https://vercel.com/dashboard
2. Click your project
3. Go to "Deployments" tab
4. Watch the latest deployment build
5. When you see "Deployment Successful" ✅
6. Visit your site's `/admin` route - should work!

---

## Commands Summary

| Command | Purpose |
|---------|---------|
| `git status` | Check what files changed |
| `git add .` | Stage all changes for commit |
| `git commit -m "message"` | Create a commit with message |
| `git push origin main` | Push to GitHub (triggers Vercel deploy) |
| `npm run build` | Test build locally |
| `npm run preview` | Preview production build locally |

---

## Troubleshooting Commands

### If you made a mistake and want to undo:
```bash
# Undo last commit (but keep changes)
git reset HEAD~1

# Or start over with a fresh commit
git reset --hard HEAD~1
git push origin main --force-with-lease
```

### If you need to see what changed:
```bash
git diff vite.config.ts
```

### If you need to check your commit history:
```bash
git log --oneline -5
```

---

## Verify on Vercel

After pushing, check:

```bash
# 1. See your commit on GitHub
# Visit: https://github.com/YourUsername/athle-forge-ai

# 2. Check Vercel deployment
# Visit: https://vercel.com/dashboard
# Click your project → Deployments
# Should see your commit being deployed

# 3. Test your live site
# Visit: https://your-site.vercel.app/admin
# Should work! ✅
```

---

## Pro Tips

### Automatic deployment
Once you push, Vercel automatically:
- Detects the new code
- Reads your `vercel.json`
- Builds your project
- Deploys it
- **You don't need to do anything else!**

### Monitor the build
```bash
# Check build progress in Vercel dashboard
# Typically takes 1-2 minutes
```

### Quick verification
```bash
# After deployment succeeds, test immediately:
curl -I https://your-site.vercel.app/admin

# Should return 200 (not 404)
# If you see "404 Not Found" - check Vercel logs
```

---

## Done! ✅

Once you see this in Vercel Dashboard:
```
✓ Deployment Successful
  Production
  Created (3 minutes ago)
```

Your admin panel is **live and working**!

Test by:
1. Visit https://your-site.vercel.app
2. Click "Admin Login"  
3. Enter: `admin`
4. See admin dashboard ✅

---

**Time to complete:** 5 minutes
**Risk level:** Very Low (just configuration, no code changes)
**Rollback time:** 2 minutes (if needed)
