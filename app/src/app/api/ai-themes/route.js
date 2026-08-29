import { NextResponse } from 'next/server'
import { CohereClient } from 'cohere-ai'
import { jsonrepair } from 'jsonrepair'

const COHERE_API_URL = 'https://api.cohere.com/v1/chat'

const AI_SYSTEM_PROMPT = [
  'You are a world-class principal UI/UX designer and design systems architect.',
  'Generate elite, production-grade runtime themes for real applications.',
  'Every theme must be visually strong, highly differentiated, and suitable for live use on many page types.',
  'Include practical UI treatment for header, navbar, footer, hero section, search section, search bar, marquee, scroll buttons, spacing, height, margin, outline, and inline display states.',
  'Output ONLY valid JSON. No markdown formatting, no code blocks, no backticks, no explanations. Return raw JSON only.',
].join(' ')

const COLOR_PALETTE_SYSTEM_PROMPT = [
  'You are a professional color theory expert like Canva\'s color palette AI.',
  'Generate harmonious, accessible color palettes for UI design.',
  'Apply complementary, triadic, analogous, monochromatic, and split-complementary color harmony rules.',
  'Ensure WCAG AA contrast compliance.',
  'Output ONLY valid JSON. No explanations.',
].join(' ')

const NEUTRAL_BASELINE = ['#f8fafc', '#111827', '#3b82f6', '#94a3b8', '#e2e8f0']

