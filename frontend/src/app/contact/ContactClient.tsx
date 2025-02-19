'use client'

import { motion } from 'framer-motion'
import AnimatedText from '@/components/FramerMotion/AnimatedText'
import AnimatedDiv from '@/components/FramerMotion/AnimatedDiv'
import AnimatedHeading from '@/components/FramerMotion/AnimatedHeading'
import { opacityVariant, popUpFromBottomForText, FadeContainer } from '@/content/FramerMotionVariants'
import ContactPageContactForm from '@/components/Contact/ContactPageContactForm'
import PageTop from '@/components/PageTop'

export default function ContactPageClient() {
  return (
    <>
      <div className="dark:bg-darkPrimary dark:text-gray-100 min-h-screen flex items-center justify-center">
        
        <motion.section
          initial="hidden"
          whileInView="visible"
          variants={FadeContainer}
          viewport={{ once: true }}
          className="pageTop w-full max-w-4xl mx-auto px-6"
        >
          <PageTop pageTitle="Contact"></PageTop>
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={FadeContainer}
            viewport={{ once: true }}
            className="mb-10 mt-4 px-7 py-4 transform rounded-lg border-gray-300 sm:justify-start bg-white dark:bg-darkSecondary dark:border-neutral-700"
          >
            <AnimatedDiv variants={opacityVariant} className="max-w-full prose dark:prose-invert">
              <div id="contact" className="bg-darkWhitePrimary dark:bg-darkPrimary !relative p-6">
                <section className="pt-6 text-center w-full-width dark:bg-darkPrimary dark:text-white">
                  <AnimatedHeading variants={popUpFromBottomForText} className="text-4xl font-bold">
                    Get in touch
                  </AnimatedHeading>
                  <AnimatedText variants={popUpFromBottomForText} className="px-4 py-2 font-medium dark:text-gray-300">
                    Do you have something on your mind that you'd like to discuss? Whether it's work-related or simply
                    a casual conversation, I'm here and eager to lend an ear. 🌟 Let's start a conversation.
                  </AnimatedText>
                </section>
                <section className="flex flex-col w-full px-5 mx-auto lg:flex-row dark:bg-darkPrimary dark:text-white lg:pb-10">
                  <div className="w-full mx-auto mt-10">
                    <AnimatedHeading
                      variants={popUpFromBottomForText}
                      className="w-full my-2 text-2xl font-bold text-center"
                    >
                      Connect with me
                    </AnimatedHeading>
                    <ContactPageContactForm />
                  </div>
                </section>
              </div>
            </AnimatedDiv>
          </motion.div>
        </motion.section>
      </div>
    </>
  )
}
