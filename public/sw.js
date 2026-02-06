// Import bare-mux for transport management
importScripts('https://unpkg.com/@mercuryworkshop/bare-mux@2.1.8/dist/index.js');

// Import Scramjet files
importScripts('/scramjet/scramjet.codecs.js');
importScripts('/scramjet/scramjet.config.js');
importScripts('/scramjet/scramjet.bundle.js');
importScripts('/scramjet/scramjet.worker.js');

// Initialize bare-mux with wisp transport on service worker activation
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Take control of all clients
      await self.clients.claim();
      
      console.log('Scramjet service worker activated');
    })()
  );
});

// Service worker will handle all /scramjet/service/* requests
