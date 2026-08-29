const THEMES = [

 {
    id: "canva-gradient-pro",
    name: "🎨 Canva Color-Grade",
    preview: ["#6366f1", "#a855f7", "#ec4899"],
    css: `
      /* Global Layout Overhaul */
      :root { --c-grad: linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%); }
      
      body { background: #0f172a !important; color: #f1f5f9 !important; font-family: 'Inter', sans-serif !important; }
      
      /* Header, Navbar & Footer - High Contrast */
      header, nav, footer, [class*="nav"], [class*="footer"], [class*="header"] { 
        background: rgba(15, 23, 42, 0.95) !important; 
        border-bottom: 2px solid #a855f7 !important;
        backdrop-filter: blur(10px) !important;
      }

      /* Hero Sections & Large Divs */
      [class*="hero"], [class*="banner"], section:first-of-type {
        background: var(--c-grad) !important;
        color: #ffffff !important;
        padding: 60px 20px !important;
        border-radius: 0 0 50px 50px !important;
      }

      /* Disappearing Text Fix */
      p, span, li, h1, h2, h3, h4, td, th { color: #f1f5f9 !important; text-shadow: 0 1px 2px rgba(0,0,0,0.2) !important; }
      a { color: #38bdf8 !important; font-weight: bold !important; text-decoration: underline !important; }
      
      /* Buttons & Interactivity */
      button, [role="button"], .btn { 
        background: var(--c-grad) !important; 
        border: none !important; 
        border-radius: 50px !important; 
        color: #fff !important; 
        font-weight: 800 !important;
        box-shadow: 0 10px 20px rgba(168, 85, 247, 0.3) !important;
      }
    `
  },
  { id:"cyberpunk",  name:"🚀 Neon Cyberpunk",   preview:["#0a0015","#ff00ff","#00f0ff"],
    css:`body{background:radial-gradient(circle at top,#0a0015,#000)!important;color:#00f0ff!important;font-family:Orbitron,sans-serif!important;letter-spacing:1px!important}h1,h2,h3{color:#ff00ff!important;text-shadow:0 0 10px #ff00ff!important}button{background:#ff00ff!important;color:white!important;border-radius:12px!important;box-shadow:0 0 20px #ff00ff!important}a{color:#00f0ff!important}*{transition:all 0.3s ease!important}` },
  { id:"ai-minimal", name:"🧠 AI Minimal",        preview:["#0b0f19","#6366f1","#e5e7eb"],
    css:`body{background:#0b0f19!important;color:#e5e7eb!important;font-family:Inter,sans-serif!important}h1,h2,h3{color:#6366f1!important;font-weight:600!important}button{background:#6366f1!important;color:white!important;border-radius:10px!important}*{transition:all 0.2s ease!important}` },
  { id:"glass",      name:"🌌 Glass Futuristic",  preview:["#0f172a","#38bdf8","#ffffff"],
    css:`body{background:linear-gradient(135deg,#0f172a,#1e293b)!important;color:#fff!important;font-family:Poppins,sans-serif!important}div,section,article{background:rgba(255,255,255,0.07)!important;backdrop-filter:blur(15px)!important;border-radius:16px!important}h1,h2,h3{color:#38bdf8!important}button{background:rgba(255,255,255,0.15)!important;border:1px solid rgba(255,255,255,0.2)!important;border-radius:12px!important;color:white!important}` },
  { id:"electric",   name:"⚡ Electric Bold",     preview:["#000000","#f97316","#facc15"],
    css:`body{background:#000!important;color:#facc15!important;font-family:Rajdhani,sans-serif!important;font-weight:bold!important;text-transform:uppercase!important}h1,h2,h3{color:#f97316!important}button{background:#f97316!important;color:white!important;transform:scale(1.05)!important}*{transition:all 0.3s ease!important}` },
  { id:"colorful",   name:"🌈 Colorful",          preview:["#fff7ed","#f97316","#fb923c"],
    css:`body{background:#fff7ed!important;color:#333!important}h1,h2,h3{color:#f97316!important}button{background:#f97316!important;color:white!important;border:none!important;border-radius:8px!important}a{color:#f97316!important}` },
  { id:"ocean",      name:"🌊 Ocean",             preview:["#0c1e3c","#0ea5e9","#e0f0ff"],
    css:`body{background:#0c1e3c!important;color:#e0f0ff!important}h1,h2,h3{color:#38bdf8!important}button{background:#0ea5e9!important;color:white!important;border:none!important;border-radius:8px!important}a{color:#38bdf8!important}` },
  { id:"nature",     name:"🌿 Nature",            preview:["#f0fdf4","#22c55e","#166534"],
    css:`body{background:#f0fdf4!important;color:#166534!important}h1,h2,h3{color:#16a34a!important}button{background:#22c55e!important;color:white!important;border:none!important;border-radius:8px!important}a{color:#16a34a!important}` },
  { id:"matrix",     name:"🧬 Matrix Terminal",   preview:["#000000","#00ff00","#003300"],
    css:`body{background:#000!important;color:#00ff00!important;font-family:monospace!important;font-style:italic!important}h1,h2,h3{color:#00ff00!important;text-shadow:0 0 5px #00ff00!important}button{background:transparent!important;border:1px solid #00ff00!important;color:#00ff00!important}a{color:#00ff00!important}` },
  { id:"fiery",      name:"🔥 Fiery",             preview:["#1c0a00","#f97316","#fed7aa"],
    css:`body{background:#1c0a00!important;color:#fed7aa!important}h1,h2,h3{color:#f97316!important}button{background:#ea580c!important;color:white!important;border:none!important;border-radius:8px!important}a{color:#f97316!important}` },
  { id:"midnight",   name:"🌙 Midnight",          preview:["#0f0f1a","#a78bfa","#c4b5fd"],
    css:`body{background:#0f0f1a!important;color:#c4b5fd!important}h1,h2,h3{color:#a78bfa!important}button{background:#7c3aed!important;color:white!important;border:none!important;border-radius:8px!important}a{color:#a78bfa!important}` },
  { id:"sunny",      name:"☀️ Sunny",             preview:["#fefce8","#ca8a04","#713f12"],
    css:`body{background:#fefce8!important;color:#713f12!important}h1,h2,h3{color:#ca8a04!important}button{background:#eab308!important;color:white!important;border:none!important;border-radius:8px!important}a{color:#ca8a04!important}` },
  { id:"candy",      name:"🍬 Candy",             preview:["#fdf2f8","#db2777","#831843"],
    css:`body{background:#fdf2f8!important;color:#831843!important}h1,h2,h3{color:#db2777!important}button{background:#ec4899!important;color:white!important;border:none!important;border-radius:8px!important}a{color:#db2777!important}` },


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
    id: "aurora-nord",
    name: "🌌 Aurora Nord",
    preview: ["#2e3440","#88c0d0","#d8dee9"],
    css: `
      @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Nunito:wght@400;600;700;800&display=swap');
      *{transition:all 0.2s ease!important;box-sizing:border-box!important}
      html,body{background:#2e3440!important;color:#d8dee9!important;font-family:'Nunito',sans-serif!important;line-height:1.65!important}
      h1,h2,h3{color:#88c0d0!important;font-weight:800!important}h4,h5,h6{color:#81a1c1!important;font-weight:700!important}
      h1{font-size:2.2em!important}h2{font-size:1.8em!important}h3{font-size:1.4em!important}
      p{color:#e5e9f0!important;margin-bottom:1em!important}
      a{color:#88c0d0!important;text-decoration:none!important;font-weight:600!important}
      a:hover{color:#8fbcbb!important;text-decoration:underline!important}
      a:focus{outline:3px solid #88c0d0!important;outline-offset:3px!important;border-radius:3px!important}
      button,[type=button],[type=submit],[role=button]{background:#5e81ac!important;color:#eceff4!important;border:none!important;border-radius:10px!important;padding:10px 22px!important;font-weight:700!important;font-family:'Nunito',sans-serif!important;letter-spacing:0.02em!important;cursor:pointer!important;box-shadow:0 3px 12px rgba(94,129,172,0.4)!important}
      button:hover{background:#81a1c1!important;box-shadow:0 5px 20px rgba(129,161,193,0.5)!important;transform:translateY(-2px)!important}
      button:focus{outline:3px solid #88c0d0!important;outline-offset:3px!important}
      input,textarea,select{background:#3b4252!important;color:#eceff4!important;border:2px solid #434c5e!important;border-radius:8px!important;padding:9px 13px!important;font-family:'Nunito',sans-serif!important;font-size:1em!important}
      input:focus,textarea:focus,select:focus{border-color:#88c0d0!important;outline:none!important;box-shadow:0 0 0 3px rgba(136,192,208,0.2)!important;background:#434c5e!important}
      input::placeholder{color:#616e88!important}
      nav,header{background:#242933!important;border-bottom:2px solid #3b4252!important;padding:10px 20px!important}
      nav a{color:#8fbcbb!important;padding:6px 14px!important;border-radius:8px!important;font-weight:700!important}
      nav a:hover{background:#3b4252!important;color:#88c0d0!important}
      footer{background:#242933!important;border-top:2px solid #3b4252!important;color:#616e88!important;padding:20px!important}
      .card,[class*=card],[class*=panel],[class*=widget]{background:#3b4252!important;border:1px solid #434c5e!important;border-radius:12px!important;padding:18px!important}
      code,pre,[class*=code],[class*=mono]{font-family:'JetBrains Mono',monospace!important;background:#242933!important;color:#a3be8c!important;border-radius:6px!important;padding:2px 6px!important}
      *:focus-visible{outline:3px solid #88c0d0!important;outline-offset:3px!important;border-radius:4px!important}
    `
  },

  
  {
    id: "sakura-light",
    name: "🌸 Sakura Light",
    preview: ["#fff5f7","#e91e8c","#4a1942"],
    css: `
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display&display=swap');
      *{transition:all 0.2s ease!important;box-sizing:border-box!important}
      html,body{background:#fff5f7!important;color:#3d1a35!important;font-family:'DM Sans',sans-serif!important;line-height:1.7!important}
      h1,h2,h3{font-family:'DM Serif Display',serif!important;color:#8b1a5c!important}
      h4,h5,h6{color:#b02878!important;font-weight:600!important}
      h1{font-size:2.5em!important;letter-spacing:-0.03em!important}
      h2{font-size:1.9em!important}h3{font-size:1.5em!important}
      p{color:#4a1942!important;margin-bottom:1.1em!important;font-size:1.02em!important}
      a{color:#c0336e!important;text-decoration:none!important;font-weight:500!important;border-bottom:1.5px solid rgba(192,51,110,0.3)!important}
      a:hover{color:#8b1a5c!important;border-bottom-color:#8b1a5c!important}
      a:focus{outline:3px solid #e91e8c!important;outline-offset:3px!important;border-radius:3px!important}
      button,[type=button],[type=submit],[role=button]{background:linear-gradient(135deg,#e91e8c,#c0336e)!important;color:white!important;border:none!important;border-radius:50px!important;padding:10px 26px!important;font-weight:600!important;font-family:'DM Sans',sans-serif!important;cursor:pointer!important;box-shadow:0 4px 18px rgba(233,30,140,0.35)!important;letter-spacing:0.02em!important}
      button:hover{background:linear-gradient(135deg,#f04aac,#e91e8c)!important;box-shadow:0 6px 24px rgba(233,30,140,0.5)!important;transform:translateY(-2px)!important}
      button:focus{outline:3px solid #e91e8c!important;outline-offset:3px!important}
      input,textarea,select{background:white!important;color:#3d1a35!important;border:2px solid #f0a0c8!important;border-radius:12px!important;padding:9px 14px!important;font-family:'DM Sans',sans-serif!important;font-size:1em!important}
      input:focus,textarea:focus,select:focus{border-color:#e91e8c!important;outline:none!important;box-shadow:0 0 0 4px rgba(233,30,140,0.12)!important}
      input::placeholder{color:#c090a8!important}
      nav,header{background:white!important;border-bottom:2px solid #fce4ec!important;box-shadow:0 2px 12px rgba(233,30,140,0.08)!important;padding:12px 24px!important}
      nav a{color:#8b1a5c!important;padding:6px 14px!important;border-radius:50px!important;font-weight:600!important;border-bottom:none!important}
      nav a:hover{background:#fce4ec!important;color:#e91e8c!important}
      footer{background:#fce4ec!important;border-top:2px solid #f0a0c8!important;color:#8b5070!important;padding:20px!important}
      .card,[class*=card],[class*=panel],[class*=box]{background:white!important;border:2px solid #fce4ec!important;border-radius:16px!important;padding:20px!important;box-shadow:0 4px 24px rgba(233,30,140,0.08)!important}
      img{border-radius:12px!important}
      *:focus-visible{outline:3px solid #e91e8c!important;outline-offset:3px!important;border-radius:4px!important}
    `
  },

  
  {
    id: "cyber-terminal",
    name: "💻 Cyber Terminal",
    preview: ["#0d0d0d","#00ff88","#ff0055"],
    css: `
      @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@400;500;600;700&display=swap');
      *{transition:color 0.1s,background 0.1s,border-color 0.1s,box-shadow 0.2s!important;box-sizing:border-box!important}
      html,body{background:#0d0d0d!important;color:#00ff88!important;font-family:'Rajdhani',sans-serif!important;font-size:16px!important;line-height:1.6!important}
      h1,h2,h3,h4,h5,h6{font-family:'Share Tech Mono',monospace!important;color:#00ff88!important;text-transform:uppercase!important;letter-spacing:0.1em!important}
      h1{font-size:2em!important;text-shadow:0 0 20px rgba(0,255,136,0.5)!important}
      h2{font-size:1.6em!important;text-shadow:0 0 12px rgba(0,255,136,0.3)!important}
      h3{font-size:1.3em!important;color:#00ccff!important}
      p{color:#88ffbb!important;margin-bottom:1em!important}
      a{color:#ff0055!important;text-decoration:none!important;font-weight:600!important}
      a:hover{color:#ff3377!important;text-shadow:0 0 8px rgba(255,0,85,0.6)!important}
      a:focus{outline:2px solid #ff0055!important;outline-offset:3px!important}
      button,[type=button],[type=submit],[role=button]{background:transparent!important;color:#00ff88!important;border:2px solid #00ff88!important;border-radius:0px!important;padding:10px 24px!important;font-family:'Share Tech Mono',monospace!important;font-weight:400!important;text-transform:uppercase!important;letter-spacing:0.12em!important;cursor:pointer!important;clip-path:polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)!important}
      button:hover{background:#00ff88!important;color:#0d0d0d!important;box-shadow:0 0 20px rgba(0,255,136,0.4)!important}
      button:focus{outline:2px solid #00ff88!important;outline-offset:3px!important}
      input,textarea,select{background:#0a1a0f!important;color:#00ff88!important;border:1px solid #00ff88!important;border-radius:0!important;padding:9px 13px!important;font-family:'Share Tech Mono',monospace!important;font-size:0.95em!important}
      input:focus,textarea:focus,select:focus{border-color:#00ff88!important;outline:none!important;box-shadow:0 0 12px rgba(0,255,136,0.3)!important}
      input::placeholder{color:#005520!important}
      nav,header{background:#050505!important;border-bottom:1px solid #00ff88!important;padding:10px 20px!important}
      nav a{color:#00cc66!important;padding:6px 12px!important;font-family:'Share Tech Mono',monospace!important;text-transform:uppercase!important;letter-spacing:0.08em!important;font-size:0.9em!important}
      nav a:hover{color:#00ff88!important;text-shadow:0 0 8px rgba(0,255,136,0.5)!important}
      footer{background:#050505!important;border-top:1px solid #003318!important;color:#005520!important;padding:20px!important;font-family:'Share Tech Mono',monospace!important}
      .card,[class*=card],[class*=panel],[class*=widget]{background:#0a0a0a!important;border:1px solid #003318!important;border-radius:0!important;padding:16px!important}
      .card:hover,[class*=card]:hover{border-color:#00ff88!important;box-shadow:0 0 16px rgba(0,255,136,0.15)!important}
      *:focus-visible{outline:2px solid #00ff88!important;outline-offset:3px!important}
    `
  },

  {
    id: "warm-editorial",
    name: "📰 Warm Editorial",
    preview: ["#faf6f0","#1a1510","#c0392b"],
    css: `
      @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Source+Sans+3:wght@300;400;600;700&display=swap');
      *{box-sizing:border-box!important;transition:color 0.2s,background 0.2s,border-color 0.2s!important}
      html,body{background:#faf6f0!important;color:#1a1510!important;font-family:'Source Sans 3',sans-serif!important;font-size:17px!important;line-height:1.75!important}
      h1,h2,h3{font-family:'Libre Baskerville',serif!important;color:#1a1510!important;line-height:1.25!important}
      h1{font-size:2.8em!important;letter-spacing:-0.03em!important;border-bottom:3px solid #c0392b!important;padding-bottom:12px!important;margin-bottom:18px!important}
      h2{font-size:1.9em!important;border-left:4px solid #c0392b!important;padding-left:14px!important}
      h3{font-size:1.4em!important;color:#c0392b!important}
      p{color:#2c2520!important;margin-bottom:1.3em!important;font-weight:300!important}
      strong,b{font-weight:700!important;color:#1a1510!important}
      a{color:#c0392b!important;text-decoration:none!important;font-weight:600!important;border-bottom:2px solid rgba(192,57,43,0.3)!important}
      a:hover{color:#922b21!important;border-bottom-color:#922b21!important}
      a:focus{outline:3px solid #c0392b!important;outline-offset:3px!important;border-radius:2px!important}
      button,[type=button],[type=submit],[role=button]{background:#c0392b!important;color:white!important;border:none!important;border-radius:4px!important;padding:10px 24px!important;font-family:'Source Sans 3',sans-serif!important;font-weight:700!important;font-size:0.95em!important;cursor:pointer!important;letter-spacing:0.03em!important}
      button:hover{background:#922b21!important;transform:translateY(-1px)!important;box-shadow:0 4px 14px rgba(192,57,43,0.3)!important}
      button:focus{outline:3px solid #c0392b!important;outline-offset:3px!important}
      input,textarea,select{background:white!important;color:#1a1510!important;border:2px solid #d4c9bc!important;border-radius:4px!important;padding:9px 13px!important;font-family:'Source Sans 3',sans-serif!important;font-size:1em!important}
      input:focus,textarea:focus,select:focus{border-color:#c0392b!important;outline:none!important;box-shadow:0 0 0 3px rgba(192,57,43,0.1)!important}
      input::placeholder{color:#b0a898!important}
      nav,header{background:#1a1510!important;border-bottom:3px solid #c0392b!important;padding:14px 24px!important}
      nav a{color:#e8ddd0!important;border-bottom:none!important;padding:6px 12px!important;font-weight:600!important;font-family:'Source Sans 3',sans-serif!important}
      nav a:hover{color:white!important;text-decoration:underline!important}
      footer{background:#1a1510!important;color:#786a5c!important;padding:20px!important;border-top:3px solid #c0392b!important;font-family:'Libre Baskerville',serif!important}
      blockquote{border-left:5px solid #c0392b!important;margin:20px 0!important;padding:12px 20px!important;background:#f5f0e8!important;font-style:italic!important;color:#4a3a2e!important}
      .card,[class*=card],[class*=box],[class*=panel]{background:white!important;border:1px solid #e8ddd0!important;border-radius:6px!important;padding:20px!important;box-shadow:0 2px 10px rgba(0,0,0,0.06)!important}
      *:focus-visible{outline:3px solid #c0392b!important;outline-offset:3px!important;border-radius:3px!important}
    `
  },

  
  {
    id: "deep-ocean",
    name: "🌊 Deep Ocean",
    preview: ["#061428","#00d4ff","#7ecfff"],
    css: `
      @import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@300;400;600;700;800&display=swap');
      *{box-sizing:border-box!important;transition:all 0.25s ease!important}
      html,body{background:linear-gradient(160deg,#061428 0%,#0a1f3c 50%,#061428 100%)!important;background-attachment:fixed!important;color:#b8d8f8!important;font-family:'Exo 2',sans-serif!important;line-height:1.7!important}
      h1,h2,h3{color:#00d4ff!important;font-weight:800!important;letter-spacing:-0.02em!important}
      h4,h5,h6{color:#7ecfff!important;font-weight:600!important}
      h1{font-size:2.4em!important;text-shadow:0 0 30px rgba(0,212,255,0.4)!important}
      h2{font-size:1.8em!important;text-shadow:0 0 18px rgba(0,212,255,0.25)!important}
      h3{font-size:1.4em!important}
      p{color:#a0c4e8!important;margin-bottom:1.1em!important}
      a{color:#00d4ff!important;text-decoration:none!important;font-weight:500!important}
      a:hover{color:#7ecfff!important;text-shadow:0 0 8px rgba(0,212,255,0.5)!important}
      a:focus{outline:3px solid #00d4ff!important;outline-offset:3px!important;border-radius:3px!important}
      button,[type=button],[type=submit],[role=button]{background:linear-gradient(135deg,#0088cc,#00d4ff)!important;color:#061428!important;border:none!important;border-radius:10px!important;padding:10px 24px!important;font-family:'Exo 2',sans-serif!important;font-weight:700!important;cursor:pointer!important;box-shadow:0 4px 20px rgba(0,212,255,0.3)!important;letter-spacing:0.04em!important}
      button:hover{background:linear-gradient(135deg,#00aaff,#00e8ff)!important;box-shadow:0 6px 28px rgba(0,212,255,0.5)!important;transform:translateY(-2px)!important}
      button:focus{outline:3px solid #00d4ff!important;outline-offset:3px!important}
      input,textarea,select{background:rgba(0,30,60,0.8)!important;color:#b8d8f8!important;border:1px solid rgba(0,212,255,0.25)!important;border-radius:10px!important;padding:10px 14px!important;font-family:'Exo 2',sans-serif!important;font-size:1em!important;backdrop-filter:blur(10px)!important}
      input:focus,textarea:focus,select:focus{border-color:#00d4ff!important;outline:none!important;box-shadow:0 0 0 3px rgba(0,212,255,0.15)!important;background:rgba(0,40,80,0.9)!important}
      input::placeholder{color:#3a6080!important}
      nav,header{background:rgba(6,20,40,0.95)!important;border-bottom:1px solid rgba(0,212,255,0.2)!important;backdrop-filter:blur(20px)!important;padding:12px 24px!important;box-shadow:0 4px 20px rgba(0,0,0,0.3)!important}
      nav a{color:#7ecfff!important;padding:6px 14px!important;border-radius:8px!important;font-weight:600!important}
      nav a:hover{background:rgba(0,212,255,0.1)!important;color:#00d4ff!important}
      footer{background:rgba(4,12,24,0.98)!important;border-top:1px solid rgba(0,212,255,0.1)!important;color:#3a6080!important;padding:20px!important}
      div[class*=card],section[class*=card],[class*=panel],[class*=widget]{background:rgba(0,25,50,0.7)!important;border:1px solid rgba(0,212,255,0.15)!important;border-radius:14px!important;padding:18px!important;backdrop-filter:blur(15px)!important;box-shadow:0 8px 32px rgba(0,0,0,0.3)!important}
      *:focus-visible{outline:3px solid #00d4ff!important;outline-offset:3px!important;border-radius:4px!important}
    `
  },

 
  {
    id: "forest-organic",
    name: "🌿 Forest Organic",
    preview: ["#f4f7f0","#2d5a27","#7fba00"],
    css: `
      @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=Mulish:wght@300;400;600;700&display=swap');
      *{box-sizing:border-box!important;transition:all 0.2s ease!important}
      html,body{background:#f4f7f0!important;color:#1c2e1a!important;font-family:'Mulish',sans-serif!important;line-height:1.75!important}
      h1,h2,h3{font-family:'Lora',serif!important;color:#2d5a27!important;line-height:1.3!important}
      h4,h5,h6{color:#3d7535!important;font-weight:700!important}
      h1{font-size:2.4em!important;letter-spacing:-0.02em!important}
      h2{font-size:1.8em!important}h3{font-size:1.4em!important}
      p{color:#334d30!important;font-weight:300!important;margin-bottom:1.2em!important}
      a{color:#2d7a1f!important;text-decoration:none!important;font-weight:600!important;border-bottom:1.5px solid rgba(45,122,31,0.3)!important}
      a:hover{color:#1d5a10!important;border-bottom-color:#1d5a10!important}
      a:focus{outline:3px solid #7fba00!important;outline-offset:3px!important;border-radius:3px!important}
      button,[type=button],[type=submit],[role=button]{background:linear-gradient(135deg,#3d7535,#2d5a27)!important;color:white!important;border:none!important;border-radius:50px!important;padding:10px 26px!important;font-family:'Mulish',sans-serif!important;font-weight:700!important;cursor:pointer!important;box-shadow:0 4px 16px rgba(45,90,39,0.3)!important}
      button:hover{background:linear-gradient(135deg,#4e9042,#3d7535)!important;box-shadow:0 6px 22px rgba(45,90,39,0.45)!important;transform:translateY(-2px)!important}
      button:focus{outline:3px solid #7fba00!important;outline-offset:3px!important}
      input,textarea,select{background:white!important;color:#1c2e1a!important;border:2px solid #c8dcc2!important;border-radius:10px!important;padding:9px 14px!important;font-family:'Mulish',sans-serif!important;font-size:1em!important}
      input:focus,textarea:focus,select:focus{border-color:#3d7535!important;outline:none!important;box-shadow:0 0 0 4px rgba(61,117,53,0.12)!important}
      input::placeholder{color:#8aaa84!important}
      nav,header{background:white!important;border-bottom:3px solid #c8dcc2!important;box-shadow:0 2px 12px rgba(45,90,39,0.08)!important;padding:12px 24px!important}
      nav a{color:#3d7535!important;padding:6px 14px!important;border-radius:50px!important;border-bottom:none!important;font-weight:700!important}
      nav a:hover{background:#e8f5e4!important;color:#2d5a27!important}
      footer{background:#2d5a27!important;color:#a8cca0!important;padding:20px!important;border-top:3px solid #1d3a18!important}
      footer a{color:#a8cca0!important;border-bottom-color:rgba(168,204,160,0.3)!important}
      .card,[class*=card],[class*=panel],[class*=box]{background:white!important;border:2px solid #e0eedd!important;border-radius:16px!important;padding:20px!important;box-shadow:0 4px 20px rgba(45,90,39,0.06)!important}
      img{border-radius:10px!important}
      *:focus-visible{outline:3px solid #7fba00!important;outline-offset:3px!important;border-radius:4px!important}
    `
  },

 
  {
    id: "sunset-gradient",
    name: "🌅 Sunset Gradient",
    preview: ["#1a0a1e","#ff6b35","#ffd700"],
    css: `
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
      *{box-sizing:border-box!important;transition:all 0.25s ease!important}
      html,body{background:linear-gradient(160deg,#1a0a1e 0%,#2d1030 40%,#1a1428 100%)!important;background-attachment:fixed!important;color:#fde8d8!important;font-family:'Space Grotesk',sans-serif!important;line-height:1.7!important}
      h1,h2,h3{background:linear-gradient(135deg,#ff6b35,#ffd700)!important;-webkit-background-clip:text!important;-webkit-text-fill-color:transparent!important;background-clip:text!important;font-weight:700!important}
      h4,h5,h6{color:#ffaa70!important;font-weight:600!important}
      h1{font-size:2.5em!important;letter-spacing:-0.03em!important}
      h2{font-size:1.9em!important}h3{font-size:1.45em!important}
      p{color:#d4b8a8!important;margin-bottom:1.1em!important}
      a{color:#ff8c50!important;text-decoration:none!important;font-weight:500!important}
      a:hover{color:#ffd700!important}
      a:focus{outline:3px solid #ff6b35!important;outline-offset:3px!important;border-radius:3px!important}
      button,[type=button],[type=submit],[role=button]{background:linear-gradient(135deg,#ff6b35,#ff4500)!important;color:white!important;border:none!important;border-radius:12px!important;padding:10px 26px!important;font-family:'Space Grotesk',sans-serif!important;font-weight:600!important;cursor:pointer!important;box-shadow:0 4px 20px rgba(255,107,53,0.4)!important}
      button:hover{background:linear-gradient(135deg,#ff8c50,#ff6b35)!important;box-shadow:0 6px 30px rgba(255,107,53,0.6)!important;transform:translateY(-2px)!important}
      button:focus{outline:3px solid #ffd700!important;outline-offset:3px!important}
      input,textarea,select{background:rgba(255,100,50,0.08)!important;color:#fde8d8!important;border:1px solid rgba(255,107,53,0.3)!important;border-radius:10px!important;padding:10px 14px!important;font-family:'Space Grotesk',sans-serif!important;font-size:1em!important}
      input:focus,textarea:focus,select:focus{border-color:#ff6b35!important;outline:none!important;box-shadow:0 0 0 3px rgba(255,107,53,0.2)!important}
      input::placeholder{color:#8a4a30!important}
      nav,header{background:rgba(20,8,24,0.95)!important;border-bottom:1px solid rgba(255,107,53,0.2)!important;backdrop-filter:blur(20px)!important;padding:12px 24px!important}
      nav a{color:#d4907a!important;padding:6px 14px!important;border-radius:8px!important;font-weight:600!important}
      nav a:hover{background:rgba(255,107,53,0.1)!important;color:#ff8c50!important}
      footer{background:rgba(14,6,18,0.98)!important;border-top:1px solid rgba(255,107,53,0.15)!important;color:#6a3020!important;padding:20px!important}
      .card,[class*=card],[class*=panel],[class*=widget]{background:rgba(40,15,50,0.7)!important;border:1px solid rgba(255,107,53,0.15)!important;border-radius:16px!important;padding:20px!important;backdrop-filter:blur(12px)!important;box-shadow:0 8px 32px rgba(0,0,0,0.3)!important}
      *:focus-visible{outline:3px solid #ffd700!important;outline-offset:3px!important;border-radius:4px!important}
    `
  },

 
  {
    id: "ice-minimal",
    name: "❄️ Ice Minimal",
    preview: ["#f0f4f8","#1a2744","#3b82f6"],
    css: `
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
      *{box-sizing:border-box!important;transition:all 0.18s ease!important}
      html,body{background:#f0f4f8!important;color:#0f172a!important;font-family:'Plus Jakarta Sans',sans-serif!important;line-height:1.7!important}
      h1,h2,h3{color:#1a2744!important;font-weight:800!important;letter-spacing:-0.03em!important}
      h4,h5,h6{color:#1e40af!important;font-weight:700!important}
      h1{font-size:2.6em!important}h2{font-size:2em!important}h3{font-size:1.5em!important}
      p{color:#334155!important;font-weight:300!important;margin-bottom:1.1em!important;font-size:1.05em!important}
      a{color:#1d4ed8!important;text-decoration:none!important;font-weight:600!important}
      a:hover{color:#1e40af!important;text-decoration:underline!important}
      a:focus{outline:3px solid #3b82f6!important;outline-offset:3px!important;border-radius:3px!important}
      button,[type=button],[type=submit],[role=button]{background:#1d4ed8!important;color:white!important;border:none!important;border-radius:10px!important;padding:10px 24px!important;font-family:'Plus Jakarta Sans',sans-serif!important;font-weight:700!important;font-size:0.95em!important;cursor:pointer!important;box-shadow:0 4px 14px rgba(29,78,216,0.3)!important;letter-spacing:0.01em!important}
      button:hover{background:#1e40af!important;box-shadow:0 6px 20px rgba(29,78,216,0.45)!important;transform:translateY(-1px)!important}
      button:focus{outline:3px solid #3b82f6!important;outline-offset:3px!important}
      input,textarea,select{background:white!important;color:#0f172a!important;border:2px solid #cbd5e1!important;border-radius:10px!important;padding:9px 14px!important;font-family:'Plus Jakarta Sans',sans-serif!important;font-size:1em!important;font-weight:400!important}
      input:focus,textarea:focus,select:focus{border-color:#3b82f6!important;outline:none!important;box-shadow:0 0 0 4px rgba(59,130,246,0.12)!important}
      input::placeholder{color:#94a3b8!important}
      nav,header{background:white!important;border-bottom:1px solid #e2e8f0!important;box-shadow:0 1px 8px rgba(15,23,42,0.06)!important;padding:12px 24px!important}
      nav a{color:#475569!important;padding:6px 14px!important;border-radius:8px!important;font-weight:600!important;font-size:0.95em!important}
      nav a:hover{background:#eff6ff!important;color:#1d4ed8!important}
      footer{background:#1a2744!important;color:#6d8ab0!important;padding:20px!important;border-top:none!important}
      footer a{color:#7ca0d0!important}
      .card,[class*=card],[class*=panel],[class*=box]{background:white!important;border:1px solid #e2e8f0!important;border-radius:16px!important;padding:22px!important;box-shadow:0 4px 24px rgba(15,23,42,0.06)!important}
      .card:hover,[class*=card]:hover{box-shadow:0 8px 32px rgba(29,78,216,0.12)!important;transform:translateY(-2px)!important}
      *:focus-visible{outline:3px solid #3b82f6!important;outline-offset:3px!important;border-radius:4px!important}
    `
  },

  
  {
    id: "royal-velvet",
    name: "👑 Royal Velvet",
    preview: ["#1a0d2e","#9b59b6","#e8d5f5"],
    css: `
      @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap');
      *{box-sizing:border-box!important;transition:all 0.25s ease!important}
      html,body{background:radial-gradient(ellipse at top,#2d1b4e 0%,#1a0d2e 60%)!important;background-attachment:fixed!important;color:#e8d5f5!important;font-family:'Crimson Text',serif!important;font-size:18px!important;line-height:1.8!important}
      h1,h2,h3{font-family:'Cinzel',serif!important;color:#c8a2d8!important;letter-spacing:0.04em!important;font-weight:600!important;line-height:1.3!important}
      h4,h5,h6{font-family:'Cinzel',serif!important;color:#9b59b6!important;font-weight:400!important}
      h1{font-size:2.3em!important;text-shadow:0 0 30px rgba(155,89,182,0.4)!important}
      h2{font-size:1.8em!important}h3{font-size:1.4em!important}
      p{color:#d4bce8!important;margin-bottom:1.2em!important;font-weight:400!important}
      a{color:#c8a2d8!important;text-decoration:none!important;font-style:italic!important;border-bottom:1px solid rgba(200,162,216,0.3)!important}
      a:hover{color:#e8d5f5!important;border-bottom-color:#e8d5f5!important}
      a:focus{outline:3px solid #9b59b6!important;outline-offset:3px!important;border-radius:3px!important}
      button,[type=button],[type=submit],[role=button]{background:linear-gradient(135deg,#7d3c98,#9b59b6)!important;color:#f0e6f8!important;border:1px solid rgba(200,162,216,0.3)!important;border-radius:6px!important;padding:10px 26px!important;font-family:'Cinzel',serif!important;font-weight:600!important;font-size:0.85em!important;letter-spacing:0.1em!important;cursor:pointer!important;box-shadow:0 4px 20px rgba(155,89,182,0.35)!important}
      button:hover{background:linear-gradient(135deg,#9b59b6,#c39bd3)!important;box-shadow:0 6px 28px rgba(155,89,182,0.55)!important;transform:translateY(-2px)!important}
      button:focus{outline:3px solid #c8a2d8!important;outline-offset:3px!important}
      input,textarea,select{background:rgba(45,27,78,0.8)!important;color:#e8d5f5!important;border:1px solid rgba(155,89,182,0.4)!important;border-radius:6px!important;padding:10px 14px!important;font-family:'Crimson Text',serif!important;font-size:1em!important}
      input:focus,textarea:focus,select:focus{border-color:#9b59b6!important;outline:none!important;box-shadow:0 0 0 3px rgba(155,89,182,0.2)!important}
      input::placeholder{color:#6a3d7a!important}
      nav,header{background:rgba(20,10,35,0.97)!important;border-bottom:1px solid rgba(155,89,182,0.25)!important;backdrop-filter:blur(20px)!important;padding:14px 24px!important}
      nav a{color:#b888cc!important;padding:6px 14px!important;border-radius:6px!important;font-family:'Cinzel',serif!important;letter-spacing:0.06em!important;font-size:0.85em!important;font-style:normal!important;border-bottom:none!important}
      nav a:hover{background:rgba(155,89,182,0.12)!important;color:#c8a2d8!important}
      footer{background:rgba(14,6,24,0.98)!important;border-top:1px solid rgba(155,89,182,0.15)!important;color:#6a3d7a!important;padding:20px!important;font-family:'Cinzel',serif!important;font-size:0.8em!important;letter-spacing:0.05em!important}
      .card,[class*=card],[class*=panel],[class*=widget]{background:rgba(35,18,58,0.85)!important;border:1px solid rgba(155,89,182,0.2)!important;border-radius:12px!important;padding:20px!important;backdrop-filter:blur(15px)!important;box-shadow:0 8px 32px rgba(0,0,0,0.4),inset 0 1px 0 rgba(200,162,216,0.1)!important}
      img{border-radius:8px!important;box-shadow:0 8px 24px rgba(0,0,0,0.4)!important}
      *:focus-visible{outline:3px solid #9b59b6!important;outline-offset:3px!important;border-radius:4px!important}
    `
  },




  {

    id: "canva-gradient-pro",

    name: "🎨 Canva Color-Grade",

    preview: ["#6366f1", "#a855f7", "#ec4899"],

    css: `

      /* Global Layout Overhaul */

      :root { --c-grad: linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%); }

      

      body { background: #0f172a !important; color: #f1f5f9 !important; font-family: 'Inter', sans-serif !important; }

      

      /* Header, Navbar & Footer - High Contrast */

      header, nav, footer, [class*="nav"], [class*="footer"], [class*="header"] { 

        background: rgba(15, 23, 42, 0.95) !important; 

        border-bottom: 2px solid #a855f7 !important;

        backdrop-filter: blur(10px) !important;

      }



      /* Hero Sections & Large Divs */

      [class*="hero"], [class*="banner"], section:first-of-type {

        background: var(--c-grad) !important;

        color: #ffffff !important;

        padding: 60px 20px !important;

        border-radius: 0 0 50px 50px !important;

      }



      /* Disappearing Text Fix */

      p, span, li, h1, h2, h3, h4, td, th { color: #f1f5f9 !important; text-shadow: 0 1px 2px rgba(0,0,0,0.2) !important; }

      a { color: #38bdf8 !important; font-weight: bold !important; text-decoration: underline !important; }

      

      /* Buttons & Interactivity */

      button, [role="button"], .btn { 

        background: var(--c-grad) !important; 

        border: none !important; 

        border-radius: 50px !important; 

        color: #fff !important; 

        font-weight: 800 !important;

        box-shadow: 0 10px 20px rgba(168, 85, 247, 0.3) !important;

      }

    `

  }, 
{
    id: "cyberpunk-volt",
    name: "⚡ Cyberpunk Volt",
    preview: ["#000000", "#fde047", "#06b6d4"],
    css: `
      :root { --neon-yellow: #fde047; --neon-cyan: #06b6d4; }
      body { background: #050505 !important; color: #ffffff !important; }
      
      header, nav, footer, [class*="nav"], [class*="footer"] { 
        background: #000 !important; 
        border-bottom: 3px solid var(--neon-yellow) !important;
        box-shadow: 0 0 15px rgba(253, 224, 71, 0.3) !important;
      }

      [class*="hero"], [class*="banner"], section:first-of-type {
        background: #000 !important;
        border: 2px solid var(--neon-cyan) !important;
        clip-path: polygon(0 0, 100% 0, 100% 85%, 95% 100%, 0 100%) !important;
        padding: 80px 20px !important;
      }

      p, span, li, h1, h2, h3 { color: #fff !important; text-transform: uppercase !important; letter-spacing: 1px; }
      a { color: var(--neon-cyan) !important; text-shadow: 0 0 5px var(--neon-cyan); }
      
      button, .btn { 
        background: var(--neon-yellow) !important; 
        color: #000 !important; 
        border-radius: 0px !important; 
        font-weight: 900 !important;
        border-left: 5px solid var(--neon-cyan) !important;
      }
    `
  },

  {
    id: "midnight-emerald",
    name: "🌲 Midnight Emerald",
    preview: ["#064e3b", "#059669", "#fbbf24"],
    css: `
      :root { --emerald-grad: linear-gradient(135deg, #064e3b 0%, #065f46 100%); }
      body { background: #022c22 !important; color: #ecfdf5 !important; }
      
      header, nav, footer { 
        background: rgba(2, 44, 34, 0.9) !important; 
        border-bottom: 1px solid #fbbf24 !important;
        backdrop-filter: blur(8px) !important;
      }

      [class*="hero"], [class*="banner"] {
        background: var(--emerald-grad) !important;
        border-radius: 40px !important;
        margin: 20px !important;
        border: 1px solid rgba(251, 191, 36, 0.3) !important;
      }

      p, span, h1, h2 { color: #f0fdf4 !important; font-family: 'Georgia', serif !important; }
      a { color: #fbbf24 !important; text-decoration: none !important; border-bottom: 1px solid; }
      
      button, .btn { 
        background: #fbbf24 !important; 
        color: #064e3b !important; 
        border-radius: 8px !important; 
        box-shadow: 0 4px 0 #b45309 !important;
      }
    `
  },

  {
    id: "solarized-crimson",
    name: "🍎 Solarized Crimson",
    preview: ["#450a0a", "#dc2626", "#f87171"],
    css: `
      body { background: #450a0a !important; color: #fef2f2 !important; }
      
      header, nav, [class*="nav"] { 
        background: #7f1d1d !important; 
        border-bottom: 4px solid #f87171 !important;
      }

      [class*="hero"], [class*="banner"] {
        background: #dc2626 !important;
        border-radius: 0 100px 0 100px !important;
        box-shadow: inset 0 0 50px rgba(0,0,0,0.3) !important;
      }

      p, span, li, h1, h2 { color: #fff !important; }
      a { color: #fca5a5 !important; font-style: italic !important; }
      
      button, .btn { 
        background: #fff !important; 
        color: #7f1d1d !important; 
        border-radius: 15px !important; 
        font-weight: bold !important;
      }
    `
  },

  {
    id: "deep-sea",
    name: "🌊 Deep Sea Drifter",
    preview: ["#0c4a6e", "#0284c7", "#38bdf8"],
    css: `
      :root { --sea-grad: linear-gradient(180deg, #0c4a6e 0%, #075985 100%); }
      body { background: #082f49 !important; color: #f0f9ff !important; }
      
      header, nav { 
        background: rgba(12, 74, 110, 0.8) !important; 
        border-bottom: 2px solid #38bdf8 !important;
      }

      [class*="hero"], [class*="banner"] {
        background: var(--sea-grad) !important;
        border-bottom-left-radius: 100% 20px !important;
        border-bottom-right-radius: 100% 20px !important;
      }

      p, span, h1, h2 { color: #e0f2fe !important; }
      a { color: #7dd3fc !important; font-weight: 500 !important; }
      
      button, .btn { 
        background: #0ea5e9 !important; 
        border: 2px solid #bae6fd !important;
        border-radius: 30px !important;
        color: #fff !important;
      }
    `
  },

  {
    id: "mono-steel",
    name: "💿 Mono-Steel",
    preview: ["#18181b", "#52525b", "#d4d4d8"],
    css: `
      body { background: #09090b !important; color: #fafafa !important; }
      
      header, nav { 
        background: #18181b !important; 
        border-bottom: 1px solid #3f3f46 !important;
      }

      [class*="hero"], [class*="banner"] {
        background: #27272a !important;
        border: 1px solid #52525b !important;
        border-radius: 12px !important;
        margin: 10px !important;
      }

      p, span, h1, h2 { color: #d4d4d8 !important; }
      a { color: #fff !important; text-decoration: underline !important; }
      
      button, .btn { 
        background: #fafafa !important; 
        color: #000 !important; 
        border-radius: 4px !important; 
        font-family: monospace !important;
        box-shadow: 4px 4px 0px #52525b !important;
      }
    `
  },

  {
    id: "mono-steel",
    name: "💿 Mono-Steel",
    preview: ["#18181b", "#52525b", "#d4d4d8"],
    css: `
      body { background: #09090b !important; color: #fafafa !important; }
      
      header, nav { 
        background: #18181b !important; 
        border-bottom: 1px solid #3f3f46 !important;
      }

      [class*="hero"], [class*="banner"] {
        background: #27272a !important;
        border: 1px solid #52525b !important;
        border-radius: 12px !important;
        margin: 10px !important;
      }

      p, span, h1, h2 { color: #d4d4d8 !important; }
      a { color: #fff !important; text-decoration: underline !important; }
      
      button, .btn { 
        background: #fafafa !important; 
        color: #000 !important; 
        border-radius: 4px !important; 
        font-family: monospace !important;
        box-shadow: 4px 4px 0px #52525b !important;
      }
    `
  },

  {
    id: "arctic-aurora",
    name: "❄️ Arctic Aurora",
    preview: ["#0f172a", "#2dd4bf", "#818cf8"],
    css: `
      body { background: #020617 !important; color: #f1f5f9 !important; }
      
      header, nav { 
        background: rgba(15, 23, 42, 0.8) !important; 
        border-bottom: 1px solid rgba(45, 212, 191, 0.5) !important;
        backdrop-filter: blur(12px) !important;
      }

      [class*="hero"], [class*="banner"] {
        background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%) !important;
        border-radius: 60% 40% 100% 0% / 0% 100% 0% 100% !important; /* Unique organic shape */
        border: 2px solid #2dd4bf !important;
        margin: 20px !important;
      }

      p, span, li, h1 { color: #f8fafc !important; }
      a { color: #2dd4bf !important; text-decoration-style: dotted !important; }
      
      button, .btn { 
        background: transparent !important;
        border: 2px solid #818cf8 !important;
        color: #818cf8 !important;
        border-radius: 30px 0px 30px 0px !important;
        box-shadow: inset 0 0 10px rgba(129, 140, 248, 0.2) !important;
      }
    `
  },
  {
    id: "volcanic-ember",
    name: "🌋 Volcanic Ember",
    preview: ["#1c1917", "#ea580c", "#78350f"],
    css: `
      body { background: #0c0a09 !important; color: #fafaf9 !important; }
      
      header, nav { 
        background: #1c1917 !important; 
        border-bottom: 2px solid #ea580c !important;
      }

      [class*="hero"], [class*="banner"] {
        background: #1c1917 !important;
        border-left: 10px solid #ea580c !important;
        background-image: radial-gradient(circle at 100% 100%, #451a03 0%, transparent 50%) !important;
        border-radius: 0 !important;
      }

      p, span, h1, h2 { color: #f5f5f4 !important; }
      a { color: #fdba74 !important; font-weight: 900 !important; }
      
      button, .btn { 
        background: #ea580c !important; 
        clip-path: polygon(10% 0, 100% 0, 90% 100%, 0 100%) !important;
        border-radius: 0 !important;
        padding: 10px 30px !important;
      }
    `
  },

  {
    id: "galactic-nebula",
    name: "🌌 Galactic Nebula",
    preview: ["#020617", "#6366f1", "#d8b4fe"],
    css: `
      body { background: #020617 !important; color: #f8fafc !important; }
      
      header, nav { 
        background: transparent !important;
        padding: 30px 0 !important;
      }

      [class*="hero"], [class*="banner"] {
        background: rgba(99, 102, 241, 0.05) !important;
        border: 1px solid rgba(216, 180, 254, 0.2) !important;
        border-radius: 100px !important; /* Oval inner design */
        margin: 40px !important;
        box-shadow: 0 0 80px rgba(99, 102, 241, 0.1) !important;
      }

      p, span, h1 { color: #cbd5e1 !important; line-height: 1.8 !important; }
      a { color: #d8b4fe !important; text-underline-offset: 8px !important; }
      
      button, .btn { 
        background: linear-gradient(90deg, #6366f1, #d8b4fe) !important;
        border-radius: 100px !important;
        padding: 15px 40px !important;
        transition: filter 0.3s !important;
      }
      button:hover { filter: brightness(1.2) !important; }
    `
  },

  {
    id: "sandstone-dark",
    name: "🏜️ Sandstone Dark",
    preview: ["#1c1917", "#d6d3d1", "#a8a29e"],
    css: `
      body { background: #1c1917 !important; color: #e7e5e4 !important; }
      
      header, nav { 
        background: #292524 !important; 
        border-bottom: 1px solid #44403c !important;
      }

      [class*="hero"], [class*="banner"] {
        background: #44403c !important;
        border-radius: 4px !important;
        outline: 1px solid #78716c !important;
        outline-offset: 10px !important; /* Double border effect */
        margin: 40px !important;
      }

      p, span, h1, h2 { color: #e7e5e4 !important; font-family: 'Courier New', monospace !important; }
      a { color: #d6d3d1 !important; border-bottom: 2px solid #a8a29e !important; }
      
      button, .btn { 
        background: #d6d3d1 !important; 
        color: #1c1917 !important; 
        border-radius: 2px !important;
        font-weight: 400 !important;
        border: 1px solid #1c1917 !important;
      }
    `
  },

  {
    id: "neumorphic-night",
    name: "🌑 Neumorphic Night",
    preview: ["#1e293b", "#334155", "#64748b"],
    css: `
      :root { --neu-base: #1e293b; --neu-light: #2a3952; --neu-dark: #121924; }
      body { background: var(--neu-base) !important; color: #cbd5e1 !important; }
      
      header, nav { 
        background: var(--neu-base) !important; 
        box-shadow: 0 4px 20px var(--neu-dark) !important;
        border-bottom: none !important;
      }

      [class*="hero"], [class*="banner"] {
        background: var(--neu-base) !important;
        border-radius: 50px !important;
        box-shadow: 20px 20px 60px var(--neu-dark), -20px -20px 60px var(--neu-light) !important;
        margin: 40px !important;
        border: none !important;
      }

      button, .btn { 
        background: var(--neu-base) !important; 
        color: #38bdf8 !important;
        border-radius: 15px !important; 
        box-shadow: 6px 6px 12px var(--neu-dark), -6px -6px 12px var(--neu-light) !important;
        transition: all 0.2s ease !important;
      }
      button:active { box-shadow: inset 4px 4px 8px var(--neu-dark), inset -4px -4px 8px var(--neu-light) !important; }
    `
  },

  {
    id: "holo-frost",
    name: "💿 Holographic Frost",
    preview: ["#000000", "#ff0080", "#7928ca"],
    css: `
      :root { --holo: linear-gradient(90deg, #00f2ff, #ff0080, #7928ca, #00f2ff); }
      body { background: #000 !important; color: #fff !important; }
      
      header, nav { 
        background: rgba(0,0,0,0.8) !important;
        border-bottom: 2px solid transparent !important;
        border-image: var(--holo) 1 !important;
      }

      [class*="hero"], [class*="banner"] {
        background: rgba(255,255,255,0.05) !important;
        backdrop-filter: blur(20px) !important;
        border: 1px solid rgba(255,255,255,0.1) !important;
        border-radius: 0 !important;
        position: relative;
      }
      [class*="hero"]::after {
        content: ''; position: absolute; bottom: -2px; left: 0; right: 0; height: 3px; background: var(--holo); background-size: 300% 100%;
      }

      a { color: #00f2ff !important; text-shadow: 0 0 10px #00f2ff; }
      
      button, .btn { 
        background: #fff !important; color: #000 !important; border-radius: 0 !important; font-weight: 800 !important;
        box-shadow: 4px 4px 0px #ff0080, 8px 8px 0px #7928ca !important;
      }
    `
  },

  {
    id: "brutalist-lab",
    name: "🚧 Brutalist Lab",
    preview: ["#facc15", "#000000", "#ffffff"],
    css: `
      body { background: #fff !important; color: #000 !important; font-family: 'Space Mono', monospace !important; }
      
      header, nav { 
        background: #facc15 !important; 
        border-bottom: 5px solid #000 !important;
      }

      [class*="hero"], [class*="banner"] {
        background: #fff !important;
        border: 5px solid #000 !important;
        box-shadow: 15px 15px 0px #000 !important;
        margin: 30px !important;
        border-radius: 0 !important;
      }

      p, h1, h2 { color: #000 !important; font-weight: 900 !important; }
      
      button, .btn { 
        background: #000 !important; 
        color: #fff !important; 
        border-radius: 0 !important; 
        padding: 15px 30px !important;
        border: 3px solid #000 !important;
      }
      button:hover { background: #fff !important; color: #000 !important; }
    `
  },

  {
    id: "liquid-mercury",
    name: "🔘 Liquid Mercury",
    preview: ["#0f172a", "#94a3b8", "#f1f5f9"],
    css: `
      body { background: #020617 !important; color: #94a3b8 !important; }
      
      header, nav { 
        background: rgba(15, 23, 42, 0.9) !important;
        border-radius: 0 0 40px 40px !important;
        margin: 0 20px !important;
      }

      [class*="hero"], [class*="banner"] {
        background: linear-gradient(145deg, #1e293b, #0f172a) !important;
        border-radius: 500px !important; /* Liquid oval design */
        border: 1px solid #475569 !important;
        box-shadow: inset 0 0 30px rgba(255,255,255,0.05) !important;
        padding: 100px 60px !important;
      }

      p, h1 { text-align: center !important; color: #f1f5f9 !important; }
      
      button, .btn { 
        background: linear-gradient(to bottom, #f1f5f9, #94a3b8) !important;
        color: #0f172a !important;
        border-radius: 500px !important;
        box-shadow: 0 10px 20px rgba(0,0,0,0.4) !important;
        border: none !important;
      }
    `
  },
  {
    id: "matrix-bio",
    name: "☣️ Matrix Biohazard",
    preview: ["#052e16", "#22c55e", "#14532d"],
    css: `
      body { 
        background-color: #020617 !important;
        background-image: linear-gradient(rgba(34, 197, 94, 0.05) 1px, transparent 1px) !important;
        background-size: 100% 3px !important; /* Scanline effect */
        color: #22c55e !important;
      }
      
      header, nav { 
        background: #052e16 !important; 
        border-bottom: 1px solid #22c55e !important;
        text-transform: lowercase !important;
      }

      [class*="hero"], [class*="banner"] {
        background: rgba(20, 83, 45, 0.2) !important;
        border: 1px solid #22c55e !important;
        border-radius: 4px !important;
        position: relative;
        overflow: hidden;
      }

      p, span, h1 { color: #4ade80 !important; font-family: monospace !important; }
      
      button, .btn { 
        background: transparent !important; 
        color: #22c55e !important; 
        border: 1px solid #22c55e !important; 
        border-radius: 0px !important;
        box-shadow: 0 0 10px rgba(34, 197, 94, 0.3) !important;
      }
      button:hover { background: #22c55e !important; color: #000 !important; }
    `
  },

  {
    id: "floating-deck",
    name: "🃏 Floating Deck",
    preview: ["#111827", "#6366f1", "#ffffff"],
    css: `
      body { background: #f3f4f6 !important; color: #1f2937 !important; padding: 20px !important; }
      
      /* Detached Floating Header */
      header, nav, [class*="nav"] { 
        background: #ffffff !important; 
        border-radius: 20px !important;
        margin: 10px auto 30px auto !important;
        width: 95% !important;
        box-shadow: 0 10px 25px rgba(0,0,0,0.1) !important;
        border: 1px solid rgba(0,0,0,0.05) !important;
      }

      /* Isometric Hero Section */
      [class*="hero"], [class*="banner"], section:first-of-type {
        background: #6366f1 !important;
        transform: perspective(1000px) rotateX(2deg) !important;
        border-radius: 30px !important;
        box-shadow: 0 20px 50px rgba(99, 102, 241, 0.4) !important;
        color: #fff !important;
      }

      /* Floating Footer */
      footer, [class*="footer"] {
        background: #111827 !important;
        border-radius: 25px !important;
        margin: 40px auto 10px auto !important;
        width: 90% !important;
        color: #fff !important;
        padding: 40px !important;
      }

      button, .btn { border-radius: 12px !important; background: #000 !important; color: #fff !important; }
    `
  },

  {
    id: "paper-stack",
    name: "📑 Paper-Cut Stack",
    preview: ["#ffffff", "#ef4444", "#1e293b"],
    css: `
      body { background: #e2e8f0 !important; }
      
      /* Overlapping Header */
      header, nav { 
        background: #ffffff !important; 
        z-index: 1 !important;
        position: relative !important;
        box-shadow: 0 5px 15px rgba(0,0,0,0.05) !important;
      }

      /* Indented Hero Section */
      [class*="hero"], [class*="banner"] {
        background: #ef4444 !important;
        margin-top: -20px !important; /* Pulls hero under header */
        padding: 100px 40px !important;
        clip-path: polygon(0 0, 100% 0, 100% 90%, 0 100%) !important;
        z-index: 2 !important;
      }

      /* Slashed Footer */
      footer, [class*="footer"] {
        background: #1e293b !important;
        clip-path: polygon(0 15%, 100% 0, 100% 100%, 0 100%) !important;
        padding-top: 80px !important;
        margin-top: -50px !important;
      }

      button, .btn { background: #1e293b !important; border: 2px solid #fff !important; border-radius: 4px !important; }
    `
  },

  {
    id: "glass-pulse",
    name: "🔮 Glass-Morphic Pulse",
    preview: ["#4338ca", "#db2777", "#ffffff"],
    css: `
      @keyframes gradientBG { 0% {background-position: 0% 50%;} 50% {background-position: 100% 50%;} 100% {background-position: 0% 50%;} }
      
      body { 
        background: linear-gradient(-45deg, #4338ca, #7c3aed, #db2777, #2563eb) !important;
        background-size: 400% 400% !important;
        animation: gradientBG 15s ease infinite !important;
      }
      
      header, nav { 
        background: rgba(255, 255, 255, 0.1) !important; 
        backdrop-filter: blur(20px) !important;
        border: 1px solid rgba(255, 255, 255, 0.2) !important;
        border-radius: 0 0 30px 30px !important;
      }

      [class*="hero"], [class*="banner"] {
        background: rgba(255, 255, 255, 0.05) !important;
        border: 2px solid rgba(255, 255, 255, 0.1) !important;
        backdrop-filter: blur(10px) !important;
        margin: 40px !important;
        border-radius: 50px !important;
      }

      footer, [class*="footer"] {
        background: rgba(0, 0, 0, 0.3) !important;
        backdrop-filter: blur(20px) !important;
        border-top: 1px solid rgba(255, 255, 255, 0.1) !important;
        padding: 60px 0 !important;
      }

      p, h1, h2 { color: #fff !important; text-shadow: 0 4px 10px rgba(0,0,0,0.3) !important; }
    `
  },

  {
    id: "stealth-ops",
    name: "🕵️‍♂️ Stealth Ops",
    preview: ["#000000", "#16a34a", "#262626"],
    css: `
      body { background: #000000 !important; color: #a3a3a3 !important; }
      
      /* Ultra-thin Minimal Header */
      header, nav { 
        background: #000 !important; 
        height: 50px !important;
        display: flex !important; align-items: center !important;
        border-bottom: 1px solid #262626 !important;
      }

      /* Full-Bleed Hero */
      [class*="hero"], [class*="banner"] {
        background: #171717 !important;
        width: 100vw !important;
        position: relative !important;
        left: 50% !important;
        right: 50% !important;
        margin-left: -50vw !important;
        margin-right: -50vw !important;
        border-radius: 0 !important;
        border-top: 1px solid #16a34a !important;
        border-bottom: 1px solid #16a34a !important;
      }

      footer { 
        background: #000 !important; 
        border-top: 1px solid #262626 !important;
        letter-spacing: 4px !important;
        text-transform: uppercase !important;
      }

      button, .btn { 
        background: #16a34a !important; 
        color: #000 !important; 
        border-radius: 2px !important;
        font-weight: 900 !important;
      }
    `
  },

  {
    id: "origami-solar",
    name: "📐 Origami Solar",
    preview: ["#f97316", "#000000", "#fff7ed"],
    css: `
      body { background: #fff7ed !important; overflow-x: hidden !important; }
      
      /* Slanted Header */
      header, nav { 
        background: #000 !important; 
        clip-path: polygon(0 0, 100% 0, 100% 80%, 0 100%) !important;
        padding-bottom: 40px !important;
      }

      /* Slanted Hero */
      [class*="hero"], [class*="banner"] {
        background: #f97316 !important;
        clip-path: polygon(0 15%, 100% 0, 100% 85%, 0 100%) !important;
        margin: -20px 0 !important;
        color: #fff !important;
      }

      /* Slanted Footer */
      footer {
        background: #000 !important;
        clip-path: polygon(0 20%, 100% 0, 100% 100%, 0 100%) !important;
        padding-top: 80px !important;
        color: #fb923c !important;
      }

      p, h1, h2 { color: #431407 !important; }
      header h1, [class*="hero"] h1 { color: #fff !important; }
      
      button, .btn { 
        background: #000 !important; 
        color: #f97316 !important; 
        border: 2px solid #f97316 !important;
        border-radius: 0 !important;
      }
    `
  },
  {
    id: "figma-editor-dark",
    name: "🎨 Figma Editor",
    preview: ["#1e1e1e", "#007be5", "#2c2c2c"],
    css: `
      body { background: #121212 !important; color: #ffffff !important; font-family: 'Inter', sans-serif !important; }
      
      header, nav { 
        background: #1e1e1e !important; 
        border-bottom: 1px solid #2c2c2c !important;
        height: 48px !important;
      }

      [class*="hero"], [class*="banner"] {
        background: #1e1e1e !important;
        border: 1px solid #007be5 !important; /* Figma selection blue */
        margin: 40px !important;
        border-radius: 8px !important;
        box-shadow: 0 0 0 4px rgba(0, 123, 229, 0.2) !important;
      }

      footer { background: #1e1e1e !important; border-top: 1px solid #2c2c2c !important; }

      button, .btn { 
        background: #007be5 !important; 
        border-radius: 6px !important; 
        font-weight: 500 !important;
        font-size: 12px !important;
      }
    `
  },
  {
    id: "figma-mirror-glass",
    name: "📱 Prototype Mirror",
    preview: ["#000000", "#ffffff", "#38bdf8"],
    css: `
      body { background: #000 !important; background-image: radial-gradient(#1a1a1a 1px, transparent 1px) !important; background-size: 20px 20px !important; }
      
      header, nav { 
        background: rgba(255,255,255,0.05) !important;
        backdrop-filter: blur(25px) !important;
        margin: 20px !important;
        border-radius: 100px !important;
        border: 1px solid rgba(255,255,255,0.1) !important;
      }

      [class*="hero"], [class*="banner"] {
        background: linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%) !important;
        border-radius: 40px !important;
        border: 1px solid rgba(255,255,255,0.1) !important;
      }

      footer { background: transparent !important; text-align: center !important; }
      button, .btn { background: #fff !important; color: #000 !important; border-radius: 50px !important; }
    `
  },
  {
    id: "linear-pro-dark",
    name: "🌈 Linear Shimmer",
    preview: ["#08090a", "#5e6ad2", "#ffffff"],
    css: `
      body { background: #08090a !important; color: #b1b3b8 !important; }
      
      header { 
        background: rgba(8, 9, 10, 0.8) !important; 
        border-bottom: 1px solid rgba(255,255,255,0.1) !important;
        position: relative !important;
      }
      header::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, #5e6ad2, #f43f5e, transparent) !important; }

      [class*="hero"], [class*="banner"] {
        background: radial-gradient(circle at top, rgba(94, 106, 210, 0.15), transparent) !important;
        border-radius: 12px !important;
        border: 1px solid rgba(255,255,255,0.05) !important;
      }

      button, .btn { background: #5e6ad2 !important; box-shadow: 0 4px 14px rgba(94, 106, 210, 0.4) !important; border-radius: 8px !important; }
    `
  },

  {
    id: "spatial-vision",
    name: "👓 Spatial Vision",
    preview: ["#1a1a1a", "#ffffff", "#71717a"],
    css: `
      body { background: #000 !important; }
      
      header, nav, [class*="hero"], [class*="banner"], footer {
        background: rgba(40, 40, 40, 0.4) !important;
        backdrop-filter: blur(30px) saturate(150%) !important;
        border-top: 1px solid rgba(255,255,255,0.2) !important;
        border-left: 1px solid rgba(255,255,255,0.1) !important;
        box-shadow: 0 20px 40px rgba(0,0,0,0.4) !important;
      }

      [class*="hero"] { border-radius: 40px !important; margin: 40px !important; }
      header { border-radius: 0 0 24px 24px !important; }
      footer { margin-top: 50px !important; border-radius: 24px 24px 0 0 !important; }

      button, .btn { background: rgba(255,255,255,0.9) !important; color: #000 !important; border-radius: 12px !important; }
    `
  },

  {
    id: "arc-frame",
    name: "🌐 Arc Sidebar",
    preview: ["#334155", "#ffffff", "#94a3b8"],
    css: `
      body { background: #1e293b !important; padding: 12px !important; }
      
      header, [class*="hero"], section, footer { 
        background: #ffffff !important; 
        color: #000 !important;
        border-radius: 12px !important;
        margin-bottom: 12px !important;
      }

      header { height: 60px !important; border: 1px solid #e2e8f0 !important; }
      [class*="hero"] { padding: 80px !important; background: #f8fafc !important; }
      footer { background: #f1f5f9 !important; }

      button, .btn { background: #000 !important; border-radius: 10px !important; }
    `
  },

  {
    id: "clay-soft",
    name: "☁️ Clay Soft-UI",
    preview: ["#6366f1", "#ffffff", "#4338ca"],
    css: `
      body { background: #e0e7ff !important; color: #3730a3 !important; }
      
      header, nav, [class*="hero"], footer {
        background: #ffffff !important;
        border-radius: 35px !important;
        box-shadow: 10px 10px 20px rgba(0,0,0,0.05), inset -8px -8px 15px rgba(0,0,0,0.05), inset 8px 8px 15px rgba(255,255,255,0.8) !important;
        margin: 20px !important;
        border: none !important;
      }

      button, .btn { 
        background: #6366f1 !important; 
        color: #fff !important;
        box-shadow: inset -4px -4px 10px rgba(0,0,0,0.2), inset 4px 4px 10px rgba(255,255,255,0.3) !important;
        border-radius: 20px !important;
      }
    `
  },

  {
    id: "ink-spec",
    name: "🖋️ Ink Spec",
    preview: ["#ffffff", "#000000", "#e5e5e5"],
    css: `
      body { 
        background-color: #ffffff !important; 
        background-image: linear-gradient(#f0f0f0 1px, transparent 1px), linear-gradient(90deg, #f0f0f0 1px, transparent 1px) !important;
        background-size: 20px 20px !important;
        color: #000 !important;
      }
      
      header, footer { 
        background: #000 !important; 
        color: #fff !important;
        padding: 10px !important;
      }

      [class*="hero"] {
        background: #fff !important;
        border: 2px solid #000 !important;
        border-radius: 0 !important;
        position: relative !important;
      }
      [class*="hero"]::before { content: 'COMPONENT_HERO_V1'; position: absolute; top: -10px; left: 10px; background: #000; color: #fff; font-size: 10px; padding: 2px 5px; }

      button, .btn { background: #000 !important; color: #fff !important; border-radius: 0 !important; text-transform: uppercase !important; }
    `
  },

  {
    id: "aurora-mesh",
    name: "🌌 Aurora Mesh",
    preview: ["#000000", "#4ade80", "#3b82f6"],
    css: `
      body { background: #000 !important; }
      
      [class*="hero"], header, footer {
        background: rgba(255, 255, 255, 0.03) !important;
        backdrop-filter: blur(40px) !important;
        border: 1px solid rgba(255,255,255,0.1) !important;
        position: relative !important;
        overflow: hidden !important;
      }
      
      [class*="hero"]::before {
        content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%;
        background: radial-gradient(circle at center, #4ade80 0%, #3b82f6 30%, #a855f7 60%, transparent 100%) !important;
        opacity: 0.15 !important;
        filter: blur(60px) !important;
      }

      header { border-radius: 0 0 40px 40px !important; }
      footer { border-radius: 40px 40px 0 0 !important; padding: 60px !important; }

      button, .btn { background: linear-gradient(90deg, #4ade80, #3b82f6) !important; border-radius: 12px !important; border: none !important; }
    `
  },
  {
    id: "terminal-2049",
    name: "📟 Terminal 2049",
    preview: ["#0a0a0a", "#22c55e", "#052e16"],
    css: `
      body { background: #050505 !important; color: #22c55e !important; font-family: 'Courier New', monospace !important; }
      
      header, nav { 
        background: #22c55e !important; 
        color: #000 !important; 
        font-weight: 900 !important;
        clip-path: polygon(0 0, 98% 0, 100% 100%, 0% 100%) !important;
      }

      [class*="hero"], [class*="banner"] {
        background: rgba(34, 197, 94, 0.05) !important;
        border: 1px solid #22c55e !important;
        box-shadow: inset 0 0 20px rgba(34, 197, 94, 0.2) !important;
        border-radius: 0 !important;
        position: relative !important;
      }
      [class*="hero"]::before { content: "SYS_STATUS: ACTIVE"; position: absolute; top: 5px; right: 10px; font-size: 10px; }

      footer { 
        background: #000 !important; 
        border-top: 1px dashed #22c55e !important;
        padding: 20px !important;
        font-size: 12px !important;
      }

      button, .btn { 
        background: transparent !important; 
        border: 1px solid #22c55e !important; 
        color: #22c55e !important; 
        text-transform: uppercase !important;
        box-shadow: 4px 4px 0px #052e16 !important;
      }
    `
  },
  {
    id: "bauhaus-swiss",
    name: "📐 Bauhaus Swiss",
    preview: ["#ffffff", "#ef4444", "#000000"],
    css: `
      body { background: #f3f3f3 !important; color: #000 !important; font-family: 'Helvetica', sans-serif !important; }
      
      header { 
        background: #000 !important; 
        color: #fff !important;
        height: 120px !important;
        display: flex !important; align-items: flex-end !important;
        padding: 20px !important;
      }

      [class*="hero"], [class*="banner"] {
        background: #ef4444 !important; /* Bold Red */
        margin-left: 10% !important;
        border-radius: 0 !important;
        padding: 100px 40px !important;
        border-left: 20px solid #fbce07 !important; /* Bold Yellow */
      }

      footer {
        background: #1d4ed8 !important; /* Bold Blue */
        color: #fff !important;
        margin-top: 50px !important;
        padding: 60px !important;
        clip-path: circle(150% at 0% 100%) !important;
      }

      button, .btn { background: #000 !important; color: #fff !important; border-radius: 0 !important; font-weight: 800 !important; }
    `
  },
  {
    id: "classic-mac",
    name: "🖥️ System 7 Retro",
    preview: ["#c0c0c0", "#000080", "#ffffff"],
    css: `
      body { background: #55aaaa !important; /* Classic teal background */ }
      
      header, nav { 
        background: #c0c0c0 !important; 
        border-bottom: 2px solid #000 !important;
        box-shadow: inset 1px 1px #fff !important;
      }

      [class*="hero"], [class*="banner"] {
        background: #fff !important;
        border: 2px solid #000 !important;
        box-shadow: 4px 4px 0px #000 !important;
        margin: 40px !important;
        padding: 0 !important; /* Header bar inside div */
      }
      [class*="hero"]::after {
        content: "■ Main_Layout.exe"; display: block; background: #000080; color: #fff; padding: 5px 10px; order: -1;
      }

      footer { background: #c0c0c0 !important; border-top: 2px solid #fff !important; }

      button, .btn { 
        background: #c0c0c0 !important; 
        border: 2px solid !important;
        border-color: #fff #808080 #808080 #fff !important;
        color: #000 !important;
        padding: 5px 15px !important;
      }
    `
  },
  {
    id: "ghost-shell",
    name: "👻 Ghost Shell",
    preview: ["#0f172a", "#38bdf8", "#ffffff"],
    css: `
      body { background: #0f172a !important; color: #f1f5f9 !important; }
      
      header { 
        background: transparent !important; 
        border-bottom: 1px solid rgba(56, 189, 248, 0.3) !important;
        backdrop-filter: blur(5px) !important;
      }

      [class*="hero"], [class*="banner"] {
        background: rgba(255,255,255,0.02) !important;
        border: 1px solid rgba(255,255,255,0.1) !important;
        margin: 20px !important;
        padding: 80px !important;
        background-image: linear-gradient(to right, rgba(56, 189, 248, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(56, 189, 248, 0.1) 1px, transparent 1px) !important;
        background-size: 40px 40px !important;
      }

      footer {
        background: transparent !important;
        border-top: 1px solid rgba(56, 189, 248, 0.3) !important;
        opacity: 0.6 !important;
      }

      button, .btn { 
        background: transparent !important; 
        border: 1px solid #38bdf8 !important; 
        color: #38bdf8 !important;
        box-shadow: 0 0 15px rgba(56, 189, 248, 0.2) !important;
      }
    `
  },

  {
    id: "liquid-obsidian",
    name: "🖤 Liquid Obsidian",
    preview: ["#000000", "#ffffff", "#1a1a1a"],
    css: `
      body { background: #000000 !important; color: #ffffff !important; }
      
      header, nav { 
        background: #000 !important; 
        border-bottom: 1px solid #333 !important;
        border-radius: 0 0 80px 80px !important;
      }

      [class*="hero"], [class*="banner"] {
        background: linear-gradient(145deg, #1a1a1a, #000000) !important;
        border: 1px solid #222 !important;
        border-radius: 120px 20px 120px 20px !important; /* S-curve corners */
        padding: 120px 40px !important;
        box-shadow: 0 40px 100px rgba(0,0,0,1) !important;
      }

      footer {
        background: #0a0a0a !important;
        border-radius: 80px 80px 0 0 !important;
        margin-top: 100px !important;
        padding: 100px !important;
      }

      button, .btn { 
        background: #fff !important; 
        color: #000 !important; 
        border-radius: 100px !important;
        font-weight: 900 !important;
        padding: 20px 40px !important;
      }
    `
  },

  {
  id: "neon-cyberpunk",
  name: "⚡ Neon Cyberpunk",
  preview: ["#0f0f1a","#00f5ff","#ff00ff"],
  css: `
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600&display=swap');

    html,body{
      background: radial-gradient(circle at 20% 20%, #0f0f1a, #050507)!important;
      color:#00f5ff!important;
      font-family:'Orbitron',sans-serif!important;
    }

    *{
      transition: all 0.25s ease!important;
      text-shadow:0 0 8px rgba(0,245,255,0.6);
    }

    h1,h2,h3{color:#ff00ff!important}

    a:hover{
      color:#ff00ff!important;
      text-shadow:0 0 12px #ff00ff;
    }

    button{
      background:transparent!important;
      border:2px solid #00f5ff!important;
      color:#00f5ff!important;
      box-shadow:0 0 12px #00f5ff inset,0 0 20px #00f5ff;
    }

    button:hover{
      background:#00f5ff!important;
      color:#000!important;
      box-shadow:0 0 30px #00f5ff;
    }

    .card{
      background:rgba(255,255,255,0.02)!important;
      border:1px solid rgba(0,245,255,0.3)!important;
      backdrop-filter: blur(10px);
    }
  `
},

