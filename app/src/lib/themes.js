
  export const themes = [


     {
    id: "midnight-luxury",
    name: "🌙 Midnight Luxury",
    preview: ["#0a0a0f","#c9a84c","#e8e0d0"],
    css: `
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@300;400;500;600&display=swap');
      *{transition:background 0.3s ease,color 0.3s ease,border-color 0.3s ease,box-shadow 0.3s ease!important;box-sizing:border-box!important}
      html,body{background:#0a0a0f!important;color:#e8e0d0!important;font-family:'Inter',sans-serif!important;line-height:1.7!important}
      h1,h2,h3,h4,h5,h6{font-family:'Playfair Display',serif!important;color:#c9a84c!important;letter-spacing:-0.02em!important;line-height:1.2!important}
      h1{font-size:2.4em!important;margin-bottom:0.5em!important}
      h2{font-size:1.9em!important}h3{font-size:1.5em!important}
      p{color:#c8bfb0!important;font-size:1.05em!important;line-height:1.8!important;margin-bottom:1.2em!important}
      a{color:#c9a84c!important;text-decoration:none!important;border-bottom:1px solid rgba(201,168,76,0.3)!important;padding-bottom:1px!important}
      a:hover{color:#e8c96d!important;border-bottom-color:#e8c96d!important}
      a:focus{outline:3px solid #c9a84c!important;outline-offset:3px!important;border-radius:3px!important}
      button,[type=button],[type=submit],[role=button]{background:linear-gradient(135deg,#c9a84c,#a8863c)!important;color:#0a0a0f!important;border:none!important;border-radius:8px!important;padding:10px 24px!important;font-weight:600!important;font-size:0.95em!important;cursor:pointer!important;letter-spacing:0.03em!important;box-shadow:0 4px 20px rgba(201,168,76,0.3)!important}
      button:hover{background:linear-gradient(135deg,#e8c96d,#c9a84c)!important;box-shadow:0 6px 28px rgba(201,168,76,0.45)!important;transform:translateY(-1px)!important}
      button:focus{outline:3px solid #c9a84c!important;outline-offset:3px!important}
      input,textarea,select{background:#14141c!important;color:#e8e0d0!important;border:1px solid #2a2820!important;border-radius:8px!important;padding:10px 14px!important;font-size:1em!important}
      input:focus,textarea:focus,select:focus{border-color:#c9a84c!important;outline:none!important;box-shadow:0 0 0 3px rgba(201,168,76,0.2)!important}
      input::placeholder{color:#5a5040!important}
      nav,header{background:#07070c!important;border-bottom:1px solid #1e1c18!important;padding:12px 24px!important}
      nav a{border-bottom:none!important;font-weight:500!important;color:#a89070!important;padding:6px 12px!important;border-radius:6px!important}
      nav a:hover{background:rgba(201,168,76,0.1)!important;color:#c9a84c!important}
      footer{background:#07070c!important;border-top:1px solid #1e1c18!important;color:#6a6050!important;padding:24px!important}
      div,section,article,aside,main{background:transparent!important}
      .card,[class*=card],[class*=panel],[class*=box]{background:#12121a!important;border:1px solid #1e1c18!important;border-radius:12px!important;padding:20px!important;box-shadow:0 8px 32px rgba(0,0,0,0.4)!important}
      img{border-radius:8px!important;opacity:0.9!important}
      hr{border-color:#1e1c18!important}
      *:focus-visible{outline:3px solid #c9a84c!important;outline-offset:3px!important;border-radius:4px!important}
    `
  },
  
  { 
    name: " Neon Cyberpunk",
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
    name: "AI Minimal",
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