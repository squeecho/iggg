// app/layout.tsx
import './globals.css'
import { ReactNode } from 'react'
import Image from 'next/image'
import { ToastProvider } from '@/components/ui/use-toast'

export const metadata = {
  title: '공사보고 자동화',
  description: '클릭 한 번으로 공사보고 자동 생성',
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="ko">
      <head />
      <body className="bg-gray-50">
        <ToastProvider>
          <header className="bg-white py-4 shadow-sm">
            <div className="max-w-xl mx-auto flex items-center justify-center">
              <Image
                src="/logo.png"
                width={180}
                height={40}
                alt="이견공간 로고"
                priority
              />
            </div>
          </header>
          <main className="py-6">{children}</main>
        </ToastProvider>
      </body>
    </html>
  )
}