import React, { useState } from "react"
import TopNavbar from "../components/TopNavbar"
import ScrollToTopButton from "../components/ScrollToTopButton"
import Footer from "../components/Footer"
import QRCodeContainer from "@components/QRCodeContainer"
import Image from 'next/image'

export default function Layout({ children }: { children: React.ReactNode }) {
  const [showQR, setShowQR] = useState(false)
  return (
    <>
      <div className="antialiased text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900">

        {/* Background Styling Starts */}
        <div className="absolute z-20 top-0 inset-x-0 flex justify-center overflow-hidden pointer-events-none">
          <div className="w-[108rem] flex-none flex justify-end">
            <picture>
              <source srcSet="/public/images/background.avif" type="image/avif" />
              <Image
                src="/public/images/background-image.png"
                className="w-[71.75rem] flex-none max-w-none dark:hidden"
                width={933}
                height={933}
                alt="Background Image"
                quality={100}
                priority
                decoding="async"
                style={{ width: "auto", height: "auto" }}
              />
            </picture>
            <picture>
              <source srcSet="/public/images/dark-background.avif" type="image/avif" />
              <Image
                src="/public/images/dark-background-image.png"
                className="w-[90rem] flex-none max-w-none hidden dark:block"
                width={933}
                height={933}
                alt="Dark Background Image"
                quality={100}
                priority
                decoding="async"
                style={{ width: "auto", height: "auto" }}
              />
            </picture>
          </div>
        </div>
        {/* Background Styling Ends */}

        <TopNavbar />
        <main className="antialiased text-slate-500 dark:text-slate-400 bg-white dark:bg-darkFifth">{children}</main>
        <Footer setShowQR={setShowQR} showQR={showQR} />
        <ScrollToTopButton />
        <QRCodeContainer showQR={showQR} setShowQR={setShowQR} />
      </div>
    </>
  )
}
