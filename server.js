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
    appType: 'custom',
  })
  app.use(vite.middlewares)
} else {
  // Serve static files, excluding 'index.html'
  app.use(
    express.static(resolve(__dirname, 'dist/client'), {
      index: false, // Do not serve 'index.html' automatically
    })
  )
}

// API routes (define your API routes here)
// app.use('/api', apiRoutes)

// Handler to serve 'index.html' only for requests that accept HTML
app.use(/(.*)/, async (req, res, next) => {
  try {
    // Check if the request accepts HTML
    if (req.headers.accept && req.headers.accept.includes('text/html')) {
      let html
      if (!isProduction) {
        html = await fs.readFile('./index.html', 'utf-8')
        html = await vite.transformIndexHtml(req.url, html)
      } else {
        html = await fs.readFile('./dist/client/index.html', 'utf-8')
      }

      // Get the initialState by making your API call here
      const initialState = await getInitialState()

      html = html.replace(
        '</head>',
        `<script>window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}</script></head>`
      )

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } else {
      // If the request does not accept HTML, pass to the next middleware
      next()
    }
  } catch (e) {
    console.error(e)
    res.status(500).end(e.message)
  }
})

// Function to get the initialState (make your API call here)
async function getInitialState() {
  console.log('Calling the API to get the initialState...')
  // Simulate an API call (replace with your logic)
  return {
    serverTime: Date.now(),
    tenant: 'teste',
    data: 'other data',
  }
}

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
})
