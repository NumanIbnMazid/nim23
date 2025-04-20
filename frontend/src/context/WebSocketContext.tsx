'use client'

import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { WEBSOCKET_URL } from '@/lib/constants'

interface WebSocketContextType {
  ws: WebSocket | null
  logs: any | null
}

const WebSocketContext = createContext<WebSocketContextType>({
  ws: null,
  logs: null,
})

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [logs, setLogs] = useState<any | null>(null)
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    let reconnectTimeout: NodeJS.Timeout
    const socketUrl = `${WEBSOCKET_URL}/ws/logs/`

    const connect = () => {
      const ws = new WebSocket(socketUrl)
      wsRef.current = ws

      ws.onopen = () => {
        // console.log('✅ WebSocket connected')
        ws.send(JSON.stringify({ type: 'ready' }))
      }

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data)
        setLogs(data)
        if (data.type === 'ping') {
        //   console.log('✅ Ping received')
          ws.send(JSON.stringify({ type: 'pong' }))
        }
      }

      ws.onclose = (e) => {
        console.warn('🔌 WebSocket closed:', e)
        if (!e.wasClean) {
          reconnectTimeout = setTimeout(connect, 1000)
        }
      }

      ws.onerror = (err) => {
        console.error('🔴 WebSocket error:', err)
      }
    }

    connect()

    return () => {
      wsRef.current?.close()
      if (reconnectTimeout) clearTimeout(reconnectTimeout)
    }
  }, [])

  return <WebSocketContext.Provider value={{ ws: wsRef.current, logs }}>{children}</WebSocketContext.Provider>
}

export const useWebSocket = () => useContext(WebSocketContext)
