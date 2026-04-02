
  export const themes = [
  { 
    name: "🚀 Neon Cyberpunk",
    css: `
      body {
        background: radial-gradient(circle at top, #0a0015, #000) !important;
        color: #00f0ff !important;
        font-family: Orbitron, sans-serif !important;
        letter-spacing: 1px !important;
      }

      h1, h2, h3 {
        color: #ff00ff !important;
        text-shadow: 0 0 10px #ff00ff !important;
      }

      button {
        background: #ff00ff !important;
        color: white !important;
        border-radius: 12px !important;
        transform: scale(1.05) !important;
        box-shadow: 0 0 20px #ff00ff !important;
      }

      a {
        color: #00f0ff !important;
      }

      * {
        transition: all 0.3s ease !important;
      }
    `
  },

  {
    name: "🧠 AI Minimal",
    css: `
      body {
        background: #0b0f19 !important;
        color: #e5e7eb !important;
        font-family: Inter, sans-serif !important;
      }

      h1, h2, h3 {
        color: #6366f1 !important;
        font-weight: 600 !important;
      }

      button {
        background: #6366f1 !important;
        color: white !important;
        border-radius: 10px !important;
      }

      * {
        transition: all 0.2s ease !important;
      }
    `
  },

  {
    name: "🌌 Glass Futuristic",
    css: `
      body {
        background: linear-gradient(135deg, #0f172a, #1e293b) !important;
        color: #fff !important;
        font-family: Poppins, sans-serif !important;
      }

      div, section, article {
        background: rgba(255,255,255,0.1) !important;
        backdrop-filter: blur(15px) !important;
        border-radius: 16px !important;
      }

      h1, h2, h3 {
        color: #38bdf8 !important;
      }

      button {
        background: rgba(255,255,255,0.2) !important;
        border-radius: 12px !important;
      }
    `
  },

  {
    name: "⚡ Electric Bold",
    css: `
      body {
        background: #000 !important;
        color: #facc15 !important;
        font-family: Rajdhani, sans-serif !important;
        font-weight: bold !important;
        text-transform: uppercase !important;
      }

      h1, h2, h3 {
        color: #f97316 !important;
      }

      button {
        background: #f97316 !important;
        color: white !important;
        transform: scale(1.1) !important;
      }

      * {
        transition: all 0.3s ease !important;
      }
    `
  },

  {
    name: "🔥 Fiery",
    css: `
      body { background: #1c0a00 !important; color: #fed7aa !important; }
      h1, h2, h3 { color: #f97316 !important; }
      button { background: #ea580c !important; color: white !important; border: none !important; border-radius: 8px !important; }
      a { color: #f97316 !important; }
    `
  },
  {
    name: "🌙 Midnight",
    css: `
      body { background: #0f0f1a !important; color: #c4b5fd !important; }
      h1, h2, h3 { color: #a78bfa !important; }
      button { background: #7c3aed !important; color: white !important; border: none !important; border-radius: 8px !important; }
      a { color: #a78bfa !important; }
    `
  },
  {
    name: "☀️ Sunny",
    css: `
      body { background: #fefce8 !important; color: #713f12 !important; }
      h1, h2, h3 { color: #ca8a04 !important; }
      button { background: #eab308 !important; color: white !important; border: none !important; border-radius: 8px !important; }
      a { color: #ca8a04 !important; }
    `
  },
  {
    name: "🍬 Candy",
    css: `
      body { background: #fdf2f8 !important; color: #831843 !important; }
      h1, h2, h3 { color: #db2777 !important; }
      button { background: #ec4899 !important; color: white !important; border: none !important; border-radius: 8px !important; }
      a { color: #db2777 !important; }
    `
  },


  {
    name: "🌈 Colorful",
    css:`
      body { background: #fff7ed !important; color: #333 !important; }
      h1, h2, h3 { color: #f97316 !important; }
      button { background: #f97316 !important; color: white !important; border: none !important; border-radius: 8px !important; }
      a { color: #f97316 !important; }
    `
  },

  {
    name: "🌊 Ocean",
    css: `
      body { background: #0c1e3c !important; color: #e0f0ff !important; }
      h1, h2, h3 { color: #38bdf8 !important; }
      button { background: #0ea5e9 !important; color: white !important; border: none !important; border-radius: 8px !important; }
      a { color: #38bdf8 !important; }
    `
  },

  {
    name: "🌿 Nature",
    css: `
      body { background: #f0fdf4 !important; color: #166534 !important; }
      h1, h2, h3 { color: #16a34a !important; }
      button { background: #22c55e !important; color: white !important; border: none !important; border-radius: 8px !important; }
      a { color: #16a34a !important; }
    `
  },

  {
    name: "🧬 Matrix Terminal",
    css: `
      body {
        background: #000 !important;
        color: #00ff00 !important;
        font-family: monospace !important;
        font-style: italic !important;
      }

      h1, h2, h3 {
        color: #00ff00 !important;
        text-shadow: 0 0 5px #00ff00 !important;
      }

      button {
        background: transparent !important;
        border: 1px solid #00ff00 !important;
        color: #00ff00 !important;
      }

      a {
        color: #00ff00 !important;
      }
    `
  }
]