{
  id: "glass-ai",
  name: "🧊 Glass AI",
  preview: ["#e0e7ff","#6366f1","#1e1b4b"],
  css: `
    html,body{
      background:linear-gradient(135deg,#1e1b4b,#6366f1)!important;
      color:#fff!important;
    }

    *{
      backdrop-filter: blur(12px);
    }

    .card,section,div{
      background:rgba(255,255,255,0.08)!important;
      border:1px solid rgba(255,255,255,0.2)!important;
      border-radius:16px!important;
      box-shadow:0 8px 32px rgba(0,0,0,0.3);
    }

    button{
      background:rgba(255,255,255,0.2)!important;
      border:1px solid rgba(255,255,255,0.3)!important;
    }

    button:hover{
      background:rgba(255,255,255,0.35)!important;
    }
  `
},

{
  id: "ai-terminal",
  name: "💻 AI Terminal",
  preview: ["#000000","#00ff88","#003322"],
  css: `
    @import url('https://fonts.googleapis.com/css2?family=Fira+Code&display=swap');

    html,body{
      background:#000!important;
      color:#00ff88!important;
      font-family:'Fira Code',monospace!important;
    }

    *{
      text-shadow:0 0 5px #00ff88;
    }

    a::before{
      content:"> ";
    }

    button{
      background:#003322!important;
      border:1px solid #00ff88!important;
      color:#00ff88!important;
    }

    button:hover{
      background:#00ff88!important;
      color:#000!important;
    }

    input{
      background:#000!important;
      border:1px solid #00ff88!important;
      color:#00ff88!important;
    }
  `
},

