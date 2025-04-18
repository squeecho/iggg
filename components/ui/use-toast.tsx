'use client'

import { useState, useEffect, ReactNode } from 'react'

type ToastOptions = { description: string }

export function useToast() {
  const [message, setMessage] = useState<ToastOptions | null>(null)

  function show(opts: string | ToastOptions) {
    if (typeof opts === 'string') {
      setMessage({ description: opts })
    } else {
      setMessage(opts)
    }
  }

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 2000)
      return () => clearTimeout(timer)
    }
  }, [message])

  function Toast() {
    if (!message) return null
    return (
      <div
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded-md shadow-lg"
        style={{ zIndex: 9999 }}
      >
        {message.description}
      </div>
    )
  }

  return { show, Toast }
}