const THEMES = [

 
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

  // ── 3. SAKURA LIGHT ─────────────────────────────────────────────────────────
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

  // ── 4. CYBER TERMINAL ───────────────────────────────────────────────────────
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

  // ── 5. WARM EDITORIAL ───────────────────────────────────────────────────────
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

  // ── 6. DEEP OCEAN ───────────────────────────────────────────────────────────
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

  // ── 7. FOREST ORGANIC ───────────────────────────────────────────────────────
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

  // ── 8. SUNSET GRADIENT ──────────────────────────────────────────────────────
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

  // ── 9. ICE MINIMAL ──────────────────────────────────────────────────────────
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
]


// ─── State ────────────────────────────────────────────────────────────────────
// Map to store domFix objects by card index (avoids brittle HTML attribute storage)
const domFixMap = new Map()
// Track number of layout changes applied (incremented on BAKE_LAYOUT)
let layoutChangeCount = 0

let currentTabId    = null
let currentUrl      = ""
let lastResults     = null
let activeThemeId   = null
let allExpanded     = false
let fixTotal        = 0
let fixApplied      = 0
let inspectorOn     = false
let undoAvailable   = false
let redoAvailable   = false
let fixesApplied    = 0          // total fixes applied this session (for rescore trigger)

// ─── Boot ─────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  currentTabId = tab?.id
  currentUrl   = tab?.url || ""
  document.getElementById("current-url").textContent = currentUrl

  // Detect if running as side panel (wider window) or popup
  // Side panel width is the full sidebar width; popup is fixed 400px
  if (window.innerWidth > 420) {
    document.body.style.width  = "100%"
    document.body.style.minHeight = "100vh"
  }

  // Load theme from MongoDB (falls back to local storage)
  chrome.runtime.sendMessage({ type:"LOAD_THEME" }).then(res => {
    activeThemeId = res?.themeId || null
    if (activeThemeId) {
      document.querySelector(`.theme-card[data-id="${activeThemeId}"]`)?.classList.add("active-theme")
    }
  }).catch(() => {
    // Theme loaded from MongoDB only (see LOAD_THEME above)
  })

  setupTabs()
  setupScan()
  setupInspector()
  setupThemes()
  setupHistory()
  setupGlobalActions()
})

// ─── Tabs ─────────────────────────────────────────────────────────────────────
function setupTabs() {
  document.querySelectorAll(".tab").forEach(btn => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.tab
      document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"))
      document.querySelectorAll(".tab-panel").forEach(p => p.classList.add("hidden"))
      btn.classList.add("active")
      document.getElementById(`tab-${name}`)?.classList.remove("hidden")
      if (name === "history") renderHistory()
    })
  })
}

// ─────────────────────────────────────────────────────────────────────────────
//  SCAN
// ─────────────────────────────────────────────────────────────────────────────
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
    // Get all pending fix buttons with their associated domFix data
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
    // Ensure content script is loaded once
    await chrome.scripting.executeScript({ target:{ tabId:currentTabId }, files:["content.js"] }).catch(()=>{})

    for (const card of pendingCards) {
      const btn = card.querySelector(".btn-fix-inline")
      if (!btn || btn.dataset.applied === "true") continue

      // Get domFix from the Map (reliable, no HTML attribute parsing needed)
      const idx    = parseInt(btn.dataset.idx)
      let   domFix = domFixMap.get(idx) || null
      // Fallback to lastResults if map was cleared
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
    // Rescore ONCE after all done
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
  }

  const wrap = document.getElementById("suggestions-wrap")
  wrap.innerHTML = ""
  domFixMap.clear()  // clear fix map for fresh scan
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

  // Toggle body on head click (but not on the fix button)
  card.querySelector(".card-head").addEventListener("click", (e) => {
    if (e.target.closest(".btn-fix-inline")) return
    const body = card.querySelector(".card-body")
    const open = card.classList.toggle("open")
    body.style.display = open ? "flex" : "none"
  })

  if (hasFix) {
    // Store domFix in map keyed by index (safe for complex objects)
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
      // Mark button as fixed
      btn.innerHTML = "✅ Fixed"
      btn.dataset.applied = "true"
      btn.classList.add("applied-inline")

      // Strike through the card title to show it's done
      if (card) {
        const title = card.querySelector(".card-title")
        if (title) title.style.cssText = "text-decoration:line-through;opacity:0.45;flex:1;font-size:11.5px;font-weight:600;color:#c0ccec;line-height:1.35"
        card.style.opacity = "0.65"
      }

      fixApplied++
      fixesApplied++
      updateFixProgress()

      // Update download badge
      updateDownloadBadge()

      // Update undo/redo button states
      if (resp.canUndo !== undefined) setUndoState(resp.canUndo, resp.canRedo, resp.undoLabel, resp.redoLabel)

      // Auto-rescore — only for individual card fixes (not Fix All which rescores once at end)
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

// ─────────────────────────────────────────────────────────────────────────────
//  GLOBAL ACTIONS BAR  (undo / redo / download all)
// ─────────────────────────────────────────────────────────────────────────────
function setupGlobalActions() {
  document.getElementById("undo-btn")?.addEventListener("click", doUndo)
  document.getElementById("redo-btn")?.addEventListener("click", doRedo)
  document.getElementById("download-all-btn")?.addEventListener("click", downloadAllChanges)
  // Always show the bar — download starts disabled until a change is made
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
  })
}

