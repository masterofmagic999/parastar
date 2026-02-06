import DatabaseConnection from '../auth/connection'

export interface UserPreferences {
  homepage_url?: string
  theme?: string
  clear_on_exit?: boolean
  save_history?: boolean
  save_cookies?: boolean
  enable_javascript?: boolean
  block_ads?: boolean
  custom_settings?: Record<string, any>
}

class SettingsManager {
  static async loadUserPreferences(userId: string): Promise<UserPreferences> {
    const db = DatabaseConnection.getInstance()
    const { data, error } = await db
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (error) {
      // Return defaults if no preferences found
      if (error.code === 'PGRST116') {
        return this.getDefaultPreferences()
      }
      throw error
    }
    
    return {
      homepage_url: data.homepage_url,
      theme: data.theme_mode,
      clear_on_exit: data.clear_on_exit,
      save_history: data.save_history,
      save_cookies: data.save_cookies,
      enable_javascript: data.enable_javascript,
      block_ads: data.block_ads,
      custom_settings: data.custom_settings || {}
    }
  }

  static async saveUserPreferences(userId: string, preferences: Partial<UserPreferences>) {
    const db = DatabaseConnection.getInstance()
    
    const dbData: any = {
      user_id: userId,
      updated_at: new Date().toISOString()
    }
    
    if (preferences.homepage_url !== undefined) dbData.homepage_url = preferences.homepage_url
    if (preferences.theme !== undefined) dbData.theme_mode = preferences.theme
    if (preferences.clear_on_exit !== undefined) dbData.clear_on_exit = preferences.clear_on_exit
    if (preferences.save_history !== undefined) dbData.save_history = preferences.save_history
    if (preferences.save_cookies !== undefined) dbData.save_cookies = preferences.save_cookies
    if (preferences.enable_javascript !== undefined) dbData.enable_javascript = preferences.enable_javascript
    if (preferences.block_ads !== undefined) dbData.block_ads = preferences.block_ads
    if (preferences.custom_settings !== undefined) dbData.custom_settings = preferences.custom_settings

    const { data, error } = await db
      .from('user_preferences')
      .upsert(dbData, { onConflict: 'user_id' })
      .select()
    
    if (error) throw error
    return data[0]
  }

  static getDefaultPreferences(): UserPreferences {
    return {
      homepage_url: 'https://www.google.com',
      theme: 'dark',
      clear_on_exit: false,
      save_history: true,
      save_cookies: true,
      enable_javascript: true,
      block_ads: false,
      custom_settings: {}
    }
  }
}

export default SettingsManager