export async function POST(request) {
  try {
    const { userInput, scanResults, url, randomize } = await request.json()

    if (!userInput || userInput.trim().length === 0) {
      return NextResponse.json(
        { error: 'User input is required' },
        { status: 400 }
      )
    }

    const cohereKey = process.env.COHERE_KEY
    if (!cohereKey) {
      return NextResponse.json(
        { error: 'Cohere API key is missing' },
        { status: 500 }
      )
    }

    const pageProfile = buildPageDesignProfile({ userInput, scanResults, url })
    const pageSeed = buildPageSeed({ userInput, scanResults, url, randomize })

    // Step 1: Generate professional color palettes using APIVerve
    const colorPalettes = await generateColorPalettesWithCohere(userInput, scanResults, url, pageProfile, Boolean(randomize), pageSeed)
    if (!Array.isArray(colorPalettes) || colorPalettes.length === 0) {
      return NextResponse.json(
        { error: 'APIVerve did not return any color palettes' },
        { status: 502 }
      )
    }
    const score = scanResults?.score || 0
    const suggestions = scanResults?.suggestions || []
    
 
    let pageContext = ""
    if (score < 50) {
      pageContext = "This page has significant accessibility issues and needs a high-contrast, clear theme."
    } else if (score < 80) {
      pageContext = "This page has moderate accessibility issues. A clean, balanced theme would help."
    } else {
      pageContext = "This page is fairly accessible. A modern, visually appealing theme would enhance it."
    }
    
    // Add specific suggestions context
    if (suggestions.length > 0) {
      const issueTypes = suggestions.map(s => s.impact).join(', ')
      pageContext += ` Key issues: ${issueTypes}.`
    }

    const persona = pageProfile?.name || 'general'
    const requiredFeatures = [
      'header',
      'navbar',
      'footer',
      'hero section',
      'search section',
      'search bar',
      'scroll left button',
      'scroll right button',
      'scroll to top button',
      'marquee or ticker treatment',
      'padding',
      'height',
      'margin',
      'outline',
      'inline display',
      'inline-block display',
      'block display',
      'cards',
      'forms',
      'buttons',
      'inputs',
    ]

    const prompt = `Generate 2 professional UI themes using these APIVerve color palettes.

USER QUERY: "${userInput}"
PAGE SCORE: ${score}/100
PALETTES:
${colorPalettes.slice(0, 3).map((p, i) => `${i + 1}. ${p.name}: BG=${p.colors.background}, Primary=${p.colors.primary}, Secondary=${p.colors.secondary}, Accent=${p.colors.accent}, Text=${p.colors.text}`).join('\n')}

Each theme must include comprehensive styling for these UI components:
- background: overall page background
- navbar: navigation bar styling
- search: search section and search bar
- hero: hero section
- header: page header
- footer: page footer
- scroll: scroll buttons (left, right, top)
- marquee: marquee or ticker HTML/CSS if applicable

Return ONLY valid JSON array with 2 themes. Each theme object must have:
- themeName: string
- description: string
- mood: string
- preview: object with {background, primary, secondary, accent, text} colors
- cssVariables: object with CSS custom properties
- components: object with keys for each component above, each containing CSS properties as objects
- globalCss: string under 500 characters

Use only the provided palette colors. Ensure themes are production-ready and visually strong.

DO NOT include any markdown formatting, code blocks, or backticks. Return only the raw JSON array.`

    let themes = []
    try {
      const cohereClient = new CohereClient({ token: cohereKey })
      const timeoutMs = 90000
      console.log('Calling Cohere with prompt length:', prompt.length)
      const cohereResponse = await Promise.race([
        cohereClient.chat({
          model: 'command-r-plus',
          message: prompt,
          temperature: randomize ? 0.8 : 0.6,
          max_tokens: 1200,
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Cohere request timed out')), timeoutMs))
      ])

      const generatedText = String(
        cohereResponse?.text ||
        cohereResponse?.message?.content?.[0]?.text ||
        cohereResponse?.generations?.[0]?.text ||
        cohereResponse?.output?.[0]?.content?.[0]?.text ||
        cohereResponse?.output_text ||
        ''
      ).replace(/```json\s*/g, '').replace(/```\s*$/g, '').replace(/`/g, '').trim()

      if (!generatedText) {
        console.error('Cohere raw response:', JSON.stringify(cohereResponse))
        throw new Error('Cohere returned an empty theme response')
      }

      // Parse the JSON response with better error handling
      let themes = []
      try {
        // Extract JSON array by finding the first '[' and last ']'
        const startIndex = generatedText.indexOf('[')
        const endIndex = generatedText.lastIndexOf(']')
        if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
          const jsonText = generatedText.substring(startIndex, endIndex + 1)
          themes = JSON.parse(jsonText)
        } else {
          // Try parsing the entire text as JSON
          themes = JSON.parse(generatedText)
        }
      } catch (parseError) {
        console.error('JSON parse error:', parseError.message, 'Raw text:', generatedText.substring(0, 500))
        // Try to salvage by removing problematic characters
        try {
          const cleanedText = generatedText
            .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
            .replace(/,(\s*[}\]])/g, '$1') // Remove trailing commas
            .replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":') // Quote unquoted keys

          const startIndex = cleanedText.indexOf('[')
          const endIndex = cleanedText.lastIndexOf(']')
          if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
            const jsonText = cleanedText.substring(startIndex, endIndex + 1)
            themes = JSON.parse(jsonText)
          } else {
            themes = JSON.parse(cleanedText)
          }
        } catch (secondParseError) {
          console.error('Second parse attempt failed:', secondParseError.message)
          // Third attempt: Use jsonrepair to fix common JSON issues
          try {
            const repairedText = jsonrepair(cleanedText)
            const startIndex = repairedText.indexOf('[')
            const endIndex = repairedText.lastIndexOf(']')
            if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
              const jsonText = repairedText.substring(startIndex, endIndex + 1)
              themes = JSON.parse(jsonText)
            } else {
              themes = JSON.parse(repairedText)
            }
          } catch (thirdParseError) {
            console.error('Third parse attempt with jsonrepair failed:', thirdParseError.message)
            throw new Error('Cohere returned invalid JSON format')
          }
        }
      }

      if (!Array.isArray(themes) || themes.length === 0) {
        throw new Error('Cohere returned no themes')
      }
    } catch (cohereError) {
      console.error('Cohere theme generation failed:', cohereError)
      const fallbackThemes = buildThemesFromPalettes(colorPalettes, pageProfile, Boolean(randomize), pageSeed).slice(0, 6)
      return NextResponse.json({
        success: true,
        themes: fallbackThemes.map(t => ({
          id: t.id,
          name: t.name,
          description: t.description,
          mood: t.mood,
          preview: t.preview,
          css: t.css,
          components: t.components,
          featureCoverage: t.featureCoverage,
        })),
        count: fallbackThemes.length,
        source: 'local-fallback',
        warning: 'Cohere timed out or failed; generated themes locally from APIVerve palettes.'
      })
    }

    const templateOrder = getTemplateOrderForPersona(pageProfile, Boolean(randomize))

    // Validate and transform themes to include CSS (simplified)
    const candidateThemes = themes.slice(0, 2).map((theme, index) => {
      const preview = theme.preview || {}
      const cssVars = theme.cssVariables || {}
      const themed = { ...theme, _templateIndex: templateOrder[index % templateOrder.length] }

      // Use provided globalCss or generate minimal fallback
      const css = typeof theme.globalCss === 'string' && theme.globalCss.trim().length > 10
        ? theme.globalCss.trim()
        : generateMinimalCSS(themed, cssVars, colorPalettes[index % colorPalettes.length])

      const normalizedPreview = [
        preview.background || cssVars['--bg'] || colorPalettes[index % colorPalettes.length]?.colors?.background || '#1a1a1a',
        preview.primary || cssVars['--primary'] || colorPalettes[index % colorPalettes.length]?.colors?.primary || '#6366f1',
        preview.secondary || cssVars['--secondary'] || colorPalettes[index % colorPalettes.length]?.colors?.secondary || '#ffffff',
        preview.accent || cssVars['--accent'] || colorPalettes[index % colorPalettes.length]?.colors?.accent || '#ff6b35',
        preview.text || cssVars['--text'] || colorPalettes[index % colorPalettes.length]?.colors?.text || '#e5e7eb',
      ]

      return {
        id: `ai-generated-${Date.now()}-${index}`,
        name: themed.themeName || `AI Theme ${index + 1}`,
        description: themed.description || '',
        mood: themed.mood || '',
        preview: normalizedPreview.slice(0, 3),
        palette: normalizedPreview,
        css: css,
        components: themed.components || {},
        featureCoverage: Array.isArray(themed.featureCoverage) ? themed.featureCoverage : []
      }
    })

    const selectedThemes = selectHighDeltaThemes(candidateThemes, 6, pageProfile, Boolean(randomize))

    return NextResponse.json({
      success: true,
      themes: selectedThemes.map(t => ({
        id: t.id,
        name: t.name,
        description: t.description,
        mood: t.mood,
        preview: t.preview,
        css: t.css,
        components: t.components,
        featureCoverage: t.featureCoverage,
      })),
      count: selectedThemes.length,
      source: 'cohere-ai'
    })

  } catch (error) {
    console.error('Theme generation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate themes' },
      { status: 500 }
    )
  }
}

function buildThemesFromPalettes(colorPalettes = [], pageProfile = null, randomize = false, pageSeed = 0) {
  const palettes = (Array.isArray(colorPalettes) ? colorPalettes : []).slice(0, 6)
  const source = palettes
  if (!source.length) return []
  const templateOrder = getTemplateOrderForPersona(pageProfile, randomize, pageSeed)
  const familyOrder = getThemeFamilyOrder(pageProfile, randomize, pageSeed)

  return source.map((palette, index) => {
    const colors = palette.colors || {}
    const family = familyOrder[index % familyOrder.length]
    const variationSeed = pageSeed + index * 13 + (randomize ? Math.floor(Math.random() * 97) : 0)
    const bg = validateHex(colors.background) || family.colors.background
    const primary = validateHex(colors.primary) || family.colors.primary
    const secondary = validateHex(colors.secondary) || family.colors.secondary
    const accent = validateHex(colors.accent) || family.colors.accent
    const text = validateHex(colors.text) || family.colors.text

    const cssVars = {
      '--bg': mutateColor(bg, variationSeed + 1),
      '--bg-secondary': mutateColor(bg, variationSeed + 7),
      '--text': text,
      '--primary': mutateColor(primary, variationSeed + 3),
      '--secondary': mutateColor(secondary, variationSeed + 5),
      '--accent': mutateColor(accent, variationSeed + 9),
      '--border': mutateColor(text, variationSeed + 11),
      '--shadow': getPerceivedBrightness(bg) < 100 ? 'rgba(2,6,23,0.55)' : 'rgba(15,23,42,0.24)',
    }

    return {
      id: `palette-runtime-${pageSeed}-${index}`,
      name: buildThemeName(family, pageProfile, randomize, index, pageSeed),
      description: buildThemeDescription(family, palette, pageProfile),
      mood: family.mood,
      preview: [cssVars['--bg'], cssVars['--primary'], cssVars['--secondary']],
      palette: [cssVars['--bg'], cssVars['--primary'], cssVars['--secondary'], cssVars['--accent'], cssVars['--text']],
      css: generateCSS({ name: family.name, _templateIndex: templateOrder[index % templateOrder.length] }, cssVars, pageProfile, randomize),
    }
  })
}

function getThemeFamilyOrder(pageProfile = null, randomize = false, pageSeed = 0) {
  const families = getThemeFamilies()
  const prioritized = families
    .map(family => ({ family, score: scoreFamilyForPersona(family, pageProfile) }))
    .sort((a, b) => b.score - a.score)
    .map(item => item.family)

  const order = prioritized.length ? prioritized : families
  if (randomize) return seededShuffle([...order], pageSeed || Date.now())
  return order
}

function getThemeFamilies() {
  return [
    { harmonyType: 'complementary', name: 'Royal Velvet', mood: 'luxury', colors: { background: '#1a0d2e', primary: '#9b59b6', secondary: '#e8d5f5', accent: '#ffd700', text: '#f0e6f8' } },
    { harmonyType: 'analogous', name: 'Ocean Depths', mood: 'calm', colors: { background: '#061428', primary: '#00d4ff', secondary: '#7ecfff', accent: '#00a3cc', text: '#b8d8f8' } },
    { harmonyType: 'triadic', name: 'Vibrant Energy', mood: 'vibrant', colors: { background: '#0d0d0d', primary: '#00ff88', secondary: '#00ccff', accent: '#ff0055', text: '#00ff88' } },
    { harmonyType: 'monochromatic', name: 'Warm Editorial', mood: 'professional', colors: { background: '#faf6f0', primary: '#c0392b', secondary: '#d4a574', accent: '#922b21', text: '#1a1510' } },
    { harmonyType: 'split-complementary', name: 'Sakura Spring', mood: 'elegant', colors: { background: '#fff5f7', primary: '#e91e8c', secondary: '#f0a0c8', accent: '#4a8a6f', text: '#4a1942' } },
    { harmonyType: 'tetradic', name: 'Modern Minimal', mood: 'contemporary', colors: { background: '#0b0f19', primary: '#6366f1', secondary: '#e5e7eb', accent: '#f97316', text: '#e5e7eb' } },
    { harmonyType: 'glass', name: 'Glass Aurora', mood: 'modern', colors: { background: '#0f172a', primary: '#38bdf8', secondary: '#f8fafc', accent: '#a855f7', text: '#e2e8f0' } },
    { harmonyType: 'mono', name: 'Mono Steel', mood: 'minimal', colors: { background: '#09090b', primary: '#52525b', secondary: '#d4d4d8', accent: '#fafafa', text: '#fafafa' } },
    { harmonyType: 'aurora', name: 'Arctic Aurora', mood: 'calm', colors: { background: '#020617', primary: '#2dd4bf', secondary: '#818cf8', accent: '#e2e8f0', text: '#f8fafc' } },
    { harmonyType: 'ember', name: 'Volcanic Ember', mood: 'vibrant', colors: { background: '#0c0a09', primary: '#ea580c', secondary: '#fed7aa', accent: '#78350f', text: '#fafaf9' } },
    { harmonyType: 'nebula', name: 'Cosmic Nebula', mood: 'mystic', colors: { background: '#111827', primary: '#8b5cf6', secondary: '#d8b4fe', accent: '#22d3ee', text: '#f8fafc' } },
    { harmonyType: 'editorial', name: 'Sandstone Luxe', mood: 'editorial', colors: { background: '#1c1917', primary: '#d6d3d1', secondary: '#a8a29e', accent: '#f59e0b', text: '#e7e5e4' } },
  ]
}

function scoreFamilyForPersona(family, pageProfile) {
  if (!pageProfile) return 0
  const name = String(pageProfile.name || '').toLowerCase()
  const text = `${name} ${(pageProfile.directions || []).join(' ')} ${(pageProfile.avoid || []).join(' ')}`
  let score = 0
  if (pageProfile.tags?.education && /editorial|minimal|calm|warm|sakura/.test(family.name.toLowerCase())) score += 24
  if (pageProfile.tags?.institutional && /royal|ocean|glass|cosmic|minimal/.test(family.name.toLowerCase())) score += 20
  if (pageProfile.tags?.science && /glass|aurora|cosmic|mono|ocean/.test(family.name.toLowerCase())) score += 24
  if (pageProfile.tags?.commerce && /royal|vibrant|gold|ember|luxe/.test(family.name.toLowerCase())) score += 20
  if (pageProfile.tags?.app && /glass|minimal|mono|cosmic|aurora/.test(family.name.toLowerCase())) score += 22
  if (pageProfile.tags?.content && /editorial|warm|sakura|sandstone|minimal/.test(family.name.toLowerCase())) score += 22
  if (pageProfile.tags?.auth && /minimal|glass|dark|royal|mono/.test(family.name.toLowerCase())) score += 16
  if (pageProfile.tags?.finance && /royal|cosmic|sandstone|mono|minimal/.test(family.name.toLowerCase())) score += 16
  if (text.includes(family.mood)) score += 4
  return score
}

function buildThemeName(family, pageProfile, randomize, index, pageSeed) {
  const personaPrefix = pageProfile?.name ? pageProfile.name.split(' ')[0] : 'AI'
  const tags = ['Nova', 'Atlas', 'Pulse', 'Drift', 'Prime', 'Aura', 'Vanta', 'Bloom']
  const suffix = randomize
    ? tags[(pageSeed + index * 3) % tags.length]
    : tags[(index + (family.name.length % tags.length)) % tags.length]
  return `${personaPrefix} ${family.name} ${suffix}`
}

function buildThemeDescription(family, palette, pageProfile) {
  return `Persona-aware ${family.mood} theme generated from ${palette.harmonyType || 'smart'} palette for ${pageProfile?.name || 'this page'}`
}

function seededShuffle(arr, seed = 1) {
  const result = arr.slice()
  let value = Math.abs(Number(seed) || 1) % 2147483647
  if (!value) value = 1
  for (let i = result.length - 1; i > 0; i--) {
    value = (value * 48271) % 2147483647
    const j = value % (i + 1)
    const temp = result[i]
    result[i] = result[j]
    result[j] = temp
  }
  return result
}

function getTemplateOrderForPersona(pageProfile = null, randomize = false) {
  const allTemplates = [0, 1, 2, 3, 4, 5]
  if (randomize) return shuffleArray([...allTemplates])

  const personaTemplateMap = {
    'Institutional Science': [1, 4, 0],
    'Education Editorial': [4, 1, 0],
    'Commerce Conversion': [5, 1, 0],
    'Application Dashboard': [1, 3, 2],
    'Content Editorial': [4, 0, 2],
    'General Premium': [0, 1, 5],
  }

  const preferred = personaTemplateMap[pageProfile?.name] || []
  const rest = allTemplates.filter(i => !preferred.includes(i))
  return [...preferred, ...rest]
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = arr[i]
    arr[i] = arr[j]
    arr[j] = tmp
  }
  return arr
}

function generateCSS(theme, cssVars, pageProfile = null, randomize = false) {
  const bg = cssVars['--bg'] || '#1a1a1a'
  const bgSecondary = cssVars['--bg-secondary'] || '#111827'
  const text = cssVars['--text'] || '#ffffff'
  const primary = cssVars['--primary'] || '#6366f1'
  const secondary = cssVars['--secondary'] || '#ffffff'
  const accent = cssVars['--accent'] || '#ff6b35'
  const border = cssVars['--border'] || '#333333'
  const shadow = cssVars['--shadow'] || 'rgba(0,0,0,0.3)'

  const components = theme.components || {}
  const buttonPrimary = components.buttonPrimary || primary
  const buttonSecondary = components.buttonSecondary || secondary

  const fontPairs = [
    { serif: 'Cinzel', sans: 'Crimson Text' },
    { serif: 'Playfair Display', sans: 'Inter' },
    { serif: 'Libre Baskerville', sans: 'Source Sans 3' },
    { serif: 'JetBrains Mono', sans: 'Nunito' },
    { serif: 'DM Serif Display', sans: 'DM Sans' },
    { serif: 'Exo 2', sans: 'Exo 2' },
    { serif: 'Cinzel', sans: 'Inter' },
    { serif: 'Merriweather', sans: 'Poppins' },
  ]

  const templateGenerators = [
    // Luxury / Editorial (Royal Velvet like)
    (vars) => {
      const fonts = fontPairs[0]
      return `@import url('https://fonts.googleapis.com/css2?family=${fonts.serif.replace(/ /g,'+')}:wght@400;600;700&family=${fonts.sans.replace(/ /g,'+')}:wght@300;400;600&display=swap');
        *{box-sizing:border-box!important}
        html,body{background:radial-gradient(ellipse at top,${primary}22,${bg})!important;color:${text}!important;font-family:'${fonts.serif}',serif!important;font-size:18px!important;line-height:1.8!important}
        h1,h2,h3{font-family:'${fonts.serif}',serif!important;color:${adjustBrightness(primary,20)}!important;font-weight:700!important}
        nav,header{background:${adjustBrightness(bg,-8)}!important;border-bottom:1px solid ${border}!important;padding:14px 24px!important}
        .card{background:rgba(255,255,255,0.02)!important;border:1px solid ${mutateColor(border,3)}!important;backdrop-filter:blur(12px)!important;border-radius:12px!important;padding:22px!important;box-shadow:0 12px 40px ${shadow}!important}
        button{background:linear-gradient(135deg,${buttonPrimary},${accent})!important;color:${text}!important;border:none!important;padding:12px 28px!important;border-radius:8px!important;box-shadow:0 8px 30px ${shadow}!important}
      `
    },
    // Modern card-based
    (vars) => {
      const fonts = fontPairs[1]
      return `@import url('https://fonts.googleapis.com/css2?family=${fonts.sans.replace(/ /g,'+')}:wght@300;400;600;700&family=${fonts.serif.replace(/ /g,'+')}:wght@400;600&display=swap');
        *{box-sizing:border-box!important}
        html,body{background:linear-gradient(135deg,${bg},${bgSecondary})!important;color:${text}!important;font-family:'${fonts.sans}',sans-serif!important}
        .card{background:${adjustBrightness(bg,8)}!important;border-radius:16px!important;padding:18px!important;border:1px solid ${mutateColor(border,6)}!important;box-shadow:0 6px 24px ${shadow}!important}
        h1{font-family:'${fonts.serif}',serif!important;color:${primary}!important}
        button{background:${buttonPrimary}!important;color:${adjustBrightness(text,-80)}!important;border-radius:12px!important;padding:10px 22px!important}
      `
    },
    // Glassmorphism / Soft
    (vars) => {
      const fonts = fontPairs[2]
      return `@import url('https://fonts.googleapis.com/css2?family=${fonts.sans.replace(/ /g,'+')}:wght@300;400;600&display=swap');
        html,body{background:linear-gradient(180deg,${adjustBrightness(bg, -6)},${bg})!important;color:${text}!important;font-family:'${fonts.sans}',sans-serif!important}
        .glass{background:rgba(255,255,255,0.06)!important;backdrop-filter:blur(12px)!important;border:1px solid ${mutateColor(border,8)}!important;border-radius:14px!important;box-shadow:0 8px 30px ${shadow}!important}
        button{background:transparent!important;border:1px solid ${primary}!important;color:${primary}!important;padding:10px 20px!important;border-radius:999px!important}
      `
    },
    // Terminal / Mono (for tech)
    (vars) => {
      const fonts = fontPairs[3]
      return `@import url('https://fonts.googleapis.com/css2?family=${fonts.serif.replace(/ /g,'+')}&family=${fonts.sans.replace(/ /g,'+')}:wght@400;500&display=swap');
        html,body{background:${bg}!important;color:${primary}!important;font-family:'${fonts.serif}',monospace!important}
        h1,h2,h3{color:${accent}!important}
        .card{background:${adjustBrightness(bg,6)}!important;border:1px solid ${mutateColor(border,12)}!important;padding:14px!important;border-radius:4px!important}
        button{background:${primary}!important;color:#000!important;padding:8px 18px!important}
      `
    },
    // Minimal Light / Editorial
    (vars) => {
      const fonts = fontPairs[4]
      return `@import url('https://fonts.googleapis.com/css2?family=${fonts.serif.replace(/ /g,'+')}:wght@400;600&family=${fonts.sans.replace(/ /g,'+')}:wght@300;400;600&display=swap');
        html,body{background:${bg}!important;color:${text}!important;font-family:'${fonts.sans}',sans-serif!important}
        h1{font-family:'${fonts.serif}',serif!important;color:${primary}!important}
        .card{background:${adjustBrightness(bg,12)}!important;border-radius:10px!important;padding:16px!important;border:1px solid ${mutateColor(border,4)}!important}
        button{background:${accent}!important;color:${text}!important;padding:10px 20px!important;border-radius:8px!important}
      `
    },
    // Vibrant / Gradient-heavy
    (vars) => {
      const fonts = fontPairs[5]
      return `@import url('https://fonts.googleapis.com/css2?family=${fonts.sans.replace(/ /g,'+')}:wght@300;400;700&display=swap');
        html,body{background:linear-gradient(135deg,${primary},${accent})!important;color:${adjustBrightness(text,-120)}!important;font-family:'${fonts.sans}',sans-serif!important}
        .hero{padding:80px 20px;background:linear-gradient(90deg,${adjustBrightness(primary,10)},${adjustBrightness(accent,-10)})!important;color:${adjustBrightness(text,-140)}!important}
        .card{background:rgba(255,255,255,0.06)!important;border-radius:14px!important;padding:18px!important;box-shadow:0 12px 40px ${shadow}!important}
        button{background:${adjustBrightness(primary,10)}!important;color:${adjustBrightness(text,-140)}!important;padding:12px 26px!important;border-radius:999px!important}
      `
    }
  ]

  const templateOrder = getTemplateOrderForPersona(pageProfile, randomize)
  const seedString = `${theme.id || theme.name || ''}-${primary}-${pageProfile?.name || 'general'}`
  const localSeed = Math.abs(hashColor(seedString))
  const defaultIndex = templateOrder[localSeed % templateOrder.length]
  const templateIndex = Number.isInteger(theme?._templateIndex)
    ? theme._templateIndex
    : defaultIndex
  const css = templateGenerators[templateIndex]({ bg, bgSecondary, text, primary, secondary, accent, border, shadow, buttonPrimary, buttonSecondary })

  return css
}

function augmentRuntimeThemeCss(css, theme, pageProfile = null, randomize = false) {
  const accent = theme?.cssVariables?.['--accent'] || theme?.preview?.accent || '#ff6b35'
  const primary = theme?.cssVariables?.['--primary'] || theme?.preview?.primary || '#6366f1'
  const text = theme?.cssVariables?.['--text'] || theme?.preview?.text || '#e5e7eb'
  const bg = theme?.cssVariables?.['--bg'] || theme?.preview?.background || '#0f172a'
  const bgSecondary = theme?.cssVariables?.['--bg-secondary'] || bg
  const border = theme?.cssVariables?.['--border'] || primary

  const featureLayer = `
/* Runtime affordance layer: common page structures */
:where(header, nav, footer, [class*="header" i], [class*="nav" i], [class*="footer" i]) {
  position: sticky;
  top: 0;
  z-index: 1000;
  backdrop-filter: blur(18px) saturate(1.25);
  background: color-mix(in srgb, ${bg} 88%, transparent) !important;
  border-color: color-mix(in srgb, ${border} 68%, transparent) !important;
}

:where([class*="hero" i], [class*="banner" i], main > section:first-of-type, section:first-of-type) {
  padding: clamp(2rem, 5vw, 5rem) !important;
  min-height: clamp(22rem, 55vh, 42rem);
  display: grid;
  align-items: center;
  gap: 1rem;
  background: linear-gradient(135deg, color-mix(in srgb, ${primary} 82%, ${bg} 18%), color-mix(in srgb, ${accent} 72%, ${bgSecondary} 28%)) !important;
}

:where(form[role="search"], [class*="search" i] form, [class*="searchbar" i], [class*="search-bar" i], input[type="search"]) {
  border-color: color-mix(in srgb, ${border} 72%, transparent) !important;
  box-shadow: 0 16px 40px color-mix(in srgb, ${bg} 52%, transparent) !important;
}

:where(input[type="search"], input[placeholder*="search" i], [class*="search" i] input, [class*="search" i] button) {
  min-height: 2.75rem;
}

:where([class*="scroll-top" i], [aria-label*="top" i], button[data-scroll-top], .scroll-to-top) {
  position: fixed;
  right: 1rem;
  bottom: 1rem;
  z-index: 1100;
  border-radius: 999px !important;
  box-shadow: 0 14px 30px color-mix(in srgb, ${accent} 38%, transparent) !important;
}

:where([class*="scroll-left" i], [data-scroll-left], [aria-label*="left" i], .scroll-left) {
  position: relative;
}

:where([class*="scroll-right" i], [data-scroll-right], [aria-label*="right" i], .scroll-right) {
  position: relative;
}

:where([class*="marquee" i], marquee) {
  overflow: hidden;
  white-space: nowrap;
  display: block;
  animation: theme-marquee ${randomize ? '14s' : '18s'} linear infinite;
}

:where([class*="inline-block" i]) { display: inline-block !important; }
:where([class*="inline" i]) { display: inline !important; }
:where([class*="block" i]) { display: block !important; }

@keyframes theme-marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-12%); }
}
`

  const personaLayer = pageProfile?.name
    ? `
/* Persona tuning for ${pageProfile.name} */
:where(main, section, article, aside) {
  scroll-margin-top: 5rem;
}

:where(button, [role="button"], a.button, .btn) {
  transition: transform 180ms ease, box-shadow 180ms ease, background 180ms ease, color 180ms ease;
}
`
    : ""

  return `${css}\n${featureLayer}\n${personaLayer}`
}

// Helper: Hash color string to number
function hashColor(color) {
  const hex = color.replace('#', '')
  let hash = 0
  for (let i = 0; i < hex.length; i++) {
    hash = ((hash << 5) - hash) + hex.charCodeAt(i)
    hash = hash & hash
  }
  return hash
}

// Helper: Get perceived brightness (0-255)
function getPerceivedBrightness(hex) {
  const [r, g, b] = hexToRgb(hex)
  return (r * 299 + g * 587 + b * 114) / 1000
}

// Helper: Adjust brightness of a hex color
function adjustBrightness(hex, amount) {
  let [r, g, b] = hexToRgb(hex)
  r = Math.max(0, Math.min(255, r + amount))
  g = Math.max(0, Math.min(255, g + amount))
  b = Math.max(0, Math.min(255, b + amount))
  return rgbToHex(r, g, b)
}

// Helper: Convert hex to RGB
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : [0, 0, 0]
}

// Helper: Convert RGB to hex
function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('')
}

function selectHighDeltaThemes(candidates, requiredCount, pageProfile = null, randomize = false) {
  const scored = candidates.map((theme, index) => ({
    ...theme,
    _baseScore: scoreAgainstBaseline(theme.palette || theme.preview),
    _richnessScore: scoreCssRichness(theme.css),
    _profileScore: scoreAgainstProfile(theme, pageProfile),
    _index: index,
  }))

  scored.sort((a, b) => (b._baseScore + b._richnessScore + b._profileScore) - (a._baseScore + a._richnessScore + a._profileScore))

  const selected = []
  for (const theme of scored) {
    if (selected.length >= requiredCount) break
    const diversityScore = selected.length ? averageDistance(theme.palette, selected.map(s => s.palette)) : 100
    const total = theme._baseScore + theme._richnessScore + theme._profileScore + diversityScore * 0.25
    if (total >= 190 || selected.length < 2) {
      selected.push(theme)
    }
  }

  let seed = 0
  while (selected.length < requiredCount && scored.length > 0) {
    const base = scored[seed % scored.length]
    selected.push(createEnhancedVariant(base, seed + 1, pageProfile, randomize))
    seed++
  }

  return selected.slice(0, requiredCount)
}

function createEnhancedVariant(theme, seed, pageProfile = null, randomize = false) {
  const palette = (theme.palette || []).map((hex, i) => mutateColor(hex, seed + i * 3))
  const [bg, primary, secondary, accent, text] = palette.length >= 5
    ? palette
    : ['#0b1020', '#7c3aed', '#f1f5f9', '#f97316', '#e2e8f0']

  return {
    ...theme,
    id: `${theme.id}-v${seed}`,
    name: `${theme.name} Variant ${seed}`,
    mood: `${theme.mood || 'Dynamic'} · Enhanced`,
    description: `${theme.description || 'High-impact'} variant with stronger visual delta`,
    preview: [bg, primary, secondary],
    palette: [bg, primary, secondary, accent, text],
    css: generateCSS({
      components: {
        buttonPrimary: primary,
        buttonSecondary: secondary,
        card: bg,
        navbar: bg,
        input: bg,
      }
    }, {
      '--bg': bg,
      '--bg-secondary': mutateColor(bg, seed + 9),
      '--text': text,
      '--primary': primary,
      '--secondary': secondary,
      '--accent': accent,
      '--border': mutateColor(text, seed + 11),
      '--shadow': 'rgba(2,6,23,0.45)',
    }, pageProfile, randomize)
  }
}

function scoreCssRichness(css) {
  const tokens = [
    /linear-gradient/gi,
    /radial-gradient/gi,
    /box-shadow/gi,
    /backdrop-filter/gi,
    /:hover/gi,
    /:focus-visible/gi,
  ]
  const tokenScore = tokens.reduce((sum, rx) => sum + ((css.match(rx) || []).length > 0 ? 10 : 0), 0)
  const lengthScore = Math.min(Math.floor((css || '').length / 120), 60)
  return tokenScore + lengthScore
}

function scoreAgainstBaseline(palette) {
  const normalized = normalizePalette(palette)
  const baseline = normalizePalette(NEUTRAL_BASELINE)
  let total = 0
  for (let i = 0; i < Math.min(normalized.length, baseline.length); i++) {
    total += colorDistance(normalized[i], baseline[i])
  }
  const contrastBonus = computeContrastBonus(normalized)
  return total / Math.max(1, normalized.length) + contrastBonus
}

function averageDistance(palette, previousPalettes) {
  if (!previousPalettes.length) return 100
  const current = normalizePalette(palette)
  const values = previousPalettes.map(prev => {
    const p = normalizePalette(prev)
    const len = Math.min(current.length, p.length)
    let total = 0
    for (let i = 0; i < len; i++) total += colorDistance(current[i], p[i])
    return total / Math.max(1, len)
  })
  return values.reduce((a, b) => a + b, 0) / values.length
}

function scoreAgainstProfile(theme, pageProfile) {
  if (!pageProfile) return 0
  const text = `${String(theme.name || '').toLowerCase()} ${String(theme.mood || '').toLowerCase()} ${String(theme.description || '').toLowerCase()}`
  let score = 0

  if (pageProfile.tags.education && /(clean|editorial|institutional|minimal|calm)/.test(text)) score += 28
  if (pageProfile.tags.institutional && /(editorial|premium|dark|luxury|clean)/.test(text)) score += 28
  if (pageProfile.tags.science && /(tech|clean|dark|precision|aurora|ocean)/.test(text)) score += 28
  if (pageProfile.tags.commerce && /(premium|vibrant|clean|dark|luxury)/.test(text)) score += 22
  if (pageProfile.tags.content && /(editorial|warm|clean|nature|minimal)/.test(text)) score += 22
  if (pageProfile.tags.app && /(tech|clean|dark|minimal|premium)/.test(text)) score += 22
  if (pageProfile.tags.auth && /(clean|premium|dark|minimal)/.test(text)) score += 14
  if (pageProfile.tags.health && /(calm|clean|nature|soft)/.test(text)) score += 18
  if (pageProfile.tags.finance && /(premium|dark|clean|institutional)/.test(text)) score += 18

  if (pageProfile.directions.some(direction => text.includes(direction))) score += 12
  if (pageProfile.avoid.some(word => text.includes(word))) score -= 18

  return score
}

function normalizePalette(palette) {
  const source = Array.isArray(palette) ? palette : []
  const fallback = ['#0f172a', '#7c3aed', '#f8fafc', '#f97316', '#e2e8f0']
  const merged = [...source, ...fallback].slice(0, 5)
  return merged.map(hexToRgbObject)
}

function hexToRgbObject(hex) {
  const clean = String(hex || '').trim().replace('#', '')
  const full = clean.length === 3
    ? clean.split('').map(c => c + c).join('')
    : clean.padEnd(6, '0').slice(0, 6)
  const n = Number.parseInt(full, 16)
  return {
    r: (n >> 16) & 255,
    g: (n >> 8) & 255,
    b: n & 255,
  }
}

function colorDistance(a, b) {
  const dr = a.r - b.r
  const dg = a.g - b.g
  const db = a.b - b.b
  return Math.sqrt(dr * dr + dg * dg + db * db)
}

function computeContrastBonus(rgbPalette) {
  if (!rgbPalette.length) return 0
  const bg = rgbPalette[0]
  const text = rgbPalette[4] || rgbPalette[2] || rgbPalette[1]
  const ratio = contrastRatio(bg, text)
  if (ratio >= 7) return 60
  if (ratio >= 4.5) return 40
  if (ratio >= 3) return 20
  return 0
}

function contrastRatio(c1, c2) {
  const l1 = luminance(c1)
  const l2 = luminance(c2)
  const light = Math.max(l1, l2)
  const dark = Math.min(l1, l2)
  return (light + 0.05) / (dark + 0.05)
}

function luminance({ r, g, b }) {
  const toLinear = (v) => {
    const s = v / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  }
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)
}

function mutateColor(hex, seed) {
  const { r, g, b } = hexToRgbObject(hex)
  const amount = (seed * 37) % 56 - 28
  const next = {
    r: clamp(r + amount),
    g: clamp(g - Math.floor(amount / 2)),
    b: clamp(b + Math.floor(amount / 3)),
  }
  return rgbToHexObject(next)
}

function rgbToHexObject({ r, g, b }) {
  return `#${[r, g, b].map(v => clamp(v).toString(16).padStart(2, '0')).join('')}`
}

function clamp(v) {
  return Math.max(0, Math.min(255, Math.round(v)))
}

// ========== APIVERVE COLOR PALETTE GENERATION ==========

async function generateColorPalettesWithCohere(userInput, scanResults, url, pageProfile = null, randomize = false, pageSeed = 0) {
  try {
    // Deterministic per-page seed by default; true random seed when requested
    const deterministicSeedSource = `${String(url || '')}|${String(userInput || '')}|${Number(scanResults?.score || 0)}|${(scanResults?.suggestions || []).length}`
    const computedPageSeed = pageSeed || (randomize
      ? Math.floor(Math.random() * 1000000000)
      : Math.abs(hashColor(deterministicSeedSource)) % 100000)

    // Step 1: Get professional palettes from APIVerve
    const apiVerveKey = process.env.APIVERVE_API_KEY
    if (!apiVerveKey) {
      throw new Error('APIVerve color palettes key is missing')
    }

    const apiVervePalettes = await fetchAPIVervePalettes(userInput, scanResults, pageProfile, computedPageSeed)
    if (apiVervePalettes && apiVervePalettes.length > 0) {
      return apiVervePalettes
    }

    console.warn('APIVerve returned no palettes — falling back to built-in palettes')
    return getFallbackPalettes()
  } catch (error) {
    console.error('Color palette generation error:', error)
    return null
  }
}

// ========== APIVERVE INTEGRATION ==========

async function fetchAPIVervePalettes(userInput, scanResults, pageProfile = null, seed = null) {
  try {
    const apiVerveKey = process.env.APIVERVE_API_KEY
    if (!apiVerveKey) {
      return null
    }

    const score = scanResults?.score || 0
    const mood = pageProfile?.mood || 'contemporary'

    const apiVerveUrl = 'https://api.apiverve.com/v1/colorpalette'
    const baseColor = buildAPIVerveBaseColor({ userInput, scanResults, pageProfile, seed })
    const scheme = buildAPIVerveSchemeOrder(score, randomizeFromSeed(seed))[0] || 'triade'
    const variation = buildAPIVerveVariation(score, 0)
    const params = new URLSearchParams({
      color: baseColor.replace('#', ''),
      scheme,
      variation,
      count: '5',
      distance: '0.5',
      addComplement: String(scheme === 'analogic'),
      webSafe: 'false',
    })

    const response = await fetch(`${apiVerveUrl}?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-API-Key': apiVerveKey,
      }
    })

    if (!response.ok) {
      const errorBody = await response.text().catch(() => '')
      console.warn('APIVerve request failed:', response.status, errorBody)
      return null
    }

    const data = await response.json()
    console.warn('APIVerve response status:', response.status)
    const apiPalette = mapAPIVerveResponseToPalette(data, mood, 0)
    if (!apiPalette) return null

    return buildPaletteVariantsFromAPIVervePalette(apiPalette, score, pageProfile, seed)
  } catch (error) {
    console.error('APIVerve fetch error:', error)
    return null
  }
}

function randomizeFromSeed(seed) {
  return Boolean(seed && String(seed).length > 0)
}

function buildAPIVerveSchemeOrder(score, randomize) {
  const safeOrder = score < 50
    ? ['contrast', 'triade', 'analogic', 'tetrade', 'mono']
    : score < 80
      ? ['analogic', 'triade', 'tetrade', 'contrast', 'mono']
      : ['mono', 'analogic', 'triade', 'tetrade', 'contrast']

  return randomize ? seededShuffle([...safeOrder], score || Date.now()) : safeOrder
}

function buildAPIVerveVariation(score, index) {
  const variations = score < 50
    ? ['soft', 'light', 'default', 'pastel', 'hard', 'soft']
    : score < 80
      ? ['default', 'soft', 'light', 'pastel', 'hard', 'default']
      : ['light', 'default', 'soft', 'pastel', 'hard', 'light']

  return variations[index % variations.length]
}

function mapAPIVerveResponseToPalette(data, mood, index) {
  const payload = data?.data || data?.result || data
  const paletteColors = Array.isArray(payload?.colorPalette)
    ? payload.colorPalette
    : Array.isArray(payload?.colors)
      ? payload.colors
      : Array.isArray(payload?.palette)
        ? payload.palette
        : Array.isArray(payload?.palettes)
          ? payload.palettes.flatMap(extractPaletteColors)
      : Array.isArray(payload?.colorPaletteRaw)
        ? payload.colorPaletteRaw.map(hex => ({ hex: `#${String(hex).replace('#', '')}` }))
        : extractPaletteColors(payload)

  if (!paletteColors.length) return null

  const normalized = paletteColors.slice(0, 5).map(item => {
    const hex = typeof item === 'string' ? item : item?.hex
    return validateHex(hex)
  }).filter(Boolean)

  if (!normalized.length) return null

  const fallback = [
    '#0f172a',
    '#7c3aed',
    '#f8fafc',
    '#f97316',
    '#e5e7eb',
  ]

  const colors = [...normalized, ...fallback].slice(0, 5)
  const bgHex = colors[0]
  const primaryHex = colors[1]
  const secondaryHex = colors[2]
  const accentHex = colors[3]
  const textHex = colors[4]

  return {
    id: `apiverve-palette-${Date.now()}-${index}`,
    harmonyType: payload?.scheme || payload?.harmonyType || 'triade',
    name: payload?.sourceName || payload?.name || `APIVerve Palette ${index + 1}`,
    mood,
    colors: {
      background: bgHex,
      primary: primaryHex,
      secondary: secondaryHex,
      accent: accentHex,
      text: textHex,
    },
    contrast: computeAccessibilityScore({
      background: bgHex,
      primary: primaryHex,
      secondary: secondaryHex,
      accent: accentHex,
      text: textHex,
    }),
    source: 'apiverve',
    sourceColor: payload?.source || null,
    paletteMeta: {
      scheme: payload?.scheme || null,
      variation: payload?.variation || null,
      distance: payload?.distance ?? null,
      colorCount: payload?.colorCount ?? null,
    }
  }
}

function buildPaletteVariantsFromAPIVervePalette(apiPalette, score, pageProfile = null, seed = null) {
  const baseColors = [
    apiPalette.colors.background,
    apiPalette.colors.primary,
    apiPalette.colors.secondary,
    apiPalette.colors.accent,
    apiPalette.colors.text,
  ]

  const variantOrder = score < 50
    ? [
        [0, 1, 2, 3, 4],
        [0, 3, 1, 2, 4],
        [0, 2, 1, 4, 3],
        [0, 4, 1, 2, 3],
        [0, 1, 3, 2, 4],
        [0, 2, 4, 1, 3],
      ]
    : [
        [0, 1, 2, 3, 4],
        [0, 2, 1, 3, 4],
        [0, 3, 2, 1, 4],
        [0, 4, 1, 3, 2],
        [0, 1, 4, 2, 3],
        [0, 2, 3, 4, 1],
      ]

  const themePaletteProfiles = getThemePaletteProfiles(pageProfile, seed)

  return variantOrder.map((order, index) => {
    const colors = order.map(colorIndex => baseColors[colorIndex] || baseColors[0])
    const profile = themePaletteProfiles[index % themePaletteProfiles.length]

    return {
      id: `${apiPalette.id}-variant-${index}`,
      harmonyType: apiPalette.harmonyType,
      name: `${apiPalette.name} ${profile.suffix}`,
      mood: profile.mood || apiPalette.mood,
      colors: {
        background: colors[0],
        primary: colors[1],
        secondary: colors[2],
        accent: colors[3],
        text: colors[4],
      },
      contrast: computeAccessibilityScore({
        background: colors[0],
        primary: colors[1],
        secondary: colors[2],
        accent: colors[3],
        text: colors[4],
      }),
      source: apiPalette.source,
      sourceColor: apiPalette.sourceColor,
      paletteMeta: apiPalette.paletteMeta,
    }
  })
}

function getThemePaletteProfiles(pageProfile = null, seed = null) {
  const suffixes = ['Nova', 'Atlas', 'Pulse', 'Drift', 'Prime', 'Aura']
  const moods = pageProfile?.paletteModes?.length
    ? pageProfile.paletteModes
    : ['balanced', 'vibrant', 'soft', 'high-contrast']

  const shuffledSuffixes = randomizeFromSeed(seed)
    ? seededShuffle([...suffixes], Math.abs(hashColor(String(seed || 'theme'))))
    : suffixes

  return shuffledSuffixes.map((suffix, index) => ({
    suffix,
    mood: moods[index % moods.length],
  }))
}

function buildAPIVerveBaseColor({ userInput, scanResults, pageProfile, seed }) {
  const source = [
    String(userInput || ''),
    String(pageProfile?.name || ''),
    String(pageProfile?.intent || ''),
    String(pageProfile?.mood || ''),
    String(scanResults?.score || 0),
    String((scanResults?.suggestions || []).length),
    String(seed || ''),
  ].join('|')

  const hash = Math.abs(hashColor(source))
  const colors = [
    'ff5733', '22c55e', '3b82f6', 'a855f7', 'f97316',
    '14b8a6', 'e11d48', '0ea5e9', 'f59e0b', '8b5cf6'
  ]

  return `#${colors[hash % colors.length]}`
}

function extractPaletteColors(palette) {
  if (Array.isArray(palette)) return palette
  if (Array.isArray(palette?.colors)) return palette.colors
  if (Array.isArray(palette?.palette)) return palette.palette

  const candidates = []
  const seen = new Set()

  function walk(value) {
    if (!value || seen.has(value)) return
    if (typeof value === 'string') {
      if (/^#?[0-9a-fA-F]{6}$/.test(value)) candidates.push(value)
      return
    }
    if (Array.isArray(value)) {
      value.forEach(walk)
      return
    }
    if (typeof value === 'object') {
      seen.add(value)
      Object.values(value).forEach(walk)
    }
  }

  walk(palette)
  return candidates
}

function validateHex(color) {
  if (!color || typeof color !== 'string') return null
  const hex = color.trim()
  if (/^#[0-9a-fA-F]{6}$/.test(hex)) return hex
  if (/^[0-9a-fA-F]{6}$/.test(hex)) return `#${hex}`
  return null
}

function computeAccessibilityScore(colors) {
  try {
    const bg = hexToRgb(colors?.background || '#000000')
    const text = hexToRgb(colors?.text || '#ffffff')
    const primary = hexToRgb(colors?.primary || '#0000ff')
    
    const bgTextContrast = contrastRatio(bg, text)
    const bgPrimaryContrast = contrastRatio(bg, primary)
    
    let score = 0
    if (bgTextContrast >= 7) score += 40
    else if (bgTextContrast >= 4.5) score += 30
    else if (bgTextContrast >= 3) score += 20
    
    if (bgPrimaryContrast >= 4.5) score += 30
    else if (bgPrimaryContrast >= 3) score += 20
    
    score += 30 // Color harmony bonus
    return Math.min(100, score)
  } catch {
    return 60
  }
}

function buildPageDesignProfile({ userInput, scanResults, url }) {
  const host = String(url || '').replace(/^https?:\/\/(www\.)?/i, '').split('/')[0].toLowerCase()
  const text = `${String(userInput || '').toLowerCase()} ${host} ${(scanResults?.suggestions || []).map(s => `${s?.id || ''} ${s?.title || ''} ${s?.explanation || ''}`).join(' ').toLowerCase()}`

  const tags = {
    education: /(education|school|college|university|course|learn|academy|student|faculty)/.test(text),
    institutional: /(nasa|isro|government|institute|research|laboratory|lab|official|authority)/.test(text),
    science: /(science|research|space|data|lab|scientific|engineering|technical)/.test(text),
    commerce: /(shop|store|cart|product|checkout|ecom|market|pricing|plan|buy)/.test(text),
    content: /(blog|news|article|docs|documentation|guide|tutorial|read)/.test(text),
    app: /(saas|dashboard|admin|app|tool|platform|analytics|crm|panel)/.test(text),
    auth: /(login|signup|register|password|account|profile|settings)/.test(text),
    health: /(health|medical|clinic|hospital|care|wellness)/.test(text),
    finance: /(bank|finance|fintech|invest|wallet|payment)/.test(text),
  }

  const pages = [
    { name: 'Institutional Science', mood: 'professional', intent: 'best for universities, labs, agencies, and national institutions', paletteModes: ['high-contrast', 'balanced'], directions: ['clean', 'editorial', 'precision', 'structured'], avoid: ['playful', 'candy', 'neon'] },
    { name: 'Education Editorial', mood: 'calm', intent: 'best for schools, colleges, courses, and learning portals', paletteModes: ['balanced', 'soft'], directions: ['editorial', 'clean', 'warm', 'minimal'], avoid: ['glitch', 'terminal', 'harsh'] },
    { name: 'Commerce Conversion', mood: 'vibrant', intent: 'best for stores, pricing pages, and conversion-focused flows', paletteModes: ['vibrant', 'balanced'], directions: ['premium', 'clear', 'bold', 'high-contrast'], avoid: ['flat', 'muted'] },
    { name: 'Application Dashboard', mood: 'modern', intent: 'best for SaaS dashboards, admin panels, and product tools', paletteModes: ['balanced', 'high-contrast'], directions: ['clean', 'tech', 'structured', 'minimal'], avoid: ['ornate', 'decorative'] },
    { name: 'Content Editorial', mood: 'calm', intent: 'best for blogs, news, knowledge bases, and docs', paletteModes: ['balanced', 'soft'], directions: ['editorial', 'readable', 'clean', 'warm'], avoid: ['loud', 'neon'] },
    { name: 'General Premium', mood: 'contemporary', intent: 'best for general websites that need a polished modern identity', paletteModes: ['balanced', 'vibrant'], directions: ['premium', 'modern', 'clean', 'polished'], avoid: ['generic', 'plain'] },
  ]

  if (tags.institutional || tags.science) return { ...pages[0], tags }
  if (tags.education) return { ...pages[1], tags }
  if (tags.commerce || tags.finance) return { ...pages[2], tags }
  if (tags.app || tags.auth) return { ...pages[3], tags }
  if (tags.content) return { ...pages[4], tags }
  return { ...pages[5], tags }
}

function buildPageSeed({ userInput, scanResults, url, randomize = false }) {
  const refreshEntropy = randomize ? `${Date.now()}|${Math.random()}` : 'stable'
  const seedText = `${String(url || '').toLowerCase()}|${String(userInput || '').toLowerCase()}|${Number(scanResults?.score || 0)}|${Number(scanResults?.violations || 0)}|${(scanResults?.suggestions || []).map(s => `${s?.id || ''}:${s?.impact || ''}`).join(';')}|${refreshEntropy}`
  let seed = 0
  for (let i = 0; i < seedText.length; i++) {
    seed = (seed * 31 + seedText.charCodeAt(i)) % 2147483647
  }
  return seed
}

function generateMinimalCSS(theme, cssVars, palette) {
  const bg = cssVars['--bg'] || palette?.colors?.background || '#1a1a1a'
  const primary = cssVars['--primary'] || palette?.colors?.primary || '#6366f1'
  const secondary = cssVars['--secondary'] || palette?.colors?.secondary || '#ffffff'
  const accent = cssVars['--accent'] || palette?.colors?.accent || '#ff6b35'
  const text = cssVars['--text'] || palette?.colors?.text || '#e5e7eb'
  const border = cssVars['--border'] || text
  const shadow = cssVars['--shadow'] || 'rgba(0,0,0,0.3)'

  return `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&display=swap');
* { box-sizing: border-box; }
html, body { background: ${bg}; color: ${text}; font-family: 'Inter', sans-serif; margin: 0; padding: 0; }
.card { background: rgba(255,255,255,0.05); border: 1px solid ${border}; border-radius: 8px; padding: 16px; box-shadow: 0 4px 12px ${shadow}; }
button { background: ${primary}; color: ${secondary}; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; }
button:hover { background: ${accent}; }
input { background: rgba(255,255,255,0.1); border: 1px solid ${border}; color: ${text}; padding: 8px; border-radius: 4px; }`
}

function getFallbackPalettes() {
  return [
    { harmonyType: 'complementary', name: 'Royal Velvet', mood: 'luxury', colors: { background: '#1a0d2e', primary: '#9b59b6', secondary: '#e8d5f5', accent: '#ffd700', text: '#f0e6f8' } },
    { harmonyType: 'analogous', name: 'Ocean Depths', mood: 'calm', colors: { background: '#061428', primary: '#00d4ff', secondary: '#7ecfff', accent: '#00a3cc', text: '#b8d8f8' } },
    { harmonyType: 'triadic', name: 'Vibrant Energy', mood: 'vibrant', colors: { background: '#0d0d0d', primary: '#00ff88', secondary: '#00ccff', accent: '#ff0055', text: '#00ff88' } },
    { harmonyType: 'monochromatic', name: 'Warm Editorial', mood: 'professional', colors: { background: '#faf6f0', primary: '#c0392b', secondary: '#d4a574', accent: '#922b21', text: '#1a1510' } },
    { harmonyType: 'split-complementary', name: 'Sakura Spring', mood: 'elegant', colors: { background: '#fff5f7', primary: '#e91e8c', secondary: '#f0a0c8', accent: '#4a8a6f', text: '#4a1942' } },
    { harmonyType: 'tetradic', name: 'Modern Minimal', mood: 'contemporary', colors: { background: '#0b0f19', primary: '#6366f1', secondary: '#e5e7eb', accent: '#f97316', text: '#e5e7eb' } },
  ]
}