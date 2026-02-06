# Scramjet Proxy Implementation

## What We Did

### Overview
Implemented **Scramjet** client-side proxy with service worker to enable web browsing through the Parastar application.

### Technologies Used
1. **Scramjet** - Client-side proxy library that rewrites URLs and handles requests
2. **Service Worker** - Browser API that intercepts network requests
3. **Vercel Edge Functions** - For any backend needs (CORS, headers)

### How It Works

#### 1. Service Worker Registration
When the browser page loads, it registers `/sw.js` as a service worker:
```typescript
const registration = await navigator.serviceWorker.register('/sw.js', {
  scope: '/'
})
```

#### 2. Scramjet Files
The service worker imports Scramjet scripts:
- `scramjet.codecs.js` - URL encoding/decoding
- `scramjet.config.js` - Configuration
- `scramjet.worker.js` - Main proxy logic

#### 3. URL Routing
URLs are routed through the Scramjet prefix:
```
Original: https://www.google.com
Proxied: /scramjet/service/https://www.google.com
```

#### 4. Request Interception
The service worker intercepts all requests to `/scramjet/service/*` and:
- Decodes the target URL
- Fetches the content
- Rewrites embedded URLs (images, scripts, links)
- Returns modified content

### File Structure

```
public/
├── sw.js                      # Service worker entry point
└── scramjet/                  # Scramjet library files
    ├── scramjet.worker.js     # Main proxy worker
    ├── scramjet.codecs.js     # URL encoding
    ├── scramjet.config.js     # Configuration
    └── ...

app/
└── (proxy)/
    └── browser/
        └── page.tsx           # Browser UI with iframe

lib/
└── proxy/
    ├── handler.ts             # Proxy handler utility
    └── scramjet-config.ts     # Scramjet configuration
```

### Why This Works for Vercel

✅ **No Server Required** - Runs entirely in browser
✅ **Static Files Only** - Just serves Scramjet JavaScript files
✅ **Service Worker** - Built-in browser API
✅ **Vercel Compatible** - No special backend needed

### Current Status

✅ Service worker registration implemented
✅ Scramjet files copied to public directory
✅ Browser UI updated to use Scramjet proxy
✅ History tracking integrated
✅ Loading states added

### What's Next

To make this production-ready:

1. **Test on Real Sites** - Try Google, Reddit, YouTube
2. **Handle Errors** - Add better error messages
3. **Cookie Integration** - Wire up cookie saving/restoration
4. **Performance** - Add caching strategies
5. **Mobile Support** - Test on mobile browsers

### Known Limitations

- **CORS Issues** - Some sites block cross-origin requests
- **JavaScript-Heavy Sites** - May need additional rewrites
- **WebSockets** - Limited support in service workers
- **Bot Detection** - Sites like Reddit/Discord may still detect

### For Future Improvements

Consider:
- Adding Wisp protocol for WebSocket support
- Implementing additional evasion techniques
- Using public proxy backends as fallback
- Adding custom User-Agent rotation
