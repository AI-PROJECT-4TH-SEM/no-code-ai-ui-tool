export default function ThemeCard({ theme, onClick }) {
  const previewColors = Array.isArray(theme.preview) && theme.preview.length > 0
    ? theme.preview
    : ["#111827", "#ec4899", "#f59e0b"]

  return (
    <div
      onClick={() => onClick(theme)}
      className="cursor-pointer rounded-xl border border-gray-700 bg-[#1a1a1a] p-3 transition hover:-translate-y-1 hover:border-pink-400"
    >
      <div className="mb-3 h-16 rounded-lg border border-gray-600 overflow-hidden relative bg-gradient-to-r" style={{ backgroundImage: `linear-gradient(135deg, ${previewColors.join(", ")})` }}>
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1000 100"
          preserveAspectRatio="none"
        >
          <path
            d="M0,30 Q250,10 500,30 T1000,30 L1000,100 L0,100 Z"
            fill="rgba(0,0,0,0.1)"
          />
          <path
            d="M0,50 Q250,30 500,50 T1000,50 L1000,100 L0,100 Z"
            fill="rgba(0,0,0,0.05)"
          />
        </svg>
      </div>
      <div className="text-sm font-medium text-white text-left">{theme.name}</div>
    </div>
  )
}