# Image Optimization Guide

## Current Images Status

### 1. **inforgraphic.png** (933 KB)
- Current location: `/public/inforgraphic.png`
- Usage: Displayed in Modal when user clicks "ดูเกณฑ์คัดเลือก"
- Optimization needed: YES

**Recommended Actions:**
- Convert to WebP format (can reduce size by 25-35%)
- Compress quality from 100 to 85-90
- Target size: ~300-400 KB

**Steps:**
```bash
# Using ImageMagick
magick convert inforgraphic.png -quality 85 -define webp:method=6 inforgraphic.webp

# Using cwebp (from libwebp)
cwebp -q 85 inforgraphic.png -o inforgraphic.webp
```

### 2. **logo.png** (230 KB)
- Current location: `/public/logo.png`
- Usage: App logo/branding
- Optimization needed: YES

**Recommended Actions:**
- Convert to WebP format
- Compress quality to 80-85
- Target size: ~80-100 KB

**Steps:**
```bash
magick convert logo.png -quality 80 -define webp:method=6 logo.webp
```

### 3. **poster.pdf** (3.0 MB)
- Current location: `/public/poster.pdf`
- Usage: Downloaded via "Download PDF" button in Modal
- Optimization needed: YES (HIGH PRIORITY - largest file)

**Recommended Actions:**
- Compress PDF by removing unused objects
- Reduce image quality in PDF
- Target size: ~1.2-1.5 MB

**Steps:**
```bash
# Using Ghostscript
gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/ebook \
   -dNOPAUSE -dQUIET -dBATCH -dDetectDuplicateImages \
   -r150x150 -sOutputFile=poster-compressed.pdf poster.pdf

# Or online tools:
# - https://www.ilovepdf.com/compress_pdf
# - https://www.smallpdf.com/compress-pdf
```

## Implementation Strategy

### Phase 1: Immediate Actions (Quick Wins)
1. Create WebP versions of PNG images
2. Keep PNG originals for fallback (browser support)
3. Update image references to use WebP with PNG fallback
4. Update Service Worker cache manifest for new files

### Phase 2: Component Updates
1. Update `Modal.jsx` to use `<picture>` element for WebP
2. Implement lazy loading using `LazyImage.jsx` component
3. Add `loading="lazy"` attribute to all images

### Phase 3: PDF Optimization
1. Compress poster.pdf using Ghostscript
2. Test PDF download functionality
3. Verify in Service Worker caching

## Performance Impact Estimate

**Before Optimization:**
- Total image/PDF size: ~4.2 MB
- Service Worker cache: ~4.2 MB
- First visit load: ~800KB+ (PNG + PDF overhead)

**After Optimization:**
- Total image/PDF size: ~1.8-2.0 MB  (57% reduction)
- Service Worker cache: ~1.8-2.0 MB
- First visit load: ~350KB+ (WebP + compressed PDF)
- Subsequent visits: Cached (instant from SW)
- Bad internet: Images serve from cache after first load

## WebP Format Information

WebP is supported in all modern browsers:
- Chrome/Edge: 100% support
- Firefox: 100% support
- Safari (iOS 14+): 100% support
- Fallback: PNG files for older browsers

**Size Comparison Example:**
- PNG: 933 KB
- WebP (quality 85): ~650 KB (30% reduction)
- Compressed WebP: ~600 KB (35% reduction)

## Testing After Optimization

1. **Load Testing:**
   - Open DevTools Network tab
   - Check image sizes and load times
   - Verify Service Worker caching

2. **Bad Internet Simulation:**
   - DevTools → Network → Throttle to "Slow 4G"
   - Refresh page
   - Verify images load from cache

3. **Offline Testing:**
   - DevTools → Network → Offline
   - Refresh page
   - Verify cached images still appear

## Recommended Tools

- **ImageMagick**: CLI image processing
- **cwebp**: WebP conversion (part of libwebp)
- **Ghostscript**: PDF compression
- **Online Alternatives**: Tinify, Compressor.io, ILovePDF
