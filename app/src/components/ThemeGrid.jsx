import ThemeCard from "./ThemeCard"

export default function ThemeGrid({ themes, onSelect }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {themes.map((theme) => (
        <ThemeCard
          key={theme.name}
          theme={theme}
          onClick={onSelect}
        />
      ))}
    </div>
  )
}