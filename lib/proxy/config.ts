/**
 * Wisp and Bare Server Configuration
 * 
 * This configures the proxy to use:
 * 1. Wisp protocol (WebSocket-based transport) - https://github.com/MercuryWorkshop/wisp-protocol
 * 2. Scramjet (client-side proxy) - https://github.com/MercuryWorkshop/scramjet
 * 3. Public servers (no local proxy.py hosting needed)
 */

// Public Wisp servers (WebSocket-based proxy transport)
// These provide the backend that would normally be proxy.py
export const WISP_SERVERS = [
  'wss://wisp.mercurywork.shop/',
  'wss://wisp.mercuryworkshop.network/',
];

// Fallback bare servers (HTTP-based transport)
export const BARE_SERVERS = [
  'https://uv.holyubofficial.net/bare/',
  'https://tomp.app/bare/',
];

// Scramjet service worker configuration
export const SCRAMJET_CONFIG = {
  prefix: '/scramjet/service/',
  codec: 'xor', // or 'plain', 'base64'
  files: {
    bundle: '/scramjet/scramjet.bundle.js',
    worker: '/scramjet/scramjet.worker.js',
    client: '/scramjet/scramjet.client.js',
    codecs: '/scramjet/scramjet.codecs.js',
    config: '/scramjet/scramjet.config.js',
  },
};

// Transport priority (wisp is faster than bare)
export const TRANSPORT_PRIORITY = ['wisp', 'bare'];

export default {
  WISP_SERVERS,
  BARE_SERVERS,
  SCRAMJET_CONFIG,
  TRANSPORT_PRIORITY,
};
