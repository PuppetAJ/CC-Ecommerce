import type { Metadata } from 'next'
import { Inter, Mona_Sans } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const monaSans = Mona_Sans({ subsets: ['latin'], variable: '--font-mona', axes: ['wdth'] })

export const metadata: Metadata = {
  title: { default: 'Wicken', template: '%s · Wicken' },
  description: 'Furniture and ceramics, made in small batches.',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    // next-themes sets the class on <html> after hydration.
    <html lang="en" className={`${inter.variable} ${monaSans.variable}`} suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
