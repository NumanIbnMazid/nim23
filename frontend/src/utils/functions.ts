/**
 * Locks the scroll of the document by adding a 'lock-scroll' class to the html element.
 * The 'lock-scroll' class should be defined in a global stylesheet and contain styles for disabling scrolling.
 */
export function lockScroll() {
  const root = document.getElementsByTagName('html')[0]
  root.classList.toggle('lock-scroll') // class is define in the global.css
}

/**
 * Removes the scroll lock from the document by removing the 'lock-scroll' class from the html element.
 */
export function removeScrollLock() {
  const root = document.getElementsByTagName('html')[0]
  root.classList.remove('lock-scroll') // class is define in the global.css
}

// ✅ Function to highlight code using Shiki API
export async function highlightCode(content: string): Promise<string> {
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = content

  const codeBlocks = Array.from(tempDiv.querySelectorAll('pre code'))
  if (codeBlocks.length === 0) return content // ✅ Return early if no code blocks exist

  const requests = codeBlocks.map((block) => ({
    code: block.textContent || '',
    language:
      Array.from(block.classList)
        .find((cls) => cls.startsWith('language-'))
        ?.replace('language-', '') || 'python',
  }))

  try {
    const response = await fetch('/api/highlight', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ codeBlocks: requests }), // ✅ Send all code blocks in a single request
    })

    if (response.ok) {
      const { highlightedBlocks } = await response.json()

      highlightedBlocks.forEach(({ original, highlighted }: { original: string; highlighted: string }) => {
        const matchingBlock = Array.from(tempDiv.querySelectorAll('pre code')).find((block) =>
          block.textContent?.includes(original)
        )

        if (matchingBlock && matchingBlock.parentElement) {
          matchingBlock.parentElement.outerHTML = `
            <div class="code-block-wrapper relative group">
              ${highlighted}
              <button class="copy-button absolute top-2 right-2 bg-gray-700 text-white px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
                Copy
              </button>
            </div>
          `
        }
      })
    }
  } catch (error) {
    console.error('Failed to highlight:', error)
  }

  return tempDiv.innerHTML
}

// ✅ Function to copy text to clipboard
export function copyToClipboard(button: HTMLElement) {
  const codeBlock = button.closest('.code-block-wrapper')?.querySelector('pre code')

  if (codeBlock && codeBlock instanceof HTMLElement) {
    try {
      navigator.clipboard
        .writeText(codeBlock.innerText)
        .then(() => {
          button.textContent = 'Copied!'
          setTimeout(() => {
            button.textContent = 'Copy'
          }, 2000)
        })
        .catch((err) => {
          console.error('Clipboard API Error:', err)
          button.textContent = 'Failed!'
        })
    } catch (err) {
      console.error('Clipboard API Not Available:', err)
      button.textContent = 'Not Supported'
    }
  }
}

// ✅ Function to add copy button event listeners
export function addCopyListeners() {
  document.querySelectorAll('.copy-button').forEach((button) => {
    button.removeEventListener('click', handleCopyClick) // ✅ Remove previous listeners
    button.addEventListener('click', handleCopyClick)
  })
}

function handleCopyClick(event: Event) {
  copyToClipboard(event.currentTarget as HTMLElement)
}
