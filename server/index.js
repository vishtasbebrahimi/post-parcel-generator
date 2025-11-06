
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import cookieSession from 'cookie-session'
import fetch from 'node-fetch'
import { APP_USERNAME, APP_PASSWORD, SESSION_SECRET, POST_API_BASE, POST_API_KEY } from './config.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(express.json())
app.use(cookieParser())
app.use(cookieSession({
  name: 'efa_sess',
  secret: SESSION_SECRET,
  httpOnly: true,
  sameSite: 'lax'
}))

// --- Auth ---
app.post('/api/login', (req, res) => {
  const { username, password } = req.body || {}
  if (username === APP_USERNAME && password === APP_PASSWORD) {
    req.session.authed = true
    return res.json({ ok: true })
  }
  return res.status(401).json({ message: 'نام کاربری یا گذرواژه نادرست است' })
})

app.post('/api/logout', (req, res) => {
  req.session = null
  res.json({ ok: true })
})

app.get('/api/auth/status', (req, res) => {
  res.json({ ok: !!req.session?.authed })
})

function guard(req, res, next) {
  if (!req.session?.authed) return res.status(401).json({ message: 'نیاز به ورود' })
  next()
}

// --- Proxy: Create Shipment ---
app.post('/api/proxy/create-shipment', guard, async (req, res) => {
  const { payload, testMode } = req.body || {}
  if (testMode) {
    // Return a mocked tracking code for UI testing
    const fake = {
      trackingCode: 'TEST' + Math.floor(100000000 + Math.random()*900000000).toString(),
      raw: { mocked: true, received: payload }
    }
    return res.json(fake)
  }

  try {
    // NOTE: Adjust endpoint + body mapping according to your official Post API docs.
    // For now we assume POST /shipments
    const url = `${POST_API_BASE.replace(/\/$/,'')}/shipments`
    const headers = {
      'Content-Type': 'application/json',
    }
    if (POST_API_KEY) headers['Authorization'] = `Bearer ${POST_API_KEY}`

    const upstream = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    })

    const data = await upstream.json().catch(()=> ({}))

    if (!upstream.ok) {
      // Try to normalize error
      const msg = data?.message || data?.error || 'خطا در اتصال به سرویس پست'
      return res.status(upstream.status).json({ message: msg, raw: data })
    }

    // Try to map tracking code
    const trackingCode = data?.trackingCode || data?.result?.trackingCode || data?.data?.trackingCode
    if (!trackingCode) {
      return res.status(502).json({ message: 'پاسخ معتبر از سرویس پست دریافت نشد (بدون trackingCode)', raw: data })
    }

    res.json({ trackingCode, raw: data })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'خطای داخلی سرور', error: String(e) })
  }
})

app.listen(PORT, () => console.log(`[server] listening on http://localhost:${PORT}`))
