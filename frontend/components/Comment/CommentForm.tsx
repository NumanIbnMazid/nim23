import React from 'react'
import { ToastContainer, toast } from 'react-toastify'
import { useDarkMode } from '@context/darkModeContext'
import emailjs from '@emailjs/browser'
import { motion } from 'framer-motion'
import { FadeContainer, mobileNavItemSideways } from '@content/FramerMotionVariants'
import Ripples from 'react-ripples'
import { useRef } from 'react'
import { CommentInput } from '@lib/types'
import { addBlogComment } from '@lib/backendAPI'

export default function CommentForm({ slug }: { slug: string }) {
  const { isDarkMode } = useDarkMode()
  const sendButtonRef = useRef<HTMLButtonElement>(null!)
  const formRef = useRef<HTMLFormElement>(null!)

  const FailToastId = 'failed'

  async function addComment(e: React.SyntheticEvent) {
    e.preventDefault()

    const target = e.target as typeof e.target & {
      name: { value: string }
      email: { value: string }
      comment: { value: string }
    }

    const BLOG_ENDPOINT = 'https://nim23.com' + '/blogs/' + slug

    const commentData = {
      name: target.name.value.trim(),
      email: target.email.value.trim(),
      comment: target.comment.value.trim(),
      blogURL: BLOG_ENDPOINT,
    }

    if (!validateForm(commentData) && !toast.isActive(FailToastId))
      return toast.error('Looks like you have not filled the form properly!', {
        toastId: FailToastId,
      })

    // Making submit button disable
    sendButtonRef.current.setAttribute('disabled', 'true')

    // Creating a loading toast
    const toastId = toast.loading('Processing ⌛')

    await addBlogComment(commentData.name, commentData.email, commentData.comment, slug)
      .then(() => {
        formRef.current.reset()
        toast.update(toastId, {
          render: 'Thanks for your valuable comment! Your comment will be visible after admin approval.',
          type: 'success',
          isLoading: false,
          autoClose: false,
        })
        sendButtonRef.current.removeAttribute('disabled')

        // Send email to admin
        emailjs
          .send(
            process.env.EMAIL_JS_SERVICE_ID!,
            process.env.EMAIL_JS_BLOG_COMMENT_TEMPLATE_ID!,
            commentData!,
            process.env.EMAIL_JS_PUBLIC_KEY
          )
      })
      .catch((err) => {
        toast.update(toastId, {
          render: '😢 ' + err.text,
          type: 'error',
          isLoading: false,
          autoClose: false,
        })
        sendButtonRef.current.removeAttribute('disabled')
      })
  }

  function validateForm(data: CommentInput): boolean {
    for (const key in data) {
      if (data[key as keyof CommentInput] === '') return false
    }
    return true
  }

  return (
    <>
      <motion.form
        ref={formRef}
        initial="hidden"
        whileInView="visible"
        variants={FadeContainer}
        viewport={{ once: true }}
        className="flex flex-col items-center w-full max-w-xl mx-auto dark:text-gray-300"
        onSubmit={addComment}
      >
        <motion.div variants={mobileNavItemSideways} className="relative z-0 w-full mb-6 group">
          <input
            type="text"
            name="name"
            id="floating_name"
            className="block w-full px-0 py-2 mt-2 text-sm bg-transparent border-0 border-b-2 appearance-none text-white-900 border-slate-500 dark:text-white dark:border-gray-400 dark:focus:border-white focus:outline-none focus:ring-0 focus:border-black peer"
            placeholder=" "
            required
          />
          <label
            htmlFor="floating_name"
            className="peer-focus:font-medium absolute text-sm text-slate-600 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-black dark:peer-focus:text-white peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Name
          </label>
        </motion.div>

        <motion.div variants={mobileNavItemSideways} className="relative z-0 w-full mb-6 group">
          <input
            type="email"
            name="email"
            id="floating_email"
            className="block w-full px-0 py-2 mt-2 text-sm text-gray-900 bg-transparent border-0 border-b-2 appearance-none border-slate-500 dark:text-white dark:border-gray-400 focus:outline-none focus:ring-0 focus:dark:border-white focus:border-black peer"
            placeholder=" "
            required
          />
          <label
            htmlFor="floating_email"
            className="peer-focus:font-medium absolute text-sm text-slate-600 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-black dark:peer-focus:text-white peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Email address
          </label>
        </motion.div>

        <motion.div variants={mobileNavItemSideways} className="relative z-0 w-full mb-6 group">
          <textarea
            name="comment"
            id="floating_comment"
            className="block py-2 mt-2 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-slate-500 appearance-none dark:text-white dark:border-gray-400 dark:focus:border-white focus:outline-none focus:ring-0  peer min-h-[100px] resize-y focus:border-black"
            placeholder=" "
            required
          />
          <label
            htmlFor="floating_comment"
            className="peer-focus:font-medium absolute text-sm text-slate-600 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-black dark:peer-focus:text-white peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Comment
          </label>
        </motion.div>

        <motion.div
          variants={mobileNavItemSideways}
          className="w-full overflow-hidden rounded-lg shadow-lg sm:max-w-sm"
        >
          <Ripples className="flex justify-center w-full" color="rgba(225, 225,225,0.2)">
            <button
              ref={sendButtonRef}
              type="submit"
              className="relative w-full px-4 py-3 overflow-hidden text-sm font-medium text-center text-white transition duration-300 rounded-lg outline-none bg-neutral-800 dark:bg-darkSecondary active:scale-95 disabled:opacity-50 disabled:active:scale-100"
            >
              Add Comment
            </button>
          </Ripples>
        </motion.div>
      </motion.form>
      <ToastContainer closeButton={true} theme={isDarkMode ? 'dark' : 'light'} style={{ zIndex: 1000 }} />
    </>
  )
}
