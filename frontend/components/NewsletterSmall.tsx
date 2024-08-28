import { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AiOutlineSend } from 'react-icons/ai'
import { useDarkMode } from '@context/darkModeContext'


export default function Newsletter() {
  const { isDarkMode } = useDarkMode()
  const [email, setEmail] = useState('')

  const subscribeToNewsLetter = async (email: string) => {
    try {
      const response = await fetch(`/api/newsletter-subscribe?email=${encodeURIComponent(email)}`)

      if (!response.ok) {
        toast.error("Failed to subscribe nim23's newsletter!")
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      toast.success("You have successfully subscribed to nim23's newsletter!")
    } catch (error) {
      // Handle errors
      console.error('Fetch error:', error)
    }
  }

  async function subscribeNewsLetter(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    try {
      await subscribeToNewsLetter(email)
    } catch (error) {
      toast.error('Something went wrong. Please try again later.')
    }
    setEmail('')
  }

  return (
    <>
      <div>
        <h3 className="my-0 text-sm tracking-wider uppercase font-bold">Newsletter</h3>
        <p className="mt-4 text-base ">
          Subscribe to nim23's Newsletter for professional insights, industry trends, and valuable tips. Join now (Spam Free)!
        </p>
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

      <ToastContainer theme={isDarkMode ? 'dark' : 'light'} style={{ zIndex: 1000 }} autoClose={5000} />
    </>
  )
}
