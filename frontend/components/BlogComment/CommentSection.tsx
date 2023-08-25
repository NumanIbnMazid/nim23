import React from 'react'
import 'react-toastify/dist/ReactToastify.css'
import { popUpFromBottomForText } from '../../content/FramerMotionVariants'
import AnimatedText from '../FramerMotion/AnimatedText'
import AnimatedHeading from '../FramerMotion/AnimatedHeading'
import CommentForm from './CommentForm'

export default function Comment({ slug, contentURL }: { slug: string; contentURL: string }) {
  return (
    <div id="comment" className="dark:bg-darkPrimary !relative">
      {/* Get in touch top section */}
      <section className="pt-6 text-center w-full-width dark:bg-darkPrimary dark:text-white">
        <AnimatedHeading variants={popUpFromBottomForText} className="text-4xl font-bold">
          Comment
        </AnimatedHeading>

        <AnimatedText variants={popUpFromBottomForText} className="px-4 py-2 font-medium dark:text-gray-300">
          Respectful and constructive dialogue is key to fostering a positive and enriching environment for everyone.
          We value your input and look forward to reading what you have to say. So go ahead, express yourself, and
          let's create an insightful and engaging discussion together!. 🗣️
          <br />
          <span className="text-sky-600">[N:B: Your email won't be published or shared]</span>
        </AnimatedText>
      </section>

      {/* Wrapper Container */}
      <section className="flex flex-col w-full px-5 mx-auto lg:flex-row dark:bg-darkPrimary dark:text-white lg:pb-10">
        {/* Left Comment form section */}
        <div className="w-full mx-auto">
          {/* <AnimatedHeading variants={popUpFromBottomForText} className="w-full my-2 text-2xl font-bold text-center">
            Add Comment
          </AnimatedHeading> */}

          <CommentForm slug={slug} contentURL={contentURL} />
        </div>
      </section>
    </div>
  )
}
