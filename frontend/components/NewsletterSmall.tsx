import { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import { AiOutlineSend } from 'react-icons/ai'
import { useDarkMode } from '@context/darkModeContext'
import { subscribeToNewsletter } from '@lib/backendAPI'

export default function Newsletter() {
  const { isDarkMode } = useDarkMode()
  const [email, setEmail] = useState('')

  async function subscribeNewsLetter(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    try {
      toast.info('Please wait ...')

      const newsLetterSubscriptionResponse = await subscribeToNewsletter(email)

      // Dismiss the previous toast
      toast.dismiss()

      if (newsLetterSubscriptionResponse.success === false) {
        toast.error(newsLetterSubscriptionResponse.error.error_details)
      } else if (newsLetterSubscriptionResponse.success === true) {
        toast.success(newsLetterSubscriptionResponse.message)
      } else {
        toast.error('Something went wrong. Please try again later.')
      }
    } catch (error) {
    }
    setEmail('')
  }

  return (
    <>
      <div>
        <h3 className="my-0 text-sm tracking-wider uppercase font-bold">Newsletter</h3>
        <p className="mt-4 text-base ">Get new articles delivered to your inbox (Spam Free)!</p>
        <form className="relative flex my-4 space-y-0" onSubmit={subscribeNewsLetter}>
          <label htmlFor="email-address" className="sr-only">
            Email address
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            <input
              className="px-4 py-2.5 rounded-lg text-lg bg-gray-200 dark:bg-darkSecondary outline-none border-0 w-auto placeholder:text-gray-700 dark:placeholder:text-gray-500 dark:text-gray-300"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john.doe@email.com"
              required={true}
            />
            <button
              type="submit"
              className="w-36 px-4 py-2 m-[3px] bg-white dark:text-white dark:bg-neutral-600/40 rounded-md font-medium font-inter transform duration-200 active:scale-90 select-none"
            >
              <div className="relative flex items-center gap-2 !my-0">
                <AiOutlineSend className="text-xl" />
                <p className="">Subscribe</p>
              </div>
            </button>
          </div>
        </form>
      </div>

      <ToastContainer theme={isDarkMode ? 'dark' : 'light'} style={{ zIndex: 1000 }} autoClose={6000} />
    </>
  )
}
