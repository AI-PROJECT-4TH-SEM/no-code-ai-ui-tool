// Theme Manager - Handles theme persistence with MongoDB for authenticated users
// Falls back to sessionStorage for anonymous users

const THEME_STORAGE_KEY = 'current_theme_session';
const FALLBACK_THEME = 'AI Minimal';

export const themeManager = {
  /**
   * Save active theme to MongoDB (for authenticated users) or sessionStorage (for anonymous)
   */
  saveActiveTheme: async (theme, accessToken = null) => {
    if (!theme) {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(THEME_STORAGE_KEY);
      }
      return;
    }

    // For authenticated users, save to MongoDB
    if (accessToken) {
      try {
        const response = await fetch('/api/theme', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ themeName: theme.name || theme }),
        });

        if (!response.ok) {
          console.warn('Failed to save theme to database, using session storage as fallback');
          // Fall back to session storage
          if (typeof window !== 'undefined') {
            sessionStorage.setItem(THEME_STORAGE_KEY, JSON.stringify({
              name: theme.name || theme,
              id: theme.id,
              css: theme.css,
              savedAt: new Date().toISOString(),
            }));
          }
        }
      } catch (error) {
        console.warn('Theme save error:', error);
        // Fall back to session storage
        if (typeof window !== 'undefined') {
          sessionStorage.setItem(THEME_STORAGE_KEY, JSON.stringify({
            name: theme.name || theme,
            id: theme.id,
            css: theme.css,
            savedAt: new Date().toISOString(),
          }));
        }
      }
    } else {
      // For anonymous users, save to sessionStorage
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(THEME_STORAGE_KEY, JSON.stringify({
          name: theme.name || theme,
          id: theme.id,
          css: theme.css,
          savedAt: new Date().toISOString(),
        }));
      }
    }
  },

  /**
   * Get active theme from MongoDB (for authenticated users) or sessionStorage (for anonymous)
   */
  getActiveTheme: async (accessToken = null) => {
    // For authenticated users, fetch from MongoDB
    if (accessToken) {
      try {
        const response = await fetch('/api/theme', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          return { name: data.theme };
        }
      } catch (error) {
        console.warn('Failed to fetch theme from database:', error);
      }
    }

    // Fall back to sessionStorage
    if (typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem(THEME_STORAGE_KEY);
        if (stored) return JSON.parse(stored);
      } catch (error) {
        console.warn('Failed to parse stored theme:', error);
      }
    }

    return { name: FALLBACK_THEME };
  },

  /**
   * Clear stored theme
   */
  clearActiveTheme: async (accessToken = null) => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(THEME_STORAGE_KEY);
    }

    // For authenticated users, reset to default in database
    if (accessToken) {
      try {
        await fetch('/api/theme', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ themeName: FALLBACK_THEME }),
        });
      } catch (error) {
        console.warn('Failed to clear theme from database:', error);
      }
    }
  },

  /**
   * Generate CSS file content from inline styles in HTML
   */
  extractModificationsCss: (html) => {
    let css = '/* Auto-generated CSS from applied modifications */\n\n';

    try {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const elementsWithStyles = doc.querySelectorAll('[style]');

      elementsWithStyles.forEach((el, index) => {
        const tagName = el.tagName.toLowerCase();
        const className = el.className || '';
        const id = el.id || '';

        const selector = id
          ? `#${id}`
          : className
            ? `.${className.split(' ').join('.')}`
            : `${tagName}:nth-of-type(${index + 1})`;

        css += `${selector} {\n`;
        css += `  /* ${el.style.cssText} */\n`;

        Array.from(el.style).forEach(prop => {
          css += `  ${prop}: ${el.style.getPropertyValue(prop)};\n`;
        });

        css += '}\n\n';
      });

      return css || '/* No modifications found */';
    } catch {
      return '/* Error extracting CSS */';
    }
  }
}
