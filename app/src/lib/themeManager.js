// Theme Manager - Handles theme persistence and application
// Uses sessionStorage to ensure themes are removed on page reload

const THEME_STORAGE_KEY = 'current_theme_session';
const APPLIED_CHANGES_KEY = 'applied_changes_session';

export const themeManager = {
  /**
   * Save active theme to sessionStorage
   * SessionStorage is cleared on browser tab close or page reload
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
   * Returns null if no theme or session expired
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
   * Clear all theme data from sessionStorage
   */
  clearActiveTheme: () => {
    sessionStorage.removeItem(THEME_STORAGE_KEY);
  },

  /**
   * Save applied changes (fixes, layout edits, etc)
   */
  saveAppliedChanges: (changes) => {
    if (!changes || changes.length === 0) {
      sessionStorage.removeItem(APPLIED_CHANGES_KEY);
      return;
    }
    sessionStorage.setItem(APPLIED_CHANGES_KEY, JSON.stringify({
      changes: changes.map(c => ({
        id: c._id,
        type: c.themeName,
        html: c.html,
        appliedAt: c.appliedAt,
      })),
      lastUpdated: new Date().toISOString(),
    }));
  },

  /**
   * Get applied changes from sessionStorage
   */
  getAppliedChanges: () => {
    try {
      const stored = sessionStorage.getItem(APPLIED_CHANGES_KEY);
      if (!stored) return [];
      return JSON.parse(stored).changes || [];
    } catch {
      return [];
    }
  },

  /**
   * Inject theme CSS globally into page
   * This modifies the DOM to apply theme across entire page
   */
  applyThemeGlobally: (theme) => {
    if (!theme || !theme.css) return;

    // Remove existing theme style if present
    const existingStyle = document.getElementById('global-theme-style');
    if (existingStyle) existingStyle.remove();

    // Create new style element for theme
    const styleEl = document.createElement('style');
    styleEl.id = 'global-theme-style';
    styleEl.textContent = theme.css;
    document.head.appendChild(styleEl);

    // Save to sessionStorage
    themeManager.saveActiveTheme(theme);
  },

  /**
   * Remove theme from page
   */
  removeThemeGlobally: () => {
    const styleEl = document.getElementById('global-theme-style');
    if (styleEl) styleEl.remove();
    themeManager.clearActiveTheme();
  },

  /**
   * Check if theme is currently applied
   */
  isThemeActive: () => {
    return !!document.getElementById('global-theme-style') || !!themeManager.getActiveTheme();
  },

  /**
   * Auto-apply theme on page load if in sessionStorage
   * (for subsequent page loads within same session)
   */
  restoreThemeIfExists: () => {
    const theme = themeManager.getActiveTheme();
    if (theme) {
      themeManager.applyThemeGlobally(theme);
    }
  },

  /**
   * Generate downloadable content with theme applied
   */
  generateDownloadHtml: (html, theme = null) => {
    const themeCss = theme ? `<style>${theme.css}</style>` : '';
    return html + themeCss;
  },

  /**
   * Generate CSS file content with all modifications
   * Extracts inline styles from HTML elements
   */
  extractModificationsCss: (html) => {
    let css = '/* Auto-generated CSS from applied modifications */\n\n';
    
    try {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      
      // Extract inline styles
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
    } catch (e) {
      return '/* Error extracting CSS */';
    }
  },

  /**
   * Create a package with HTML + CSS file
   * Returns object with html and css content
   */
  createDownloadPackage: (html, theme = null, modifications = []) => {
    const finalHtml = themeManager.generateDownloadHtml(html, theme);
    const modificationsCss = themeManager.extractModificationsCss(html);
    
    return {
      html: finalHtml,
      css: modificationsCss,
      timestamp: new Date().toISOString(),
      hasTheme: !!theme,
      themeUsed: theme?.name || 'None',
      modificationsCount: modifications.length,
    };
  },
};

export default themeManager;
