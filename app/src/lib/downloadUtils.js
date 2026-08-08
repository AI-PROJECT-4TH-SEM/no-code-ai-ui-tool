// Download Utilities - Handles all file downloads for modified HTML/CSS

export const downloadUtils = {
  /**
   * Download HTML file with applied theme and modifications
   */
  downloadHtmlFile: (html, filename = 'modified-page.html') => {
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  },

  /**
   * Download CSS file with all applied modifications
   */
  downloadCssFile: (css, filename = 'modifications.css') => {
    const blob = new Blob([css], { type: 'text/css;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  },

  /**
   * Generic file download method
   */
  downloadFile: (content, filename, mimeType = 'text/plain') => {
    const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  /**
   * Download HTML with theme as a self-contained file
   * Theme CSS is embedded in the HTML file
   */
  downloadSelfContainedHtml: (html, theme = null, filename = 'page.html') => {
    let finalHtml = html;

    if (theme) {
      // Inject theme CSS directly into HTML head
      finalHtml = html.replace(
        '</head>',
        `  <style data-theme="${theme.name}">${theme.css}</style>\n</head>`
      );
    }

    downloadUtils.downloadHtmlFile(finalHtml, filename);
  },

  /**
   * Download all files as a ZIP-like structure (creates individual files)
   * Note: Browsers don't support ZIP, so we download individual files
   */
  downloadAllModifications: async (html, css, theme = null) => {
    const timestamp = new Date().toISOString().slice(0, 10);
    const baseFilename = `ui-mods-${timestamp}`;

    // 1. Download self-contained HTML
    let htmlContent = html;
    if (theme) {
      htmlContent = html.replace(
        '</head>',
        `  <style data-theme="${theme.name}">${theme.css}</style>\n</head>`
      );
    }

    // 2. Add note at the beginning of CSS file
    const cssContent = `/* 
 * Applied Modifications CSS
 * Theme: ${theme?.name || 'Default'}
 * Created: ${new Date().toLocaleString()}
 */\n\n${css}`;

    // 3. Create README with instructions
    const readmeContent = `# UI Modifications - Setup Instructions

## Files Included:
1. **${baseFilename}-full.html** - Complete HTML with theme applied (self-contained, ready to use)
2. **${baseFilename}-style.css** - CSS file with all modifications

## How to Use:

### Option 1: Quick Use
Simply open the \`${baseFilename}-full.html\` file in any browser. All styles are already embedded.

### Option 2: Separate Files
If you want to use the HTML with external CSS:
1. Keep the HTML and CSS files in the same folder
2. Edit the HTML file and change the \`</head>\` section to include:
   \`\`\`html
   <link rel="stylesheet" href="${baseFilename}-style.css">
   \`\`\`

## Customization:
- Edit \`${baseFilename}-style.css\` to make further changes
- All modifications preserve the original HTML structure
- Theme CSS is applied globally to all elements

## Notes:
- Tested on modern browsers (Chrome, Firefox, Safari, Edge)
- All styling uses CSS that's compatible with standard CSS frameworks
- You can integrate these styles into your build process if needed

## Support:
For issues or questions, refer to the main application documentation.`;

    // Download all files
    downloadUtils.downloadFile(htmlContent, `${baseFilename}-full.html`, 'text/html');
    downloadUtils.downloadFile(cssContent, `${baseFilename}-style.css`, 'text/css');
    downloadUtils.downloadFile(readmeContent, `${baseFilename}-README.md`, 'text/markdown');

    // Also provide a summary
    const summary = `Download Summary
=================
Files downloaded at: ${new Date().toLocaleString()}

Files:
- ${baseFilename}-full.html (ready to use immediately)
- ${baseFilename}-style.css (separate styles)
- ${baseFilename}-README.md (setup instructions)

All files are ready for integration into your project.`;

    console.log(summary);
  },
};

export default downloadUtils;
