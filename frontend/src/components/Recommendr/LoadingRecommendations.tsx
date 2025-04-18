import { ImSpinner8 } from 'react-icons/im'
import { useEffect, useState } from 'react'

// make props wsRef which is a ref to the WebSocket instance
interface LoadingRecommendationsProps {
  wsRef: React.RefObject<WebSocket | null>
}

export default function LoadingRecommendations({ wsRef }: LoadingRecommendationsProps) {
  const [logs, setLogs] = useState<string | null>(null)
  useEffect(() => {
    if (wsRef.current) {
      wsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data)
        // console.log('WebSocket message received:', data)

        if (data.message.type === 'event' && data.message.module === 'recommendr') {
          setLogs(data.message.message)
        }
      }
    }
  }, [wsRef])
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-4 text-center text-gray-700 dark:text-gray-200">
      <ImSpinner8 className="animate-spin text-4xl text-blue-500" />
      <p className="text-xl font-semibold">Curating the best recommendations for you...</p>
      <p className="text-sm text-gray-500">This might take a few seconds. Hang tight!</p>

      {/* Real-time WebSocket logs */}
      {logs && (
        <div className="mt-10 p-4 bg-gray-100 rounded-md shadow-md">
          <p className="text-sm text-gray-600">{logs}</p>
        </div>
      )}
    </div>
  )
}
