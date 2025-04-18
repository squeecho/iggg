export const metadata = {
  title: '공사보고 자동화',
  description: '클릭 한 번으로 공사보고 자동 생성',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head />
      <body>{children}</body>
    </html>
  )
}