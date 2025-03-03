import Link from 'next/link'
import socialMedia from '@/content/socialMedia'
import { FadeContainer, opacityVariant, popUp } from '@/content/FramerMotionVariants'
import { navigationRoutes } from '@/utils/utils'
import { motion } from 'framer-motion'
import useSWR from 'swr'
import fetcher from '@/lib/fetcher'
import { HiOutlineQrcode } from 'react-icons/hi'
import { BsDot } from 'react-icons/bs'
import NewsletterSmall from './NewsletterSmall'
import { useDarkMode } from '@/context/darkModeContext'
import { GOOGLE_ANALYTICS_API_ROUTE } from '@/lib/apiRouteMaps'

export default function Footer({ setShowQR, showQR }: { setShowQR: (value: boolean) => void; showQR: boolean }) {
  const { data: visitors } = useSWR(GOOGLE_ANALYTICS_API_ROUTE, fetcher)
  const { isDarkMode } = useDarkMode()

  const footerClass = isDarkMode ? 'footer-with-rays-dark' : 'footer-with-rays'

  return (
    <footer
      className={`w-screen text-gray-600 dark:text-gray-400 font-inter mb-14 print:hidden relative z-10 ${footerClass}`}
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={FadeContainer}
        viewport={{ once: true }}
        className="flex flex-col max-w-4xl gap-5 p-5 mx-auto text-sm border-t-2 border-gray-200 2xl:max-w-5xl 3xl:max-w-7xl dark:border-gray-400/10 sm:text-base"
      >
        <section className="grid grid-cols-3 md:grid-cols-6 gap-10">
          {/* 1st 5 navigation routes */}
          <div className="flex flex-col gap-4 capitalize">
            {navigationRoutes.slice(0, 5).map((text, index) => {
              return <FooterLink key={index} route={text} text={text} />
            })}
          </div>
          {/* Last navigation routes */}
          <div className="flex flex-col gap-4 capitalize">
            {navigationRoutes.slice(5, navigationRoutes.length).map((route, index) => {
              let text = route
              if (route === 'rss') text = 'RSS'
              return <FooterLink key={index} route={route} text={text} />
            })}
            {/* Submit Issue in Github */}
            <Link
              href="https://github.com/NumanIbnMazid/nim23-issues/issues"
              target="_blank"
              rel="noopener noreferrer"
            >
              <motion.p className="hover:text-black dark:hover:text-white w-fit" variants={popUp}>
                Report an issue
              </motion.p>
            </Link>
          </div>
          {/* Social Media */}
          <div className="flex flex-col gap-4 capitalize">
            {socialMedia.slice(0, 5).map((platform, index) => {
              return (
                <Link key={index} href={platform.url} target="_blank" rel="noopener noreferrer">
                  <motion.p className="hover:text-black dark:hover:text-white w-fit" variants={popUp}>
                    {platform.title}
                  </motion.p>
                </Link>
              )
            })}
          </div>

          {/* Newsletter */}
          <motion.div variants={opacityVariant} className="col-span-3">
            <NewsletterSmall />
          </motion.div>
        </section>

        <motion.div variants={opacityVariant} className="flex items-center justify-between w-full gap-4 mt-5 ">
          {/* Visitors Count */}
          <div className="relative flex items-center px-4 py-1 text-xs bg-white rounded-full shadow dark:bg-darkSecondary sm:text-sm">
            <BsDot className="-ml-2 text-green-500 w-7 h-7 animate-ping" />
            <div className="flex items-center gap-1">
              {visitors?.totalVisitors ?? (
                <div className="w-10 h-3 bg-gray-300 rounded-full dark:bg-darkPrimary animate-pulse"></div>
              )}{' '}
              visitors in last {visitors?.days} days
            </div>
          </div>
          {/* QRCode Scanner */}
          <div
            onClick={() => setShowQR(!showQR)}
            className="p-3 text-white transition-all bg-gray-700 rounded-full cursor-pointer active:scale-90 hover:scale-105"
          >
            <HiOutlineQrcode className="w-5 h-5 " />
          </div>
        </motion.div>

        {/* Copyright & Developed By */}
        <motion.div variants={opacityVariant} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
          <div>
            <p className="order-1 text-base">&copy; {new Date().getFullYear()} Numan Ibn Mazid</p>
          </div>
          <div className="text-start md:text-right">
            <span>Developed by </span>
            <Link
              target="_blank"
              aria-label="Next.js"
              rel="noreferrer"
              href="https://www.linkedin.com/in/numanibnmazid/"
              className="font-semibold hover:underline"
            >
              Numan Ibn Mazid
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  )
}

function FooterLink({ route, text }: { route: string; text: string }) {
  return (
    <Link href={route === 'home' ? '/' : `/${route}`}>
      <motion.p className="hover:text-black dark:hover:text-white w-fit" variants={popUp}>
        {text}
      </motion.p>
    </Link>
  )
}
