import Link from 'next/link'
import { getPageMetadata, pageMeta } from '@/lib/Meta'
import type { Metadata } from 'next'
import { PUBLIC_SITE_URL } from '@/lib/constants'

// ✅ Generate metadata for 404 Not Found Page
export const metadata: Metadata = getPageMetadata({
  title: '404 - Page Not Found',
  description: 'Oops! The page you are looking for does not exist. You are lost in space!',
  image: pageMeta.about.image, // ✅ Optional image for better social previews
  keywords: '404, page not found, lost, missing page, error',
  url: `${PUBLIC_SITE_URL}/404`,
})

export default function NotFoundPage() {
  return (
    <section className="flex flex-col gap-5 pageTop md:pt-20">
      <h1 className="text-3xl font-bold uppercase font-barlow md:text-5xl dark:text-white">
        Stay calm and don't freak out!!
      </h1>
      <p className="text-gray-500 font-inter dark:text-gray-400/70">
        Looks like you've found the doorway to the great nothing. You didn't break the internet, but I can't find what
        you are looking for. Please visit <b>Homepage</b> to get where you need to go.
      </p>

      <Link
        href="/"
        className="p-3 w-full xs:max-w-[200px] xs:mx-0 sm:p-3 font-bold mx-auto bg-gray-300 dark:bg-darkSecondary text-center rounded-md text-black dark:text-white select-none active:scale-95 transition-all lg:hover:ring-2 ring-black/50 dark:ring-white/50"
      >
        Take me there!
      </Link>
    </section>
  )
}
