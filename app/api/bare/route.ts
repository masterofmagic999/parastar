import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  return handleProxyRequest(req)
}

export async function POST(req: NextRequest) {
  return handleProxyRequest(req)
}

async function handleProxyRequest(req: NextRequest) {
  const destinationUrl = req.nextUrl.searchParams.get('target')
  
  if (!destinationUrl) {
    return NextResponse.json({ msg: 'No target specified' }, { status: 400 })
  }

  try {
    const decodedDestination = decodeURIComponent(destinationUrl)
    
    const requestHeaders: HeadersInit = {}
    
    // Copy important headers
    const userAgentHeader = req.headers.get('user-agent')
    if (userAgentHeader) {
      requestHeaders['User-Agent'] = userAgentHeader
    }
    
    const acceptHeader = req.headers.get('accept')
    if (acceptHeader) {
      requestHeaders['Accept'] = acceptHeader
    }

    const requestOptions: RequestInit = {
      method: req.method,
      headers: requestHeaders,
      redirect: 'follow'
    }

    if (req.method === 'POST') {
      const bodyContent = await req.text()
      if (bodyContent) {
        requestOptions.body = bodyContent
      }
    }

    const upstreamResponse = await fetch(decodedDestination, requestOptions)
    const contentData = await upstreamResponse.arrayBuffer()
    
    const outgoingHeaders = new Headers()
    
    // Copy response headers selectively
    const contentTypeHeader = upstreamResponse.headers.get('content-type')
    if (contentTypeHeader) {
      outgoingHeaders.set('Content-Type', contentTypeHeader)
    }
    
    // Enable CORS
    outgoingHeaders.set('Access-Control-Allow-Origin', '*')
    outgoingHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    outgoingHeaders.set('Access-Control-Allow-Headers', '*')

    return new NextResponse(contentData, {
      status: upstreamResponse.status,
      statusText: upstreamResponse.statusText,
      headers: outgoingHeaders
    })
  } catch (errorObj) {
    const errorMessage = errorObj instanceof Error ? errorObj.message : 'Unknown error'
    console.error('Proxy error:', errorMessage)
    return NextResponse.json({ 
      msg: 'Proxy request failed',
      details: errorMessage 
    }, { status: 500 })
  }
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': '*',
    }
  })
}