// ── Undo ─────────────────────────────────────────────────────────────────────
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

// ── Redo ─────────────────────────────────────────────────────────────────────
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

// ── Download All Changes ──────────────────────────────────────────────────────
function updateDownloadBadge() {
  const btn   = document.getElementById("download-all-btn")
  const badge = document.getElementById("dl-badge")
  if (!btn) return

  const fixCount    = document.querySelectorAll(".btn-fix-inline.applied-inline").length
  const hasTheme    = !!activeThemeId
  const layoutCount = layoutChangeCount  // tracked separately
  const total       = fixCount + (hasTheme ? 1 : 0) + layoutCount

  // Enable as soon as ANY change exists (fix, theme, or layout)
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
    const resp = await chrome.tabs.sendMessage(currentTabId, { type: "GET_HTML" })
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

    // ── 1. Collect fix titles for changelog ────────────────────────────────────
    const appliedBtns  = [...document.querySelectorAll(".btn-fix-inline.applied-inline")]
    const fixTitles    = appliedBtns.map((b, i) => {
      const title = b.closest(".card")?.querySelector(".card-title")?.textContent?.trim() || ("Fix " + (i+1))
      return title
    })

    // ── 2. Build the extracted CSS block (theme + layout inline styles) ─────────
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
        // Convert inline style to CSS rule
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

    // ── 3. Build annotated HTML ──────────────────────────────────────────────────
    let finalHtml = resp.html

    // Inject theme CSS permanently with clear marker
    if (themeCss) {
      const themeStyleTag = [
        "",
        "  <!-- ╔══════════════════════════════════════════════════════╗ -->",
        "  <!-- ║  CHAI KE SATH AI — THEME: " + (activeTheme ? activeTheme.name : "Applied") + "  ║ -->",
        "  <!-- ╚══════════════════════════════════════════════════════╝ -->",
        "  <style id=\"cksa-applied-theme\">",
        "    /* Theme applied via Chai Ke Sath AI extension */",
        "    " + themeCss.trim().replace(/\n/g, "\n    "),
        "  </style>",
        "  <!-- ── End Theme ── -->",
        ""
      ].join("\n")

      if (finalHtml.includes("</head>")) {
        finalHtml = finalHtml.replace("</head>", themeStyleTag + "</head>")
      } else {
        finalHtml = themeStyleTag + finalHtml
      }
    }

    // Inject extracted CSS as downloadable <link> + inline <style> for layout changes
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

    // ── 4. Annotate fixed elements with underline + comment in HTML ─────────────
    // Add visible marker on each element that had accessibility fix
    // We inject a small CSS snippet that underlines elements with data-cksa-fixed
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

    // ── 5. Build top-level change report comment ─────────────────────────────────
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

    // ── 6. Download both files ──────────────────────────────────────────────────
    const safeName = (domain || "page").replace(/[^a-z0-9]/gi, "-").toLowerCase()
    const dateStr  = now.getFullYear() + String(now.getMonth()+1).padStart(2,"0") + String(now.getDate()).padStart(2,"0")

    // HTML file
    const htmlBlob    = new Blob([finalHtml], { type: "text/html;charset=utf-8" })
    const htmlUrl     = URL.createObjectURL(htmlBlob)
    const htmlFilename = safeName + "-final-" + dateStr + ".html"

    // CSS file
    const cssBlob     = new Blob([extractedCSS], { type: "text/css;charset=utf-8" })
    const cssUrl      = URL.createObjectURL(cssBlob)
    const cssFilename  = safeName + "-changes-" + dateStr + ".css"

    if (chrome.downloads) {
      await chrome.downloads.download({ url: htmlUrl, filename: htmlFilename, saveAs: true })
      // Small delay then download CSS
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

// ── Rescore after fix ─────────────────────────────────────────────────────────
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
  if (violEl) violEl.textContent = violations === 0 ? "✅ No violations!" : violations + " violation" + (violations !== 1 ? "s" : "") + " found"

  const ring = document.querySelector(".score-ring-wrap")
  if (ring) { ring.style.transform = "scale(1.06)"; setTimeout(() => { ring.style.transform = "scale(1)" }, 300) }
}

// ─────────────────────────────────────────────────────────────────────────────
//  LAYOUT INSPECTOR — editor lives entirely inside the extension panel
// ─────────────────────────────────────────────────────────────────────────────

let inspEl = null   // currently selected element selector

function setupInspector() {
  // Toggle button
  document.getElementById("inspector-toggle-btn")?.addEventListener("click", async () => {
    inspectorOn = !inspectorOn
    try {
      await chrome.scripting.executeScript({ target:{ tabId:currentTabId }, files:["content.js"] }).catch(()=>{})
      await chrome.tabs.sendMessage(currentTabId, { type:"TOGGLE_INSPECTOR", active: inspectorOn })
    } catch {
      showToast("Could not activate inspector on this page.", "error")
      inspectorOn = false
    }
    updateInspectorUI()
    // Do NOT close the extension — user needs the panel visible
  })

  // Listen for element picked on page
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === "ELEMENT_PICKED") {
      inspEl = msg.selector
      populateEditor(msg)
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

  // Inspector tab buttons
  document.querySelectorAll(".li-tab").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".li-tab").forEach(t => t.classList.remove("li-tab-on"))
      btn.classList.add("li-tab-on")
      document.querySelectorAll(".li-pane").forEach(p => p.classList.add("hidden"))
      document.getElementById("litab-" + btn.dataset.litab)?.classList.remove("hidden")
    })
  })

  // Reset button
  document.getElementById("li-reset-btn")?.addEventListener("click", async () => {
    if (!inspEl) return
    await sendToPage({ type: "APPLY_LIVE_STYLE", selector: inspEl, prop: "cssText", value: "" })
    // Full reset — send empty styles
    const props = ["fontSize","lineHeight","letterSpacing","fontWeight",
      "paddingTop","paddingRight","paddingBottom","paddingLeft",
      "marginTop","marginRight","marginBottom","marginLeft",
      "width","height","borderRadius","color","backgroundColor"]
    for (const p of props) {
      await sendToPage({ type: "APPLY_LIVE_STYLE", selector: inspEl, prop: p, value: "" })
    }
    showToast("↩ Element styles reset", "info")
  })

  // Copy CSS button
  document.getElementById("li-copy-css-btn")?.addEventListener("click", () => {
    const styles = gatherCurrentStyles()
    if (!styles) return
    const css = Object.entries(styles)
      .filter(([,v]) => v)
      .map(([k, v]) => "  " + k.replace(/([A-Z])/g, c => "-" + c.toLowerCase()) + ": " + v + ";")
      .join("")
    navigator.clipboard.writeText((inspEl||"element") + " {" + css + "}")
    showToast("📋 CSS copied!", "success")
  })

  // Apply to HTML button
  document.getElementById("li-apply-btn")?.addEventListener("click", async () => {
    if (!inspEl) return
    const styles = gatherCurrentStyles()
    const btn    = document.getElementById("li-apply-btn")
    btn.textContent = "⏳ Applying…"; btn.disabled = true
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

  // Fit Content / Full Width quick buttons
  document.getElementById("li-fit-btn")?.addEventListener("click", async () => {
    await sendToPage({ type: "APPLY_LIVE_STYLE", selector: inspEl, prop: "width", value: "fit-content" })
    document.getElementById("li-width-n").value = "auto"
  })
  document.getElementById("li-full-btn")?.addEventListener("click", async () => {
    await sendToPage({ type: "APPLY_LIVE_STYLE", selector: inspEl, prop: "width", value: "100%" })
  })

  // Wire all sliders + number inputs
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

  // Font weight select
  document.getElementById("li-fontweight-s")?.addEventListener("change", e => {
    sendToPage({ type: "APPLY_LIVE_STYLE", selector: inspEl, prop: "fontWeight", value: e.target.value })
  })

  // Color pickers
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
}

// ── Wire a slider+number pair ─────────────────────────────────────────────────
// input = live drag preview (no undo push)
// change = final release value (pushes undo so each property is individually undoable)
function wireSlider(id, cssProp, unit, isFloat) {
  const slider = document.getElementById(id + "-r")
  const numIn  = document.getElementById(id + "-n")
  if (!slider || !numIn) return

  // Live drag — preview only, no undo push
  const preview = (v) => {
    const n = isFloat ? parseFloat(v) : parseInt(v)
    if (isNaN(n)) return
    slider.value = n; numIn.value = n
    sendToPage({ type: "APPLY_LIVE_STYLE", selector: inspEl, prop: cssProp, value: n + unit, pushUndo: false })
  }

  // Final release — push one undo entry for THIS property
  const commit = (v) => {
    const n = isFloat ? parseFloat(v) : parseInt(v)
    if (isNaN(n)) return
    slider.value = n; numIn.value = n
    sendToPage({ type: "APPLY_LIVE_STYLE", selector: inspEl, prop: cssProp, value: n + unit, pushUndo: true })
      .then(resp => { if (resp?.canUndo !== undefined) setUndoState(resp.canUndo, resp.canRedo, resp.undoLabel, resp.redoLabel) })
  }

  slider.addEventListener("input",  () => preview(slider.value))
  slider.addEventListener("change", () => commit(slider.value))   // release
  numIn.addEventListener("input",   () => preview(numIn.value))
  numIn.addEventListener("change",  () => commit(numIn.value))    // tab/enter
}

// ── Populate the editor with values from the picked element ──────────────────
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

  updateContrastDisplay()
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
  } catch { /* page may not be ready */ }
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
    // Hide editor, show idle
    document.getElementById("li-editor")?.classList.add("hidden")
    document.getElementById("li-idle")?.classList.remove("hidden")
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  RESCORE AFTER FIX
// ─────────────────────────────────────────────────────────────────────────────
function showRescoreBanner() {
  // Remove existing banner if any
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

  // Insert right after the score card
  const scoreCard = document.querySelector(".score-card")
  if (scoreCard) scoreCard.insertAdjacentElement("afterend", banner)

  document.getElementById("rescore-btn").addEventListener("click", rescoreNow)
}

