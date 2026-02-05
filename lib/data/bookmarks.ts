import DatabaseConnection from '../auth/connection'

export interface BookmarkData {
  id?: string
  title: string
  url: string
  folder: string
  icon_url?: string
  position?: number
}

class BookmarkManager {
  static async fetchAllBookmarks(userId: string) {
    const db = DatabaseConnection.getInstance()
    const { data, error } = await db
      .from('bookmarks')
      .select('*')
      .eq('user_id', userId)
      .order('position', { ascending: true })
    
    if (error) throw error
    return data
  }

  static async addBookmark(userId: string, bookmark: BookmarkData) {
    const db = DatabaseConnection.getInstance()
    const { data, error } = await db
      .from('bookmarks')
      .insert([{
        user_id: userId,
        title: bookmark.title,
        url: bookmark.url,
        folder: bookmark.folder || 'default',
        icon_url: bookmark.icon_url,
        position: bookmark.position || 0
      }])
      .select()
    
    if (error) throw error
    return data[0]
  }

  static async removeBookmark(bookmarkId: string, userId: string) {
    const db = DatabaseConnection.getInstance()
    const { error } = await db
      .from('bookmarks')
      .delete()
      .eq('id', bookmarkId)
      .eq('user_id', userId)
    
    if (error) throw error
    return true
  }

  static async modifyBookmark(bookmarkId: string, userId: string, updates: Partial<BookmarkData>) {
    const db = DatabaseConnection.getInstance()
    const { data, error } = await db
      .from('bookmarks')
      .update(updates)
      .eq('id', bookmarkId)
      .eq('user_id', userId)
      .select()
    
    if (error) throw error
    return data[0]
  }
}

export default BookmarkManager
