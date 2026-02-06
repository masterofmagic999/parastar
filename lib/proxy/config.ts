/**
 * Proxy Configuration - Advanced Multi-Transport Setup
 * 
 * Configures multiple proxy transports with intelligent fallback:
 * 1. Libcurl-transport (fastest, uses WASM libcurl)
 * 2. Epoxy-transport (wisp protocol, WebSocket-based)
 * 3. Bare-transport (HTTP-based fallback)
 * 4. Ultraviolet (alternative proxy engine)
 */

// Public Wisp servers (WebSocket-based proxy transport)
export const WISP_SERVERS = [
  'wss://wisp.mercurywork.shop/',
  'wss://wisp.mercuryworkshop.network/',
  'wss://wisp.kbve.com/',
];

// Bare servers (HTTP-based transport, fallback)
export const BARE_SERVERS = [
  'https://uv.holyubofficial.net/bare/',
  'https://tomp.app/bare/',
  'https://bare.benrogo.net/',
  'https://uv.itzcat.com/',
];

// Scramjet configuration (primary proxy engine)
export const SCRAMJET_CONFIG = {
  prefix: '/scramjet/service/',
  codec: 'xor', // Options: 'xor', 'plain', 'base64'
  files: {
    bundle: '/scramjet/scramjet.bundle.js',
    worker: '/scramjet/scramjet.worker.js',
    client: '/scramjet/scramjet.client.js',
    codecs: '/scramjet/scramjet.codecs.js',
    config: '/scramjet/scramjet.config.js',
  },
};

// Ultraviolet configuration (fallback proxy engine)
export const ULTRAVIOLET_CONFIG = {
  prefix: '/uv/service/',
  bundle: '/uv/uv.bundle.js',
  config: '/uv/uv.config.js',
  handler: '/uv/uv.handler.js',
  client: '/uv/uv.client.js',
};

// Transport priority (fastest to slowest)
export const TRANSPORT_PRIORITY = [
  'libcurl',  // Fastest - WASM libcurl with E2E encryption
  'epoxy',    // Fast - Wisp protocol over WebSocket
  'bare',     // Medium - HTTP-based
];

// Proxy engine priority
export const PROXY_ENGINE_PRIORITY = [
  'scramjet',    // Primary - Modern, fast
  'ultraviolet', // Fallback - Mature, compatible
];

/**
 * Server health check with timeout
 */
export async function checkServerHealth(url: string, timeout = 3000): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      cache: 'no-cache',
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    return false;
  }
}

/**
 * Get fastest available bare server
 * Tests all servers in parallel and returns the fastest
 */
export async function getFastestBareServer(): Promise<string> {
  const results = await Promise.allSettled(
    BARE_SERVERS.map(async (server) => {
      const start = performance.now();
      const isHealthy = await checkServerHealth(server);
      const latency = performance.now() - start;
      return { server, latency, isHealthy };
    })
  );
  
  const healthyServers = results
    .filter((r): r is PromiseFulfilledResult<{ server: string; latency: number; isHealthy: boolean }> => 
      r.status === 'fulfilled' && r.value.isHealthy
    )
    .map(r => r.value)
    .sort((a, b) => a.latency - b.latency);
  
  if (healthyServers.length > 0) {
    console.log(`✅ Fastest bare server: ${healthyServers[0].server} (${Math.round(healthyServers[0].latency)}ms)`);
    return healthyServers[0].server;
  }
  
  console.warn('⚠️ No healthy bare servers found, using first as fallback');
  return BARE_SERVERS[0];
}

/**
 * Get fastest available wisp server
 */
export async function getFastestWispServer(): Promise<string> {
  // Wisp uses WebSocket, harder to test
  // Return first available for now
  // TODO: Implement WebSocket connectivity test
  return WISP_SERVERS[0];
}

/**
 * Initialize transport with automatic selection
 */
export async function initializeBestTransport(): Promise<{
  transport: 'libcurl' | 'epoxy' | 'bare';
  server: string;
}> {
  if (typeof window === 'undefined') {
    return { transport: 'bare', server: BARE_SERVERS[0] };
  }
  
  // Try libcurl-transport first (fastest)
  try {
    const wispServer = await getFastestWispServer();
    const { default: BareMuxConnection } = await import('@mercuryworkshop/bare-mux');
    const { LibcurlTransport } = await import('@mercuryworkshop/libcurl-transport');
    
    const connection = new BareMuxConnection('/baremux/worker.js');
    await connection.setTransport(LibcurlTransport, [wispServer]);
    
    console.log('✅ Initialized libcurl-transport (fastest)');
    return { transport: 'libcurl', server: wispServer };
  } catch (error) {
    console.warn('⚠️ Libcurl-transport unavailable, trying epoxy:', error);
  }
  
  // Try epoxy-transport (wisp) as fallback
  try {
    const wispServer = await getFastestWispServer();
    const { default: BareMuxConnection } = await import('@mercuryworkshop/bare-mux');
    
    const connection = new BareMuxConnection('/baremux/worker.js');
    
    // Load epoxy transport from CDN if available
    if ((window as any).EpoxTransport) {
      await (connection as any).setTransport((window as any).EpoxTransport, [wispServer]);
      console.log('✅ Initialized epoxy-transport (wisp)');
      return { transport: 'epoxy', server: wispServer };
    }
  } catch (error) {
    console.warn('⚠️ Epoxy-transport unavailable, falling back to bare:', error);
  }
  
  // Final fallback to bare transport
  const bareServer = await getFastestBareServer();
  console.log('ℹ️ Using bare transport');
  return { transport: 'bare', server: bareServer };
}

/**
 * Connection quality monitoring
 */
export function getConnectionQuality(latency: number): 'excellent' | 'good' | 'fair' | 'poor' | 'offline' {
  if (latency < 0) return 'offline';
  if (latency < 100) return 'excellent';
  if (latency < 300) return 'good';
  if (latency < 1000) return 'fair';
  return 'poor';
}

export default {
  WISP_SERVERS,
  BARE_SERVERS,
  SCRAMJET_CONFIG,
  ULTRAVIOLET_CONFIG,
  TRANSPORT_PRIORITY,
  PROXY_ENGINE_PRIORITY,
  checkServerHealth,
  getFastestBareServer,
  getFastestWispServer,
  initializeBestTransport,
  getConnectionQuality,
};
