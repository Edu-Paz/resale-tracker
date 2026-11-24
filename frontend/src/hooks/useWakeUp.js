import { useEffect, useRef } from 'react'

const DEFAULT_PING_INTERVAL_MS = 5 * 60 * 1000

/**
 * Mantém o backend (web service free do Render) acordado enquanto a
 * aplicação estiver aberta, enviando um GET leve para `/ping` a cada
 * intervalo. Só roda em produção — em dev o backend está local.
 */
export function useWakeUp(intervalMs = DEFAULT_PING_INTERVAL_MS) {
  const timeoutRef = useRef(null)
  const abortRef = useRef(null)

  useEffect(() => {
    // Em desenvolvimento o backend roda na máquina (já acordado). Sem necessidade.
    if (!import.meta.env.PROD) return

    const apiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/+$/, '')
    let disposed = false

    const ping = async () => {
      if (disposed) return
      // Reinicia o temporizador a cada chamada para evitar pings sobrepostos.
      clearTimeout(timeoutRef.current)

      const controller = new AbortController()
      abortRef.current = controller

      try {
        // "cache: no-store" impede que o browser/devtools sirva resposta em cache.
        const res = await fetch(`${apiUrl}/ping`, {
          method: 'GET',
          cache: 'no-store',
          signal: controller.signal,
        })
        if (!disposed) console.log(`[keep-alive] backend despertado (HTTP ${res.status})`)
      } catch (err) {
        if (!disposed && err.name !== 'AbortError') {
          console.warn('[keep-alive] falha ao acordar o backend:', err)
        }
      } finally {
        if (!disposed) {
          timeoutRef.current = setTimeout(ping, intervalMs)
        }
      }
    }

    ping()

    return () => {
      disposed = true
      clearTimeout(timeoutRef.current)
      abortRef.current?.abort()
    }
  }, [intervalMs])
}