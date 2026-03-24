import "./globals.css"
import { AuthProvider } from "@/context/AuthContext"

export const metadata = {
  title: "UI Theme Lab",
  description: "No-Code AI UI Tool",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}