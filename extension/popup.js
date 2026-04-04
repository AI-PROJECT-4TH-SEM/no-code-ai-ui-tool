// ─── Themes ───────────────────────────────────────────────────────────────────
const THEMES = [
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
]

// ─── State ────────────────────────────────────────────────────────────────────
let currentTabId    = null
let currentUrl      = ""
let lastResults     = null
let activeThemeId   = null
let allExpanded     = false
let fixTotal        = 0
let fixApplied      = 0
let inspectorOn     = false

// ─── Boot ─────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  currentTabId = tab?.id
  currentUrl   = tab?.url || ""
  document.getElementById("current-url").textContent = currentUrl
  chrome.storage.local.get(["activeThemeId"], d => { activeThemeId = d.activeThemeId || null })
  setupTabs()
  setupScan()
  setupInspector()
  setupThemes()
  setupHistory()
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
    const btns = [...document.querySelectorAll(".btn-fix:not([data-applied='true']):not(:disabled)")]
    if (!btns.length) { showToast("No pending fixes!", "info"); return }
    const fixBtn = document.getElementById("fix-all-btn")
    fixBtn.disabled = true; fixBtn.innerHTML = "⏳ Fixing…"
    for (const b of btns) { b.click(); await new Promise(r => setTimeout(r, 400)) }
    fixBtn.disabled = false; fixBtn.innerHTML = "⚡ Fix All"
  })
}

