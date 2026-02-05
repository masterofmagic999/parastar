import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  return processProxyRequest(req)
}

export async function POST(req: NextRequest) {
  return processProxyRequest(req)
}

async function processProxyRequest(req: NextRequest) {
  const targetUrl = req.nextUrl.searchParams.get('target')
  
  if (!targetUrl) {
    return NextResponse.json({ error: 'Missing target URL' }, { status: 400 })
  }

  try {
    const decodedUrl = decodeURIComponent(targetUrl)
    
    const proxyHeaders: Record<string, string> = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': req.headers.get('accept') || '*/*',
      'Accept-Language': 'en-US,en;q=0.9',
    }

    const cookieValue = req.headers.get('cookie')
    if (cookieValue) {
      proxyHeaders['Cookie'] = cookieValue
    }

    const fetchConfig: RequestInit = {
      method: req.method,
      headers: proxyHeaders,
    }

    if (req.method === 'POST' && req.body) {
      fetchConfig.body = req.body
    }

    const targetResponse = await fetch(decodedUrl, fetchConfig)
    const content = await targetResponse.text()
    
    const responseHeaders = new Headers()
    responseHeaders.set('Access-Control-Allow-Origin', '*')
    responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    
    const contentType = targetResponse.headers.get('content-type')
    if (contentType) {
      responseHeaders.set('Content-Type', contentType)
    }

    return new NextResponse(content, {
      status: targetResponse.status,
      headers: responseHeaders
    })
  } catch (err) {
    console.error('Proxy request failed:', err)
    return NextResponse.json({ error: 'Request failed' }, { status: 500 })
  }
}
