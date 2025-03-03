import { NextResponse } from 'next/server'
import { createHighlighter } from 'shiki'

let cachedHighlighter: any = null // ✅ Cached Singleton

async function getHighlighter() {
  if (!cachedHighlighter) {
    cachedHighlighter = await createHighlighter({
      themes: ['dark-plus', 'nord', 'dracula'], // ✅ Ensure themes are correctly loaded
      langs: [
        'python',
        'javascript',
        'typescript',
        'html',
        'css',
        'cpp',
        'java',
        'sql',
        'php',
        'xml',
        'yaml',
        'ruby',
        'go',
        'rust',
        'csharp',
        'shellscript',
        'tsx',
        'jsx',
        'nginx',
        'json',
        'markdown',
      ],
    })
  }
  return cachedHighlighter
}

export async function POST(req: Request) {
  try {
    const { codeBlocks } = await req.json() // ✅ Accept multiple code blocks
    const highlighter = await getHighlighter()

    // ✅ Extract supported languages dynamically from `cachedHighlighter`
    const supportedLanguages = highlighter.getLoadedLanguages()

    const highlightedBlocks = await Promise.all(
      codeBlocks.map(async ({ code, language }: { code: string; language: string }) => {
        const selectedLanguage = supportedLanguages.includes(language) ? language : 'plaintext' // ✅ Default to plaintext if unsupported

        const highlightedCode = await highlighter.codeToHtml(code, {
          lang: selectedLanguage,
          theme: 'dark-plus',
        })

        return { original: code, highlighted: highlightedCode }
      })
    )

    return NextResponse.json({ highlightedBlocks })
  } catch (error) {
    console.error('Shiki error:', error)
    return NextResponse.json({ error: 'Error highlighting code' }, { status: 500 })
  }
}
