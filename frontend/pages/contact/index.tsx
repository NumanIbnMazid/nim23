import { motion } from 'framer-motion'
import AnimatedText from '@components/FramerMotion/AnimatedText'
import AnimatedDiv from '@components/FramerMotion/AnimatedDiv'
import AnimatedHeading from '@components/FramerMotion/AnimatedHeading'
import React from 'react'
import { opacityVariant, popUpFromBottomForText, FadeContainer } from '@content/FramerMotionVariants'
import ContactForm from './ContactForm'
import Metadata from '@components/MetaData'
import pageMeta from '@content/meta'

export default function ContactSection() {
  return (
    <>
      <Metadata
        title="Contact"
        description={pageMeta.contact.description}
        previewImage={pageMeta.contact.image}
        keywords={pageMeta.contact.keywords}
      />
      <div className="dark:bg-darkPrimary dark:text-gray-100">
        <motion.section
          initial="hidden"
          whileInView="visible"
          variants={FadeContainer}
          viewport={{ once: true }}
          className="pageTop"
        >
          <section className="">
            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={FadeContainer}
              viewport={{ once: true }}
              className="mb-10 mt-4 px-7 py-4 transform rounded-lg border-gray-300 sm:justify-start bg-white dark:bg-darkSecondary dark:border-neutral-700"
            >
              <AnimatedDiv variants={opacityVariant} className="max-w-full prose dark:prose-invert">
                <div id="contact" className="bg-darkWhitePrimary dark:bg-darkPrimary !relative">
                  {/* Get in touch top section */}
                  <section className="pt-6 text-center w-full-width dark:bg-darkPrimary dark:text-white">
                    <AnimatedHeading variants={popUpFromBottomForText} className="text-4xl font-bold">
                      Get in touch
                    </AnimatedHeading>

                    <AnimatedText
                      variants={popUpFromBottomForText}
                      className="px-4 py-2 font-medium dark:text-gray-300"
                    >
                      Do you have something on your mind that you'd like to discuss? Whether it's work-related or
                      simply a casual conversation, I'm here and eager to lend an ear. Please don't hesitate to get in
                      touch with me at any time. 🌟 I'm always ready for engaging discussions and open to connecting
                      with you. Let's start a conversation and explore new ideas together. 🗣️
                    </AnimatedText>
                  </section>

                  {/* Wrapper Container */}
                  <section className="flex flex-col w-full px-5 mx-auto lg:flex-row dark:bg-darkPrimary dark:text-white lg:pb-10">
                    {/* Left Contact form section */}
                    <div className="w-full mx-auto mt-10">
                      <AnimatedHeading
                        variants={popUpFromBottomForText}
                        className="w-full my-2 text-2xl font-bold text-center"
                      >
                        Connect with me
                      </AnimatedHeading>

                      <ContactForm />
                    </div>
                  </section>
                </div>
              </AnimatedDiv>
            </motion.div>
          </section>
        </motion.section>
      </div>
    </>
  )
}
