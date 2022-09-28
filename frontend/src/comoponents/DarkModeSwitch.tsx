import { useLocalStorage } from '../stores/useLocalStorage'

const DarkModeSwitch = () => {
  // Add initial classes to body class
  document.body.classList.add('antialiased', 'text-slate-500', 'dark:text-slate-400', 'bg-white', 'dark:bg-slate-900')

  // get prefers color scheme from client
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const clientPreferredColorScheme = mediaQuery.matches ? 'dark' : 'light'

  // set initial color_theme placeholder to local storage
  const [colorTheme, setColorTheme] = useLocalStorage('color_theme', { theme: null })

  const toggleColorTheme = () => {
    const newTheme = colorTheme.theme === 'dark' ? 'light' : 'dark'
    setAppColorTheme(colorTheme.theme, newTheme)
  }

  const setAppColorTheme = (oldTheme: string, newTheme: string) => {
    const root = window.document.documentElement

    if (oldTheme != null) root.classList.remove(oldTheme)
    root.classList.add(newTheme)

    setColorTheme({
      theme: newTheme,
    })
  }

  // set initial color theme from clientPreferredColorScheme if the value of theme in local storage is null
  if (colorTheme.theme == null) {
    setAppColorTheme(null, clientPreferredColorScheme)
  } else {
    setAppColorTheme(colorTheme.theme, colorTheme.theme)
  }

  return (
    // <!-- Dark mode switcher -->
    <div class="mr-8 w-6 cursor-pointer fill-transparent self-center" onclick={toggleColorTheme}>
      <svg
        class="fill-transparent dark:fill-yellow-600"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="1.5"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
      </svg>
    </div>
    // <!-- Dark mode switcher end -->
  )
}

export default DarkModeSwitch
