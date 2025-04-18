'use client'

import { useEffect, useState } from 'react'

let timeout: NodeJS.Timeout

export function useToast() {
  const [message, setMessage] = useState('')

  const show = (msg: string) => {
    setMessage(msg)
    clearTimeout(timeout)
    timeout = setTimeout(() => setMessage(''), 2000)
  }

  const Toast = () => (
    message ? (
      <div
        style={{
          position: 'fixed',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#111',
          color: '#fff',
          padding: '0.75rem 1.5rem',
          borderRadius: '0.5rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          fontSize: '14px',
          zIndex: 9999,
        }}
      >
        {message}
      </div>
    ) : null
  )

  return { show, Toast }
}