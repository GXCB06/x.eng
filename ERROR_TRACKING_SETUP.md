# Error Tracking & Monitoring Setup Guide

## Overview

Error tracking helps identify and fix issues in production. This guide covers setting up Sentry, the industry-standard error tracking platform.

## Why Error Tracking?

- **Real-time alerts** when errors occur
- **User context** - see what users were doing when error happened
- **Performance metrics** - track Core Web Vitals
- **Session replay** - see exactly what happened before the error
- **Analytics** - identify most common issues

## Sentry Setup (Recommended)

### 1. Create Sentry Account

1. Visit https://sentry.io
2. Sign up (free tier available)
3. Create a new project:
   - Platform: React
   - Alert rule: Issue
4. Get your DNS key from `Settings → Client Keys (DSN)`

### 2. Installation

```bash
npm install @sentry/react @sentry/tracing
```

### 3. Environment Variables

Create `.env` file:
```
VITE_SENTRY_DSN=https://your-key@your-org.ingest.sentry.io/your-project-id
VITE_SENTRY_ENVIRONMENT=production
VITE_SENTRY_RELEASE=1.0.0
```

### 4. Initialize Sentry in main.jsx

```javascript
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.VITE_SENTRY_ENVIRONMENT || 'development',
  release: import.meta.env.VITE_SENTRY_RELEASE,
  integrations: [
    new BrowserTracing({
      // Set sampling rate for performance monitoring
      tracingOrigins: ["localhost", /^\//],
    }),
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring
  // We recommend adjusting this value in production
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Capture Replay for 10% of all sessions,
  // plus 100% of sessions with an error
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
```

## Alternative: Using Custom Error Handling

If you prefer not to use Sentry, create an internal error tracking service:

```javascript
// src/utils/errorTracking.js
const API_ENDPOINT = '/api/logs'; // Your backend endpoint

export async function reportError(error, context = {}) {
  // Only report in production
  if (process.env.NODE_ENV !== 'production') {
    console.error('Development Error:', error, context);
    return;
  }

  try {
    await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: error.message,
        stack: error.stack,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        ...context,
      }),
    });
  } catch (err) {
    console.error('Failed to report error:', err);
  }
}

// Usage in error boundary:
reportError(error, { component: 'Modal', userId: currentUser?.id });
```

## Network Error Tracking

Add to your fetch/axios interceptor:

```javascript
// src/utils/errorTracking.js
export function setupNetworkErrorTracking() {
  const originalFetch = window.fetch;

  window.fetch = async (...args) => {
    try {
      const response = await originalFetch(...args);

      if (!response.ok) {
        reportError(new Error(`HTTP ${response.status}`), {
          url: args[0],
          status: response.status,
          method: args[1]?.method || 'GET',
        });
      }

      return response;
    } catch (error) {
      reportError(error, {
        type: 'NetworkError',
        url: args[0],
        method: args[1]?.method || 'GET',
      });
      throw error;
    }
  };
}
```

## Configuration by Deployment Platform

### Netlify Environment Variables

1. Go to `Site settings → Build & deploy → Environment`
2. Add production environment variables:
   ```
   VITE_SENTRY_DSN=your-dsn-key
   VITE_SENTRY_ENVIRONMENT=production
   VITE_SENTRY_RELEASE=1.0.0
   ```

### GitHub Actions Workflow

Add to `.github/workflows/deploy.yml`:
```yaml
env:
  VITE_SENTRY_DSN: ${{ secrets.SENTRY_DSN }}
  VITE_SENTRY_ENVIRONMENT: production
  VITE_SENTRY_RELEASE: ${{ github.ref }}
```

### Vercel Environment Variables

1. Go to `Settings → Environment Variables`
2. Add the key-value pairs
3. Select environments: Production, Preview, Development

## Monitoring & Alerts

### Key Metrics to Monitor

1. **Error Rate** - % of requests with errors
   - Alert if > 5% for 5 minutes

