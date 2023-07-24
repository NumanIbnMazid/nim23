import { FadeContainer } from '../content/FramerMotionVariants'
import { HomeHeading } from '../pages'
import { motion } from 'framer-motion'
import React from 'react'
import AnimatedDiv from '@components/FramerMotion/AnimatedDiv'
import Image from 'next/image'
import { popUpFromBottomForText } from '@content/FramerMotionVariants'
import Link from 'next/link'
import { CertificateType, MediaType } from '@lib/types'
import MediaModal from '@components/Modals/MediaModal'

export default function CertificateSection({
  certificates,
  showHomeHeading = true
}: {
  certificates: CertificateType[]
  showHomeHeading?: boolean
}) {
  return (
    <section className="mx-5">
      {showHomeHeading && <HomeHeading title="Certificates" />}

      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={FadeContainer}
        viewport={{ once: true }}
        className="grid grid-cols-1 mb-10"
      >
        <div className="mt-12 space-y-6">
          <p className="mb-12">
            Here, I will showcase the certifications and professional achievements I have earned throughout my career.
            Each certificate I have obtained represents a milestone in my journey and demonstrates my commitment to
            excellence.
          </p>
          {certificates.map((certificate: CertificateType) => {
            return (
              <AnimatedDiv
                className="bg-white rounded-lg shadow dark:bg-darkSecondary/50 grid md:grid-cols-12"
                variants={popUpFromBottomForText}
                key={certificate.id}
              >
                <div className="relative flex items-center justify-center md:col-span-1 px-4">
                  <Image
                    width={50}
                    height={50}
                    src={certificate.image}
                    alt={certificate.organization}
                    quality={50}
                    placeholder="blur"
                    blurDataURL={certificate.image}
                    style={{
                      objectFit: 'contain',
                    }}
                  />
                </div>
                <div className="md:col-span-11 p-4">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between md:gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        {certificate.credential_url ? (
                          <Link
                            href={certificate.credential_url}
                            target="_blank"
                            className="text-sm font-semibold hover:underline sm:text-base md:text-lg text-neutral-900 dark:text-neutral-200"
                          >
                            {certificate.title}
                          </Link>
                        ) : (
                          <p className="text-sm font-semibold sm:text-base md:text-lg text-neutral-900 dark:text-neutral-200">
                            {certificate.title}
                          </p>
                        )}

                        <p className="text-xs text-gray-500 mt-2">
                          <span>&#x2022; Organization: {certificate.organization}</span>
                          {certificate.address ? <span>, {certificate.address}</span> : null}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="gap-2">
                    <div className="flex flex-col text-xs text-gray-500">
                      <span>&#x2022; Issue Date: {certificate.issue_date}</span>
                      <span>&#x2022; Expiration Date: {certificate.expiration_date}</span>
                      {certificate.credential_id ? (
                        <span>&#x2022; Credential ID: {certificate.credential_id}</span>
                      ) : null}

                      {/* Certification Media */}
                      {certificate.certification_media?.length ? (
                        // Here there will be a list of media. bullet points. There will be a button. After clicking the button new modal will open with the list of media.
                        <div className="mt-4">
                          <div className="mt-4">
                            <h2 className="font-bold">Attachments</h2>

                            {certificate.certification_media.map((media: MediaType, mediaIndex) => (
                              <div key={mediaIndex} className="my-4">
                                <MediaModal
                                  key={mediaIndex}
                                  title={media.title}
                                  file={media.file}
                                  description={media.description}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </AnimatedDiv>
            )
          })}
        </div>
      </motion.div>
    </section>
  )
}