{
  id: "gaming-hud",
  name: "🎮 Gaming HUD",
  preview: ["#0b0f1a","#00ffcc","#1a1f2e"],
  css: `
    html,body{
      background:#0b0f1a!important;
      color:#00ffcc!important;
    }

    .card{
      border:1px solid #00ffcc!important;
      position:relative;
    }

    .card::after{
      content:'';
      position:absolute;
      inset:0;
      border:2px dashed rgba(0,255,204,0.3);
      pointer-events:none;
    }

    button{
      background:#00ffcc!important;
      color:#000!important;
      clip-path: polygon(10% 0,100% 0,90% 100%,0% 100%);
    }
  `
},

{
  id: "zen-minimal",
  name: "🧘 Zen Minimal",
  preview: ["#ffffff","#111111","#e5e5e5"],
  css: `
    html,body{
      background:#ffffff!important;
      color:#111!important;
      font-family:sans-serif!important;
    }

    *{
      box-shadow:none!important;
      border-radius:0!important;
    }

    a{
      border-bottom:1px solid #111!important;
    }

    button{
      background:#111!important;
      color:#fff!important;
    }

    .card{
      border-bottom:1px solid #ddd!important;
      padding:20px!important;
    }
  `
},
{
  id: "space-void",
  name: "🌌 Space Void",
  preview: ["#000814","#001d3d","#ffd60a"],
  css: `
    html,body{
      background:radial-gradient(circle,#001d3d,#000814)!important;
      color:#ffd60a!important;
    }

    body::before{
      content:'';
      position:fixed;
      width:200%;
      height:200%;
      background:url('https://www.transparenttextures.com/patterns/stardust.png');
      animation:move 60s linear infinite;
      opacity:0.3;
    }

    @keyframes move{
      from{transform:translate(0,0)}
      to{transform:translate(-500px,-500px)}
    }

    button{
      background:#ffd60a!important;
      color:#000!important;
    }
  `
},

