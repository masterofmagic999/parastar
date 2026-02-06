import DatabaseConnection from '../auth/connection'

export interface TabSession {
  id?: string
  url: string
  pageTitle?: string
  tabPosition: number
  isActive: boolean
  sessionId: string
  createdAt?: string
  updatedAt?: string
}

class TabSessionManager {
  /**
   * Generate a unique session ID
   */
  static generateSessionId(): string {
    // Use crypto.randomUUID for secure, unique IDs
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return `session_${crypto.randomUUID()}`
    }
    // Fallback for environments without randomUUID
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Save all open tabs for a user
   * @param userId - User ID
   * @param tabs - Array of tab objects
   * @param sessionId - Optional session ID, generates new one if not provided
   */
  static async saveTabs(
    userId: string,
    tabs: Array<{ url: string; title?: string; isActive: boolean }>,
    sessionId?: string
  ): Promise<string> {
    const db = DatabaseConnection.getInstance()
    const sid = sessionId || this.generateSessionId()
    
    // Clear existing tabs for this session
    await db
      .from('tab_sessions')
      .delete()
      .eq('user_id', userId)
      .eq('session_id', sid)
    
    // Insert new tabs
    const tabData = tabs.map((tab, index) => ({
      user_id: userId,
      url: tab.url,
      page_title: tab.title || 'New Tab',
      tab_position: index,
      is_active: tab.isActive,
      session_id: sid
    }))
    
    if (tabData.length > 0) {
      const { error } = await db
        .from('tab_sessions')
        .insert(tabData)
      
      if (error) throw error
    }
    
    return sid
  }

  /**
   * Get the most recent tab session for a user
   */
  static async getLatestSession(userId: string): Promise<TabSession[] | null> {
    const db = DatabaseConnection.getInstance()
    
    // Get the most recent session ID
    const { data: sessions, error: sessionError } = await db
      .from('tab_sessions')
      .select('session_id')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
    
    if (sessionError) throw sessionError
    if (!sessions || sessions.length === 0) return null
    
    const sessionId = sessions[0].session_id
    
    // Get all tabs for that session
    return this.getSessionTabs(userId, sessionId)
  }

  /**
   * Get tabs for a specific session
   */
  static async getSessionTabs(userId: string, sessionId: string): Promise<TabSession[]> {
    const db = DatabaseConnection.getInstance()
    
    const { data, error } = await db
      .from('tab_sessions')
      .select('*')
      .eq('user_id', userId)
      .eq('session_id', sessionId)
      .order('tab_position', { ascending: true })
    
    if (error) throw error
    
    return data.map((tab: any) => ({
      id: tab.id,
      url: tab.url,
      pageTitle: tab.page_title,
      tabPosition: tab.tab_position,
      isActive: tab.is_active,
      sessionId: tab.session_id,
      createdAt: tab.created_at,
      updatedAt: tab.updated_at
    }))
  }

  /**
   * Get all session IDs for a user
   */
  static async getAllSessions(userId: string): Promise<string[]> {
    const db = DatabaseConnection.getInstance()
    
    const { data, error } = await db
      .from('tab_sessions')
      .select('session_id, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    // Get unique session IDs
    const uniqueSessions = new Set<string>()
    data.forEach((item: any) => uniqueSessions.add(item.session_id))
    
    return Array.from(uniqueSessions)
  }

  /**
   * Delete a specific session
   */
  static async deleteSession(userId: string, sessionId: string): Promise<boolean> {
    const db = DatabaseConnection.getInstance()
    
    const { error } = await db
      .from('tab_sessions')
      .delete()
      .eq('user_id', userId)
      .eq('session_id', sessionId)
    
    if (error) throw error
    return true
  }

  /**
   * Delete all sessions for a user
   */
  static async deleteAllSessions(userId: string): Promise<boolean> {
    const db = DatabaseConnection.getInstance()
    
    const { error } = await db
      .from('tab_sessions')
      .delete()
      .eq('user_id', userId)
    
    if (error) throw error
    return true
  }

  /**
   * Delete old sessions (keep only last N sessions)
   */
  static async cleanupOldSessions(userId: string, keepCount: number = 5): Promise<void> {
    const db = DatabaseConnection.getInstance()
    
    // Get all session IDs ordered by creation date
    const { data, error } = await db
      .from('tab_sessions')
      .select('session_id, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    if (!data || data.length <= keepCount) return
    
    // Get unique sessions to delete (oldest ones)
    const sessions = new Map<string, string>()
    data.forEach((item: any) => {
      if (!sessions.has(item.session_id)) {
        sessions.set(item.session_id, item.created_at)
      }
    })
    
    const sessionArray = Array.from(sessions.entries())
    if (sessionArray.length <= keepCount) return
    
    // Delete old sessions
    const sessionsToDelete = sessionArray.slice(keepCount).map(([sid]) => sid)
    
    for (const sessionId of sessionsToDelete) {
      await this.deleteSession(userId, sessionId)
    }
  }

  /**
   * Update a single tab in a session
   */
  static async updateTab(
    userId: string,
    sessionId: string,
    tabPosition: number,
    updates: { url?: string; pageTitle?: string; isActive?: boolean }
  ): Promise<void> {
    const db = DatabaseConnection.getInstance()
    
    const updateData: any = { updated_at: new Date().toISOString() }
    if (updates.url !== undefined) updateData.url = updates.url
    if (updates.pageTitle !== undefined) updateData.page_title = updates.pageTitle
    if (updates.isActive !== undefined) updateData.is_active = updates.isActive
    
    const { error } = await db
      .from('tab_sessions')
      .update(updateData)
      .eq('user_id', userId)
      .eq('session_id', sessionId)
      .eq('tab_position', tabPosition)
    
    if (error) throw error
  }
}

export default TabSessionManager
