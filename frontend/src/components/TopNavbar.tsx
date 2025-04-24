'use client'

import React, { useEffect, useState, useRef, useCallback } from 'react'
import { usePathname } from 'next/navigation' // ✅ Use App Router hook
import Link from 'next/link'
import { motion, useAnimation, AnimatePresence } from 'framer-motion'
import { FadeContainer, hamFastFadeContainer, mobileNavItemSideways, popUp } from '../content/FramerMotionVariants'
import { useDarkMode } from '@/context/darkModeContext'
import { namedNavigationRoutesAll } from '@/utils/utils'
import Logo from './SVG/Logo'
import { DarkModeSwitch } from 'react-toggle-dark-mode'

export default function TopNavbar() {
  const navRef = useRef<HTMLDivElement | null>(null)
  const control = useAnimation()
  const [navOpen, setNavOpen] = useState(false)
  const { isDarkMode, changeDarkMode } = useDarkMode()
  const pathname = usePathname() // ✅ Correctly detects current route

  const addShadowToNavbar = useCallback(() => {
    if (!navRef.current) return

    if (window.pageYOffset > 10) {
      navRef.current.classList.add('shadow', 'backdrop-blur-xl', 'bg-white/70', 'dark:bg-darkFourth')
      control.start('visible')
    } else {
      navRef.current.classList.remove('shadow', 'backdrop-blur-xl', 'bg-white/70', 'dark:bg-darkFourth')
      control.start('hidden')
    }
  }, [control])

  useEffect(() => {
    window.addEventListener('scroll', addShadowToNavbar)
    return () => window.removeEventListener('scroll', addShadowToNavbar)
  }, [addShadowToNavbar])

  function lockScroll() {
    document.getElementsByTagName('html')[0].classList.toggle('lock-scroll')
  }

  function handleClick() {
    lockScroll()
    setNavOpen(!navOpen)
  }

  return (
    <div
      ref={navRef}
      className="fixed w-full dark:text-white top-0 flex items-center justify-between px-4 py-[10px] sm:px-6 z-50 print:hidden backdrop-filter backdrop-blur-lg transition-colors duration-500"
    >
      <HamBurger open={navOpen} handleClick={handleClick} />
      <AnimatePresence>{navOpen && <MobileMenu handleClick={handleClick} />}</AnimatePresence>

      <Link href="/" className="mr-3" aria-label="Link to Home Page" prefetch={true}>
        <Logo className="relative hidden w-8 h-8 sm:inline-flex" />
      </Link>

      <motion.nav className="z-10 hidden sm:flex md:inset-0 md:justify-center">
        <motion.div initial="hidden" animate="visible" variants={FadeContainer} className="flex items-center md:gap-2">
          <div>
            {Object.entries(namedNavigationRoutesAll)
              .slice(0, 9)
              .map(([route, text], index) => (
                <NavItem key={index} href={`/${route}`} text={text} pathname={pathname ?? ''} />
              ))}
            {/* Hardcoded Apps Link */}
            <NavItem href={`${process.env.NIM23_APPS_SITE_URL}`} text="Apps" pathname="" target="_blank" />
          </div>
        </motion.div>
      </motion.nav>

      <motion.div initial="hidden" animate="visible" variants={popUp} className="cursor-pointer" title="Toggle Theme">
        <DarkModeSwitch checked={isDarkMode} onChange={changeDarkMode} size={24} />
      </motion.div>
    </div>
  )
}

function NavItem({ href, text, pathname, target }: { href: string; text: string; pathname: string; target?: string }) {
  const isActive = pathname === (href === '/home' ? '/' : href) || pathname.startsWith(href)

  return (
    <Link href={href === '/home' ? '/' : href} prefetch={true} target={target} rel="noopener noreferrer">
      <motion.p
        className={`${
          isActive ? 'font-bold text-teal-700 dark:text-teal-400' : 'text-gray-600 dark:text-gray-300'
        } sm:inline-block transition-all text-[17px] hidden px-2 md:px-3 py-[3px] hover:bg-black/10 dark:hover:bg-neutral-700/50 rounded-md`}
        variants={popUp}
      >
        {text}
      </motion.p>
    </Link>
  )
}

// Hamburger Button
function HamBurger({ open, handleClick }: { open: boolean; handleClick: () => void }) {
  return (
    <motion.div style={{ zIndex: 1000 }} initial="hidden" animate="visible" variants={popUp} className="sm:hidden">
      {!open ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 duration-300 transform rounded-md cursor-pointer select-none active:scale-50"
          onClick={handleClick}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 duration-300 transform rounded-md cursor-pointer select-none active:scale-50"
          onClick={handleClick}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      )}
    </motion.div>
  )
}

// Mobile navigation menu
const MobileMenu = ({ handleClick }: { handleClick: () => void }) => {
  return (
    <motion.div
      className="absolute top-0 left-0 z-10 w-screen h-screen font-normal bg-white dark:bg-darkPrimary sm:hidden"
      variants={hamFastFadeContainer}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <motion.nav className="flex flex-col mx-8 mt-28">
        {Object.entries(namedNavigationRoutesAll)
          .slice(0, 9)
          .map(([route, text]) => {
            const navlink = route.toLowerCase() === 'home' ? '/' : `/${route}`
            return (
              <Link
                key={route}
                href={navlink}
                onClick={handleClick}
                className="flex w-auto py-4 text-base font-semibold text-gray-900 capitalize border-b border-gray-300 cursor-pointer dark:border-gray-700 dark:text-gray-100"
              >
                <motion.p variants={mobileNavItemSideways}>{text === 'rss' ? text.toUpperCase() : text}</motion.p>
              </Link>
            )
          })}{' '}
        {/* Hardcoded Portfolio Link */}
        <Link
          href={`${process.env.NIM23_APPS_SITE_URL}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          className="flex w-auto py-4 text-base font-semibold text-gray-900 capitalize border-b border-gray-300 cursor-pointer dark:border-gray-700 dark:text-gray-100"
        >
          <motion.p variants={mobileNavItemSideways}>Apps</motion.p>
        </Link>
      </motion.nav>
    </motion.div>
  )
}