{
  id: "fire-energy",
  name: "🔥 Fire Energy",
  preview: ["#1a0000","#ff3c00","#ffae00"],
  css: `
    html,body{
      background:linear-gradient(270deg,#1a0000,#ff3c00,#ffae00)!important;
      background-size:600% 600%!important;
      animation:fireMove 10s ease infinite;
      color:#fff!important;
    }

    @keyframes fireMove{
      0%{background-position:0%}
      50%{background-position:100%}
      100%{background-position:0%}
    }

    button{
      background:#ff3c00!important;
      box-shadow:0 0 20px #ff3c00;
    }
  `
},

{
  id: "nature-ai",
  name: "🌿 Nature AI",
  preview: ["#0b3d2e","#3a7d44","#d9fdd3"],
  css: `
    html,body{
      background:#0b3d2e!important;
      color:#d9fdd3!important;
    }

    *{
      animation:breath 6s ease-in-out infinite;
    }

    @keyframes breath{
      0%,100%{transform:scale(1)}
      50%{transform:scale(1.01)}
    }

    button{
      background:#3a7d44!important;
      color:#fff!important;
      border-radius:20px!important;
    }

    .card{
      background:rgba(255,255,255,0.05)!important;
    }
  `
},

{
  id: "hologram-ui",
  name: "🧬 Hologram UI",
  preview: ["#020617","#22d3ee","#a5f3fc"],
  css: `
    html,body{
      background:#020617!important;
      color:#22d3ee!important;
    }

    *{
      text-shadow:0 0 6px rgba(34,211,238,0.7);
    }

    .card,div,section{
      background:rgba(34,211,238,0.05)!important;
      border:1px solid rgba(34,211,238,0.4)!important;
      box-shadow:0 0 25px rgba(34,211,238,0.2) inset;
    }

    button{
      background:transparent!important;
      border:1px solid #22d3ee!important;
      color:#22d3ee!important;
    }

    button:hover{
      background:#22d3ee!important;
      color:#020617!important;
      box-shadow:0 0 30px #22d3ee;
    }
  `
},

{
  id: "liquid-metal",
  name: "🧿 Liquid Metal",
  preview: ["#0f172a","#94a3b8","#e2e8f0"],
  css: `
    html,body{
      background:#0f172a!important;
      color:#e2e8f0!important;
    }

    *{
      border-radius:20px!important;
    }

    .card{
      background:linear-gradient(145deg,#1e293b,#0f172a)!important;
      box-shadow: inset 5px 5px 15px #020617,
                  inset -5px -5px 15px #334155;
    }

    button{
      background:linear-gradient(145deg,#94a3b8,#64748b)!important;
      color:#0f172a!important;
      box-shadow:0 8px 20px rgba(148,163,184,0.4);
    }

    button:active{
      transform:scale(0.96)!important;
    }
  `
},

{
  id: "modular-grid",
  name: "🧩 Modular Grid",
  preview: ["#ffffff","#111827","#6366f1"],
  css: `
    html,body{
      background:#ffffff!important;
      color:#111827!important;
    }

    body{
      display:grid!important;
      grid-template-columns: repeat(auto-fit,minmax(300px,1fr));
      gap:16px!important;
      padding:20px!important;
    }

    .card,section,div{
      border:2px solid #6366f1!important;
      padding:16px!important;
      background:#fff!important;
    }

    button{
      background:#6366f1!important;
      color:#fff!important;
    }
  `
},

{
  id: "focus-ai",
  name: "🧠 Focus AI",
  preview: ["#000000","#ffffff","#444444"],
  css: `
    html,body{
      background:#000!important;
      color:#fff!important;
    }

    body *{
      opacity:0.3!important;
    }

    body *:hover{
      opacity:1!important;
    }

    p,article,main{
      font-size:1.2em!important;
      line-height:2!important;
    }

    button{
      background:#fff!important;
      color:#000!important;
    }
  `
},

{
  id: "rgb-matrix",
  name: "🌈 RGB Matrix",
  preview: ["#000","#ff0000","#00ff00"],
  css: `
    html,body{
      background:#000!important;
      color:#fff!important;
    }

    body::before{
      content:'';
      position:fixed;
      inset:0;
      background:linear-gradient(45deg,red,green,blue);
      mix-blend-mode:overlay;
      opacity:0.2;
      animation:rgbFlow 5s linear infinite;
    }

    @keyframes rgbFlow{
      0%{filter:hue-rotate(0deg)}
      100%{filter:hue-rotate(360deg)}
    }

    button{
      background:linear-gradient(45deg,red,blue)!important;
      color:#fff!important;
    }
  `
},

{
  id: "satellite-ui",
  name: "🛰️ Satellite UI",
  preview: ["#020617","#38bdf8","#0ea5e9"],
  css: `
    html,body{
      background:#020617!important;
      color:#38bdf8!important;
    }

    .card{
      border:1px solid #38bdf8!important;
      position:relative;
    }

    .card::before{
      content:'●';
      position:absolute;
      top:-10px;
      right:-10px;
      color:#0ea5e9;
      font-size:12px;
    }

    button{
      background:#38bdf8!important;
      color:#020617!important;
    }
  `
},

{
  id: "lab-glitch",
  name: "🧪 Lab Glitch",
  preview: ["#111","#ff00c8","#00fff7"],
  css: `
    html,body{
      background:#111!important;
      color:#00fff7!important;
    }

    *{
      animation:glitch 1s infinite;
    }

    @keyframes glitch{
      0%{transform:translate(0)}
      20%{transform:translate(-2px,2px)}
      40%{transform:translate(2px,-2px)}
      60%{transform:translate(-1px,1px)}
      80%{transform:translate(1px,-1px)}
      100%{transform:translate(0)}
    }

    button{
      background:#ff00c8!important;
      color:#111!important;
    }
  `
},

{
  id: "ultra-luxe",
  name: "🏁 Ultra Luxe",
  preview: ["#000","#d4af37","#f5e6c4"],
  css: `
    html,body{
      background:#000!important;
      color:#f5e6c4!important;
    }

    h1,h2,h3{
      color:#d4af37!important;
      letter-spacing:1px;
    }

    .card{
      border:1px solid rgba(212,175,55,0.4)!important;
      box-shadow:0 0 30px rgba(212,175,55,0.2);
    }

    button{
      background:#d4af37!important;
      color:#000!important;
      font-weight:bold;
    }

    a{
      color:#d4af37!important;
    }
  `
},

];



const domFixMap = new Map()
const BASE_URL =  "https://no-code-ai-ui-tool.vercel.app/"

let layoutChangeCount = 0

let currentTabId    = null
let currentUrl      = ""
let lastResults     = null
let activeThemeId   = null
let allExpanded     = false
let fixTotal        = 0
let fixApplied      = 0
let inspectorOn     = false
let dragModeOn      = false
let clickMoveOn     = false
let dragEngineOptions = {
  freePlacement: true,
  snapToGrid: false,
  snapToEdges: true,
  boundary: true,
  duplicateOnAlt: true,
  autoScroll: true,
}
let undoAvailable   = false
let redoAvailable   = false
let fixesApplied    = 0        
let chatSessionId   = null
let chatMessages    = []
let chatBusy        = false
let lastPickedForChat = null
let chatPickModeActive = false
let lastScanResults = null  // Store scan results for theme optimization
let lastUserInput   = null  // Store user input for theme optimization
let currentPageKey  = null

function getPageKey(url) {
  try {
    const parsed = new URL(url || currentUrl || location.href)
    return `${parsed.origin}${parsed.pathname}`
  } catch {
    return String(url || currentUrl || location.href || "").split("#")[0].split("?")[0]
  }
}

let extensionInitialized = false
let authPollingInterval = null

function setAuthGateVisible(visible) {
  const gate = document.getElementById("auth-gate")
  if (gate) {
    gate.classList.toggle("hidden", !visible)
  }
  document.body.classList.toggle("auth-locked", visible)
}

async function checkAuthStatus() {
  try {
    const res = await fetch(`${BASE_URL}/api/refresh`, {
      method: "GET",
      credentials: "include",
      headers: { "Cache-Control": "no-cache" },
    })
    return res.ok
  } catch {
    return false
  }
}

function clearAuthPolling() {
  if (authPollingInterval) {
    clearInterval(authPollingInterval)
    authPollingInterval = null
  }
}

function waitForLoginAndActivate(loginWindow) {
  clearAuthPolling()
  authPollingInterval = setInterval(async () => {
    const authenticated = await checkAuthStatus()
    if (authenticated) {
      clearAuthPolling()
      try {
        loginWindow?.close()
      } catch {
        // ignore
      }
      await initializeExtension(true)
      return
    }

    if (!loginWindow || loginWindow.closed) {
      clearAuthPolling()
      return
    }
  }, 1200)
}

function openWebsiteLogin() {
  const extensionUrl = `chrome-extension://${chrome.runtime.id}/popup.html`
  const loginUrl = `${BASE_URL}/login?redirectBack=${encodeURIComponent(extensionUrl)}`
  const loginWindow = window.open(loginUrl, "_blank")
  if (loginWindow) {
    waitForLoginAndActivate(loginWindow)
  } else {
    window.location.href = loginUrl
  }
}

async function initializeExtension(forceInit = false) {
  if (extensionInitialized && !forceInit) return

  const authenticated = await checkAuthStatus()
  if (!authenticated) {
    setAuthGateVisible(true)
    const loginButton = document.getElementById("open-login-btn")
    if (loginButton) {
      loginButton.onclick = openWebsiteLogin
    }
    return
  }
  setAuthGateVisible(false)
  extensionInitialized = true

  chrome.runtime.sendMessage({ type: "LOAD_THEME", pageKey: currentPageKey }).then(res => {
    activeThemeId = res?.theme?.id || null
    if (activeThemeId) {
      document.querySelector(`.theme-card[data-id="${activeThemeId}"]`)?.classList.add("active-theme")
    }
  }).catch(() => {
  })

  setupTabs()
  setupScan()
  setupInspector()
  setupDragMode()
  setupChatbot()
  setupThemes()
  setupHistory()
  setupGlobalActions()
  setupAIThemeRefresh()
}


document.addEventListener("DOMContentLoaded", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  currentTabId = tab?.id
  currentUrl   = tab?.url || ""
  currentPageKey = getPageKey(currentUrl)
  document.getElementById("current-url").textContent = currentUrl

  if (window.innerWidth > 420) {
    document.body.style.width  = "100%"
    document.body.style.minHeight = "100vh"
  }

  await initializeExtension()
})


function setupTabs() {
  document.querySelectorAll(".tab").forEach(btn => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.tab
      document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"))
      document.querySelectorAll(".tab-panel").forEach(p => p.classList.add("hidden"))
      btn.classList.add("active")
      document.getElementById(`tab-${name}`)?.classList.remove("hidden")
      if (name === "history") renderHistory()
      if (name === "chat") {
        chatPickModeActive = true
        chrome.tabs.sendMessage(currentTabId, { type: "ENABLE_CHAT_PICK_MODE" }).catch(() => {})
        renderChatMessages()
      } else {
        chatPickModeActive = false
        chrome.tabs.sendMessage(currentTabId, { type: "DISABLE_CHAT_PICK_MODE" }).catch(() => {})
      }
    })
  })
}

