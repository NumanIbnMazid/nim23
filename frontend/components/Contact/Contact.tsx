import React from "react";
import "react-toastify/dist/ReactToastify.css";
import { popUpFromBottomForText } from "../../content/FramerMotionVariants";
import AnimatedText from "../FramerMotion/AnimatedText";
import AnimatedHeading from "../FramerMotion/AnimatedHeading";
import ContactForm from "./ContactForm";

export default function Contact() {
  return (
    <div id="contact" className="dark:bg-darkPrimary !relative">
      {/* Get in touch top section */}
      <section className="pt-6 text-center w-full-width dark:bg-darkPrimary dark:text-white">
        <AnimatedHeading
          variants={popUpFromBottomForText}
          className="text-4xl font-bold"
        >
          Get in touch
        </AnimatedHeading>

        <AnimatedText
          variants={popUpFromBottomForText}
          className="px-4 py-2 font-medium dark:text-gray-300"
        >
          Do you have something on your mind that you'd like to discuss? Whether it's work-related or simply a casual conversation, I'm here and eager to lend an ear.
          Please don't hesitate to get in touch with me at any time. 🌟 I'm always ready for engaging discussions and open to connecting with you.
          Let's start a conversation and explore new ideas together. 🗣️
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
  );
}
