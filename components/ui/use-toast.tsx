import { useState } from 'react'

export function useToast() {
  const [message, setMessage] = useState<string | null>(null)

  const show = (msg: string) => {
    setMessage(msg)
    setTimeout(() => setMessage(null), 2000)
  }

  const Toast = () =>
    message ? (
      <div
        style={{
          position: 'fixed',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#333',
          color: '#fff',
          padding: '10px 16px',
          borderRadius: '8px',
          fontSize: '14px',
          zIndex: 9999,
        }}
      >
        {message}
      </div>
    ) : null

  return { show, Toast }
}