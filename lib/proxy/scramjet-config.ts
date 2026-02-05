export default class ScramjetConfig {
  static config = {
    prefix: '/scramjet/service/',
    codec: 'xor',
    config: '/scramjet.config.js',
    files: {
      wasm: '/scramjet/scramjet.wasm.js',
      worker: '/scramjet/scramjet.worker.js', 
      client: '/scramjet/scramjet.client.js',
      shared: '/scramjet/scramjet.shared.js',
      sync: '/scramjet/scramjet.sync.js'
    }
  }
}

// Make it available globally
if (typeof window !== 'undefined') {
  (window as any).SCRAMJET_CONFIG = ScramjetConfig.config
}
