# HTTP Caching Headers Configuration

## Overview

Proper HTTP caching headers work alongside the Service Worker to optimize performance. These headers tell browsers how long to cache resources locally.

## Recommended Cache Headers for Production

### For Static Assets (1 year - will use cache busting)
```
/logo.png -> Cache-Control: public, max-age=31536000, immutable
/logo.webp -> Cache-Control: public, max-age=31536000, immutable
/inforgraphic.png -> Cache-Control: public, max-age=31536000, immutable
/inforgraphic.webp -> Cache-Control: public, max-age=31536000, immutable
```

### For JavaScript/CSS Bundles (1 year - Vite handles hashing automatically)
```
/**/*.js -> Cache-Control: public, max-age=31536000, immutable
/**/*.css -> Cache-Control: public, max-age=31536000, immutable
```

### For PDFs (7 days - content may be updated)
```
/**/*.pdf -> Cache-Control: public, max-age=604800
```

### For HTML (no cache - always fetch latest)
```
/index.html -> Cache-Control: public, max-age=0, must-revalidate
/

 -> Cache-Control: public, max-age=0, must-revalidate
```

## Deployment Configurations

### Netlify (netlify.toml)
```toml
[[headers]]
  for = "/logo.*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/inforgraphic.*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.pdf"
  [headers.values]
    Cache-Control = "public, max-age=604800"

[[headers]]
  for = "/index.html"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"
    Content-Type = "text/html; charset=utf-8"
```

### Vercel (vercel.json)
```json
{
  "headers": [
    {
      "source": "/(logo|inforgraphic)\\.(png|webp)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/_next/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/.*\\.pdf$",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=604800"
        }
      ]
    },
    {
      "source": "/index.html",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        }
      ]
    }
  ]
}
```

### GitHub Pages (_config.yml with add-on)
GitHub Pages doesn't directly support custom headers, but you can use:
- Cloudflare CDN (free tier)
- GitHub Actions to set headers via middleware
- Alternative hosting with header support

### Cloudflare Workers (cloudflare.com)
```javascript
export default {
  async fetch(request) {
    let response = await fetch(request);

    // Cache images for 1 year
    if (/\.(png|webp|jpg|jpeg|gif|svg)$/.test(request.url)) {
      response = new Response(response.body, response);
      response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    }

    // Cache JS/CSS for 1 year
    if (/\.(js|css)$/.test(request.url)) {
      response = new Response(response.body, response);
      response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    }

    // Cache PDFs for 7 days
    if (/\.pdf$/.test(request.url)) {
      response = new Response(response.body, response);
      response.headers.set('Cache-Control', 'public, max-age=604800');
    }

    // Don't cache HTML
    if (request.url.endsWith('/') || request.url.endsWith('.html')) {
      response = new Response(response.body, response);
      response.headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
    }

    return response;
  }
}
```

## How Caching Works Together

1. **First Visit (No Cache):**
   - Browser loads all resources from network
   - Service Worker caches everything
   - HTTP headers tell browser to cache for 1 year

2. **Subsequent Visits (Fast + Offline):**
   - Browser checks local HTTP cache (instant)
   - If expired, Service Worker serves from SW cache
   - If both miss, fetch from network
   - Works offline with Service Worker cache

3. **Bad Internet (Degraded Mode):**
   - Service Worker serves from cache (no network wait)
   - Images, CSS, JavaScript all cached
   - Page appears instantly even on 2G/3G
   - PDF caches after first download

## Performance Impact

**Without proper caching:**
- Every page load: 800KB+ download
- Repeat visits: Same 800KB again
- Bad internet: Slow/timeout

**With Service Worker + HTTP caching:**
- First visit: 800KB download (cached)
- Repeat visits: <10KB (HTML only)
- Bad internet: Instant load from cache
- Offline: Full access to previously cached content

## Security Headers (Also Recommended)

```toml
# Netlify example
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

## Testing Caching

### DevTools Network Tab
1. Open DevTools → Network
2. Check "Disable cache" checkbox
3. Reload page (first visit simulation)
4. Uncheck "Disable cache"
5. Reload page (should be much faster)

### Verify Headers
```bash
curl -i https://your-domain.com/logo.png | grep Cache-Control
# Should output: Cache-Control: public, max-age=31536000, immutable
```

### Test Offline
1. DevTools → Network → Offline
2. Navigate to page
3. Should load from Service Worker cache

## Migration Checklist

- [ ] Setup HTTP caching headers in deployment config
- [ ] Test headers with curl or browser DevTools
- [ ] Verify Service Worker installation
- [ ] Test offline mode in DevTools
- [ ] Test on slow 4G/bad internet
- [ ] Monitor cache hit rates in DevTools
- [ ] Setup monitoring for failed requests