async function rescoreNow() {
  // Show a small "updating..." state on the score ring
  const scoreEl = document.getElementById("score-val")
  const prevText = scoreEl?.textContent || "--"
  if (scoreEl) scoreEl.style.opacity = "0.4"

  try {
    // 1. Get the current live DOM HTML (with all fixes applied) from the page
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

    // 2. Send the fixed HTML to backend — same /api/analyse endpoint, html mode
    const data = await chrome.runtime.sendMessage({
      type: "ANALYSE_HTML",
      html: htmlResp.html
    })

    if (data?.error) {
      if (scoreEl) scoreEl.style.opacity = "1"
      showToast("Rescore error: " + data.error, "error")
      return
    }

    // 3. Update score ring, number, grade, violations label
    updateScoreDisplay(data)
    lastResults = data
    fixesApplied = 0

    // 4. Confetti if score is excellent
    if (data.score >= 90) setTimeout(launchConfetti, 400)

  } catch (err) {
    if (scoreEl) scoreEl.style.opacity = "1"
    showToast("Rescore failed: " + err.message, "error")
  }
}

/** Update only the score ring, grade, and violations label without rebuilding cards */
function updateScoreDisplay({ score, violations, suggestions }) {
  // ── NEVER let score decrease after fixes ─────────────────────────────────
  const scoreEl   = document.getElementById("score-val")
  const prevScore = parseInt(scoreEl?.textContent) || 0
  // Only update if new score is higher (or equal) — fixes should never hurt
  const displayScore = Math.max(score, prevScore)

  // Animate score ring with the clamped score
  const arc = document.getElementById("score-arc")
  const C   = 2 * Math.PI * 32
  arc.style.strokeDashoffset = C - (displayScore / 100) * C
  arc.style.stroke = displayScore >= 80 ? "#22c55e" : displayScore >= 50 ? "#f59e0b" : "#ef4444"

  // Restore opacity (was dimmed during loading)
  if (scoreEl) scoreEl.style.opacity = "1"

  // Use displayScore everywhere instead of raw score
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

  // Grade badge
  const { grade, label, cls } = calcGrade(score)
  const gradeEl = document.getElementById("score-grade")
  gradeEl.textContent = grade
  gradeEl.className   = `grade-badge grade-${cls}`
  document.getElementById("score-label-text").textContent = label

  // Violations line
  document.getElementById("violations-label").textContent =
    violations === 0
      ? "✅ No violations — perfectly accessible!"
      : `${violations} violation${violations !== 1 ? "s" : ""} found`

  // Score ring flash effect
  const ring = document.querySelector(".score-ring-wrap")
  if (ring) {
    ring.style.transition = "transform 0.3s"
    ring.style.transform  = "scale(1.08)"
    setTimeout(() => { ring.style.transform = "scale(1)" }, 300)
  }
}

