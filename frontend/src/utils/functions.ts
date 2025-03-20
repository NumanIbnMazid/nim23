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
// Language to Shiki language map
const languageMap: Record<string, string> = {
  docker: 'dockerfile',
  // Add more mappings as needed
};

export async function highlightCode(content: string): Promise<string> {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = content;

  const codeBlocks = Array.from(tempDiv.querySelectorAll('pre'));
  if (codeBlocks.length === 0) return content; // ✅ Return early if no code blocks exist

  const requests = codeBlocks.map((block) => {
    // Access the class of the <pre> element, not the <code> element
    const language =
      block.classList?.value.match(/language-(\w+)/)?.[1] || 'XXX';

    // Map the detected language to the corresponding Shiki language
    const mappedLanguage = languageMap[language.toLowerCase()] || language;

    // console.log('✅ Detected language:', language, 'Mapped to:', mappedLanguage); // ✅ Log detected language and mapped value

    return {
      code: block.querySelector('code')?.textContent || '',
      language: mappedLanguage
    };
  });

  try {
    const response = await fetch('/api/highlight', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ codeBlocks: requests }), // ✅ Send all code blocks in a single request
    });

    if (response.ok) {
      const { highlightedBlocks } = await response.json();

      highlightedBlocks.forEach(({ original, highlighted }: { original: string; highlighted: string }) => {
        const matchingBlock = Array.from(tempDiv.querySelectorAll('pre code')).find((block) =>
          block.textContent?.includes(original)
        );

        if (matchingBlock && matchingBlock.parentElement) {
          matchingBlock.parentElement.outerHTML = `
            <div class="code-block-wrapper relative group">
              ${highlighted}
              <button class="copy-button absolute top-2 right-2 bg-gray-700 text-white px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
                Copy
              </button>
            </div>
          `;
        }
      });
    }
  } catch (error) {
    console.error('❌ Failed to highlight:', error);
  }

  return tempDiv.innerHTML;
}


// ✅ Function to copy text to clipboard
export function copyToClipboard(button: HTMLElement) {
  const codeBlock = button.closest('.code-block-wrapper')?.querySelector('pre code')

  if (!codeBlock || !(codeBlock instanceof HTMLElement)) {
    console.warn('❌ Code block not found.')
    return
  }

  const text = codeBlock.innerText.trim()
  if (!text) {
    console.warn('❌ No text found to copy.')
    return
  }

  navigator.clipboard
    .writeText(text)
    .then(() => {
      button.textContent = 'Copied!'
      setTimeout(() => (button.textContent = 'Copy'), 2000)
    })
    .catch((err) => {
      console.error('❌ Clipboard API Error:', err)
      button.textContent = 'Failed!'
    })
}

// ✅ Function to add copy button event listeners
export function addCopyListeners() {
  document.querySelectorAll('.copy-button').forEach((button) => {
    button.removeEventListener('click', handleCopyClick)
    button.addEventListener('click', handleCopyClick)
  })
}

function handleCopyClick(event: Event) {
  copyToClipboard(event.currentTarget as HTMLElement)
}
