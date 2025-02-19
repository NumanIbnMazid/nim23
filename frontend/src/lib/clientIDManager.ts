import { createHash } from 'crypto'

const CLIENT_ID_KEY = 'clientID'

function generateUUID(): string {
  const hash = createHash('sha256')
  hash.update(Math.random().toString())
  return hash.digest('hex')
}

export function getOrSetClientID(): string {
  if (typeof localStorage !== 'undefined') {
    let clientID = localStorage.getItem(CLIENT_ID_KEY)
    
    if (!clientID) {
      clientID = generateUUID();
      localStorage.setItem(CLIENT_ID_KEY, clientID)
    }

    return clientID
  } else {
    throw new Error('LocalStorage is not available.')
  }
}
