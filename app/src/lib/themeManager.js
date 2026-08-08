// Theme Manager - Handles theme persistence and application
// Uses sessionStorage to ensure themes are removed on page reload

const THEME_STORAGE_KEY = 'current_theme_session';

export const themeManager = {
  /**
   * Save active theme to sessionStorage
   */
  saveActiveTheme: (theme) => {
    if (!theme) {
      sessionStorage.removeItem(THEME_STORAGE_KEY);
      return;
    }
    sessionStorage.setItem(THEME_STORAGE_KEY, JSON.stringify({
      name: theme.name,
      id: theme.id,
      css: theme.css,
      savedAt: new Date().toISOString(),
    }));
  },

  /**
   * Get active theme from sessionStorage
   */
  getActiveTheme: () => {
    try {
      const stored = sessionStorage.getItem(THEME_STORAGE_KEY);
      if (!stored) return null;
      return JSON.parse(stored);
    } catch {
      return null;
    }
  },

  /**
   * Clear stored theme from sessionStorage
   */
  clearActiveTheme: () => {
    sessionStorage.removeItem(THEME_STORAGE_KEY);
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
