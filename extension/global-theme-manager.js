// Global Theme Manager for Chrome Extension
// Applies/removes theme styles in the current page DOM only.

window.globalThemeManager = {
  /**
   * Apply theme globally to current page
   */
  applyTheme: (theme) => {
    if (!theme || !theme.css) return;

    // Remove existing global theme style
    const existingStyle = document.getElementById('global-theme-injector');
    if (existingStyle) existingStyle.remove();

    // Create and inject new style
    const styleEl = document.createElement('style');
    styleEl.id = 'global-theme-injector';
    styleEl.setAttribute('data-theme', theme.name || 'custom');
    styleEl.textContent = theme.css;
    document.head.appendChild(styleEl);

  },

  /**
   * Remove theme from current page
   */
  removeTheme: () => {
    const styleEl = document.getElementById('global-theme-injector');
    if (styleEl) styleEl.remove();

  },

  /**
   * Get currently applied theme
   */
  getCurrentTheme: () => {
    const styleEl = document.getElementById('global-theme-injector');
    if (!styleEl) return null;

    return {
      name: styleEl.getAttribute('data-theme'),
      css: styleEl.textContent,
    };
  },

  /**
   * Check if theme is active
   */
  isThemeActive: () => {
    return !!document.getElementById('global-theme-injector');
  },

  /**
   * Theme restoration is handled by extension background/session flow.
   * This function is kept for compatibility with existing callers.
   */
  restoreThemeOnLoad: () => false,

  /**
   * Listen for theme changes from parent window (iframe/main app)
   */
  setupThemeListener: () => {
    window.addEventListener('message', (event) => {
      if (!event.data) return;

      // Handle theme application message
      if (event.data.type === 'APPLY_GLOBAL_THEME' && event.data.theme) {
        window.globalThemeManager.applyTheme(event.data.theme);
      }

      // Handle theme removal message
      if (event.data.type === 'REMOVE_GLOBAL_THEME') {
        window.globalThemeManager.removeTheme();
      }

      // Handle theme status query
      if (event.data.type === 'GET_THEME_STATUS') {
        window.parent.postMessage({
          type: 'THEME_STATUS_RESPONSE',
          isActive: window.globalThemeManager.isThemeActive(),
          theme: window.globalThemeManager.getCurrentTheme(),
        }, '*');
      }
    });
  },

  /**
   * Get all applied modifications CSS
   * Extracts inline styles from all elements
   */
  getModificationsCss: () => {
    let css = '/* Auto-generated CSS from applied modifications */\n\n';

    const elementsWithStyles = document.querySelectorAll('[style]');
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
      Array.from(el.style).forEach((prop) => {
        css += `  ${prop}: ${el.style.getPropertyValue(prop)};\n`;
      });
      css += '}\n\n';
    });

    return css || '/* No modifications found */';
  },

  /**
   * Download current page state with theme applied
   */
  downloadCurrentPage: (filename = 'page.html') => {
    const html = document.documentElement.outerHTML;
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  },
};

if (typeof window !== 'undefined') {
  window.globalThemeManager.setupThemeListener();

}
