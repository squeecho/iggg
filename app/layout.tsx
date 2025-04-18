// app/layout.tsx
import './globals.css'
import Image from 'next/image'
import React from 'react'

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
      <body className="bg-gray-50 antialiased">
        {/* 로고 헤더 */}
        <header className="bg-white shadow-sm">
          <div className="max-w-xl mx-auto py-4 flex justify-center">
            <Image
              src="/logo.png"
              alt="이견공간 로고"
              width={150}
              height={48}
              priority
            />
          </div>
        </header>

        {/* 본문 */}
        <main className="max-w-xl mx-auto p-4">{children}</main>
      </body>
    </html>
  )
}