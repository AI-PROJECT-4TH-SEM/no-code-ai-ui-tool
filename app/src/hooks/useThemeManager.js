import { useContext } from 'react'
import { AuthContext } from '@/context/AuthContext'

/**
 * Custom hook to provide theme manager with access token
 * Returns themeManager instance with bound access token
 */
export const useThemeManager = () => {
  const { accessToken } = useContext(AuthContext) || {}
  const { themeManager } = require('@/lib/themeManager')

  return {
    /**
     * Save theme with access token
     */
    saveTheme: async (theme) => {
      return themeManager.saveActiveTheme(theme, accessToken)
    },

    /**
     * Get active theme with access token
     */
    getTheme: async () => {
      return themeManager.getActiveTheme(accessToken)
    },

    /**
     * Clear theme with access token
     */
    clearTheme: async () => {
      return themeManager.clearActiveTheme(accessToken)
    },

    /**
     * Migrate local data to database
     */
    migrateLocalData: async (data) => {
      if (!accessToken) return { error: 'Not authenticated' }

      try {
        const response = await fetch('/api/migrate-local-data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify(data),
        })

        if (!response.ok) {
          throw new Error('Migration failed')
        }

        return await response.json()
      } catch (error) {
        console.error('Migration error:', error)
        return { error: error.message }
      }
    },
  }
}
