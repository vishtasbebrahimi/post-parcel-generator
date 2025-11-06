
import React from 'react'
import { Login } from './Login'
import { CreateShipment } from './CreateShipment'

export function App() {
  const [authed, setAuthed] = React.useState<boolean>(false)

  React.useEffect(() => {
    // Simple probe to check session
    fetch('/api/auth/status', { credentials: 'include' })
      .then(r => r.json()).then(j => setAuthed(!!j?.ok)).catch(() => setAuthed(false))
  }, [])

  if (!authed) return <Login onAuthed={() => setAuthed(true)} />
  return <CreateShipment onLogout={() => setAuthed(false)} />
}