2. **Performance Metrics**
   - First Contentful Paint (FCP) > 3s
   - Largest Contentful Paint (LCP) > 4s
   - Cumulative Layout Shift (CLS) > 0.1

3. **Network Errors** - Failed API calls
   - Alert if > 50 per hour

4. **JavaScript Errors** - Uncaught exceptions
   - Alert on first occurrence

### Setting Up Alerts in Sentry

1. Go to `Alerts → Create Alert Rule`
2. Create alert for "Error is new"
3. Notification: Slack/Email/PagerDuty
4. Create alert for performance: LCP > 4s
5. Create alert for error rate spike: > 10%

## Code Example: Full Integration

```jsx
// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import { registerServiceWorker } from './utils/registerServiceWorker'
import * as Sentry from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'
import './index.css'

// Initialize Sentry
if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.VITE_SENTRY_ENVIRONMENT || 'development',
    release: import.meta.env.VITE_SENTRY_RELEASE,
    integrations: [
      new BrowserTracing({
        tracingOrigins: ['localhost', /^\//],
      }),
      new Sentry.Replay({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}

// Register service worker
registerServiceWorker();

const SentryApp = Sentry.withProfiler(App);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <SentryApp />
    </ErrorBoundary>
  </React.StrictMode>,
)
```

## Testing Error Tracking

### Test in Development

Add temporary button to trigger error:
```jsx
<button onClick={() => {
  throw new Error('Test error for Sentry');
}}>
  Test Error Tracking
</button>
```

### Test in Production

Once deployed, click the test button and verify error appears in Sentry within 30 seconds.

### Verify Setup

```bash
# Check if Sentry is loaded
curl -s https://your-domain.com | grep sentry

# Check network tab in DevTools for Sentry requests
# Look for requests to ingest.sentry.io
```

## Privacy Considerations

### GDPR Compliance

1. **Update Privacy Policy** - mention error tracking
2. **Sensitive Data** - Sentry strips:
   - Email addresses
   - Phone numbers
   - Password fields
   - API keys

3. **Configure Data Scrubbing** in Sentry:
   - Settings → Data Scrubbing
   - Add patterns for custom sensitive fields

### Before & After URL Masking

Enable in Sentry settings if users have sensitive URLs:
```
// Enable "Strip URLs"
// Transform: https://user:password@example.com → https://*:*@example.com
```

## Cost Estimation

### Sentry Free Tier
- 5,000 errors/month
- No session replay
- Good for small projects

### Sentry Pro ($29/month)
- Unlimited errors
- Session replay: 50/month
- Good for medium projects

### Self-Hosted Alternative
Consider if you need complete privacy:
- Glitchtip (open-source Sentry alternative)
- Your own logging server
- AWS CloudWatch

## Troubleshooting

### Errors not appearing in Sentry

1. **Check DSN** - verify key is correct
2. **Check environment** - errors only sent in production by default
3. **Check sampling rate** - might be filtering errors
4. **Check browser console** - look for errors on ingest.sentry.io
5. **VPN/Firewall** - might be blocking Sentry domain

### Too many errors

1. **Reduce `tracesSampleRate`** to 0.01-0.05
2. **Add error tags** to filter:
   ```javascript
   Sentry.captureException(err, {
     tags: {
       section: 'checkout',
       severity: 'critical',
     },
   });
   ```

## Next Steps

1. ✅ Choose error tracking service (Sentry recommended)
2. ✅ Create account and get DSN
3. ✅ Install npm package
4. ✅ Configure environment variables
5. ✅ Initialize in main.jsx
6. ✅ Test in development
7. ✅ Deploy to production
8. ✅ Setup alerts and monitoring

## Resources

- Sentry React Docs: https://docs.sentry.io/platforms/javascript/guides/react/
- Sentry Performance Monitoring: https://docs.sentry.io/concepts/key-concepts/performance-monitoring/
- Web Vitals Monitoring: https://web.dev/vitals/