function setupChatbot() {
  const sendBtn = document.getElementById("chat-send-btn")
  const input = document.getElementById("chat-input")
  const loadBtn = document.getElementById("chat-load-btn")
  const clearBtn = document.getElementById("chat-clear-btn")

  if (!sendBtn || !input) return

  if (!chatMessages.length) {
    chatMessages = [{
      role: "assistant",
      content: "🎨 I can directly modify any element! Just click on any element below and give me instructions like 'change color to yellow', 'make bigger', 'increase font size', 'add padding', etc.",
    }]
  }
  renderChatMessages()

  // Listen for element picks from chat tab
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === "CHAT_ELEMENT_PICKED") {
      lastPickedForChat = {
        selector: msg.info.selector,
        tag: msg.info.tag,
        label: msg.info.label,
        id: msg.info.id,
        className: msg.info.className,
      }
      renderChatMessages()
      showToast(`✅ Selected: ${msg.info.label}`, "success")
    }
  })

  sendBtn.addEventListener("click", async () => {
    const instruction = (input.value || "").trim()
    if (!instruction || chatBusy) return

    input.value = ""
    chatMessages.push({ role: "user", content: instruction })
    renderChatMessages()
    setChatBusy(true)

    try {
      console.log("📤 Sending chat instruction to Cohere...", instruction)
      
      const payload = {
        sessionId: chatSessionId,
        instruction,
        url: currentUrl,
        selectedElement: lastPickedForChat,
      }
      
      const resp = await chrome.runtime.sendMessage({ type: "EXT_CHAT_SEND", payload })
      console.log("📥 Received response from background:", resp)
      
      if (!resp?.success) {
        const errorMsg = "Chat request failed: " + (resp?.error || "Unknown error")
        console.error("❌", errorMsg)
        chatMessages.push({ role: "assistant", content: errorMsg })
        renderChatMessages()
        showToast(errorMsg, "error")
        return
      }

      chatSessionId = resp.sessionId || chatSessionId
      console.log("✅ Chat session:", chatSessionId)

      // Ensure actions array is properly formatted
      const actions = Array.isArray(resp.actions) ? resp.actions : []
      console.log("📦 Actions to apply:", actions.length)

      chatMessages.push({
        role: "assistant",
        content: resp.reply || "Done.",
        plan: {
          layout: resp.layoutSuggestions || [],
          contrast: resp.contrastSuggestions || [],
          actions: actions,
        }
      })
      renderChatMessages()

      const autoApply = document.getElementById("chat-auto-apply")?.checked ?? true
      if (autoApply) {
        console.log("🔄 Auto-applying", actions.length, "actions...")
        const appliedCount = await applyChatActions(actions)
        console.log("✅ Applied", appliedCount, "actions successfully")
        
        if (appliedCount > 0) {
          showToast(`✅ Applied ${appliedCount} change${appliedCount !== 1 ? "s" : ""}`, "success")
          updateDownloadBadge()
        } else if (actions.length > 0) {
          showToast("⚠️ Actions generated but could not apply to page. Check element selector.", "warning")
        }
      }
    } catch (err) {
      console.error("❌ Chat error:", err)
      const errorMsg = "Chat failed: " + err.message
      chatMessages.push({ role: "assistant", content: errorMsg })
      renderChatMessages()
      showToast(errorMsg, "error")
    } finally {
      setChatBusy(false)
    }
  })

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendBtn.click()
    }
  })

  loadBtn?.addEventListener("click", async () => {
    try {
      const resp = await chrome.runtime.sendMessage({ type: "EXT_CHAT_LOAD", payload: { sessionId: chatSessionId, url: currentUrl } })
      if (!resp?.success) {
        showToast("Could not load MongoDB chat: " + (resp?.error || "Unknown"), "error")
        return
      }
      chatSessionId = resp.sessionId || chatSessionId
      const dbMessages = Array.isArray(resp.messages) ? resp.messages : []
      if (dbMessages.length) {
        chatMessages = dbMessages.map(m => ({ role: m.role, content: m.content, plan: m.meta || null }))
      }
      if (!chatMessages.length) {
        chatMessages = [{ role: "assistant", content: "No saved chat found for this page yet." }]
      }
      renderChatMessages()
      showToast("☁️ Chat loaded from MongoDB", "success")
    } catch (err) {
      showToast("Chat load failed: " + err.message, "error")
    }
  })

  clearBtn?.addEventListener("click", () => {
    chatSessionId = null
    chatMessages = [{ role: "assistant", content: "🆕 Started a new MongoDB chat session." }]
    renderChatMessages()
    showToast("New session started", "success")
  })

  // 📚 History Button Handler
  const historyBtn = document.getElementById("chat-history-btn")
  const historyModal = document.getElementById("chat-history-modal")
  const historyClose = document.getElementById("chat-history-close")
  const historyClearAll = document.getElementById("chat-history-clear-all")

  historyBtn?.addEventListener("click", async () => {
    console.log("📂 Opening chat history modal...")
    if (historyModal) historyModal.classList.remove("hidden")
    
    const historyList = document.getElementById("chat-history-list")
    if (!historyList) {
      console.warn("⚠️ History list element not found")
      return
    }
    
    // Show loading state
    historyList.innerHTML = '<div class="chat-history-empty">Loading history...</div>'
    
    // Load all sessions from MongoDB with improved error handling
    try {
      const res = await fetch(`${BASE_URL}/api/extension-chat/sessions`, {
        timeout: 5000 // 5 second timeout
      })
      
      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`)
      }
      
      const data = await res.json()
      const sessions = (data?.sessions && Array.isArray(data.sessions)) ? data.sessions : []
      
      console.log("📊 Loaded", sessions.length, "sessions from MongoDB")
      
      if (!sessions.length) {
        historyList.innerHTML = '<div class="chat-history-empty">No chat history yet.</div>'
        return
      }
      
      historyList.innerHTML = sessions.map((session, idx) => {
        // Validate session data
        const sessionId = session?.sessionId || "unknown"
        const createdAt = session?.createdAt ? new Date(session.createdAt).toLocaleString() : 'Unknown date'
        const messages = Array.isArray(session?.messages) ? session.messages : []
        const preview = messages.length > 0 && messages[0]?.content 
          ? messages[0].content.substring(0, 50) + '...' 
          : 'No messages'
        
        return `
          <div class="chat-history-item" data-session-id="${sessionId}">
            <div class="chat-history-item-time">${createdAt}</div>
            <div class="chat-history-item-text">${preview}</div>
            <div style="font-size:9px;color:#3d4f6a;margin-top:2px;">
              ${messages.length} message${messages.length !== 1 ? 's' : ''}
            </div>
          </div>
        `
      }).join("")
      
      // Add click handlers to history items
      historyList.querySelectorAll(".chat-history-item").forEach(item => {
        item.addEventListener("click", async () => {
          const sessionId = item.getAttribute("data-session-id")
          if (!sessionId || sessionId === "unknown") {
            showToast("Invalid session ID", "error")
            return
          }
          console.log("🔄 Restoring session:", sessionId)
          await loadChatSession(sessionId)
          if (historyModal) historyModal.classList.add("hidden")
        })
      })
    } catch (err) {
      console.error("❌ Error loading history:", err)
      historyList.innerHTML = `
        <div class="chat-history-empty" style="color: #e74c3c;">
          ⚠️ Failed to load history<br>
          <small>${err.message}</small>
        </div>
      `
      showToast("Failed to load chat history: " + err.message, "error")
    }
  })

  historyClose?.addEventListener("click", () => {
    if (historyModal) historyModal.classList.add("hidden")
  })

  historyClearAll?.addEventListener("click", async () => {
    if (!confirm("🗑 Delete ALL chat history? This cannot be undone.")) return
    
    try {
      console.log("🗑 Clearing all chat history...")
      const res = await fetch(`${BASE_URL}/api/extension-chat/sessions`, {
        method: "DELETE",
        timeout: 5000
      })
      
      if (!res.ok) {
        throw new Error(`Failed to clear (${res.status})`)
      }
      
      const data = await res.json()
      const deletedCount = data?.deletedCount || 0
      console.log("✅ Cleared", deletedCount, "sessions")
      
      const historyList = document.getElementById("chat-history-list")
      if (historyList) {
        historyList.innerHTML = '<div class="chat-history-empty">No chat history.</div>'
      }
      
      showToast("✅ All chat history cleared", "success")
    } catch (err) {
      console.error("❌ Error clearing history:", err)
      showToast("Failed to clear history: " + err.message, "error")
    }
  })
}

async function loadChatSession(sessionId) {
  try {
    console.log("📂 Loading session:", sessionId)
    
    // Query the specific session directly instead of fetching all
    const res = await fetch(`${BASE_URL}/api/extension-chat?sessionId=${encodeURIComponent(sessionId)}`, {
      timeout: 5000
    })
    
    if (!res.ok) {
      throw new Error(`Failed to load session (${res.status})`)
    }
    
    const data = await res.json()
    const messages = Array.isArray(data?.messages) ? data.messages : []
    
    if (!messages.length) {
      showToast("Session is empty or not found", "warning")
      return
    }
    
    console.log("✅ Found session with", messages.length, "messages")
    
    chatSessionId = sessionId
    chatMessages = messages.map(m => ({
      role: m?.role || "user",
      content: m?.content || "",
      plan: m?.meta || null
    })).filter(m => m.content) // Filter out empty messages
    
    renderChatMessages()
    showToast("✅ Chat session restored", "success")
  } catch (err) {
    console.error("❌ Error loading session:", err)
    showToast("Failed to load session: " + err.message, "error")
    // Keep current session on error
  }
}

function setChatBusy(isBusy) {
  chatBusy = isBusy
  const sendBtn = document.getElementById("chat-send-btn")
  if (sendBtn) {
    sendBtn.disabled = isBusy
    sendBtn.textContent = isBusy ? "Sending..." : "Send"
  }
}

function renderChatMessages() {
  const box = document.getElementById("chat-messages")
  const selection = document.getElementById("chat-selection")
  if (!box) return

  if (selection) {
    const target = lastPickedForChat
      ? `Target: ${lastPickedForChat.label || lastPickedForChat.selector || lastPickedForChat.tag || "selected element"}`
      : "Target: whole page"
    selection.textContent = target
  }

  box.innerHTML = ""
  chatMessages.forEach(msg => {
    const wrap = document.createElement("div")
    wrap.className = `chat-msg ${msg.role === "user" ? "chat-msg-user" : "chat-msg-ai"}`
    wrap.innerHTML = esc(msg.content || "")

    if (msg.role === "assistant" && msg.plan) {
      const layoutN = Array.isArray(msg.plan.layout) ? msg.plan.layout.length : 0
      const contrastN = Array.isArray(msg.plan.contrast) ? msg.plan.contrast.length : 0
      const actionN = Array.isArray(msg.plan.actions) ? msg.plan.actions.length : 0
      const info = document.createElement("div")
      info.className = "chat-plan"
      info.textContent = `layout ${layoutN} · contrast ${contrastN} · actions ${actionN}`
      wrap.appendChild(info)
    }

    box.appendChild(wrap)
  })
  box.scrollTop = box.scrollHeight
}

async function applyChatActions(actions) {
  if (!Array.isArray(actions) || !actions.length) {
    console.log("ℹ️  No actions to apply")
    return 0
  }
  
  console.log("📝 Applying", actions.length, "actions to tab", currentTabId)
  console.log("Actions:", JSON.stringify(actions, null, 2))
  
  // Ensure content script is loaded
  try {
    await chrome.scripting.executeScript({
      target: { tabId: currentTabId },
      files: ["content.js"]
    }).catch(() => {
      console.warn("⚠️  Content script already loaded")
    })
  } catch (err) {
    console.error("❌ Failed to inject content script:", err)
  }

  let applied = 0
  let failed = 0
  const failedReasons = []
  
  for (const action of actions) {
    try {
      const fixType = action?.fix?.type || "unknown"
      const selector = action?.fix?.selector || "no-selector"
      console.log(`🔧 Applying action ${applied + failed + 1}/${actions.length}:`, fixType, "selector:", selector)
      
      if (action?.kind === "domFix" && action.fix) {
        const resp = await chrome.tabs.sendMessage(currentTabId, {
          type: "APPLY_FIX",
          domFix: action.fix
        }).catch((err) => {
          console.error("❌ Message delivery error:", err.message)
          return { success: false, error: "Message failed: " + err.message }
        })
        
        if (resp?.success) {
          applied++
          console.log(`✅ Applied [${applied}]:`, resp.result)
          if (resp.canUndo !== undefined) {
            setUndoState(resp.canUndo, resp.canRedo, resp.undoLabel, resp.redoLabel)
          }
        } else {
          failed++
          const reason = resp?.error || "Unknown error (no response)"
          failedReasons.push(`${fixType} on "${selector}": ${reason}`)
          console.error(`❌ Failed [${failed}]:`, reason)
        }
      } else {
        failed++
        const reason = `Invalid action format: missing kind or fix object`
        failedReasons.push(reason)
        console.warn("⚠️  Invalid action format:", action)
      }
    } catch (err) {
      failed++
      const reason = `Exception: ${err.message}`
      failedReasons.push(reason)
      console.error("❌ Exception applying action:", err)
    }
  }
  
  console.log(`\n📊 RESULTS: ${applied}/${actions.length} applied, ${failed} failed`)
  if (failed > 0) {
    console.log("Failed actions:", failedReasons)
  }
  return applied
}


function setupScan() {
  document.getElementById("scan-btn").addEventListener("click", startScan)
  document.getElementById("rescan-btn").addEventListener("click", startScan)

  document.getElementById("save-btn").addEventListener("click", async () => {
    if (!lastResults) return
    const btn = document.getElementById("save-btn")
    btn.disabled = true
    const res = await chrome.runtime.sendMessage({
      type: "SAVE_HISTORY",
      entry: { url: currentUrl, score: lastResults.score, violations: lastResults.violations, suggestions: lastResults.suggestions }
    })
    if (res?.success) {
      const src = res.source === "mongodb" ? "☁️ Saved to MongoDB!" : "💾 Saved locally!"
      btn.innerHTML = "✅ " + (res.source === "mongodb" ? "Saved to DB!" : "Saved!")
      btn.classList.add("saved")
      showToast(src, "success")
      setTimeout(() => { btn.innerHTML = "💾 Save"; btn.classList.remove("saved"); btn.disabled = false }, 2500)
    } else { btn.disabled = false }
  })

  document.getElementById("copy-report-btn").addEventListener("click", () => {
    if (!lastResults) return
    const { score, violations, suggestions } = lastResults
    const lines = [
      `Chai Ke Sath AI — Accessibility Report`,
      `Generated: ${new Date().toLocaleString()}`,
      `URL: ${currentUrl}`,
      `Score: ${score}/100  |  Grade: ${calcGrade(score).grade}  |  Violations: ${violations}`,
      ``,
      ...(suggestions||[]).map((s, i) =>
        `${i+1}. [${(s.impact||"").toUpperCase()}] ${s.title||s.id}\n   ${s.fixDescription||""}`)
    ]
    navigator.clipboard.writeText(lines.join("\n"))
    showToast("📋 Report copied!", "success")
  })

  document.getElementById("expand-all-btn").addEventListener("click", () => {
    allExpanded = !allExpanded
    document.querySelectorAll(".card").forEach(card => {
      const body = card.querySelector(".card-body")
      allExpanded ? card.classList.add("open") : card.classList.remove("open")
      if (body) body.style.display = allExpanded ? "flex" : "none"
    })
    document.getElementById("expand-all-btn").innerHTML = allExpanded ? "↕ Collapse" : "↕ Expand"
  })

  document.getElementById("fix-all-btn").addEventListener("click", async () => {
    
    const pendingCards = [...document.querySelectorAll(".card")]
      .filter(card => {
        const btn = card.querySelector(".btn-fix-inline")
        return btn && btn.dataset.applied !== "true" && !btn.disabled
      })

    if (!pendingCards.length) { showToast("All fixes already applied!", "info"); return }

    const fixBtn = document.getElementById("fix-all-btn")
    fixBtn.disabled = true
    fixBtn.innerHTML = "⏳ 0/" + pendingCards.length

    let done = 0
   
    await chrome.scripting.executeScript({ target:{ tabId:currentTabId }, files:["content.js"] }).catch(()=>{})

    for (const card of pendingCards) {
      const btn = card.querySelector(".btn-fix-inline")
      if (!btn || btn.dataset.applied === "true") continue

     
      const idx    = parseInt(btn.dataset.idx)
      let   domFix = domFixMap.get(idx) || null
      
      if (!domFix) {
        const sugg = lastResults?.suggestions?.[idx]
        domFix = sugg?.domFix || null
      }
      if (!domFix) continue

      btn.disabled = true
      btn.innerHTML = '<span class="fix-icon-inline spin">⚙</span>'

      try {
        const resp = await chrome.tabs.sendMessage(currentTabId, { type:"APPLY_FIX", domFix })
        if (resp?.success) {
          btn.innerHTML = "✅"
          btn.dataset.applied = "true"
          btn.classList.add("applied-inline")
          const title = card.querySelector(".card-title")
          if (title) title.style.cssText = "text-decoration:line-through;opacity:0.45;flex:1;font-size:11.5px;font-weight:600;color:#c0ccec;line-height:1.35"
          card.style.opacity = "0.65"
          fixApplied++
          fixesApplied++
          if (resp.canUndo !== undefined) setUndoState(resp.canUndo, resp.canRedo, resp.undoLabel, resp.redoLabel)
        } else {
          btn.disabled = false
          btn.innerHTML = '<span class="fix-icon-inline">⚡</span>Fix'
        }
      } catch {
        btn.disabled = false
        btn.innerHTML = '<span class="fix-icon-inline">⚡</span>Fix'
      }

      done++
      fixBtn.innerHTML = "⏳ " + done + "/" + pendingCards.length
      updateFixProgress()
      updateDownloadBadge()
    }

    fixBtn.disabled = false
    fixBtn.innerHTML = "⚡ Fix All"
    showToast("✅ Applied " + done + " fix" + (done !== 1 ? "es" : "") + "!", "success")
   
    if (done > 0) await rescoreNow()
  })
}

async function startScan() {
  const scanBtn = document.getElementById("scan-btn")
  const loading = document.getElementById("loading")
  const results = document.getElementById("results")

  scanBtn.disabled = true
  scanBtn.innerHTML = "<span>⏳</span> Scanning…"
  loading.classList.remove("hidden")
  document.getElementById("global-actions")?.classList.remove("hidden")
  results.classList.add("hidden")
  allExpanded = false; fixApplied = 0; fixTotal = 0
  animateLoadingSteps()

  try {
    const data = await chrome.runtime.sendMessage({ type: "ANALYSE", url: currentUrl })
    if (data?.error) { showToast("❌ " + data.error, "error"); return }
    lastResults = data
    renderResults(data)
  } catch (err) {
    showToast("❌ " + err.message, "error")
  } finally {
    loading.classList.add("hidden")
    stopLoadingSteps()
    scanBtn.disabled = false
    scanBtn.innerHTML = "<span>🔍</span> Scan This Page"
  }
}

let stepTimer = null
function animateLoadingSteps() {
  const steps = ["lstep-1","lstep-2","lstep-3"]
  let i = 0
  steps.forEach(s => document.getElementById(s)?.classList.remove("active","done"))
  document.getElementById(steps[0])?.classList.add("active")
  stepTimer = setInterval(() => {
    document.getElementById(steps[i])?.classList.remove("active")
    document.getElementById(steps[i])?.classList.add("done")
    i++
    if (i < steps.length) document.getElementById(steps[i])?.classList.add("active")
    else clearInterval(stepTimer)
  }, 7000)
}
function stopLoadingSteps() { clearInterval(stepTimer) }


function renderResults({ score, violations, suggestions }) {
  const pageProfile = buildPageThemeProfile({ url: currentUrl, score, suggestions })
  const arc = document.getElementById("score-arc")
  const C   = 2 * Math.PI * 32
  arc.style.strokeDasharray  = C
  arc.style.strokeDashoffset = C
  document.getElementById("score-val").textContent = score
  setTimeout(() => { arc.style.strokeDashoffset = C - (score/100)*C }, 60)
  arc.style.stroke = score >= 80 ? "#22c55e" : score >= 50 ? "#f59e0b" : "#ef4444"

  const { grade, label, cls } = calcGrade(score)
  const gradeEl = document.getElementById("score-grade")
  gradeEl.textContent = grade
  gradeEl.className = `grade-badge grade-${cls}`
  document.getElementById("score-label-text").textContent = label
  document.getElementById("violations-label").textContent =
    violations === 0 ? "✅ No violations — perfectly accessible!" : `${violations} violation${violations!==1?"s":""} found`

  if (suggestions?.length) {
    const counts = { critical:0, serious:0, moderate:0, minor:0 }
    suggestions.forEach(s => { if (counts[s.impact]!==undefined) counts[s.impact]++ })
    const total = suggestions.length
    const bar   = document.getElementById("impact-bar")
    bar.innerHTML = ""; bar.classList.remove("hidden")
    const colors = { critical:"#ef4444", serious:"#f97316", moderate:"#facc15", minor:"#60a5fa" }
    Object.entries(counts).forEach(([impact, cnt]) => {
      if (!cnt) return
      const seg = document.createElement("div")
      seg.className = "bar-seg"
      seg.style.cssText = `width:${(cnt/total)*100}%;background:${colors[impact]}`
      seg.title = `${impact}: ${cnt}`
      bar.appendChild(seg)
    })
    const legend = document.getElementById("impact-legend")
    legend.innerHTML = Object.entries(counts).filter(([,c])=>c)
      .map(([k,c])=>`<span class="leg-dot" style="background:${colors[k]}"></span><span>${c} ${k}</span>`).join("")
    legend.classList.remove("hidden")
  } else {
    document.getElementById("impact-bar")?.classList.add("hidden")
    document.getElementById("impact-legend")?.classList.add("hidden")
  }

  const recommendedThemes = getTopRecommendedThemes({
    url: currentUrl,
    score,
    suggestions,
  })
  renderThemeRecommendations(recommendedThemes, pageProfile)

  // Generate AI personalized themes based on scan results
  generateAIThemes({ score, violations, suggestions, url: currentUrl })

  const wrap = document.getElementById("suggestions-wrap")
  wrap.innerHTML = ""
  domFixMap.clear()  
  fixTotal = 0; fixApplied = 0

  if (!suggestions?.length) {
    wrap.innerHTML = '<div class="empty-state"><div class="empty-icon">🎉</div><p>Fully accessible!</p></div>'
    if (score >= 90) launchConfetti()
  } else {
    const order = { critical:0, serious:1, moderate:2, minor:3 }
    const sorted = [...suggestions].sort((a,b) => (order[a.impact]??9)-(order[b.impact]??9))
    sorted.forEach((s, i) => { if (s.domFix) fixTotal++; wrap.appendChild(buildCard(s, i)) })
  }

  if (fixTotal > 0) {
    document.getElementById("fix-progress-wrap").classList.remove("hidden")
    updateFixProgress()
  }

  document.getElementById("results").classList.remove("hidden")
  document.getElementById("global-actions").classList.remove("hidden")
  if (score >= 90 && violations > 0) setTimeout(launchConfetti, 600)
}

function calcGrade(score) {
  if (score >= 95) return { grade:"A+", label:"Excellent",      cls:"a-plus" }
  if (score >= 85) return { grade:"A",  label:"Great",          cls:"a" }
  if (score >= 75) return { grade:"B",  label:"Good",           cls:"b" }
  if (score >= 60) return { grade:"C",  label:"Needs Work",     cls:"c" }
  if (score >= 40) return { grade:"D",  label:"Poor",           cls:"d" }
  return              { grade:"F",  label:"Critical Issues", cls:"f" }
}

function updateFixProgress() {
  const pct = fixTotal ? (fixApplied/fixTotal)*100 : 0
  document.getElementById("fix-counter").textContent = `${fixApplied} / ${fixTotal}`
  document.getElementById("fp-bar").style.width = `${pct}%`
  if (fixApplied === fixTotal && fixTotal > 0) {
    document.getElementById("fp-bar").style.background = "#22c55e"
    showToast("🎉 All auto-fixes applied!", "success")
    launchConfetti()
  }
}

function buildCard(s, index) {
  const card = document.createElement("div")
  card.className = "card"
  const impact = s.impact || "minor"
  const hasFix = !!s.domFix

  card.innerHTML = `
    <div class="card-head">
      <span class="badge badge-${impact}">${impact}</span>
      <span class="card-title">${esc(s.title||s.id)}</span>
      ${hasFix
        ? `<button class="btn-fix-inline" data-idx="${index}" data-applied="false">
             <span class="fix-icon-inline">⚡</span>Fix
           </button>`
        : `<span class="no-fix-tag">Manual</span>`
      }
      <span class="chevron">▾</span>
    </div>
    <div class="card-body" style="display:none">
      ${s.explanation    ? `<p class="card-text">${esc(s.explanation)}</p>` : ""}
      ${s.fixDescription ? `<div class="card-hint">${esc(s.fixDescription)}</div>` : ""}
      ${s.codeExample    ? `<pre class="code-pre">${esc(s.codeExample)}</pre>` : ""}
      ${s.helpUrl        ? `<div class="card-actions"><a href="${esc(s.helpUrl)}" target="_blank" class="btn-docs">📖 WCAG Docs</a></div>` : ""}
    </div>
  `

  
  card.querySelector(".card-head").addEventListener("click", (e) => {
    if (e.target.closest(".btn-fix-inline")) return
    const body = card.querySelector(".card-body")
    const open = card.classList.toggle("open")
    body.style.display = open ? "flex" : "none"
  })

  if (hasFix) {
    
    domFixMap.set(index, s.domFix)
    card.querySelector(".btn-fix-inline").addEventListener("click", async e => {
      e.stopPropagation()
      await doApplyFix(e.currentTarget, s.domFix, card)
    })
  }

  return card
}

async function doApplyFix(btn, domFix, card) {
  if (btn.dataset.applied === "true") return
  btn.disabled = true
  btn.innerHTML = '<span class="fix-icon-inline spin">⚙</span>…'

  try {
    await chrome.scripting.executeScript({ target:{ tabId:currentTabId }, files:["content.js"] }).catch(()=>{})
    const resp = await chrome.tabs.sendMessage(currentTabId, { type:"APPLY_FIX", domFix })

    if (resp?.success) {
      
      btn.innerHTML = "✅ Fixed"
      btn.dataset.applied = "true"
      btn.classList.add("applied-inline")

    
      if (card) {
        const title = card.querySelector(".card-title")
        if (title) title.style.cssText = "text-decoration:line-through;opacity:0.45;flex:1;font-size:11.5px;font-weight:600;color:#c0ccec;line-height:1.35"
        card.style.opacity = "0.65"
      }

      fixApplied++
      fixesApplied++
      updateFixProgress()

    
      updateDownloadBadge()

      
      if (resp.canUndo !== undefined) setUndoState(resp.canUndo, resp.canRedo, resp.undoLabel, resp.redoLabel)

     
      await rescoreNow()

    } else {
      btn.disabled = false
      btn.innerHTML = '<span class="fix-icon-inline">⚡</span>Fix'
      showToast("Fix failed: " + (resp?.error || "Unknown"), "error")
    }
  } catch {
    btn.disabled = false
    btn.innerHTML = '<span class="fix-icon-inline">⚡</span>Fix'
    showToast("Could not reach page. Try reloading the tab.", "error")
  }
}


function setupGlobalActions() {
  document.getElementById("undo-btn")?.addEventListener("click", doUndo)
  document.getElementById("redo-btn")?.addEventListener("click", doRedo)
  document.getElementById("download-all-btn")?.addEventListener("click", downloadAllChanges)

  document.getElementById("global-actions")?.classList.remove("hidden")

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === "LAYOUT_APPLIED") {
      layoutChangeCount++
      if (msg.canUndo !== undefined) setUndoState(msg.canUndo, msg.canRedo, msg.undoLabel, msg.redoLabel)
      updateDownloadBadge()
    }
    if (msg.type === "INSPECTOR_CLOSED") {
      if (msg.canUndo !== undefined) setUndoState(msg.canUndo, msg.canRedo, msg.undoLabel, msg.redoLabel)
      updateDownloadBadge()
    }
    // PRODUCTION: Listen for drag mode state changes
    if (msg.type === "DRAG_MODE_TOGGLED") {
      dragModeActive = msg.active
      dragChangesExist = msg.hasChanges || false
      updateDownloadBadge()
    }
    if (msg.type === "ELEMENT_DRAGGED") {
      dragChangesExist = true
      updateDownloadBadge()
    }
    if (msg.type === "DRAG_ENGINE_OPTIONS_UPDATED" && msg.options) {
      applyDragEngineOptionsToUI(msg.options)
    }
  })
}


async function doUndo() {
  const btn = document.getElementById("undo-btn")
  if (!btn || btn.disabled) return
  btn.disabled = true
  try {
    await chrome.scripting.executeScript({ target: { tabId: currentTabId }, files: ["content.js"] }).catch(() => {})
    const resp = await chrome.tabs.sendMessage(currentTabId, { type: "UNDO_FIX" })
    if (resp) setUndoState(resp.canUndo, resp.canRedo, resp.undoLabel, resp.redoLabel)
    showToast("↩ Undone", "info")
  } catch { showToast("Undo failed — try reloading the page.", "error") }
  finally { const b = document.getElementById("undo-btn"); if(b) b.disabled = !undoAvailable }
}


async function doRedo() {
  const btn = document.getElementById("redo-btn")
  if (!btn || btn.disabled) return
  btn.disabled = true
  try {
    await chrome.scripting.executeScript({ target: { tabId: currentTabId }, files: ["content.js"] }).catch(() => {})
    const resp = await chrome.tabs.sendMessage(currentTabId, { type: "REDO_FIX" })
    if (resp) setUndoState(resp.canUndo, resp.canRedo, resp.undoLabel, resp.redoLabel)
    showToast("↪ Redone", "info")
  } catch { showToast("Redo failed.", "error") }
  finally { const b = document.getElementById("redo-btn"); if(b) b.disabled = !redoAvailable }
}

function setUndoState(canUndo, canRedo, undoLabel, redoLabel) {
  undoAvailable = !!canUndo
  redoAvailable = !!canRedo
  const ub = document.getElementById("undo-btn")
  const rb = document.getElementById("redo-btn")
  if (ub) { ub.disabled = !canUndo; ub.title = canUndo ? ("Undo: " + (undoLabel||"last fix")) : "Nothing to undo" }
  if (rb) { rb.disabled = !canRedo; rb.title = canRedo ? ("Redo: " + (redoLabel||"last fix")) : "Nothing to redo" }
}


let dragModeActive = false
let dragChangesExist = false

function updateDownloadBadge() {
  const btn   = document.getElementById("download-all-btn")
  const badge = document.getElementById("dl-badge")
  if (!btn) return

  const fixCount    = document.querySelectorAll(".btn-fix-inline.applied-inline").length
  const hasTheme    = !!activeThemeId
  const layoutCount = layoutChangeCount  
  const dragCount   = dragModeActive && dragChangesExist ? 1 : 0
  const total       = fixCount + (hasTheme ? 1 : 0) + layoutCount + dragCount

  // PRODUCTION: Enable download only if there are actual changes
  btn.disabled = total === 0
  if (badge) {
    if (total > 0) { badge.textContent = String(total); badge.classList.remove("hidden") }
    else badge.classList.add("hidden")
  }
  if (total > 0) {
    btn.classList.add("ga-dl-ready")
    document.getElementById("global-actions")?.classList.remove("hidden")
  } else {
    btn.classList.remove("ga-dl-ready")
  }
}

async function downloadAllChanges() {
  const btn = document.getElementById("download-all-btn")
  if (!btn || btn.disabled) return
  const origHTML = btn.innerHTML
  btn.innerHTML = '<span class="ga-icon spin">⚙</span><span class="ga-label">Building…</span>'
  btn.disabled = true

  try {
    await chrome.scripting.executeScript({ target: { tabId: currentTabId }, files: ["content.js"] }).catch(() => {})
    
    // Try to capture ALL modifications (chat fixes, drag changes, theme changes)
    let resp = await chrome.tabs.sendMessage(currentTabId, { type: "CAPTURE_DOWNLOAD" })
    
    if (resp?.success && resp.html) {
      // Use the comprehensive capture with all CSS and modifications
      const blob = new Blob([resp.html], { type: "text/html;charset=utf-8" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      const now = new Date()
      const timestamp = now.toISOString().slice(0,19).replace(/:/g, "-")
      const domain = currentUrl.replace(/^https?:\/\/(www\.)?/, "").split("/")[0]
      const safeName = (domain || "page").replace(/[^a-z0-9]/gi, "-").toLowerCase()
      
      link.href = url
      link.download = `${safeName}-modified-${timestamp}.html`
      link.click()
      URL.revokeObjectURL(url)
      
      const msg = `✅ Downloaded with ${resp.modifiedElements || 0} modified element(s) and ${resp.layoutChanges || 0} layout change(s)`
      showToast(msg, "success")
      btn.innerHTML = origHTML
      btn.disabled = false
      return
    }
    
    // Fall back to GET_HTML for other changes (legacy support)
    resp = await chrome.tabs.sendMessage(currentTabId, { type: "GET_HTML" })
    if (!resp?.html) {
      showToast("Could not read page HTML.", "error")
      btn.innerHTML = origHTML; btn.disabled = false; return
    }

    const now          = new Date()
    const score        = document.getElementById("score-val")?.textContent || "--"
    const domain       = currentUrl.replace(/^https?:\/\/(www\.)?/, "").split("/")[0]
    const activeTheme  = THEMES.find(t => t.id === activeThemeId)
    const layoutChanges = resp.layoutChanges || []
    const themeCss     = resp.themeCss || (activeTheme ? activeTheme.css : null)

    
    const appliedBtns  = [...document.querySelectorAll(".btn-fix-inline.applied-inline")]
    const fixTitles    = appliedBtns.map((b, i) => {
      const title = b.closest(".card")?.querySelector(".card-title")?.textContent?.trim() || ("Fix " + (i+1))
      return title
    })

    const cssLines = []
    cssLines.push("/* ================================================================")
    cssLines.push("   CHAI KE SATH AI — Extracted CSS Changes")
    cssLines.push("   Downloaded: " + now.toLocaleString())
    cssLines.push("   Source: " + currentUrl)
    cssLines.push("================================================================ */")
    cssLines.push("")

    if (themeCss) {
      cssLines.push("/* ── THEME: " + (activeTheme ? activeTheme.name : "Applied Theme") + " ── */")
      cssLines.push(themeCss.trim())
      cssLines.push("")
    }

    if (layoutChanges.length > 0) {
      cssLines.push("/* ── LAYOUT INSPECTOR CHANGES (" + layoutChanges.length + " element(s)) ── */")
      layoutChanges.forEach((lc, i) => {
        cssLines.push("")
        cssLines.push("/* Change " + (i+1) + ": " + lc.label + " */")
       
        if (lc.style) {
          cssLines.push(lc.selector + " {")
          lc.style.split(";").forEach(s => {
            s = s.trim()
            if (s) cssLines.push("  " + s + ";")
          })
          cssLines.push("}")
        }
      })
      cssLines.push("")
    }

    if (fixTitles.length > 0) {
      cssLines.push("/* ── ACCESSIBILITY FIXES APPLIED (" + fixTitles.length + ") ── */")
      cssLines.push("/* The following violations were fixed in the HTML above: */")
      fixTitles.forEach((t, i) => cssLines.push("/* " + (i+1) + ". " + t + " */"))
      cssLines.push("")
    }

    const extractedCSS = cssLines.join("\n")

    
    let finalHtml = resp.html

  if (themeCss) {
  const themeStyleTag = [
    "",
    "  <style id=\"cksa-applied-theme\">",
    "    " + themeCss.trim().replace(/\n/g, "\n    "),
    "  </style>",
    ""
  ].join("\n")


      if (finalHtml.includes("</head>")) {
        finalHtml = finalHtml.replace("</head>", themeStyleTag + "</head>")
      } else {
        finalHtml = themeStyleTag + finalHtml
      }
    }

    if (layoutChanges.length > 0) {
      const layoutStyleLines = ["", "  <!-- ── LAYOUT INSPECTOR CHANGES (Chai Ke Sath AI) ── -->", "  <style id=\"cksa-layout-changes\">"]
      layoutChanges.forEach((lc, i) => {
        layoutStyleLines.push("    /* Layout Change " + (i+1) + ": " + lc.label + " */")
        if (lc.style) {
          layoutStyleLines.push("    " + lc.selector + " {")
          lc.style.split(";").forEach(s => { s = s.trim(); if (s) layoutStyleLines.push("      " + s + ";") })
          layoutStyleLines.push("    }")
        }
      })
      layoutStyleLines.push("  </style>", "  <!-- ── End Layout Changes ── -->", "")
      const layoutBlock = layoutStyleLines.join("\n")
      if (finalHtml.includes("</head>")) {
        finalHtml = finalHtml.replace("</head>", layoutBlock + "</head>")
      }
    }

   
    if (fixTitles.length > 0) {
      const fixMarkerCSS = [
        "",
        "  <!-- ── ACCESSIBILITY FIX MARKERS (Chai Ke Sath AI) ── -->",
        "  <style id=\"cksa-fix-markers\">",
        "    /* Elements that had accessibility violations fixed are underlined */",
        "    [data-cksa-fixed] {",
        "      outline: 2px dashed #22c55e !important;",
        "      outline-offset: 2px !important;",
        "      position: relative !important;",
        "    }",
        "    [data-cksa-fixed]::after {",
        "      content: attr(data-cksa-fixed) !important;",
        "      position: absolute !important;",
        "      top: -20px !important; left: 0 !important;",
        "      background: #22c55e !important; color: #000 !important;",
        "      font-size: 10px !important; padding: 1px 5px !important;",
        "      border-radius: 3px !important; white-space: nowrap !important;",
        "      z-index: 9999 !important; pointer-events: none !important;",
        "    }",
        "  </style>",
        "  <!-- ── End Fix Markers ── -->",
        ""
      ].join("\n")
      if (finalHtml.includes("</head>")) {
        finalHtml = finalHtml.replace("</head>", fixMarkerCSS + "</head>")
      }
    }

    
    const sep = "  " + "=".repeat(58)
    const headerLines = [
      "<!--",
      sep,
      "  CHAI KE SATH AI — COMPLETE MODIFIED PAGE",
      sep,
      "  Source URL    : " + currentUrl,
      "  Downloaded    : " + now.toLocaleString(),
      "  Score         : " + score + "/100",
      sep,
      "  CHANGES APPLIED:",
    ]
    if (fixTitles.length > 0) {
      headerLines.push("  [ACCESSIBILITY FIXES - " + fixTitles.length + " violations fixed]")
      fixTitles.forEach((t, i) => headerLines.push("    " + (i+1) + ". " + t))
    }
    if (activeTheme) {
      headerLines.push("  [THEME - " + activeTheme.name + "]")
      headerLines.push("    See <style id=\"cksa-applied-theme\"> in <head>")
    }
    if (layoutChanges.length > 0) {
      headerLines.push("  [LAYOUT INSPECTOR - " + layoutChanges.length + " element(s) edited]")
      layoutChanges.forEach((lc, i) => headerLines.push("    " + (i+1) + ". " + lc.label))
      headerLines.push("    See <style id=\"cksa-layout-changes\"> in <head>")
    }
    headerLines.push(sep)
    headerLines.push("  INCLUDED FILES:")
    headerLines.push("    1. " + (domain||"page") + "-final-YYYYMMDD.html  (this file)")
    headerLines.push("    2. " + (domain||"page") + "-changes.css          (extracted CSS changes)")
    headerLines.push(sep)
    headerLines.push("-->")
    headerLines.push("")
    finalHtml = headerLines.join("\n") + finalHtml

   
    const safeName = (domain || "page").replace(/[^a-z0-9]/gi, "-").toLowerCase()
    const dateStr  = now.getFullYear() + String(now.getMonth()+1).padStart(2,"0") + String(now.getDate()).padStart(2,"0")

   
    const htmlBlob    = new Blob([finalHtml], { type: "text/html;charset=utf-8" })
    const htmlUrl     = URL.createObjectURL(htmlBlob)
    const htmlFilename = safeName + "-final-" + dateStr + ".html"

   
    const cssBlob     = new Blob([extractedCSS], { type: "text/css;charset=utf-8" })
    const cssUrl      = URL.createObjectURL(cssBlob)
    const cssFilename  = safeName + "-changes-" + dateStr + ".css"

    if (chrome.downloads) {
      await chrome.downloads.download({ url: htmlUrl, filename: htmlFilename, saveAs: true })

      await new Promise(r => setTimeout(r, 800))
      await chrome.downloads.download({ url: cssUrl, filename: cssFilename, saveAs: false })
    } else {
      const a1 = document.createElement("a"); a1.href = htmlUrl; a1.download = htmlFilename; a1.click()
      await new Promise(r => setTimeout(r, 600))
      const a2 = document.createElement("a"); a2.href = cssUrl; a2.download = cssFilename; a2.click()
    }
    setTimeout(() => { URL.revokeObjectURL(htmlUrl); URL.revokeObjectURL(cssUrl) }, 10000)

    btn.innerHTML = '<span class="ga-icon">✅</span><span class="ga-label">2 Files!</span>'
    showToast("✅ Downloaded HTML + CSS!", "success")
    setTimeout(() => { btn.innerHTML = origHTML; btn.disabled = false; updateDownloadBadge() }, 4000)

  } catch (err) {
    btn.innerHTML = origHTML; btn.disabled = false
    showToast("Download failed: " + err.message, "error")
  }
}


async function rescoreNow() {
  const scoreEl = document.getElementById("score-val")
  if (scoreEl) scoreEl.style.opacity = "0.4"
  try {
    await chrome.scripting.executeScript({ target: { tabId: currentTabId }, files: ["content.js"] }).catch(() => {})
    const htmlResp = await chrome.tabs.sendMessage(currentTabId, { type: "GET_HTML" })
    if (!htmlResp?.html) { if (scoreEl) scoreEl.style.opacity = "1"; return }
    const data = await chrome.runtime.sendMessage({ type: "ANALYSE_HTML", html: htmlResp.html })
    if (data?.error) { if (scoreEl) scoreEl.style.opacity = "1"; return }
    updateScoreDisplay(data)
    lastResults = data
    if (data.score >= 90) setTimeout(launchConfetti, 400)
  } catch { if (scoreEl) scoreEl.style.opacity = "1" }
}

function updateScoreDisplay({ score, violations }) {
  const scoreEl   = document.getElementById("score-val")
  const prevScore = parseInt(scoreEl?.textContent) || 0
  const displayScore = Math.max(score, prevScore)

  const arc = document.getElementById("score-arc")
  const C   = 2 * Math.PI * 32
  arc.style.strokeDashoffset = C - (displayScore / 100) * C
  arc.style.stroke = displayScore >= 80 ? "#22c55e" : displayScore >= 50 ? "#f59e0b" : "#ef4444"
  if (scoreEl) scoreEl.style.opacity = "1"

  const diff = displayScore - prevScore
  let step = 0
  const timer = setInterval(() => {
    step++
    if (scoreEl) scoreEl.textContent = Math.round(prevScore + (diff * step / 20))
    if (step >= 20) { if (scoreEl) scoreEl.textContent = displayScore; clearInterval(timer) }
  }, 30)

  const { grade, label, cls } = calcGrade(displayScore)
  const gradeEl = document.getElementById("score-grade")
  if (gradeEl) { gradeEl.textContent = grade; gradeEl.className = "grade-badge grade-" + cls }
  const labelEl = document.getElementById("score-label-text")
  if (labelEl) labelEl.textContent = label
  const violEl = document.getElementById("violations-label")
  if (violEl) violEl.textContent = violations === 0 ? " No violations!" : violations + " violation" + (violations !== 1 ? "s" : "") + " found"

  const ring = document.querySelector(".score-ring-wrap")
  if (ring) { ring.style.transform = "scale(1.06)"; setTimeout(() => { ring.style.transform = "scale(1)" }, 300) }
}



let inspEl = null   

function setupInspector() {

  document.getElementById("inspector-toggle-btn")?.addEventListener("click", async () => {
    inspectorOn = !inspectorOn
    try {
      await chrome.scripting.executeScript({ target:{ tabId:currentTabId }, files:["content.js"] }).catch(()=>{})

      if (inspectorOn && dragModeOn) {
        await chrome.tabs.sendMessage(currentTabId, { type:"TOGGLE_DRAG_MODE", active: false }).catch(() => {})
        dragModeOn = false
        updateDragModeUI(dragModeOn)
      }

      await chrome.tabs.sendMessage(currentTabId, { type:"TOGGLE_INSPECTOR", active: inspectorOn })
    } catch {
      showToast("Could not activate inspector on this page.", "error")
      inspectorOn = false
    }
    updateInspectorUI()
    
  })


  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === "ELEMENT_PICKED") {
      inspEl = msg.selector
      lastPickedForChat = {
        selector: msg.selector,
        tag: msg.tag,
        label: msg.label,
        styles: msg.styles || {},
      }
      populateEditor(msg)
      renderChatMessages()
    }
    if (msg.type === "INSPECTOR_CLOSED") {
      inspectorOn = false
      updateInspectorUI()
    }
    if (msg.type === "LAYOUT_APPLIED") {
      if (msg.canUndo !== undefined) setUndoState(msg.canUndo, msg.canRedo, msg.undoLabel, msg.redoLabel)
      updateDownloadBadge()
    }
  })


  document.querySelectorAll(".li-tab").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".li-tab").forEach(t => t.classList.remove("li-tab-on"))
      btn.classList.add("li-tab-on")
      document.querySelectorAll(".li-pane").forEach(p => p.classList.add("hidden"))
      document.getElementById("litab-" + btn.dataset.litab)?.classList.remove("hidden")
    })
  })

 
  document.getElementById("li-reset-btn")?.addEventListener("click", async () => {
    if (!inspEl) return
    await sendToPage({ type: "APPLY_LIVE_STYLE", selector: inspEl, prop: "cssText", value: "" })
  
    const props = ["fontSize","lineHeight","letterSpacing","fontWeight",
      "paddingTop","paddingRight","paddingBottom","paddingLeft",
      "marginTop","marginRight","marginBottom","marginLeft",
      "width","height","borderRadius","color","backgroundColor"]
    for (const p of props) {
      await sendToPage({ type: "APPLY_LIVE_STYLE", selector: inspEl, prop: p, value: "" })
    }
    showToast("↩ Element styles reset", "info")
  })

 
  document.getElementById("li-copy-css-btn")?.addEventListener("click", () => {
    const styles = gatherCurrentStyles()
    if (!styles) return
    const css = Object.entries(styles)
      .filter(([,v]) => v)
      .map(([k, v]) => "  " + k.replace(/([A-Z])/g, c => "-" + c.toLowerCase()) + ": " + v + ";")
      .join("")
    navigator.clipboard.writeText((inspEl||"element") + " {" + css + "}")
    showToast(" CSS copied!", "success")
  })

 
  document.getElementById("li-apply-btn")?.addEventListener("click", async () => {
    if (!inspEl) return
    const styles = gatherCurrentStyles()
    const btn    = document.getElementById("li-apply-btn")
    btn.textContent = " Applying…"; btn.disabled = true
    try {
      await chrome.scripting.executeScript({ target:{ tabId:currentTabId }, files:["content.js"] }).catch(()=>{})
      const resp = await chrome.tabs.sendMessage(currentTabId, {
        type: "BAKE_LAYOUT",
        selector: inspEl,
        label: document.getElementById("li-el-tag")?.textContent || "element",
        styles,
      })
      if (resp?.success) {
        if (resp.canUndo !== undefined) setUndoState(resp.canUndo, resp.canRedo, resp.undoLabel, resp.redoLabel)
        updateDownloadBadge()
        btn.textContent = "✓ Applied!"
        showToast("Layout applied to HTML!", "success")
        setTimeout(() => { btn.textContent = "✓ Apply to HTML"; btn.disabled = false }, 2000)
      } else {
        btn.textContent = "✓ Apply to HTML"; btn.disabled = false
        showToast("Apply failed", "error")
      }
    } catch {
      btn.textContent = "✓ Apply to HTML"; btn.disabled = false
      showToast("Could not apply layout.", "error")
    }
  })

  document.getElementById("li-fit-btn")?.addEventListener("click", async () => {
    await sendToPage({ type: "APPLY_LIVE_STYLE", selector: inspEl, prop: "width", value: "fit-content" })
    document.getElementById("li-width-n").value = "auto"
  })
  document.getElementById("li-full-btn")?.addEventListener("click", async () => {
    await sendToPage({ type: "APPLY_LIVE_STYLE", selector: inspEl, prop: "width", value: "100%" })
  })


  wireSlider("li-fontsize",      "fontSize",      "px")
  wireSlider("li-lineheight",    "lineHeight",    "px")
  wireSlider("li-letterspacing", "letterSpacing", "px", true)
  wireSlider("li-pt", "paddingTop",    "px")
  wireSlider("li-pr", "paddingRight",  "px")
  wireSlider("li-pb", "paddingBottom", "px")
  wireSlider("li-pl", "paddingLeft",   "px")
  wireSlider("li-mt", "marginTop",     "px")
  wireSlider("li-mr", "marginRight",   "px")
  wireSlider("li-mb", "marginBottom",  "px")
  wireSlider("li-ml", "marginLeft",    "px")
  wireSlider("li-width",  "width",        "px")
  wireSlider("li-height", "height",       "px")
  wireSlider("li-radius", "borderRadius", "px")

  
  document.getElementById("li-fontweight-s")?.addEventListener("change", e => {
    sendToPage({ type: "APPLY_LIVE_STYLE", selector: inspEl, prop: "fontWeight", value: e.target.value })
  })

  
  document.getElementById("li-color-pick")?.addEventListener("input", e => {
    document.getElementById("li-color-hex").textContent = e.target.value
    sendToPage({ type: "APPLY_LIVE_STYLE", selector: inspEl, prop: "color", value: e.target.value })
    updateContrastDisplay()
  })
  document.getElementById("li-bg-pick")?.addEventListener("input", e => {
    document.getElementById("li-bg-hex").textContent = e.target.value
    sendToPage({ type: "APPLY_LIVE_STYLE", selector: inspEl, prop: "backgroundColor", value: e.target.value })
    updateContrastDisplay()
  })

  document.getElementById("li-text-replace-btn")?.addEventListener("click", async () => {
    await applyInspectorTextChange("replace")
  })

  document.getElementById("li-text-append-btn")?.addEventListener("click", async () => {
    await applyInspectorTextChange("append")
  })

  document.getElementById("li-text-prepend-btn")?.addEventListener("click", async () => {
    await applyInspectorTextChange("prepend")
  })

  document.getElementById("li-text-clear-btn")?.addEventListener("click", async () => {
    const input = document.getElementById("li-text-input")
    if (input) input.value = ""
    await applyInspectorTextChange("replace")
  })

  document.getElementById("li-text-create-btn")?.addEventListener("click", async () => {
    const input = document.getElementById("li-text-input")
    const allowHtml = document.getElementById("li-text-allow-html")?.checked
    const textValue = input ? input.value : ""

    try {
      await chrome.scripting.executeScript({ target:{ tabId:currentTabId }, files:["content.js"] }).catch(()=>{})
      const resp = await chrome.tabs.sendMessage(currentTabId, {
        type: "CREATE_TEXT_BLOCK",
        html: !!allowHtml,
        text: textValue,
        opts: { padding: 8, background: "transparent", color: "#000" }
      })

      if (resp?.success) {
        showToast("➕ Text block created on page", "success")
        if (resp.canUndo !== undefined) setUndoState(resp.canUndo, resp.canRedo, resp.undoLabel, resp.redoLabel)
        updateDownloadBadge()
      } else {
        showToast("Could not create text block: " + (resp?.error || "Unknown"), "error")
      }
    } catch (e) {
      console.error("Create text block error:", e)
      showToast("Could not create text block on page.", "error")
    }
  })

  document.getElementById("li-text-input")?.addEventListener("keydown", async (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault()
      await applyInspectorTextChange("replace")
    }
  })
}


function setupDragMode() {
  document.getElementById("move-toggle-btn")?.addEventListener("click", async () => {
    dragModeOn = !dragModeOn
    try {
      await chrome.scripting.executeScript({ 
        target:{ tabId:currentTabId }, 
        files:["content.js"] 
      }).catch(()=>{})

      if (dragModeOn && inspectorOn) {
        await chrome.tabs.sendMessage(currentTabId, { type:"TOGGLE_INSPECTOR", active: false }).catch(() => {})
        inspectorOn = false
        updateInspectorUI()
      }

      const resp = await chrome.tabs.sendMessage(currentTabId, { 
        type:"TOGGLE_DRAG_MODE", 
        active: dragModeOn 
      })
      
      if (resp?.success) {
        if (!dragModeOn) {
          clickMoveOn = false
          dragChangesExist = false
          await chrome.tabs.sendMessage(currentTabId, { type: "TOGGLE_CLICK_MOVE", active: false }).catch(() => {})
        }
        dragModeActive = dragModeOn
        updateDragModeUI(dragModeOn)
        updateClickMoveUI(clickMoveOn)
        updateDownloadBadge()
        if (dragModeOn) {
          await syncDragEngineOptions()
          showToast("🔀 Drag mode enabled! Hover an element, tap ⠿ to select, then use move/resize/rotate handles.", "success")
        } else {
          showToast("🔀 Drag mode disabled", "info")
        }
      }
    } catch (err) {
      console.error("Drag mode error:", err)
      showToast("Could not activate drag mode on this page.", "error")
      dragModeOn = false
      updateDragModeUI(dragModeOn)
      updateClickMoveUI(false)
    }
  })

  document.getElementById("move-add-image-btn")?.addEventListener("click", () => {
    if (!dragModeOn) {
      showToast("Enable drag mode first to add and move images.", "info")
      return
    }
    document.getElementById("move-image-input")?.click()
  })

  document.getElementById("move-image-input")?.addEventListener("change", async (e) => {
    const file = e.target?.files?.[0]
    if (!file) return
    if (!file.type || !file.type.startsWith("image/")) {
      showToast("Please select an image file.", "error")
      e.target.value = ""
      return
    }

    try {
      await chrome.scripting.executeScript({ target:{ tabId:currentTabId }, files:["content.js"] }).catch(()=>{})
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = () => reject(new Error("Failed to read image"))
        reader.readAsDataURL(file)
      })

      const resp = await chrome.tabs.sendMessage(currentTabId, {
        type: "ADD_DRAG_IMAGE",
        dataUrl,
        name: file.name,
      })

      if (resp?.success) {
        showToast("🖼 Image added. You can now drag or click-move it.", "success")
        if (resp.canUndo !== undefined) setUndoState(resp.canUndo, resp.canRedo, resp.undoLabel, resp.redoLabel)
        updateDownloadBadge()
      } else {
        showToast("Could not add image to this page.", "error")
      }
    } catch {
      showToast("Image upload failed on this page.", "error")
    } finally {
      e.target.value = ""
    }
  })

  document.getElementById("move-click-mode-btn")?.addEventListener("click", async () => {
    if (!dragModeOn) {
      showToast("Enable drag mode first.", "info")
      return
    }
    clickMoveOn = !clickMoveOn
    try {
      await chrome.scripting.executeScript({ target:{ tabId:currentTabId }, files:["content.js"] }).catch(()=>{})
      await chrome.tabs.sendMessage(currentTabId, { type: "TOGGLE_CLICK_MOVE", active: clickMoveOn })
      updateClickMoveUI(clickMoveOn)
      showToast(clickMoveOn ? "🎯 Click Move ON: select an element, then click destination." : "🎯 Click Move OFF", "info")
    } catch {
      clickMoveOn = false
      updateClickMoveUI(false)
      showToast("Could not toggle Click Move on this page.", "error")
    }
  })

  document.querySelectorAll("#move-grid-snap-toggle, #move-edge-snap-toggle, #move-boundary-toggle, #move-duplicate-toggle, #move-autoscroll-toggle").forEach((input) => {
    input?.addEventListener("change", async () => {
      await pushDragEngineOptions()
    })
  })

  document.getElementById("move-reset-last-btn")?.addEventListener("click", async () => {
    try {
      await chrome.scripting.executeScript({ target:{ tabId:currentTabId }, files:["content.js"] }).catch(()=>{})
      const resp = await chrome.tabs.sendMessage(currentTabId, { type:"RESET_LAST_MOVE" })
      if (resp?.success) {
        showToast("↩ Selected element reset", "success")
        const selectedEl = document.getElementById("move-selected-el")
        if (selectedEl) selectedEl.textContent = "No element selected yet"
        if (resp.canUndo !== undefined) setUndoState(resp.canUndo, resp.canRedo, resp.undoLabel, resp.redoLabel)
        updateDownloadBadge()
      } else {
        showToast("No moved element selected yet.", "info")
      }
    } catch {
      showToast("Could not reset selected element.", "error")
    }
  })

  document.getElementById("move-delete-btn")?.addEventListener("click", async () => {
    if (!dragModeOn) {
      showToast("Enable drag mode first to delete selected elements.", "info")
      return
    }

    try {
      await chrome.scripting.executeScript({ target:{ tabId:currentTabId }, files:["content.js"] }).catch(()=>{})
      const resp = await chrome.tabs.sendMessage(currentTabId, { type: "DELETE_SELECTED_ELEMENT" })
      if (resp?.success) {
        showToast("🗑 Selected element deleted", "success")
        const selectedEl = document.getElementById("move-selected-el")
        if (selectedEl) selectedEl.textContent = "No element selected yet"
        if (resp.canUndo !== undefined) setUndoState(resp.canUndo, resp.canRedo, resp.undoLabel, resp.redoLabel)
        updateDownloadBadge()
      } else {
        showToast("No selected element to delete.", "info")
      }
    } catch (err) {
      console.error("Delete selected error:", err)
      showToast("Could not delete selected element.", "error")
    }
  })

  document.getElementById("move-reset-btn")?.addEventListener("click", async () => {
    try {
      await chrome.scripting.executeScript({ target:{ tabId:currentTabId }, files:["content.js"] }).catch(()=>{})
      await new Promise(r => setTimeout(r, 100))
      
      const resp = await chrome.tabs.sendMessage(currentTabId, { type:"RESET_ALL_MOVES" })
      if (resp?.success) {
        showToast("🔀 All moves have been reset!", "success")
        if (resp.canUndo !== undefined) setUndoState(resp.canUndo, resp.canRedo, resp.undoLabel, resp.redoLabel)
        updateDownloadBadge()
      }
    } catch (err) {
      console.error("Reset error:", err)
      showToast("Could not reset moves on this page.", "error")
    }
  })

  // Create text block while in drag mode
  document.getElementById("move-text-create-btn")?.addEventListener("click", async () => {
    if (!dragModeOn) {
      showToast("Enable drag mode first to add text blocks.", "info")
      return
    }

    const input = document.getElementById("move-text-input")
    const textValue = input ? input.value : ""

    try {
      await chrome.scripting.executeScript({ target:{ tabId:currentTabId }, files:["content.js"] }).catch(()=>{})
      const resp = await chrome.tabs.sendMessage(currentTabId, {
        type: "CREATE_TEXT_BLOCK",
        html: true,
        text: textValue,
        opts: { padding: 8, background: "transparent", color: "#000" }
      })

      if (resp?.success) {
        showToast("➕ Text block created (draggable)", "success")
        if (resp.canUndo !== undefined) setUndoState(resp.canUndo, resp.canRedo, resp.undoLabel, resp.redoLabel)
        updateDownloadBadge()
        if (input) input.value = ""
      } else {
        showToast("Could not create text block: " + (resp?.error || "Unknown"), "error")
      }
    } catch (e) {
      console.error("Create text block error:", e)
      showToast("Could not create text block on this page.", "error")
    }
  })

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === "ELEMENT_DRAGGED") {
      const selectedEl = document.getElementById("move-selected-el")
      if (selectedEl) {
        selectedEl.textContent = "Currently moving: " + msg.label
      }
      if (msg.canUndo !== undefined) setUndoState(msg.canUndo, msg.canRedo, msg.undoLabel, msg.redoLabel)
      updateDownloadBadge()
    }
    if (msg.type === "DRAG_MODE_CLOSED") {
      dragModeOn = false
      clickMoveOn = false
      updateDragModeUI(dragModeOn)
      updateClickMoveUI(clickMoveOn)
    }
  })

  updateDragModeUI(dragModeOn)
  updateClickMoveUI(clickMoveOn)
  syncDragEngineOptions().catch(() => {})
}


function updateDragModeUI(isOn) {
  const btn = document.getElementById("move-toggle-btn")
  const dot = document.getElementById("move-dot")
  const status = document.getElementById("move-status")
  const idle = document.getElementById("move-idle")
  const active = document.getElementById("move-active")

  if (!btn || !dot || !status || !idle || !active) return

  if (isOn) {
    btn.classList.add("move-toggle-on")
    btn.textContent = "Disable"
    dot.classList.remove("move-dot-off")
    dot.classList.add("move-dot-on")
    status.textContent = "Drag mode ON"
    status.style.color = "#4ade80"
    idle.classList.add("hidden")
    active.classList.remove("hidden")
  } else {
    btn.classList.remove("move-toggle-on")
    btn.textContent = "Enable"
    dot.classList.add("move-dot-off")
    dot.classList.remove("move-dot-on")
    status.textContent = "Drag mode OFF"
    status.style.color = "#4b5a7a"
    idle.classList.remove("hidden")
    active.classList.add("hidden")
    const selectedEl = document.getElementById("move-selected-el")
    if (selectedEl) selectedEl.textContent = "No element selected yet"
  }
}

function updateClickMoveUI(isOn) {
  const btn = document.getElementById("move-click-mode-btn")
  if (!btn) return

  if (!dragModeOn) {
    btn.classList.remove("active")
    btn.textContent = "🎯 Click Move: OFF"
    btn.disabled = true
    return
  }

  btn.disabled = false
  if (isOn) {
    btn.classList.add("active")
    btn.textContent = "🎯 Click Move: ON"
  } else {
    btn.classList.remove("active")
    btn.textContent = "🎯 Click Move: OFF"
  }
}

function readDragEngineOptionsFromUI() {
  return {
    snapToGrid: !!document.getElementById("move-grid-snap-toggle")?.checked,
    snapToEdges: !!document.getElementById("move-edge-snap-toggle")?.checked,
    boundary: !!document.getElementById("move-boundary-toggle")?.checked,
    duplicateOnAlt: !!document.getElementById("move-duplicate-toggle")?.checked,
    autoScroll: !!document.getElementById("move-autoscroll-toggle")?.checked,
  }
}

function applyDragEngineOptionsToUI(options = {}) {
  dragEngineOptions = { ...dragEngineOptions, ...options }
  const mappings = {
    "move-grid-snap-toggle": !!dragEngineOptions.snapToGrid,
    "move-edge-snap-toggle": !!dragEngineOptions.snapToEdges,
    "move-boundary-toggle": !!dragEngineOptions.boundary,
    "move-duplicate-toggle": !!dragEngineOptions.duplicateOnAlt,
    "move-autoscroll-toggle": !!dragEngineOptions.autoScroll,
  }

  Object.entries(mappings).forEach(([id, checked]) => {
    const input = document.getElementById(id)
    if (input) input.checked = checked
  })
}

async function syncDragEngineOptions() {
  if (!currentTabId) return
  try {
    await chrome.scripting.executeScript({ target: { tabId: currentTabId }, files: ["content.js"] }).catch(() => { })
    const resp = await chrome.tabs.sendMessage(currentTabId, { type: "GET_DRAG_ENGINE_OPTIONS" })
    if (resp?.options) {
      applyDragEngineOptionsToUI(resp.options)
    }
  } catch { }
}

async function pushDragEngineOptions() {
  if (!currentTabId || !dragModeOn) return
  const options = readDragEngineOptionsFromUI()
  dragEngineOptions = { ...dragEngineOptions, ...options }
  try {
    await sendToPage({ type: "SET_DRAG_ENGINE_OPTIONS", options })
  } catch { }
}


function wireSlider(id, cssProp, unit, isFloat) {
  const slider = document.getElementById(id + "-r")
  const numIn  = document.getElementById(id + "-n")
  if (!slider || !numIn) return


  const preview = (v) => {
    const n = isFloat ? parseFloat(v) : parseInt(v)
    if (isNaN(n)) return
    slider.value = n; numIn.value = n
    sendToPage({ type: "APPLY_LIVE_STYLE", selector: inspEl, prop: cssProp, value: n + unit, pushUndo: false })
  }

  
  const commit = (v) => {
    const n = isFloat ? parseFloat(v) : parseInt(v)
    if (isNaN(n)) return
    slider.value = n; numIn.value = n
    sendToPage({ type: "APPLY_LIVE_STYLE", selector: inspEl, prop: cssProp, value: n + unit, pushUndo: true })
      .then(resp => { if (resp?.canUndo !== undefined) setUndoState(resp.canUndo, resp.canRedo, resp.undoLabel, resp.redoLabel) })
  }

  slider.addEventListener("input",  () => preview(slider.value))
  slider.addEventListener("change", () => commit(slider.value))   
  numIn.addEventListener("input",   () => preview(numIn.value))
  numIn.addEventListener("change",  () => commit(numIn.value))    
}

function populateEditor(msg) {
  document.getElementById("li-idle")?.classList.add("hidden")
  document.getElementById("li-editor")?.classList.remove("hidden")

  document.getElementById("li-el-tag").textContent = "<" + msg.tag + ">"
  document.getElementById("li-el-cls").textContent = msg.label || ""

  const s = msg.styles || {}
  setVal("li-fontsize",      s.fontSize      || 16)
  setVal("li-lineheight",    s.lineHeight     || 24)
  setVal("li-letterspacing", s.letterSpacing  || 0)
  setVal("li-pt", s.paddingTop    || 0)
  setVal("li-pr", s.paddingRight  || 0)
  setVal("li-pb", s.paddingBottom || 0)
  setVal("li-pl", s.paddingLeft   || 0)
  setVal("li-mt", s.marginTop     || 0)
  setVal("li-mr", s.marginRight   || 0)
  setVal("li-mb", s.marginBottom  || 0)
  setVal("li-ml", s.marginLeft    || 0)
  setVal("li-width",  s.width        || 0)
  setVal("li-height", s.height       || 0)
  setVal("li-radius", s.borderRadius || 0)

  const fwSel = document.getElementById("li-fontweight-s")
  if (fwSel) fwSel.value = s.fontWeight || "400"

  const color = s.color || "#000000"
  const bg    = s.backgroundColor || "#ffffff"
  const cp = document.getElementById("li-color-pick")
  const bp = document.getElementById("li-bg-pick")
  if (cp) { cp.value = color; document.getElementById("li-color-hex").textContent = color }
  if (bp) { bp.value = bg;    document.getElementById("li-bg-hex").textContent    = bg    }

  const currentText = typeof msg.currentText === "string" ? msg.currentText : ""
  const currentTextEl = document.getElementById("li-current-text")
  const textInput = document.getElementById("li-text-input")
  if (currentTextEl) currentTextEl.textContent = currentText || "Selected element has no text"
  if (textInput) textInput.value = currentText

  updateContrastDisplay()
}

async function applyInspectorTextChange(mode = "replace") {
  if (!inspEl) {
    showToast("Pick an element first", "info")
    return
  }

  const input = document.getElementById("li-text-input")
  const currentTextEl = document.getElementById("li-current-text")
  const textValue = input ? input.value : ""

  const replaceBtn = document.getElementById("li-text-replace-btn")
  const appendBtn = document.getElementById("li-text-append-btn")
  const prependBtn = document.getElementById("li-text-prepend-btn")
  const clearBtn = document.getElementById("li-text-clear-btn")
  if (replaceBtn) replaceBtn.disabled = true
  if (appendBtn) appendBtn.disabled = true
  if (prependBtn) prependBtn.disabled = true
  if (clearBtn) clearBtn.disabled = true

  try {
    await chrome.scripting.executeScript({ target:{ tabId:currentTabId }, files:["content.js"] }).catch(()=>{})
    const resp = await chrome.tabs.sendMessage(currentTabId, {
      type: "APPLY_TEXT_CONTENT",
      selector: inspEl,
      text: textValue,
      mode,
    })

    if (resp?.success) {
      if (currentTextEl) {
        if (mode === "append") currentTextEl.textContent = (currentTextEl.textContent || "") + textValue
        else if (mode === "prepend") currentTextEl.textContent = textValue + (currentTextEl.textContent || "")
        else currentTextEl.textContent = textValue || "(empty text)"
      }
      if (resp.canUndo !== undefined) setUndoState(resp.canUndo, resp.canRedo, resp.undoLabel, resp.redoLabel)
      updateDownloadBadge()
      showToast(`✅ Text ${mode === "append" ? "appended" : mode === "prepend" ? "prepended" : "updated"}`, "success")
    } else {
      showToast("Text update failed: " + (resp?.error || "Unknown"), "error")
    }
  } catch (e) {
    showToast("Could not update text on page.", "error")
  } finally {
    if (replaceBtn) replaceBtn.disabled = false
    if (appendBtn) appendBtn.disabled = false
    if (prependBtn) prependBtn.disabled = false
    if (clearBtn) clearBtn.disabled = false
  }
}

function setVal(id, v) {
  const r = document.getElementById(id + "-r")
  const n = document.getElementById(id + "-n")
  const val = isNaN(v) ? 0 : parseFloat(v)
  if (r) r.value = val
  if (n) n.value = val.toFixed ? val.toFixed(1) : val
}

function gatherCurrentStyles() {
  if (!inspEl) return null
  const get = (id) => parseFloat(document.getElementById(id + "-n")?.value) || 0
  return {
    fontSize:      get("li-fontsize")      + "px",
    lineHeight:    get("li-lineheight")    + "px",
    letterSpacing: get("li-letterspacing") + "px",
    fontWeight:    document.getElementById("li-fontweight-s")?.value || "",
    paddingTop:    get("li-pt") + "px",
    paddingRight:  get("li-pr") + "px",
    paddingBottom: get("li-pb") + "px",
    paddingLeft:   get("li-pl") + "px",
    marginTop:     get("li-mt") + "px",
    marginRight:   get("li-mr") + "px",
    marginBottom:  get("li-mb") + "px",
    marginLeft:    get("li-ml") + "px",
    width:         get("li-width")  + "px",
    height:        get("li-height") + "px",
    borderRadius:  get("li-radius") + "px",
    color:         document.getElementById("li-color-pick")?.value || "",
    backgroundColor: document.getElementById("li-bg-pick")?.value || "",
  }
}

function updateContrastDisplay() {
  const fg  = document.getElementById("li-color-pick")?.value || "#000000"
  const bg  = document.getElementById("li-bg-pick")?.value    || "#ffffff"
  const box = document.getElementById("li-contrast-box")
  const ratioEl = document.getElementById("li-contrast-ratio")
  const labelEl = document.getElementById("li-contrast-label")
  if (!box || !ratioEl) return

  const ratio = calcContrast(fg, bg)
  const pass  = ratio >= 4.5
  ratioEl.textContent = ratio.toFixed(2) + ":1"
  ratioEl.style.color = pass ? "#4ade80" : "#f87171"
  box.style.borderColor = pass ? "#14532d" : "#5a1a1a"
  box.style.background  = pass ? "#071a0f" : "#1a0505"
  if (labelEl) { labelEl.textContent = pass ? "✓ WCAG AA Pass" : "✗ WCAG AA Fail"; labelEl.style.color = pass ? "#4ade80" : "#f87171" }
}

function calcContrast(hex1, hex2) {
  const lum = h => {
    const r = parseInt(h.slice(1,3),16)/255, g = parseInt(h.slice(3,5),16)/255, b = parseInt(h.slice(5,7),16)/255
    return [r,g,b].reduce((s,v,i) => {
      v = v <= 0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055,2.4)
      return s + v * [0.2126,0.7152,0.0722][i]
    }, 0)
  }
  try { const l1 = lum(hex1), l2 = lum(hex2); return (Math.max(l1,l2)+0.05)/(Math.min(l1,l2)+0.05) } catch { return 1 }
}

async function sendToPage(msg) {
  if (!inspEl && msg.type !== "APPLY_LIVE_STYLE") return
  try {
    await chrome.scripting.executeScript({ target:{ tabId:currentTabId }, files:["content.js"] }).catch(()=>{})
    return await chrome.tabs.sendMessage(currentTabId, msg)
  } catch {
    showToast("Could not communicate with page.", "error")
    return null
  }
}

function updateInspectorUI() {
  const dot    = document.getElementById("li-dot")
  const status = document.getElementById("li-status")
  const btn    = document.getElementById("inspector-toggle-btn")
  if (!btn) return
  if (inspectorOn) {
    if (dot)    { dot.className = "li-dot li-dot-on" }
    if (status) { status.textContent = "Click any element on page"; status.style.color = "#4ade80" }
    btn.textContent = "Disable"
    btn.classList.add("li-toggle-on")
  } else {
    if (dot)    { dot.className = "li-dot li-dot-off" }
    if (status) { status.textContent = "Inspector OFF"; status.style.color = "" }
    btn.textContent = "Enable"
    btn.classList.remove("li-toggle-on")
    
    document.getElementById("li-editor")?.classList.add("hidden")
    document.getElementById("li-idle")?.classList.remove("hidden")
  }
}


function showRescoreBanner() {
  
  document.getElementById("rescore-banner")?.remove()

  const banner = document.createElement("div")
  banner.id = "rescore-banner"
  banner.className = "rescore-banner"
  banner.innerHTML = `
    <div class="rescore-left">
      <span class="rescore-pulse"></span>
      <span class="rescore-text">Fixes applied — score not updated yet</span>
    </div>
    <button id="rescore-btn" class="btn-rescore-now">
      <span>🔄</span> Recalculate Score
    </button>
  `

  
  const scoreCard = document.querySelector(".score-card")
  if (scoreCard) scoreCard.insertAdjacentElement("afterend", banner)

  document.getElementById("rescore-btn").addEventListener("click", rescoreNow)
}

async function rescoreNow() {

  const scoreEl = document.getElementById("score-val")
  const prevText = scoreEl?.textContent || "--"
  if (scoreEl) scoreEl.style.opacity = "0.4"

  try {
    
    await chrome.scripting.executeScript({
      target: { tabId: currentTabId },
      files: ["content.js"]
    }).catch(() => {})

    const htmlResp = await chrome.tabs.sendMessage(currentTabId, { type: "GET_HTML" })

    if (!htmlResp?.html) {
      if (scoreEl) scoreEl.style.opacity = "1"
      showToast("Could not read page HTML for rescoring.", "error")
      return
    }

   
    const data = await chrome.runtime.sendMessage({
      type: "ANALYSE_HTML",
      html: htmlResp.html
    })

    if (data?.error) {
      if (scoreEl) scoreEl.style.opacity = "1"
      showToast("Rescore error: " + data.error, "error")
      return
    }

    
    updateScoreDisplay(data)
    lastResults = data
    fixesApplied = 0

   
    if (data.score >= 90) setTimeout(launchConfetti, 400)

  } catch (err) {
    if (scoreEl) scoreEl.style.opacity = "1"
    showToast("Rescore failed: " + err.message, "error")
  }
}


function updateScoreDisplay({ score, violations, suggestions }) {
 
  const scoreEl   = document.getElementById("score-val")
  const prevScore = parseInt(scoreEl?.textContent) || 0
  
  const displayScore = Math.max(score, prevScore)

  
  const arc = document.getElementById("score-arc")
  const C   = 2 * Math.PI * 32
  arc.style.strokeDashoffset = C - (displayScore / 100) * C
  arc.style.stroke = displayScore >= 80 ? "#22c55e" : displayScore >= 50 ? "#f59e0b" : "#ef4444"

  
  if (scoreEl) scoreEl.style.opacity = "1"

  
  score = displayScore
  const diff = score - prevScore
  const steps = 20
  let step = 0
  const timer = setInterval(() => {
    step++
    scoreEl.textContent = Math.round(prevScore + (diff * step / steps))
    if (step >= steps) {
      scoreEl.textContent = score
      clearInterval(timer)
    }
  }, 30)

 
  const { grade, label, cls } = calcGrade(score)
  const gradeEl = document.getElementById("score-grade")
  gradeEl.textContent = grade
  gradeEl.className   = `grade-badge grade-${cls}`
  document.getElementById("score-label-text").textContent = label

 
  document.getElementById("violations-label").textContent =
    violations === 0
      ? " No violations — perfectly accessible!"
      : `${violations} violation${violations !== 1 ? "s" : ""} found`

 
  const ring = document.querySelector(".score-ring-wrap")
  if (ring) {
    ring.style.transition = "transform 0.3s"
    ring.style.transform  = "scale(1.08)"
    setTimeout(() => { ring.style.transform = "scale(1)" }, 300)
  }
}

function getTopRecommendedThemes({ url, score, suggestions }) {
  const host = String(url || "").replace(/^https?:\/\/(www\.)?/i, "").split("/")[0].toLowerCase()
  const urlText = String(url || "").toLowerCase()
  const suggText = (suggestions || []).map(s => `${s?.id || ""} ${s?.title || ""} ${s?.explanation || ""}`).join(" ").toLowerCase()
  const pageText = `${host} ${urlText} ${suggText}`
  const pageSeed = buildPageThemeSeed(url, score, suggestions)
  const pageProfile = buildPageThemeProfile({ url, score, suggestions })

  const severeCount = (suggestions || []).filter(s => ["critical", "serious"].includes(String(s.impact || "").toLowerCase())).length
  const lowScore = Number(score || 0) < 65

  const uniqueThemes = []
  const seen = new Set()
  THEMES.forEach(theme => {
    if (!theme?.id || seen.has(theme.id)) return
    seen.add(theme.id)
    uniqueThemes.push(theme)
  })

  const pageTags = {
    commerce: /(shop|store|cart|product|checkout|ecom|market|pricing|plan)/.test(pageText),
    content: /(blog|news|article|docs|documentation|guide|tutorial|read)/.test(pageText),
    creative: /(portfolio|agency|studio|creative|design|ux|ui|art|gallery)/.test(pageText),
    app: /(saas|dashboard|admin|app|tool|platform|analytics|crm|panel)/.test(pageText),
    auth: /(login|signup|register|password|account|profile|settings)/.test(pageText),
    gaming: /(game|gaming|esports|stream)/.test(pageText),
    health: /(health|medical|clinic|hospital|care|wellness)/.test(pageText),
    finance: /(bank|finance|fintech|invest|wallet|payment)/.test(pageText),
    education: /(course|school|college|learn|academy|education)/.test(pageText),
  }

  const bucketOf = (text) => {
    if (/(minimal|nord|ice|zen|clean|editorial|sakura|warm)/.test(text)) return "clean"
    if (/(midnight|deep|ocean|void|dark|night|royal)/.test(text)) return "dark"
    if (/(cyber|neon|matrix|terminal|hologram|glitch|rgb|electric)/.test(text)) return "tech"
    if (/(nature|forest|organic|sunny|ocean|earth)/.test(text)) return "nature"
    if (/(luxury|velvet|luxe|premium|gold)/.test(text)) return "premium"
    if (/(canva|gradient|aurora|sunset|candy|colorful|fiery)/.test(text)) return "vibrant"
    return "general"
  }

  const ranked = uniqueThemes.map(theme => {
    const text = `${String(theme.name || "").toLowerCase()} ${String(theme.id || "").toLowerCase()}`
    const bucket = bucketOf(text)
    let rank = 0

    if (pageProfile.tags.institutional && /(premium|dark|clean|editorial|science)/.test(bucket)) rank += 4
    if (pageProfile.tags.education && /(clean|nature|editorial|general)/.test(bucket)) rank += 4
    if (pageProfile.tags.science && /(tech|dark|clean|premium)/.test(bucket)) rank += 4
    if (pageProfile.tags.commerce && /(premium|vibrant|dark|clean)/.test(bucket)) rank += 4
    if (pageProfile.tags.app && /(tech|clean|dark|general)/.test(bucket)) rank += 4
    if (pageProfile.tags.content && /(editorial|warm|clean|nature)/.test(bucket)) rank += 4
    if (pageProfile.tags.auth && /(clean|dark|general)/.test(bucket)) rank += 3

    if (pageTags.commerce && /(clean|premium|dark|vibrant)/.test(bucket)) rank += 3
    if (pageTags.content && /(clean|nature|general)/.test(bucket)) rank += 3
    if (pageTags.creative && /(vibrant|tech|dark|premium)/.test(bucket)) rank += 3
    if (pageTags.app && /(clean|dark|tech|general)/.test(bucket)) rank += 3
    if (pageTags.auth && /(clean|dark|general)/.test(bucket)) rank += 2
    if (pageTags.gaming && /(tech|dark|vibrant)/.test(bucket)) rank += 3
    if (pageTags.health && /(clean|nature|general)/.test(bucket)) rank += 3
    if (pageTags.finance && /(clean|dark|premium|general)/.test(bucket)) rank += 3
    if (pageTags.education && /(clean|nature|general)/.test(bucket)) rank += 3

    if (lowScore || severeCount >= 3) {
      if (/(clean|nature|general)/.test(bucket)) rank += 4
      if (bucket === "tech" || bucket === "vibrant") rank -= 1
    } else {
      if (bucket === "vibrant" || bucket === "premium") rank += 1
    }

    if (/(minimal|nord|canva|aurora|midnight|ocean|nature|sakura|ice|warm)/.test(text)) rank += 1

    const seedText = `${host}:${score}:${severeCount}:${theme.id}`
    let seed = 0
    for (let i = 0; i < seedText.length; i++) seed = (seed * 31 + seedText.charCodeAt(i)) % 100000
    rank += (seed % 97) / 10000

    return { theme, rank, bucket }
  })

  ranked.sort((a, b) => b.rank - a.rank)

  const selected = []
  const usedIds = new Set()
  const bucketCount = new Map()
  const LIMIT = 6

  for (const item of ranked) {
    if (selected.length >= LIMIT) break
    if (usedIds.has(item.theme.id)) continue
    const c = bucketCount.get(item.bucket) || 0
    if (c >= 2) continue
    selected.push(item.theme)
    usedIds.add(item.theme.id)
    bucketCount.set(item.bucket, c + 1)
  }

  if (selected.length < LIMIT) {
    for (const item of ranked) {
      if (selected.length >= LIMIT) break
      if (usedIds.has(item.theme.id)) continue
      selected.push(item.theme)
      usedIds.add(item.theme.id)
    }
  }

  if (!selected.length) return []

  const rotateBy = pageSeed % selected.length
  return selected.slice(rotateBy).concat(selected.slice(0, rotateBy))
}

function buildPageThemeSeed(url, score, suggestions) {
  const seedText = `${String(url || "").toLowerCase()}|${Number(score || 0)}|${(suggestions || []).map(s => `${s?.id || ""}:${s?.impact || ""}`).join(";")}`
  let seed = 0
  for (let i = 0; i < seedText.length; i++) {
    seed = (seed * 31 + seedText.charCodeAt(i)) % 2147483647
  }
  return seed
}

function buildPageThemeProfile({ url, score, suggestions }) {
  const host = String(url || "").replace(/^https?:\/\/(www\.)?/i, "").split("/")[0].toLowerCase()
  const text = `${host} ${(suggestions || []).map(s => `${s?.id || ""} ${s?.title || ""} ${s?.explanation || ""}`).join(" ").toLowerCase()}`

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

function buildPersonaPreviewSwatches(preview, pageProfile, index = 0) {
  const base = Array.isArray(preview) && preview.length ? preview.slice(0, 3) : ["#0f172a", "#6366f1", "#e5e7eb"]
  if (!pageProfile) return base

  const personaSwatches = {
    "Institutional Science": ["#081120", "#1d4ed8", "#e2e8f0"],
    "Education Editorial": ["#f8fafc", "#2563eb", "#f59e0b"],
    "Commerce Conversion": ["#111827", "#f97316", "#fde68a"],
    "Application Dashboard": ["#0f172a", "#06b6d4", "#cbd5e1"],
    "Content Editorial": ["#fffaf5", "#b91c1c", "#334155"],
    "General Premium": ["#0b1020", "#8b5cf6", "#f8fafc"],
  }

  const persona = personaSwatches[pageProfile.name] || personaSwatches["General Premium"]
  const toneShift = index % 2 === 0 ? 0 : 1

  return [
    persona[0],
    base[1] || persona[1 + toneShift] || persona[1],
    base[2] || persona[2],
  ]
}

function renderThemeRecommendations(themes, pageProfile) {
  const wrap = document.getElementById("theme-reco-wrap")
  const grid = document.getElementById("theme-reco-grid")
  if (!wrap || !grid) return

  if (!themes?.length) {
    wrap.classList.add("hidden")
    grid.innerHTML = ""
    return
  }

  wrap.classList.remove("hidden")
  grid.innerHTML = ""

  themes.forEach((theme, index) => {
    const row = document.createElement("div")
    row.className = "theme-reco-card"
    const preview = buildPersonaPreviewSwatches(theme.preview || [], pageProfile, index)
    row.innerHTML = `
      <div class="theme-reco-rank">#${index + 1}</div>
      <div class="theme-reco-main">
        <div class="theme-reco-name">${esc(theme.name)}</div>
        <div class="theme-reco-swatches">${preview.map(c => `<span class="swatch" style="background:${c}"></span>`).join("")}</div>
      </div>
      <button class="theme-reco-apply" data-theme-id="${theme.id}">Apply</button>
    `

    row.querySelector(".theme-reco-apply")?.addEventListener("click", () => applyTheme(theme))
    grid.appendChild(row)
  })
}

function setupThemes() {
  const grid = document.getElementById("themes-grid")
  THEMES.forEach(theme => {
    const card = document.createElement("div")
    card.className = "theme-card" + (theme.id === activeThemeId ? " active-theme" : "")
    card.dataset.id = theme.id
    card.innerHTML = `
      <div class="theme-preview">${theme.preview.map(c=>`<span class="swatch" style="background:${c}"></span>`).join("")}</div>
      <div class="theme-name">${esc(theme.name)}</div>
      <button class="btn-theme-apply" data-id="${theme.id}">Apply</button>
    `
    card.querySelector(".btn-theme-apply").addEventListener("click", e => {
      e.stopPropagation(); applyTheme(theme)
    })
    grid.appendChild(card)
  })
  document.getElementById("remove-theme-btn").addEventListener("click", removeTheme)
}

async function applyTheme(theme) {
  try {
    // Step 1: Optimize theme with APIVerve for better contrast
    let optimizedTheme = theme
    try {
      const optimizeRes = await fetch('/api/optimize-theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theme: theme,
          userInput: lastUserInput || theme.name || 'modern',
          scanResults: lastScanResults || {}
        })
      })

      if (optimizeRes.ok) {
        const optimizeData = await optimizeRes.json()
        if (optimizeData.optimizedTheme) {
          optimizedTheme = optimizeData.optimizedTheme
        }
      }
    } catch (err) {
      console.warn('Theme optimization skipped:', err)
      // Continue with original theme if optimization fails
    }

    // Step 2: Apply the theme (optimized or original)
    await chrome.scripting.executeScript({ target:{ tabId:currentTabId }, files:["content.js"] }).catch(()=>{})
    
    const resp = await chrome.tabs.sendMessage(currentTabId, { type:"APPLY_THEME", css:optimizedTheme.css, name:optimizedTheme.name })
    activeThemeId = theme.id

    if (resp?.canUndo !== undefined) setUndoState(resp.canUndo, resp.canRedo, resp.undoLabel, resp.redoLabel)

    const saveRes = await chrome.runtime.sendMessage({ type:"SAVE_THEME", pageKey: currentPageKey, theme: optimizedTheme })
    const savedIcon = saveRes?.source === "mongodb" ? "☁️" : "💾"
    const savedTo   = saveRes?.source === "mongodb" ? "Saved to MongoDB" : "Saved locally"

    document.querySelectorAll(".theme-card").forEach(c => c.classList.remove("active-theme"))
    document.querySelector(`.theme-card[data-id="${theme.id}"]`)?.classList.add("active-theme")

    const storageMsg = saveRes?.source === "mongodb" ? "Saved to MongoDB" : "Saved locally"
    showToast(` ${theme.name} applied!  ${storageMsg}`, "success")
    updateDownloadBadge()
  } catch { showToast("Could not apply theme. Reload page and try.", "error") }
}

async function removeTheme() {
  try {
    const resp = await chrome.tabs.sendMessage(currentTabId, { type:"REMOVE_THEME" })
    activeThemeId = null
    if (resp?.canUndo !== undefined) setUndoState(resp.canUndo, resp.canRedo, resp.undoLabel, resp.redoLabel)
   
    await chrome.runtime.sendMessage({ type:"SAVE_THEME", pageKey: currentPageKey, theme: null }).catch(()=>{})
    document.querySelectorAll(".theme-card").forEach(c => c.classList.remove("active-theme"))
    showToast("Theme removed", "info")
    updateDownloadBadge()
  } catch { showToast("No active theme.", "info") }
}


// AI Theme Suggestions generated after scan
function buildAIThemePrompt({ score, violations, suggestions, url }) {
  const issues = Array.isArray(suggestions)
    ? suggestions.slice(0, 6).map(s => `${s.title || s.id} (${s.impact || "minor"})`).join("; ")
    : ""
  const pageSignature = buildPageThemeSeed(url, score, suggestions)
  const pageProfile = buildPageThemeProfile({ url, score, suggestions })
  const requiredFeatures = [
    "header",
    "navbar",
    "footer",
    "hero section",
    "search section",
    "search bar",
    "scroll left button",
    "scroll right button",
    "scroll to top button",
    "marquee",
    "padding",
    "height",
    "margin",
    "outline",
    "inline display",
    "inline-block display",
    "block display",
  ]

  return [
    `Generate runtime-only themes for the scanned webpage.`,
    `URL: ${url || "unknown"}`,
    `Accessibility score: ${score}/100`,
    `Violations found: ${violations}`,
    `Page signature: ${pageSignature}`,
    `Page persona: ${pageProfile.name}`,
    `Page intent: ${pageProfile.intent}`,
    `Prefer directions: ${pageProfile.directions.join(', ')}`,
    `Avoid: ${pageProfile.avoid.join(', ')}`,
    `Required features: ${requiredFeatures.join(', ')}`,
    `Use APIVerve-generated color palettes as the color source for the final CSS.`,
    `Every regenerated response must be different when the random seed changes.`,
    issues ? `Key issues: ${issues}` : "",
  ].filter(Boolean).join(" ")
}

async function generateAIThemes({ score, violations, suggestions, url }) {
  const wrap = document.getElementById("ai-theme-reco-wrap")
  const grid = document.getElementById("ai-theme-reco-grid")
  const loading = document.getElementById("ai-theme-loading")
  const refreshBtn = document.getElementById("ai-refresh-themes")
  const randomizeToggle = document.getElementById("ai-randomize-toggle")

  if (!wrap || !grid || !loading) return

  wrap.classList.remove("hidden")
  loading.classList.remove("hidden")
  grid.innerHTML = ""
  if (refreshBtn) refreshBtn.disabled = true
  // Store scan results for theme optimization
  lastScanResults = { score, violations, suggestions }
  lastUserInput = `Webpage with ${score}/100 accessibility score and ${violations || 0} violations`


  const payload = {
    userInput: buildAIThemePrompt({ score, violations, suggestions, url }),
    scanResults: { score, violations, suggestions },
    url,
    randomize: Boolean(randomizeToggle?.checked),
  }

  try {
    const response = await fetch(`${BASE_URL}/api/ai-themes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    const data = await response.json().catch(() => ({}))
    if (!response.ok || !data.success || !Array.isArray(data.themes)) {
      throw new Error(data.error || `Server error: ${response.status}`)
    }

    renderAIThemeSuggestions(data.themes)
    showToast(`✨ Generated ${data.count || data.themes.length} AI themes using APIVerve palettes`, "success")
  } catch (error) {
    console.error("AI theme generation failed:", error)
    const grid = document.getElementById("ai-theme-reco-grid")
    const wrap = document.getElementById("ai-theme-reco-wrap")
    if (grid) {
      grid.innerHTML = `<div class="ai-theme-error">Live AI generation failed: ${esc(error.message || "unknown error")}</div>`
    }
    if (wrap) wrap.classList.remove("hidden")
    showToast("AI theme generation failed. Check APIVerve/Cohere keys.", "error")
  } finally {
    loading.classList.add("hidden")
    if (refreshBtn) refreshBtn.disabled = false
  }
}

function renderAIThemeSuggestions(themes) {
  const grid = document.getElementById("ai-theme-reco-grid")
  const wrap = document.getElementById("ai-theme-reco-wrap")
  if (!grid || !wrap) return

  const safeThemes = Array.isArray(themes) ? themes.slice(0, 6) : []
  if (!safeThemes.length) {
    grid.innerHTML = '<div class="ai-theme-error">No AI themes returned.</div>'
    wrap.classList.remove("hidden")
    return
  }

  grid.innerHTML = safeThemes.map((theme, index) => `
    <div class="ai-theme-card" data-index="${index}">
      <div class="ai-theme-card-preview">
        ${(theme.preview || []).slice(0, 3).map(color => `<span class="ai-theme-card-swatch" style="background:${color}"></span>`).join("")}
      </div>
      <div class="ai-theme-card-name">${esc(theme.name || `AI Theme ${index + 1}`)}</div>
      <div class="ai-theme-card-mood">${esc(theme.mood || theme.description || "AI-generated")}</div>
      <button class="ai-theme-card-apply" data-index="${index}">Apply Theme</button>
    </div>
  `).join("")

  grid.querySelectorAll(".ai-theme-card").forEach(card => {
    const index = Number(card.dataset.index)
    const theme = safeThemes[index]
    const applyBtn = card.querySelector(".ai-theme-card-apply")

    applyBtn?.addEventListener("click", async (e) => {
      e.stopPropagation()
      if (theme) await applyTheme(theme)
    })

    card.addEventListener("click", async () => {
      if (theme) {
        await applyTheme(theme)
        showToast(`🎨 ${theme.name} applied`, "success")
      }
    })
  })

  wrap.classList.remove("hidden")
}

function setupAIThemeRefresh() {
  document.getElementById("ai-refresh-themes")?.addEventListener("click", () => {
    if (!lastResults) {
      showToast("Run a scan first", "info")
      return
    }

    generateAIThemes({
      score: lastResults.score,
      violations: lastResults.violations,
      suggestions: lastResults.suggestions,
      url: currentUrl,
    })
  })
}


function setupHistory() {
  document.getElementById("clear-history-btn").addEventListener("click", async () => {
    const btn = document.getElementById("clear-history-btn")
    if (btn.dataset.confirming === "true") {
      btn.dataset.confirming = "false"
      btn.textContent = "🗑 Clear All"
      btn.style.background = ""
     
      const list = document.getElementById("history-list")
      if (list) list.innerHTML = '<div class="empty-state"><div class="empty-icon">📭</div><p>No scans saved yet. Run a scan and click 💾 Save.</p></div>'
      const countEl = document.getElementById("history-count")
      if (countEl) countEl.textContent = "0 scans"
      await chrome.runtime.sendMessage({ type:"CLEAR_HISTORY" })
    } else {
      btn.dataset.confirming = "true"
      btn.textContent = "⚠ Confirm Clear?"
      btn.style.background = "#3d0000"
      setTimeout(() => {
        if (btn.dataset.confirming === "true") {
          btn.dataset.confirming = "false"
          btn.textContent = "🗑 Clear All"
          btn.style.background = ""
        }
      }, 3000)
    }
  })
}

async function renderHistory() {
  const list    = document.getElementById("history-list")
  const countEl = document.getElementById("history-count")
  const sourceEl= document.getElementById("history-source")

  list.innerHTML = '<div class="hist-loading"><div class="ring-sm"></div> Loading…</div>'

  const res     = await chrome.runtime.sendMessage({ type:"GET_HISTORY" })
  const history = res.history || []
  const source  = res.source  || "local"

  countEl.textContent  = history.length + " scan" + (history.length !== 1 ? "s" : "")
  sourceEl.textContent = source === "mongodb" ? "☁️ MongoDB" : "💾 Local"
  sourceEl.className   = "hist-source " + (source === "mongodb" ? "src-mongo" : "src-local")

  list.innerHTML = ""

  if (!history.length) {
    list.innerHTML = '<div class="empty-state"><div class="empty-icon">📭</div><p>No scans saved yet. Run a scan and click 💾 Save.</p></div>'
    return
  }

 
  history.forEach(entry => {
    const row = document.createElement("div")
    row.className = "history-row"
    const sc    = entry.score >= 80 ? "good" : entry.score >= 50 ? "ok" : "bad"
    const { grade } = calcGrade(entry.score)
    const date  = new Date(entry.savedAt).toLocaleDateString(undefined, { month:"short", day:"numeric", hour:"2-digit", minute:"2-digit" })
    const shortUrl = (entry.url||"").replace(/^https?:\/\/(www\.)?/,"").slice(0, 38)

    
    row.dataset.entryId  = entry.id
    row.dataset.entryUrl = entry.url || ""

    row.innerHTML =
      '<div class="hist-score-wrap">' +
        '<div class="hist-score ' + sc + '">' + entry.score + '</div>' +
        '<div class="hist-grade ' + sc + '">' + grade + '</div>' +
      '</div>' +
      '<div class="hist-meta">' +
        '<div class="hist-url" title="' + esc(entry.url) + '">' + esc(shortUrl) + '</div>' +
        '<div class="hist-info">' +
          '<span>' + entry.violations + ' violation' + (entry.violations !== 1 ? "s" : "") + '</span>' +
          '<span class="dot">·</span>' +
          '<span>' + date + '</span>' +
        '</div>' +
      '</div>' +
      '<div class="hist-btns">' +
        '<button class="hbtn hbtn-rescan" title="Rescan this URL">↺</button>' +
        '<button class="hbtn hbtn-del" title="Delete this entry">✕</button>' +
      '</div>'

    list.appendChild(row)
  })


  if (list._histListener) list.removeEventListener("click", list._histListener)
  list._histListener = async function(e) {
    const row = e.target.closest(".history-row")
    if (!row) return
    const entryId  = row.dataset.entryId
    const entryUrl = row.dataset.entryUrl

    if (e.target.closest(".hbtn-del")) {
      e.stopPropagation()
      row.style.transition = "opacity 0.2s, transform 0.2s"
      row.style.opacity = "0"
      row.style.transform = "translateX(20px)"
      await new Promise(r => setTimeout(r, 200))
      row.remove()
      
      const remaining = document.querySelectorAll("#history-list .history-row").length
      const cEl = document.getElementById("history-count")
      if (cEl) cEl.textContent = remaining + " scan" + (remaining !== 1 ? "s" : "")
      if (remaining === 0) {
        const lst = document.getElementById("history-list")
        if (lst) lst.innerHTML = '<div class="empty-state"><div class="empty-icon">📭</div><p>No scans saved yet. Run a scan and click  Save.</p></div>'
      }
      await chrome.runtime.sendMessage({ type:"DELETE_HISTORY_ITEM", id: entryId })
      return
    }
    if (e.target.closest(".hbtn-rescan")) {
      e.stopPropagation()
      document.querySelector('.tab[data-tab="scan"]').click()
      currentUrl = entryUrl
      document.getElementById("current-url").textContent = entryUrl
      startScan()
    }
  }
  list.addEventListener("click", list._histListener)
}

function launchConfetti() {
  const canvas = document.getElementById("confetti-canvas")
  const ctx    = canvas.getContext("2d")
  canvas.width = 400; canvas.height = 600; canvas.style.display = "block"
  const particles = Array.from({ length:80 }, () => ({
    x: Math.random()*400, y: Math.random()*-200,
    r: Math.random()*5+3, d: Math.random()*80+20,
    color: ["#a78bfa","#34d399","#f59e0b","#60a5fa","#f472b6"][Math.floor(Math.random()*5)],
    tilt:0, tiltAngle:0, tiltSpeed:Math.random()*0.07+0.05,
  }))
  let frame = 0
  const angle = 0.01
  function draw() {
    ctx.clearRect(0,0,400,600)
    particles.forEach(p => {
      p.tiltAngle += p.tiltSpeed
      p.y += (Math.cos(angle+p.d)+2.5+p.r/4)
      p.x += Math.sin(angle)*1.5
      p.tilt = Math.sin(p.tiltAngle)*10
      ctx.beginPath(); ctx.lineWidth = p.r; ctx.strokeStyle = p.color
      ctx.moveTo(p.x+p.tilt+p.r/3, p.y); ctx.lineTo(p.x+p.tilt, p.y+p.tilt+p.r/5)
      ctx.stroke()
    })
    frame++
    if (frame < 140) requestAnimationFrame(draw)
    else { ctx.clearRect(0,0,400,600); canvas.style.display="none" }
  }
  draw()
}


function esc(str) {
  return String(str??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")
}

function showToast(msg, type="info") {
  const el = document.getElementById("__toast")
  el.className = `toast toast-${type} show`
  el.textContent = msg
  clearTimeout(el._t)
  el._t = setTimeout(() => el.classList.remove("show"), 3200)
}
