
import React from 'react'
import { api } from '../lib/fetcher'
import { Lock } from 'lucide-react'

export const Login: React.FC<{ onAuthed: () => void }> = ({ onAuthed }) => {
  const [username, setU] = React.useState('')
  const [password, setP] = React.useState('')
  const [err, setErr] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setErr(null); setLoading(true)
    try {
      await api('/api/login', { method: 'POST', body: JSON.stringify({ username, password }) })
      onAuthed()
    } catch (e:any) {
      setErr(e.message)
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={submit} className="card w-full max-w-sm">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="text-indigo-600" />
          <h1 className="text-xl font-semibold">ورود</h1>
        </div>
        <div className="field mb-3">
          <label className="label">نام کاربری</label>
          <input className="input" value={username} onChange={e=>setU(e.target.value)} required />
        </div>
        <div className="field mb-4">
          <label className="label">گذرواژه</label>
          <input className="input" type="password" value={password} onChange={e=>setP(e.target.value)} required />
        </div>
        {err && <div className="error mb-3">{err}</div>}
        <button className="btn btn-primary w-full" disabled={loading}>{loading? '...' : 'ورود'}</button>
      </form>
    </div>
  )
}
