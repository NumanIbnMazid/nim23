import { FadeContainer } from "../content/FramerMotionVariants"
import { HomeHeading } from "../pages"
import { motion } from "framer-motion"
import React from "react"
import { useEffect, useState } from 'react'
import { getAllCertificates } from "@lib/backendAPI"
import AnimatedDiv from "@components/FramerMotion/AnimatedDiv"
import Image from "next/image"
import { popUpFromBottomForText } from "@content/FramerMotionVariants"
import Link from "next/link"
import { getFormattedDate } from "@utils/date"
import { CertificateType } from "@lib/types"


export default function CertificateSection() {
  const [certificates, setCertificates] = useState([])

  useEffect(() => {
    fetchCertificates()
  }, [])

  const fetchCertificates = async () => {
    const certificatesData = await getAllCertificates()
    setCertificates(certificatesData)
  }

  // ******* Loader Starts *******
  if (certificates.length === 0) {
    return <div>Loading...</div>
  }
  // ******* Loader Ends *******

  return (
    <section className="mx-5">
      <HomeHeading title="Certificates" />

      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={FadeContainer}
        viewport={{ once: true }}
        className="grid grid-cols-1 mb-10"
      >
        <div className="mt-12 space-y-6">
          <p>Here are some certificates that I have obtained.</p>
          {certificates.map((cer: CertificateType) => {
            return (
              <AnimatedDiv
                className="flex flex-col gap-2 p-3 bg-white rounded-lg shadow md:flex-row md:items-center md:justify-between md:gap-4 dark:bg-darkSecondary/50"
                variants={popUpFromBottomForText}
                key={cer.id}
              >
                <div className="flex items-center gap-3">
                  <div className="relative flex items-center justify-center">
                    <Image
                      width={40}
                      height={40}
                      src={cer.orgLogo}
                      alt={cer.orgName}
                      quality={50}
                      placeholder="blur"
                      blurDataURL={cer.orgLogo}
                      style={{
                        objectFit: "contain",
                      }}
                    />
                  </div>
                  <div className="flex flex-col ">
                    <Link
                      href={cer.url}
                      className="text-sm font-semibold hover:underline sm:text-base md:text-lg text-neutral-900 dark:text-neutral-200"
                    >
                      {cer.title}
                    </Link>
                    <p className="text-xs text-gray-500">
                      {cer.orgName} &#x2022;{" "}
                      {getFormattedDate(new Date(cer.issuedDate))}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-500"></p>
              </AnimatedDiv>
            )
          })}
        </div>
      </motion.div>
    </section>
  )
}
