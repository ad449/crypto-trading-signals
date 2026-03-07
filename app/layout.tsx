export const metadata = {
  title: 'AD AI Crypto Trading Signals',
  description: 'Advanced AI-Powered Trading Signals',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
