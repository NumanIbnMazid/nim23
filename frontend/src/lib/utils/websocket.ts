export function createWebSocketWithRetry(url: string, retries = 5, delay = 1000): Promise<WebSocket> {
  return new Promise((resolve, reject) => {
    let attempts = 0

    const tryConnect = () => {
      const ws = new WebSocket(url)

      ws.onopen = () => resolve(ws)
      ws.onerror = (err) => {
        attempts++
        if (attempts >= retries) reject(err)
        else setTimeout(tryConnect, delay)
      }
    }

    tryConnect()
  })
}
