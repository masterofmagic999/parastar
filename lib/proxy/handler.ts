export class ProxyHandler {
  private activeUrl: string = ''
  private historyStack: string[] = []
  private currentIndex: number = -1

  constructor() {
    this.activeUrl = ''
  }

  buildProxyUrl(targetUrl: string): string {
    try {
      let processedUrl = targetUrl.trim()
      
      if (!processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
        if (processedUrl.includes('.')) {
          processedUrl = 'https://' + processedUrl
        } else {
          return `https://www.google.com/search?q=${encodeURIComponent(processedUrl)}`
        }
      }

      const encoded = encodeURIComponent(processedUrl)
      return `/api/bare?target=${encoded}`
    } catch (e) {
      console.error('URL processing error:', e)
      return ''
    }
  }

  navigate(url: string) {
    this.activeUrl = url
    
    if (this.currentIndex < this.historyStack.length - 1) {
      this.historyStack = this.historyStack.slice(0, this.currentIndex + 1)
    }
    
    this.historyStack.push(url)
    this.currentIndex++
  }

  canGoBack(): boolean {
    return this.currentIndex > 0
  }

  canGoForward(): boolean {
    return this.currentIndex < this.historyStack.length - 1
  }

  goBack(): string | null {
    if (this.canGoBack()) {
      this.currentIndex--
      this.activeUrl = this.historyStack[this.currentIndex]
      return this.activeUrl
    }
    return null
  }

  goForward(): string | null {
    if (this.canGoForward()) {
      this.currentIndex++
      this.activeUrl = this.historyStack[this.currentIndex]
      return this.activeUrl
    }
    return null
  }

  getCurrentUrl(): string {
    return this.activeUrl
  }

  clearHistory() {
    this.historyStack = []
    this.currentIndex = -1
    this.activeUrl = ''
  }
}

export default ProxyHandler
