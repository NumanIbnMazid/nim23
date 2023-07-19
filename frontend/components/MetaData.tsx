import Head from "next/head"
import useWindowLocation from "@hooks/useWindowLocation"
import { useEffect, useState } from "react"

type Props = {
  title: string
  description: string
  previewImage?: string
  keywords?: string
  suffix?: string
}

const getFaviconPath = (isDarkMode = true): string => {
  return `/favicon-${isDarkMode ? "dark" : "light"}.ico`
}

export default function MetaData({
  title,
  description,
  previewImage,
  keywords,
  suffix,
}: Props) {
  const { currentURL } = useWindowLocation()
  const [faviconHref, setFaviconHref] = useState("/favicon-dark.ico")

  useEffect(() => {
    // Get current color scheme.
    const matcher = window.matchMedia("(prefers-color-scheme: dark)")
    // Set favicon initially.
    setFaviconHref(getFaviconPath(matcher.matches))
    // Change favicon if the color scheme changes.
    matcher.onchange = () => setFaviconHref(getFaviconPath(matcher.matches))
  }, [faviconHref])

  return (
    <Head>
      <meta charSet="utf-8" />
      <meta
        name="viewport"
        content="width=device-width,initial-scale=1.0"
      />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="description" content={description || "Numan Ibn Mazid's Portfolio Web Application"} />
      <title>{title + (suffix ? ` - ${suffix}` : "") + "| nim23.com"}</title>
      <meta name="theme-color" content="#000" />
      <link rel="shortcut icon" href={faviconHref} sizes="any" />
      <link rel="manifest" href="/manifest.json" />
      <link rel="apple-touch-icon" href="/icons/icon-192x192.png"></link>
      <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
      <meta name="author" content="Numan Ibn Mazid"></meta>
      <meta name="robots" content="index,follow" />
      <meta
        name="keywords"
        content={`${keywords || ""}, Numan, Numan Ibn Mazid, numanibnmazid, nmn, nim23, nim23.com, numan blog, blog application, portfolio application, portfolio template, programming blog, web development blog, web development, web development portfolio, web development portfolio template, portfolio application, portfolio website, portfolio website template, Noman, Noman Ibne Mojid, Noman Blog, Numan Ibne Mojid, Noman Ibne Mazid, Numan Ibne Mazid, Numan Ibn Majid, Mazid Blog, Mazid Portfolio`}
      />

      {/* Og */}
      <meta property="og:title" content={`${title || ""} + "| nim23.com"`} />
      <meta property="og:description" content={description || "Numan Ibn Mazid's Portfolio Application"} />
      <meta property="og:site_name" content="Numan Ibn Mazid's Portfolio" />
      <meta property="og:url" content={currentURL} key="ogurl" />
      <meta property="og:image" content={previewImage || ""} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content="@NumanIbnMazid" />
      <meta name="twitter:title" content={`${title || "" + "| nim23.com"}`} />
      <meta name="twitter:description" content={description || "Numan Ibn Mazid's Portfolio Application"} />
      <meta name="twitter:image" content={previewImage || ""} />
      <meta name="twitter:image:alt" content={title || "nim23.com"}></meta>
      <meta name="twitter:domain" content={currentURL} />
    </Head>
  )
}
