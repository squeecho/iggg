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

  const Toast = () =>
    message ? (
      <div
        style={{
          position: 'fixed',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'black',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '10px',
          fontSize: '14px',
          zIndex: 1000,
        }}
      >
        {message}
      </div>
    ) : null

  return { show, Toast }
}