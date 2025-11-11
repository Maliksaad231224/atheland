# Configuration Files - Exact Content Reference

## File 1: `vercel.json` (NEW FILE - Place in project root)

**Location:** `d:\athle-forge-ai\vercel.json`

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
    "VITE_SUPABASE_URL": "@VITE_SUPABASE_URL",
    "VITE_SUPABASE_PUBLISHABLE_KEY": "@VITE_SUPABASE_PUBLISHABLE_KEY"
  }
}
```

**Explanation:**
- `buildCommand`: Tells Vercel how to build the project
- `outputDirectory`: Where the built files are located
- `routes`: SPA routing rule that serves `/index.html` for all non-static routes
- `env`: Environment variable references (Vercel will inject these)

---

## File 2: `public/_redirects` (NEW FILE)

**Location:** `d:\athle-forge-ai\public\_redirects`

```
/* /index.html 200
```

**Explanation:**
- `/*`: Match all routes
- `/index.html`: Serve this file
- `200`: Return HTTP 200 (success) not a redirect

This is a fallback redirect rule that works with Vercel's routing system.

---

## File 3: `vite.config.ts` (MODIFIED - Updated)

**Location:** `d:\athle-forge-ai\vite.config.ts`

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "/",  // ← ADDED THIS LINE
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
```

**Key Change:**
- Added `base: "/"` - Ensures assets are served from the root path

---

## Why Each File is Needed

### `vercel.json` - The Most Important
This is Vercel's configuration file. It tells Vercel:
- How to build your project
- Where the output is
- **How to handle routes for SPA** ← This is the key fix

The routing rule uses a regex pattern that:
- Matches ANY URL (using `.*`)
- EXCEPT those starting with: `api`, `_next`, `static`, specific files
- And serves `/index.html` with a 200 status

This allows React Router to handle all your custom routes.

### `public/_redirects` - The Fallback
This is a simple fallback redirect rule. Some configurations might use this instead of or in addition to `vercel.json`.

### `vite.config.ts` - Asset Serving
The `base: "/"` ensures that when Vite builds your assets, it references them from the root path, not a subdirectory.

---

## How They Work Together

```
User Request Flow:
├─ User visits: https://your-site.com/admin/classes
│
├─ Vercel receives request
│
├─ Checks vercel.json routes
│  └─ Pattern matches? YES (it's not a static file)
│
├─ Serves: /index.html with status 200
│  └─ Includes CSS from /assets/index-*.css (base: "/" tells Vite to use root)
│  └─ Includes JS from /assets/index-*.js
│
├─ Browser loads HTML + JavaScript
│
├─ React Router initializes
│  └─ Reads URL: /admin/classes
│  └─ Matches route: <Route path="classes" element={<Classes />} />
│
└─ Renders Classes component ✅
```

---

## Verification

### Check the files exist:
```bash
# In your project root directory:
ls -la vercel.json              # Should exist
ls -la public/_redirects        # Should exist
grep "base:" vite.config.ts     # Should show: base: "/"
```

### Check Git changes:
```bash
git status

# Should show:
# Changes not staged for commit:
#   modified:   vite.config.ts
# 
# Untracked files:
#   vercel.json
#   public/_redirects
```

---

## Deployment

1. Commit these files:
```bash
git add vercel.json public/_redirects vite.config.ts
git commit -m "Fix: Add Vercel SPA routing configuration"
git push origin main
```

2. Vercel will automatically:
   - Pull your code
   - Read `vercel.json`
   - Build using the `buildCommand`
   - Deploy using the routes configuration

3. Test:
   - Visit your site's `/admin` route
   - Should work without 404 ✅

---

## Common Mistakes to Avoid

❌ **Don't:** Put `vercel.json` in `src/` folder
✅ **Do:** Put it in project root (same level as `package.json`)

❌ **Don't:** Name the file `vercel.json.txt` or `vercel.JSON`
✅ **Do:** Exactly `vercel.json` (lowercase, .json extension)

❌ **Don't:** Put `_redirects` in root directory
✅ **Do:** Put it in `public/` folder

❌ **Don't:** Remove the `base: "/"` from vite.config.ts
✅ **Do:** Keep it for proper asset serving

---

## If Something Goes Wrong

1. **Syntax error in vercel.json?**
   - Copy the JSON and paste into: https://jsonlint.com
   - Should show "Valid JSON"

2. **Still getting 404?**
   - Go to Vercel Dashboard
   - Click your project → Settings → Advanced
   - Click "Clear Cache" button
   - Click "Redeploy" on latest commit

3. **Need to rollback?**
   - Go to Vercel → Deployments
   - Find last working deployment
   - Click menu (⋮) → Redeploy

---

**Status:** All files prepared and ready for deployment
**Date:** November 11, 2025
