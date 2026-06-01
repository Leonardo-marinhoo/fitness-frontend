import path from 'node:path'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** Remove Domain/Secure do Set-Cookie do Laravel para o host do Vite (ex.: IP da LAN no celular). */
function rewriteProxyCookies(proxyRes: import('http').IncomingMessage) {
  const raw = proxyRes.headers['set-cookie']
  if (!raw) {
    return
  }

  const cookies = Array.isArray(raw) ? raw : [raw]
  proxyRes.headers['set-cookie'] = cookies.map((cookie) =>
    cookie
      .replace(/;\s*Domain=[^;]*/gi, '')
      .replace(/;\s*Secure/gi, ''),
  )
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiProxyTarget = env.VITE_PROXY_TARGET || env.VITE_API_URL || 'http://127.0.0.1:8000'

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      host: true,
      proxy: {
        '/api': {
          target: apiProxyTarget,
          changeOrigin: true,
          configure: (proxy) => {
            proxy.on('proxyRes', rewriteProxyCookies)
          },
        },
        '/storage': {
          target: apiProxyTarget,
          changeOrigin: true,
        },
      },
    },
  }
})
