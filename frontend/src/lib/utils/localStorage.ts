export function getLocalStorageItem(key: string, defaultValue: string | boolean | number): string | boolean | number {
  if (typeof window === 'undefined') {
    return defaultValue // Return default value on server
  }

  try {
    const item = localStorage.getItem(key)
    if (item === null) {
      return defaultValue // Key doesn't exist, return default
    }

    // Attempt to parse as boolean first
    if (item === 'true' || item === 'false') {
      return item === 'true'
    }

    // Attempt to parse as number
    const num = Number(item)
    if (!isNaN(num)) {
      return num
    }

    // Otherwise, treat as string
    return item
  } catch (error) {
    console.error(`Error getting localStorage item for key "${key}":`, error)
    return defaultValue
  }
}

export function setLocalStorageItem(key: string, value: string | boolean | number): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(key, String(value))
    } catch (error) {
      console.error(`Error setting localStorage item for key "${key}" with value "${value}":`, error)
    }
  }
}
