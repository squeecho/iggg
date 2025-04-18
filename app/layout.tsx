
import './globals.css'
import Image from 'next/image'

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
      <body className="bg-gray-50">
        {/* 상단 헤더: 로고 한 번만 */}
        <header className="bg-white shadow">
          <div className="max-w-xl mx-auto py-4 flex justify-center">
            <Image
              src="/logo.png"
              alt="이견공간 로고"
              width={180}
              height={60}
              priority
            />
          </div>
        </header>

        {/* 메인 컨텐츠 */}
        <main className="max-w-xl mx-auto p-4">
          {children}
        </main>
      </body>
    </html>
  )
}