//  THEMES
// ─────────────────────────────────────────────────────────────────────────────
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
    await chrome.scripting.executeScript({ target:{ tabId:currentTabId }, files:["content.js"] }).catch(()=>{})
    // Pass name so content.js can label the undo entry correctly
    const resp = await chrome.tabs.sendMessage(currentTabId, { type:"APPLY_THEME", css:theme.css, name:theme.name })
    activeThemeId = theme.id

    // Update undo/redo state from response
    if (resp?.canUndo !== undefined) setUndoState(resp.canUndo, resp.canRedo, resp.undoLabel, resp.redoLabel)

    // Save to MongoDB
    const saveRes = await chrome.runtime.sendMessage({ type:"SAVE_THEME", themeId: theme.id })
    const savedIcon = saveRes?.source === "mongodb" ? "☁️" : "💾"
    const savedTo   = saveRes?.source === "mongodb" ? "Saved to MongoDB" : "Saved locally"

    document.querySelectorAll(".theme-card").forEach(c => c.classList.remove("active-theme"))
    document.querySelector(`.theme-card[data-id="${theme.id}"]`)?.classList.add("active-theme")

    if (saveRes?.source === "mongodb") {
      showToast(`🎨 ${theme.name} applied! ☁️ Saved to MongoDB`, "success")
    } else {
      showToast(`🎨 ${theme.name} applied! ⚠️ Theme server offline`, "info")
    }
    updateDownloadBadge()
  } catch { showToast("Could not apply theme. Reload page and try.", "error") }
}

