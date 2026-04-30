# no-code-ai-ui-tool

This project is a Next.js app with a Chrome extension. The app lets you paste HTML or fetch a URL, analyze the page, open the results workspace, apply themes, move elements, and download the final output. The extension makes the same theme and drag behavior work on live websites.

## Project Flow

### Next.js app startup order

1. `app/src/app/layout.js` runs first for every page.
2. `app/src/context/AuthContext.jsx` wraps the app and refreshes login state.
3. `app/src/app/page.jsx` runs for the home page.
4. After analysis, the router opens `app/src/app/results/page.jsx`.

### Chrome extension startup order

1. `extension/manifest.json` registers the extension.
2. `extension/background.js` starts as the service worker.
3. `extension/content.js` injects on every matched website page.
4. `extension/popup.js` runs when the extension popup opens.

## Main App Flow

### 1. Root layout

`app/src/app/layout.js` imports the global CSS and wraps all pages in `AuthProvider`. That makes login state available everywhere.

### 2. Authentication flow

`app/src/context/AuthContext.jsx` runs a `useEffect()` on load.

1. It calls `/api/refresh`.
2. If refresh succeeds, `accessToken` is stored in context.
3. `login()` posts to `/api/login`.
4. `logout()` posts to `/api/logout`.
5. Pages use `useAuth()` to read `accessToken` and `isLoggedIn`.

### 3. Home page flow

`app/src/app/page.jsx` is the first user screen.

1. The user types HTML or enters a URL.
2. If a URL is entered, `fetchUrl()` calls `/api/fetch-url`.
3. If HTML is pasted, `handleAnalyse()` saves it through `/api/html`.
4. `handleAnalyse()` then creates a session through `/api/session`.
5. The router sends the user to `/results?sessionId=...`.

### 4. Results page flow

`app/src/app/results/page.jsx` is the main editing workspace.

1. It reads `sessionId` from the URL.
2. It loads the session data and renders the preview.
3. It imports `themes` from `app/src/lib/themes.js`.
4. It imports `themeManager` from `app/src/lib/themeManager.js`.
5. It imports `downloadUtils` from `app/src/lib/downloadUtils.js`.
6. The user can apply a theme, remove it, edit layout, move elements, or download output.

## Results Page Execution Order

When the results page opens, the usual order is:

1. React renders the page.
2. Session data is read from the query string.
3. Preview state is prepared.
4. Theme buttons and download buttons are rendered.
5. User applies a theme or fix.
6. Theme manager stores the active theme in session-only storage.
7. Download utilities package the modified HTML, CSS, or full export.

## Theme Workflow

Theme behavior is split between the results page and the shared theme manager.

### App theme flow

1. User clicks a theme card.
2. `handleThemeChange(theme)` runs in `results/page.jsx`.
3. `themeManager.saveActiveTheme(theme)` stores the theme for the session.
4. `themeManager.applyThemeGlobally(theme)` injects the CSS.
5. The preview updates.
6. If the user clicks Remove, `removeTheme()` clears the saved state and removes the injected style.
7. If the page reloads, the theme is cleared automatically.

### Extension theme flow

1. `popup.js` sends `SAVE_THEME` after a theme is applied.
2. `background.js` stores the theme with a website origin key in `chrome.storage.session`.
3. `content.js` asks for `LOAD_THEME` for the current website.
4. The same origin key is used on other pages of the same website.
5. The theme appears on settings, profile, about, and other pages on that site.
6. Reload clears the theme state, so nothing stays saved in localStorage.

## Drag Workflow

Drag logic lives mainly in `extension/content.js`.

### Drag order

1. User enables drag mode.
2. `enableDragMode()` installs mouse and keyboard listeners.
3. `onDragStart()` selects the element.
4. `onDragMove()` follows the cursor.
5. If the pointer moves enough, `beginCarryMode()` creates a placeholder and lifts the element.
6. `updateCarriedPosition()` keeps the element under the cursor.
7. `finishCarryAtCurrentPosition()` drops the element where the cursor is.
8. `findContainerDropTarget()` and `getContainerInsertReference()` decide the exact container position.

### Drag behavior goal

The drag system is meant to let the user:

1. Move any element by pointer.
2. Drop it exactly where the cursor is pointing.
3. Move elements between blocks such as `div`, `span`, `header`, `main`, `footer`, `section`, `nav`, and `button` containers.
4. Keep the element fixed at the new position after drop.

## Download Workflow

Downloads are handled by `app/src/lib/downloadUtils.js`.

### Download order

1. User clicks a download button.
2. The results page collects the current HTML and CSS.
3. `downloadUtils.downloadSelfContainedHtml()` creates a single HTML file.
4. `downloadUtils.downloadCssFile()` creates a CSS-only file.
5. `downloadUtils.downloadAllModifications()` creates a full package.
6. The browser downloads the file through Blob/ObjectURL.

## File Connection Map

### App files

1. `app/src/app/layout.js` sets up the app shell.
2. `app/src/context/AuthContext.jsx` manages login state.
3. `app/src/app/page.jsx` starts the user flow.
4. `app/src/app/results/page.jsx` is the main editor and export page.
5. `app/src/lib/themeManager.js` manages theme state.
6. `app/src/lib/downloadUtils.js` manages downloads.
7. `app/src/lib/themes.js` stores the available theme list.

### Extension files

1. `extension/manifest.json` registers the extension.
2. `extension/background.js` stores and loads theme data.
3. `extension/content.js` changes live websites.
4. `extension/global-theme-manager.js` applies the current theme in the page DOM.
5. `extension/popup.js` is the control panel.

## Typical User Journey

1. Open the home page.
2. Paste HTML or fetch a live site.
3. Log in if required.
4. Run Analyse.
5. Open the results page.
6. Apply a theme.
7. Remove or change the theme if needed.
8. Move elements with drag mode.
9. Download HTML, CSS, or a complete package.
10. Use the extension on live websites and keep the same theme across pages of the same site.

## Important Behavior Rules

1. Nothing is stored in localStorage for theme persistence.
2. Theme state is session-only.
3. Reload removes the applied theme.
4. Same-site pages share the theme through the origin key.
5. Dragging uses cursor position, not page layout guessing.

## Run The Project

```bash
cd app
npm install
npm run dev
```

## Code Flow Summary

```text
Browser opens app
	-> layout.js
	-> AuthContext.jsx
	-> page.jsx
	-> /api/fetch-url or /api/html
	-> /api/session
	-> results/page.jsx
	-> themeManager.js / downloadUtils.js
	-> extension background.js / content.js / popup.js when using extension
```

This README is the single top-level workflow document for the repository.
