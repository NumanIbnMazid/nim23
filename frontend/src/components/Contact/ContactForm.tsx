import React, { useRef, useState } from 'react'
import emailjs from '@emailjs/browser'
import { motion } from 'framer-motion'
import { FadeContainer, mobileNavItemSideways } from '@/content/FramerMotionVariants'
import Ripples from 'react-ripples'
import { toast } from 'sonner' // ✅ Replaced Toastify with Sonner
import { FormInput } from '@/lib/types'

export default function Form() {
  const sendButtonRef = useRef<HTMLButtonElement>(null!)
  const formRef = useRef<HTMLFormElement>(null!)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function sendEmail(e: React.SyntheticEvent) {
    e.preventDefault()

    if (isSubmitting) return
    setIsSubmitting(true)

    const target = e.target as typeof e.target & {
      first_name: { value: string }
      last_name: { value: string }
      email: { value: string }
      subject: { value: string }
      message: { value: string }
    }

    const emailData = {
      to_name: 'Numan Ibn Mazid',
      first_name: target.first_name.value.trim(),
      last_name: target.last_name.value.trim(),
      email: target.email.value.trim(),
      subject: target.subject.value.trim(),
      message: target.message.value.trim(),
    }

    if (!validateForm(emailData)) {
      setIsSubmitting(false)
      return toast.error('⚠️ Please fill in all fields!')
    }

    sendButtonRef.current?.setAttribute('disabled', 'true')

    const toastId = toast.loading('📨 Sending message...')

    try {
      await emailjs.send(
        process.env.EMAIL_JS_SERVICE_ID!,
        process.env.EMAIL_JS_TEMPLATE_ID!,
        emailData!,
        process.env.EMAIL_JS_PUBLIC_KEY!
      )

      formRef.current?.reset()
      toast.success('✅ Message Sent!', { id: toastId })
      sendButtonRef.current?.removeAttribute('disabled')
      setIsSubmitting(false)
    } catch (err) {
      toast.error('❌ Failed to send. Try again!', { id: toastId })
      sendButtonRef.current?.removeAttribute('disabled')
      setIsSubmitting(false)
    }
  }

  function validateForm(data: FormInput): boolean {
    return Object.values(data).every((value) => value.trim() !== '')
  }

  return (
    <>
      <motion.form
        ref={formRef}
        initial="hidden"
        whileInView="visible"
        variants={FadeContainer}
        viewport={{ once: true }}
        className="flex flex-col items-center w-full max-w-xl mx-auto my-10 dark:text-gray-300"
        onSubmit={sendEmail}
      >
        {/* First Name & Last Name */}
        <div className="grid w-full grid-cols-2 gap-6">
          <motion.div variants={mobileNavItemSideways} className="relative z-0 w-full mb-6 group">
            <input
              type="text"
              name="first_name"
              id="floating_first_name"
              className="block w-full px-0 py-2 mt-2 text-sm bg-transparent border-0 border-b-2 text-white-900 border-slate-500 dark:text-white dark:border-gray-400 focus:border-black peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="floating_first_name"
              className="absolute text-sm text-slate-600 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              First name
            </label>
          </motion.div>

          <motion.div variants={mobileNavItemSideways} className="relative z-0 w-full mb-6 group">
            <input
              type="text"
              name="last_name"
              id="floating_last_name"
              className="block w-full px-0 py-2 mt-2 text-sm bg-transparent border-0 border-b-2 text-white-900 border-slate-500 dark:text-white dark:border-gray-400 focus:border-black peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="floating_last_name"
              className="absolute text-sm text-slate-600 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Last name
            </label>
          </motion.div>
        </div>

        <motion.div variants={mobileNavItemSideways} className="relative z-0 w-full mb-6 group">
          <input
            type="email"
            name="email"
            id="floating_email"
            className="block w-full px-0 py-2 mt-2 text-sm bg-transparent border-0 border-b-2 text-white-900 border-slate-500 dark:text-white dark:border-gray-400 focus:border-black peer"
            placeholder=" "
            required
          />
          <label
            htmlFor="floating_email"
            className="absolute text-sm text-slate-600 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Email address
          </label>
        </motion.div>

        <motion.div variants={mobileNavItemSideways} className="relative z-0 w-full mb-6 group">
          <input
            type="text"
            name="subject"
            id="floating_subject"
            className="block w-full px-0 py-2 mt-2 text-sm bg-transparent border-0 border-b-2 text-white-900 border-slate-500 dark:text-white dark:border-gray-400 focus:border-black peer"
            placeholder=" "
            required
          />
          <label
            htmlFor="floating_subject"
            className="absolute text-sm text-slate-600 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Subject
          </label>
        </motion.div>

        <motion.div variants={mobileNavItemSideways} className="relative z-0 w-full mb-6 group">
          <textarea
            name="message"
            id="floating_message"
            className="block py-2 mt-2 px-0 w-full text-sm bg-transparent border-0 border-b-2 text-white-900 border-slate-500 dark:text-white dark:border-gray-400 focus:border-black peer min-h-[100px] resize-y"
            placeholder=" "
            required
          />
          <label
            htmlFor="floating_message"
            className="absolute text-sm text-slate-600 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Message
          </label>
        </motion.div>

        <motion.div
          variants={mobileNavItemSideways}
          className="w-full overflow-hidden rounded-lg shadow-lg sm:max-w-sm"
        >
          <Ripples className="flex justify-center w-full" color="rgba(225,225,225,0.2)">
            <button
              ref={sendButtonRef}
              type="submit"
              className="relative w-full px-4 py-3 text-sm font-medium text-center text-white transition duration-300 rounded-lg outline-none bg-neutral-800 dark:bg-darkSecondary active:scale-95 disabled:opacity-50 disabled:active:scale-100"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send'}
            </button>
          </Ripples>
        </motion.div>
      </motion.form>
    </>
  )
}
