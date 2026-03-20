export default function ThemeCard({ theme, onClick }) {
  return (
    <div
      onClick={() => onClick(theme)}
      className="bg-[#1a1a1a] border border-gray-700 rounded-xl p-5 text-center cursor-pointer hover:border-pink-400 hover:-translate-y-1 transition"
    >
      {theme.name}
    </div>
  )
}