import DatabaseConnection from '../auth/connection'

export interface HistoryEntry {
  id?: string
  url: string
  page_title?: string
  visit_count?: number
  last_visited?: string
}

class HistoryManager {
  static async trackVisit(userId: string, url: string, pageTitle?: string) {
    const db = DatabaseConnection.getInstance()
    
    // Check if URL already exists for this user
    const { data: existing } = await db
      .from('history')
      .select('*')
      .eq('user_id', userId)
      .eq('url', url)
      .maybeSingle()
    
    if (existing) {
      // Update existing entry
      const { data, error } = await db
        .from('history')
        .update({
          visit_count: (existing.visit_count || 0) + 1,
          last_visited: new Date().toISOString(),
          page_title: pageTitle || existing.page_title
        })
        .eq('id', existing.id)
        .select()
      
      if (error) throw error
      return data[0]
    } else {
      // Create new entry
      const { data, error } = await db
        .from('history')
        .insert([{
          user_id: userId,
          url: url,
          page_title: pageTitle,
          visit_count: 1,
          last_visited: new Date().toISOString()
        }])
        .select()
      
      if (error) throw error
      return data[0]
    }
  }

  static async fetchHistory(userId: string, limit: number = 50): Promise<HistoryEntry[]> {
    const db = DatabaseConnection.getInstance()
    const { data, error } = await db
      .from('history')
      .select('*')
      .eq('user_id', userId)
      .order('last_visited', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    return data.map((h: any) => ({
      id: h.id,
      url: h.url,
      page_title: h.page_title,
      visit_count: h.visit_count,
      last_visited: h.last_visited
    }))
  }

  static async searchHistory(userId: string, query: string): Promise<HistoryEntry[]> {
    const db = DatabaseConnection.getInstance()
    const { data, error } = await db
      .from('history')
      .select('*')
      .eq('user_id', userId)
      .or(`url.ilike.%${query}%,page_title.ilike.%${query}%`)
      .order('last_visited', { ascending: false })
      .limit(50)
    
    if (error) throw error
    return data.map((h: any) => ({
      id: h.id,
      url: h.url,
      page_title: h.page_title,
      visit_count: h.visit_count,
      last_visited: h.last_visited
    }))
  }

  static async clearAllHistory(userId: string) {
    const db = DatabaseConnection.getInstance()
    const { error } = await db
      .from('history')
      .delete()
      .eq('user_id', userId)
    
    if (error) throw error
    return true
  }

  static async deleteHistoryEntry(historyId: string, userId: string) {
    const db = DatabaseConnection.getInstance()
    const { error } = await db
      .from('history')
      .delete()
      .eq('id', historyId)
      .eq('user_id', userId)
    
    if (error) throw error
    return true
  }
}

export default HistoryManager
