import { createClient } from '@supabase/supabase-js'

class DatabaseConnection {
  private static clientInstance: any = null
  
  static getInstance() {
    if (!this.clientInstance) {
      const apiUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
      const publicKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      this.clientInstance = createClient(apiUrl, publicKey)
    }
    return this.clientInstance
  }

  static async authenticateUser(email: string, password: string) {
    const db = this.getInstance()
    const result = await db.auth.signInWithPassword({
      email: email,
      password: password,
    })
    return result
  }

  static async createUser(email: string, password: string, metadata: any = {}) {
    const db = this.getInstance()
    const result = await db.auth.signUp({
      email: email,
      password: password,
      options: { data: metadata }
    })
    return result
  }

  static async signOutUser() {
    const db = this.getInstance()
    await db.auth.signOut()
  }

  static async getCurrentSession() {
    const db = this.getInstance()
    const { data } = await db.auth.getSession()
    return data.session
  }

  static async resetUserPassword(email: string) {
    const db = this.getInstance()
    const result = await db.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`
    })
    return result
  }
}

export default DatabaseConnection
