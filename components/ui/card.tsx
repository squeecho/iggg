export function Card({ children }: { children: React.ReactNode }) {
  return <div style={{ border: '1px solid #ccc', padding: '16px' }}>{children}</div>
}

export function CardContent({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}