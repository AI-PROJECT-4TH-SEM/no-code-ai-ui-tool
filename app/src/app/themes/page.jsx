"use client"
import { useRouter } from "next/navigation"
import { themes } from "@/lib/themes"
import Navbar from "@/components/Navbar"

export default function Themes() {
  const router = useRouter()

  async function handleSelect(theme) {
    const html = localStorage.getItem("htmlToAnalyse")
    if (!html) {
      alert("Paste some HTML on home page first!")
      router.push("/")
      return
    }

    const token = localStorage.getItem("accessToken")
    if (!token) {
      alert("Please login to apply themes")
      return
    }

    try {
      // Call backend to save selected theme
      const res = await fetch("/api/theme", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ themeName: theme.name }),
      })

      const data = await res.json()
      if (!res.ok) {
        alert(data.error || "Failed to apply theme")
        return
      }

      const styledHtml = html + `<style>${theme.css}</style>`
      localStorage.setItem("htmlToAnalyse", styledHtml)
      alert(`Theme applied: ${data.selectedTheme}`)
      router.push("/results")
    } catch (err) {
      console.error(err)
      alert("Something went wrong!")
    }
  }

  return (
    <div
      className="flex flex-col min-h-screen text-white relative"
      style={{ backgroundImage: "url('/hero-bg.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}
    >
      {/* dark overlay */}
      <div className="absolute inset-0 bg-black/75 z-0"></div>

      {/* content wrapper */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        {/* HEADER */}
        <div className="px-12 py-10 border-b border-gray-800 bg-black/20 relative overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-32 bg-purple-600 opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute top-0 right-1/4 w-96 h-32 bg-pink-600 opacity-10 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-gray-400 mb-4">
              {themes.length} themes available
            </div>
            <h1 className="text-4xl font-bold mb-2">Explore Themes</h1>
            <p className="text-gray-400">Click any theme to instantly apply it to your website</p>
          </div>
        </div>

        {/* THEMES GRID */}
        <div className="flex-1 p-12 overflow-y-auto bg-black/10">
          <div className="grid grid-cols-4 gap-6">
            {themes.map((theme) => (
              <div
                key={theme.name}
                onClick={() => handleSelect(theme)}
                className="group cursor-pointer rounded-2xl overflow-hidden border border-gray-800 hover:border-pink-400 transition hover:-translate-y-1 bg-black/40 backdrop-blur-sm"
              >
                {/* PREVIEW CARD */}
                <div
                  className="h-40 p-4 relative overflow-hidden"
                  style={{ background: getThemeBg(theme.name) }}
                >
                  {/* fake browser bar */}
                  <div className="flex items-center gap-1.5 mb-3">
                    <div className="w-2 h-2 rounded-full bg-red-400 opacity-70"></div>
                    <div className="w-2 h-2 rounded-full bg-yellow-400 opacity-70"></div>
                    <div className="w-2 h-2 rounded-full bg-green-400 opacity-70"></div>
                    <div className="flex-1 bg-white/10 rounded h-2 ml-1"></div>
                  </div>
                  {/* fake content */}
                  <div className="space-y-2">
                    <div
                      className="h-3 rounded w-3/4"
                      style={{ background: getThemeAccent(theme.name), opacity: 0.9 }}
                    ></div>
                    <div className="h-2 rounded w-full bg-white/20"></div>
                    <div className="h-2 rounded w-5/6 bg-white/15"></div>
                    <div className="h-2 rounded w-4/6 bg-white/10"></div>
                    <div
                      className="h-5 rounded w-20 mt-3"
                      style={{ background: getThemeAccent(theme.name), opacity: 0.8 }}
                    ></div>
                  </div>
                </div>

                {/* CARD FOOTER */}
                <div className="p-4 flex items-center justify-between">
                  <span className="font-medium text-sm">{theme.name}</span>
                  <span className="text-xs text-gray-600 group-hover:text-pink-400 transition">
                    Apply →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function getThemeBg(name) {
  const map = {
    "🌑 Dark Mode": "#0f0f0f",
    "🌸 Pastel": "#fdf6ff",
    "💼 Corporate": "#ffffff",
    "🌈 Colorful": "#fff7ed",
    "🌊 Ocean": "#0c1e3c",
    "🌿 Nature": "#f0fdf4",
    "🔥 Fiery": "#1c0a00",
    "🌙 Midnight": "#0f0f1a",
    "☀️ Sunny": "#fefce8",
    "🍬 Candy": "#fdf2f8",
  }
  return map[name] || "#1a1a2e"
}

function getThemeAccent(name) {
  const map = {
    "🌑 Dark Mode": "#7c6dfa",
    "🌸 Pastel": "#c084fc",
    "💼 Corporate": "#0ea5e9",
    "🌈 Colorful": "#f97316",
    "🌊 Ocean": "#38bdf8",
    "🌿 Nature": "#22c55e",
    "🔥 Fiery": "#ea580c",
    "🌙 Midnight": "#a78bfa",
    "☀️ Sunny": "#eab308",
    "🍬 Candy": "#ec4899",
  }
  return map[name] || "#ff6fd8"
}