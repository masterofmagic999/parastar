import DatabaseConnection from '../auth/connection'

export interface StoredCookie {
  id?: string
  domain: string
  name: string
  value: string
  path?: string
  expires?: string
  secure?: boolean
  http_only?: boolean
  same_site?: string
}

class CookieManager {
  static async saveCookie(userId: string, cookie: StoredCookie) {
    const db = DatabaseConnection.getInstance()
    
    // Check if cookie already exists
    const { data: existing } = await db
      .from('stored_cookies')
      .select('*')
      .eq('user_id', userId)
      .eq('domain', cookie.domain)
      .eq('name', cookie.name)
      .eq('path', cookie.path || '/')
      .maybeSingle()
    
    if (existing) {
      // Update existing cookie
      const { data, error } = await db
        .from('stored_cookies')
        .update({
          value: cookie.value,
          expires: cookie.expires,
          secure: cookie.secure,
          http_only: cookie.http_only,
          same_site: cookie.same_site,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id)
        .select()
      
      if (error) throw error
      return data[0]
    } else {
      // Insert new cookie
      const { data, error } = await db
        .from('stored_cookies')
        .insert([{
          user_id: userId,
          domain: cookie.domain,
          name: cookie.name,
          value: cookie.value,
          path: cookie.path || '/',
          expires: cookie.expires,
          secure: cookie.secure || false,
          http_only: cookie.http_only || false,
          same_site: cookie.same_site || 'Lax'
        }])
        .select()
      
      if (error) throw error
      return data[0]
    }
  }

  static async getCookiesForDomain(userId: string, domain: string): Promise<StoredCookie[]> {
    const db = DatabaseConnection.getInstance()
    
    // Get cookies for exact domain and parent domains
    const domainPattern = `%${domain}%`
    
    const { data, error } = await db
      .from('stored_cookies')
      .select('*')
      .eq('user_id', userId)
      .or(`domain.eq.${domain},domain.like.${domainPattern}`)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    // Filter out expired cookies
    const now = new Date()
    return data
      .filter((c: any) => {
        if (!c.expires) return true
        return new Date(c.expires) > now
      })
      .map((c: any) => ({
        id: c.id,
        domain: c.domain,
        name: c.name,
        value: c.value,
        path: c.path,
        expires: c.expires,
        secure: c.secure,
        http_only: c.http_only,
        same_site: c.same_site
      }))
  }

  static async getAllCookies(userId: string): Promise<StoredCookie[]> {
    const db = DatabaseConnection.getInstance()
    const { data, error } = await db
      .from('stored_cookies')
      .select('*')
      .eq('user_id', userId)
      .order('domain', { ascending: true })
    
    if (error) throw error
    
    return data.map((c: any) => ({
      id: c.id,
      domain: c.domain,
      name: c.name,
      value: c.value,
      path: c.path,
      expires: c.expires,
      secure: c.secure,
      http_only: c.http_only,
      same_site: c.same_site
    }))
  }

  static async deleteCookie(cookieId: string, userId: string) {
    const db = DatabaseConnection.getInstance()
    const { error } = await db
      .from('stored_cookies')
      .delete()
      .eq('id', cookieId)
      .eq('user_id', userId)
    
    if (error) throw error
    return true
  }

  static async clearAllCookies(userId: string) {
    const db = DatabaseConnection.getInstance()
    const { error } = await db
      .from('stored_cookies')
      .delete()
      .eq('user_id', userId)
    
    if (error) throw error
    return true
  }

  static async clearCookiesForDomain(userId: string, domain: string) {
    const db = DatabaseConnection.getInstance()
    const { error } = await db
      .from('stored_cookies')
      .delete()
      .eq('user_id', userId)
      .eq('domain', domain)
    
    if (error) throw error
    return true
  }

  static async cleanExpiredCookies(userId: string) {
    const db = DatabaseConnection.getInstance()
    const now = new Date().toISOString()
    
    const { error } = await db
      .from('stored_cookies')
      .delete()
      .eq('user_id', userId)
      .lt('expires', now)
      .not('expires', 'is', null)
    
    if (error) throw error
    return true
  }
}

export default CookieManager