async function removeTheme() {
  try {
    const resp = await chrome.tabs.sendMessage(currentTabId, { type:"REMOVE_THEME" })
    activeThemeId = null
    if (resp?.canUndo !== undefined) setUndoState(resp.canUndo, resp.canRedo, resp.undoLabel, resp.redoLabel)
    // Delete from MongoDB (no local storage)
    await chrome.runtime.sendMessage({ type:"SAVE_THEME", themeId: null }).catch(()=>{})
    document.querySelectorAll(".theme-card").forEach(c => c.classList.remove("active-theme"))
    showToast("Theme removed", "info")
    updateDownloadBadge()
  } catch { showToast("No active theme.", "info") }
}

// ─────────────────────────────────────────────────────────────────────────────
//  HISTORY — MongoDB + local fallback
// ─────────────────────────────────────────────────────────────────────────────
function setupHistory() {
  document.getElementById("clear-history-btn").addEventListener("click", async () => {
    const btn = document.getElementById("clear-history-btn")
    if (btn.dataset.confirming === "true") {
      btn.dataset.confirming = "false"
      btn.textContent = "🗑 Clear All"
      btn.style.background = ""
      // Immediately clear UI
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

  // Build all rows with data attributes (no inline event listeners = no closure bugs)
  history.forEach(entry => {
    const row = document.createElement("div")
    row.className = "history-row"
    const sc    = entry.score >= 80 ? "good" : entry.score >= 50 ? "ok" : "bad"
    const { grade } = calcGrade(entry.score)
    const date  = new Date(entry.savedAt).toLocaleDateString(undefined, { month:"short", day:"numeric", hour:"2-digit", minute:"2-digit" })
    const shortUrl = (entry.url||"").replace(/^https?:\/\/(www\.)?/,"").slice(0, 38)

    // Store data on the row itself — no inline handlers
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

  // Event delegation — one listener on #history-list, no stale refs, no cloneNode
  // Re-assign onclick to clear any previous listener from prior render
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
      // Re-query count after removal (not a stale captured variable)
      const remaining = document.querySelectorAll("#history-list .history-row").length
      const cEl = document.getElementById("history-count")
      if (cEl) cEl.textContent = remaining + " scan" + (remaining !== 1 ? "s" : "")
      if (remaining === 0) {
        const lst = document.getElementById("history-list")
        if (lst) lst.innerHTML = '<div class="empty-state"><div class="empty-icon">📭</div><p>No scans saved yet. Run a scan and click 💾 Save.</p></div>'
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

// ─── Confetti ─────────────────────────────────────────────────────────────────
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

// ─── Utils ────────────────────────────────────────────────────────────────────
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
