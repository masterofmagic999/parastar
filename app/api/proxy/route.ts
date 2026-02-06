import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, RateLimitPresets, getRequestIdentifier } from '@/lib/security/rate-limit'

// Custom request forwarder with evasion
export async function GET(request: NextRequest) {
  // Apply rate limiting
  const identifier = getRequestIdentifier(request)
  const rateLimit = checkRateLimit(identifier, RateLimitPresets.API)
  
  if (!rateLimit.allowed) {
    return new NextResponse(
      JSON.stringify({ error: 'Too many requests' }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString(),
          'X-RateLimit-Limit': RateLimitPresets.API.maxRequests.toString(),
          'X-RateLimit-Remaining': rateLimit.remaining.toString()
        }
      }
    )
  }
  
  const targetUrl = request.nextUrl.searchParams.get('url')
  
  if (!targetUrl) {
    return new NextResponse('Missing URL parameter', { status: 400 })
  }

  try {
    // Build realistic browser headers
    const forwardHeaders = new Headers()
    forwardHeaders.set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
    forwardHeaders.set('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8')
    forwardHeaders.set('Accept-Language', 'en-US,en;q=0.9')
    forwardHeaders.set('Accept-Encoding', 'gzip, deflate, br')
    forwardHeaders.set('DNT', '1')
    forwardHeaders.set('Connection', 'keep-alive')
    forwardHeaders.set('Upgrade-Insecure-Requests', '1')
    forwardHeaders.set('Sec-Fetch-Dest', 'document')
    forwardHeaders.set('Sec-Fetch-Mode', 'navigate')
    forwardHeaders.set('Sec-Fetch-Site', 'none')
    forwardHeaders.set('Sec-Fetch-User', '?1')

    const proxyResponse = await fetch(targetUrl, {
      method: 'GET',
      headers: forwardHeaders,
      redirect: 'follow',
    })

    const contentType = proxyResponse.headers.get('content-type') || ''
    let responseBody = await proxyResponse.text()

    // Rewrite URLs in HTML content
    if (contentType.includes('text/html')) {
      const urlObj = new URL(targetUrl)
      const baseUrl = `${urlObj.protocol}//${urlObj.host}`
      
      // Rewrite absolute URLs
      responseBody = responseBody.replace(
        /href="https?:\/\/[^"]+"/g,
        (match) => {
          const url = match.slice(6, -1)
          return `href="/api/proxy?url=${encodeURIComponent(url)}"`
        }
      )
      
      // Rewrite relative URLs
      responseBody = responseBody.replace(
        /href="\/[^"]+"/g,
        (match) => {
          const path = match.slice(6, -1)
          const fullUrl = `${baseUrl}${path}`
          return `href="/api/proxy?url=${encodeURIComponent(fullUrl)}"`
        }
      )

      // Rewrite src attributes
      responseBody = responseBody.replace(
        /src="(https?:\/\/[^"]+|\/[^"]+)"/g,
        (match, url) => {
          const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`
          return `src="/api/proxy?url=${encodeURIComponent(fullUrl)}"`
        }
      )
    }

    return new NextResponse(responseBody, {
      status: proxyResponse.status,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    console.error('Proxy error:', error)
    return new NextResponse('Proxy request failed', { status: 500 })
  }
}