async function startScan() {
  const scanBtn = document.getElementById("scan-btn")
  const loading = document.getElementById("loading")
  const results = document.getElementById("results")

  scanBtn.disabled = true
  scanBtn.innerHTML = "<span>⏳</span> Scanning…"
  loading.classList.remove("hidden")
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

// ─── Render Results ───────────────────────────────────────────────────────────
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
      <span class="chevron">▾</span>
    </div>
    <div class="card-body" style="display:none">
      ${s.explanation    ? `<p class="card-text">${esc(s.explanation)}</p>` : ""}
      ${s.fixDescription ? `<div class="card-hint">${esc(s.fixDescription)}</div>` : ""}
      ${s.codeExample    ? `<pre class="code-pre">${esc(s.codeExample)}</pre>` : ""}
      <div class="card-actions">
        ${hasFix
          ? `<button class="btn-fix" data-idx="${index}" data-applied="false">
               <span class="fix-icon">⚡</span> Apply Fix
             </button>`
          : `<span class="manual-tag">⚠ Manual fix required</span>`
        }
        ${s.helpUrl ? `<a href="${esc(s.helpUrl)}" target="_blank" class="btn-docs">📖 Docs</a>` : ""}
      </div>
    </div>
  `

  card.querySelector(".card-head").addEventListener("click", () => {
    const body = card.querySelector(".card-body")
    const open = card.classList.toggle("open")
    body.style.display = open ? "flex" : "none"
  })

  if (hasFix) {
    card.querySelector(".btn-fix").addEventListener("click", async e => {
      e.stopPropagation()
      await doApplyFix(e.currentTarget, s.domFix)
    })
  }

  return card
}

async function doApplyFix(btn, domFix) {
  if (btn.dataset.applied === "true") return
  btn.disabled = true
  btn.innerHTML = '<span class="fix-icon spin">⚙</span> Applying…'

  try {
    await chrome.scripting.executeScript({ target:{ tabId:currentTabId }, files:["content.js"] }).catch(()=>{})
    const resp = await chrome.tabs.sendMessage(currentTabId, { type:"APPLY_FIX", domFix })

    if (resp?.success) {
      btn.innerHTML = "✅ Fixed"
      btn.dataset.applied = "true"
      btn.classList.add("applied")
      fixApplied++
      updateFixProgress()
      showToast("Fix applied on page!", "success")
    } else {
      btn.disabled = false
      btn.innerHTML = '<span class="fix-icon">⚡</span> Apply Fix'
      showToast("Fix failed: " + (resp?.error || "Unknown"), "error")
    }
  } catch {
    btn.disabled = false
    btn.innerHTML = '<span class="fix-icon">⚡</span> Apply Fix'
    showToast("Could not reach page. Try reloading the tab.", "error")
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  LAYOUT INSPECTOR
// ─────────────────────────────────────────────────────────────────────────────
function setupInspector() {
  const toggleBtn = document.getElementById("inspector-toggle-btn")
  if (!toggleBtn) return

  toggleBtn.addEventListener("click", async () => {
    inspectorOn = !inspectorOn
    try {
      await chrome.scripting.executeScript({ target:{ tabId:currentTabId }, files:["content.js"] }).catch(()=>{})
      await chrome.tabs.sendMessage(currentTabId, { type:"TOGGLE_INSPECTOR", active: inspectorOn })
    } catch {
      showToast("Could not activate on this page.", "error")
      inspectorOn = false
    }
    updateInspectorUI()
    // close popup so user can freely click elements on page
    if (inspectorOn) setTimeout(() => window.close(), 350)
  })

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === "INSPECTOR_CLOSED") {
      inspectorOn = false
      updateInspectorUI()
    }
  })
}

function updateInspectorUI() {
  const badge = document.getElementById("insp-status-badge")
  const btn   = document.getElementById("inspector-toggle-btn")
  if (!btn) return

  if (inspectorOn) {
    if (badge) { badge.textContent = "ON"; badge.className = "insp-badge insp-badge-on" }
    btn.textContent = "✓ Inspector Active — click to disable"
    btn.classList.add("active")
  } else {
    if (badge) { badge.textContent = "OFF"; badge.className = "insp-badge insp-badge-off" }
    btn.textContent = "Enable Inspector"
    btn.classList.remove("active")
  }
}
// message from content script when inspector is closed from page
// ─────────────────────────────────────────────────────────────────────────────
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
    await chrome.tabs.sendMessage(currentTabId, { type:"APPLY_THEME", css:theme.css })
    activeThemeId = theme.id
    chrome.storage.local.set({ activeThemeId: theme.id })
    document.querySelectorAll(".theme-card").forEach(c => c.classList.remove("active-theme"))
    document.querySelector(`.theme-card[data-id="${theme.id}"]`)?.classList.add("active-theme")
    showToast(`🎨 ${theme.name} applied!`, "success")
  } catch { showToast("Could not apply theme. Reload page and try.", "error") }
}

async function removeTheme() {
  try {
    await chrome.tabs.sendMessage(currentTabId, { type:"REMOVE_THEME" })
    activeThemeId = null
    chrome.storage.local.remove("activeThemeId")
    document.querySelectorAll(".theme-card").forEach(c => c.classList.remove("active-theme"))
    showToast("Theme removed", "info")
  } catch { showToast("No active theme.", "info") }
}

// ─────────────────────────────────────────────────────────────────────────────
//  HISTORY — MongoDB + local fallback
// ─────────────────────────────────────────────────────────────────────────────
function setupHistory() {
  document.getElementById("clear-history-btn").addEventListener("click", async () => {
    if (!confirm("Clear all scan history?")) return
    await chrome.runtime.sendMessage({ type:"CLEAR_HISTORY" })
    renderHistory()
  })
}

async function renderHistory() {
  const list      = document.getElementById("history-list")
  const countEl   = document.getElementById("history-count")
  const sourceEl  = document.getElementById("history-source")

  list.innerHTML = '<div class="hist-loading"><div class="ring-sm"></div> Loading…</div>'

  const res = await chrome.runtime.sendMessage({ type:"GET_HISTORY" })
  const history = res.history || []
  const source  = res.source  || "local"

  countEl.textContent  = `${history.length} scan${history.length!==1?"s":""}`
  sourceEl.textContent = source === "mongodb" ? "☁️ MongoDB" : "💾 Local"
  sourceEl.className   = `hist-source ${source === "mongodb" ? "src-mongo" : "src-local"}`

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
    const shortUrl = (entry.url||"").replace(/^https?:\/\/(www\.)?/,"").slice(0,40)

    row.innerHTML = `
      <div class="hist-score-wrap">
        <div class="hist-score ${sc}">${entry.score}</div>
        <div class="hist-grade ${sc}">${grade}</div>
      </div>
      <div class="hist-meta">
        <div class="hist-url" title="${esc(entry.url)}">${esc(shortUrl)}</div>
        <div class="hist-info">
          <span>${entry.violations} violation${entry.violations!==1?"s":""}</span>
          <span class="dot">·</span><span>${date}</span>
        </div>
      </div>
      <div class="hist-btns">
        <button class="hbtn hbtn-rescan" data-url="${esc(entry.url)}" title="Rescan">↺</button>
        <button class="hbtn hbtn-del"    data-id="${esc(entry.id)}"   title="Delete">✕</button>
      </div>
    `
    row.querySelector(".hbtn-rescan").addEventListener("click", e => {
      const url = e.currentTarget.dataset.url
      document.querySelector('.tab[data-tab="scan"]').click()
      currentUrl = url
      document.getElementById("current-url").textContent = url
      startScan()
    })
    row.querySelector(".hbtn-del").addEventListener("click", async e => {
      await chrome.runtime.sendMessage({ type:"DELETE_HISTORY_ITEM", id:e.currentTarget.dataset.id })
      renderHistory()
    })
    list.appendChild(row)
  })
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
