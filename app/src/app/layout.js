import "./globals.css"
import { AuthProvider } from "@/context/AuthContext"
import ErrorBoundary from "@/components/ErrorBoundary"
import Footer from "@/components/Footer"

export const metadata = {
  title: "UI Theme Lab",
  description: "No-Code AI UI Tool",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning style={{ margin: 0 }}>
        <ErrorBoundary>
          <AuthProvider>
            {children}
            <Footer />
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}