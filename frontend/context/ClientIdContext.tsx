import React, { createContext, useContext, useEffect } from 'react'
import { createHash } from 'crypto'

export interface ClientIDContextType {
  clientID: string | null
}

const ClientIDContext = createContext<ClientIDContextType | null>(null)

function generateUUID() {
  const hash = createHash('sha256')
  hash.update(Math.random().toString())
  return hash.digest('hex')
}

export function ClientIDProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      const existingClientID = localStorage.getItem('clientID')
      if (!existingClientID) {
        const newClientID = generateUUID()
        localStorage.setItem('clientID', newClientID)
      }
    }
  }, [])

  const contextValue: ClientIDContextType = {
    clientID: typeof localStorage !== 'undefined' ? localStorage.getItem('clientID') : null,
  }

  return <ClientIDContext.Provider value={contextValue}>{children}</ClientIDContext.Provider>
}

export const useClientID = (): ClientIDContextType => {
  const context = useContext(ClientIDContext)
  return context!
}
