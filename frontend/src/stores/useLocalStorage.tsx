import { createEffect } from 'solid-js'
import { createStore, SetStoreFunction, Store } from 'solid-js/store'

type InitialObject = {
  [key: string]: any // 👈️ variable keys
}

export function useLocalStorage(
  key: string,
  initState: InitialObject
): [Store<InitialObject>, SetStoreFunction<InitialObject>] {
  const [state, setState] = createStore(initState)
  const storageInitialValue = localStorage.getItem(key)

  if (storageInitialValue) setState(JSON.parse(storageInitialValue))
  createEffect(() => localStorage.setItem(key, JSON.stringify(state)))
  return [state, setState]
}
