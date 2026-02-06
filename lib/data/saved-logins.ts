import DatabaseConnection from '../auth/connection'
import { encrypt, decrypt } from '../security/encryption'

export interface SavedLogin {
  id?: string
  domain: string
  username: string
  encryptedPassword: string
  lastUsed?: string
  createdAt?: string
}

export interface DecryptedLogin {
  id?: string
  domain: string
  username: string
  password: string
  lastUsed?: string
  createdAt?: string
}

class SavedLoginsManager {
  /**
   * Save a new login or update existing one
   * @param userId - User ID
   * @param domain - Website domain
   * @param username - Username/email
   * @param password - Plain text password (will be encrypted)
   * @param masterPassword - Master password for encryption
   */
  static async saveLogin(
    userId: string,
    domain: string,
    username: string,
    password: string,
    masterPassword: string
  ): Promise<SavedLogin> {
    const db = DatabaseConnection.getInstance()
    
    // Encrypt the password
    const encryptedPassword = await encrypt(password, masterPassword)
    
    // Check if login already exists for this domain and username
    const { data: existing } = await db
      .from('saved_logins')
      .select('*')
      .eq('user_id', userId)
      .eq('domain', domain)
      .eq('username_field', username)
      .maybeSingle()
    
    if (existing) {
      // Update existing login
      const { data, error } = await db
        .from('saved_logins')
        .update({
          encrypted_password: encryptedPassword,
          last_used: new Date().toISOString()
        })
        .eq('id', existing.id)
        .select()
      
      if (error) throw error
      
      return {
        id: data[0].id,
        domain: data[0].domain,
        username: data[0].username_field,
        encryptedPassword: data[0].encrypted_password,
        lastUsed: data[0].last_used,
        createdAt: data[0].created_at
      }
    } else {
      // Insert new login
      const { data, error } = await db
        .from('saved_logins')
        .insert([{
          user_id: userId,
          domain: domain,
          username_field: username,
          encrypted_password: encryptedPassword,
          last_used: new Date().toISOString()
        }])
        .select()
      
      if (error) throw error
      
      return {
        id: data[0].id,
        domain: data[0].domain,
        username: data[0].username_field,
        encryptedPassword: data[0].encrypted_password,
        lastUsed: data[0].last_used,
        createdAt: data[0].created_at
      }
    }
  }

  /**
   * Get all saved logins for a user (passwords remain encrypted)
   */
  static async getAllLogins(userId: string): Promise<SavedLogin[]> {
    const db = DatabaseConnection.getInstance()
    
    const { data, error } = await db
      .from('saved_logins')
      .select('*')
      .eq('user_id', userId)
      .order('domain', { ascending: true })
    
    if (error) throw error
    
    return data.map((login: any) => ({
      id: login.id,
      domain: login.domain,
      username: login.username_field,
      encryptedPassword: login.encrypted_password,
      lastUsed: login.last_used,
      createdAt: login.created_at
    }))
  }

  /**
   * Get saved logins for a specific domain
   */
  static async getLoginsForDomain(userId: string, domain: string): Promise<SavedLogin[]> {
    const db = DatabaseConnection.getInstance()
    
    const { data, error } = await db
      .from('saved_logins')
      .select('*')
      .eq('user_id', userId)
      .eq('domain', domain)
      .order('last_used', { ascending: false })
    
    if (error) throw error
    
    return data.map((login: any) => ({
      id: login.id,
      domain: login.domain,
      username: login.username_field,
      encryptedPassword: login.encrypted_password,
      lastUsed: login.last_used,
      createdAt: login.created_at
    }))
  }

  /**
   * Get a decrypted login
   * @param loginId - Login ID
   * @param userId - User ID
   * @param masterPassword - Master password for decryption
   */
  static async getDecryptedLogin(
    loginId: string,
    userId: string,
    masterPassword: string
  ): Promise<DecryptedLogin> {
    const db = DatabaseConnection.getInstance()
    
    const { data, error } = await db
      .from('saved_logins')
      .select('*')
      .eq('id', loginId)
      .eq('user_id', userId)
      .single()
    
    if (error) throw error
    
    // Decrypt the password
    const password = await decrypt(data.encrypted_password, masterPassword)
    
    return {
      id: data.id,
      domain: data.domain,
      username: data.username_field,
      password,
      lastUsed: data.last_used,
      createdAt: data.created_at
    }
  }

  /**
   * Delete a saved login
   */
  static async deleteLogin(loginId: string, userId: string): Promise<boolean> {
    const db = DatabaseConnection.getInstance()
    
    const { error } = await db
      .from('saved_logins')
      .delete()
      .eq('id', loginId)
      .eq('user_id', userId)
    
    if (error) throw error
    return true
  }

  /**
   * Delete all saved logins for a domain
   */
  static async deleteLoginsForDomain(userId: string, domain: string): Promise<boolean> {
    const db = DatabaseConnection.getInstance()
    
    const { error } = await db
      .from('saved_logins')
      .delete()
      .eq('user_id', userId)
      .eq('domain', domain)
    
    if (error) throw error
    return true
  }

  /**
   * Delete all saved logins for a user
   */
  static async deleteAllLogins(userId: string): Promise<boolean> {
    const db = DatabaseConnection.getInstance()
    
    const { error } = await db
      .from('saved_logins')
      .delete()
      .eq('user_id', userId)
    
    if (error) throw error
    return true
  }

  /**
   * Update the last used timestamp for a login
   */
  static async updateLastUsed(loginId: string, userId: string): Promise<void> {
    const db = DatabaseConnection.getInstance()
    
    const { error } = await db
      .from('saved_logins')
      .update({ last_used: new Date().toISOString() })
      .eq('id', loginId)
      .eq('user_id', userId)
    
    if (error) throw error
  }
}

export default SavedLoginsManager
