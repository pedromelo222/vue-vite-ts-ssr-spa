import express from 'express'
import fs from 'node:fs/promises'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const isProduction = process.env.NODE_ENV === 'production'
const port = process.env.PORT || 5173

const app = express()

let vite
if (!isProduction) {
  const { createServer } = await import('vite')
  vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom'
  })
  app.use(vite.middlewares)
} else {
  app.use(express.static(resolve(__dirname, 'dist/client')))
}

// Handle all routes
app.get('/', async (req, res) => {
  try {
    let html
    if (!isProduction) {
      html = await fs.readFile('./index.html', 'utf-8')
      html = await vite.transformIndexHtml(req.url, html)
    } else {
      html = await fs.readFile('./dist/client/index.html', 'utf-8')
    }

    const initialState = {
      serverTime: Date.now(),
      tenant: 'teste',
      other: 'other other'
    }

    html = html.replace(
      '</head>',
      `<script>window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}</script></head>`
    )

    res.status(200)
    res.set({ 'Content-Type': 'text/html' })
    res.end(html)
  } catch (e) {
    vite?.ssrFixStacktrace(e)
    console.error(e.stack)
    res.status(500).end(e.stack)
  }
})

// Fallback to index.html for SPA
app.use(/(.*)/, async (req, res) => {
  try {
    let html
    if (!isProduction) {
      html = await fs.readFile('./index.html', 'utf-8')
      html = await vite.transformIndexHtml(req.url, html)
    } else {
      html = await fs.readFile('./dist/client/index.html', 'utf-8')
    }

    const initialState = {
      serverTime: Date.now(),
       tenant: 'teste',
      other: 'other other'
    }

    html = html.replace(
      '</head>',
      `<script>window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}</script></head>`
    )

    res.status(200)
    res.set({ 'Content-Type': 'text/html' })
    res.end(html)
  } catch (e) {
    vite?.ssrFixStacktrace(e)
    console.error(e.stack)
    res.status(500).end(e.stack)
  }
})

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
})
