import { useState } from 'react'
import { toast } from 'sonner' // ✅ Using Sonner for notifications
import { AiOutlineSend } from 'react-icons/ai'
import { NEWSLETTER_SUBSRIPTION_API_ROUTE } from '@/lib/apiRouteMaps'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const subscribeToNewsletter = async (email: string) => {
    try {
      setIsSubmitting(true)

      const response = await fetch(NEWSLETTER_SUBSRIPTION_API_ROUTE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to subscribe')
      }

      toast.success(`✅ ${result.message}`)
    } catch (error) {
      toast.error(`❌ ${error instanceof Error ? error.message : 'Something went wrong'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function subscribeNewsletter(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    await subscribeToNewsletter(email)
    setEmail('')
  }

  return (
    <>
      <div className="flex flex-col w-full gap-4 p-4 my-10 bg-white rounded-lg font-barlow ring-2 ring-gray-400 dark:bg-black dark:border-neutral-600 print:hidden">
        <h2 className="text-2xl font-bold dark:text-white !my-0">Numan Ibn Mazid's Newsletter</h2>
        <p className="text-gray-600 dark:text-gray-300 font-medium !my-0">
          Subscribe to my Personal Blog Newsletter for professional insights, industry trends, and valuable tips. Stay
          updated and take your personal and professional growth to new heights. Join now (Spam Free)!
        </p>

        <form className="relative w-full" onSubmit={subscribeNewsletter}>
          <input
            className="px-4 py-2.5 rounded-lg text-lg bg-gray-200 dark:bg-darkSecondary outline-none border-0 w-full placeholder:text-gray-400 dark:placeholder:text-gray-600 dark:text-gray-300"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="enter your email address"
            required
            disabled={isSubmitting} // ✅ Disable input while submitting
          />

          <button
            className="absolute right-0 top-0 bottom-0 px-4 m-[3px] bg-white dark:text-white dark:bg-neutral-600/40 rounded-md font-medium font-inter transform duration-200 active:scale-90 select-none"
            type="submit"
            disabled={isSubmitting} // ✅ Prevents multiple submissions
          >
            <div className="relative flex items-center gap-2 !my-0">
              <AiOutlineSend className="text-xl" />
              <p className="hidden sm:inline-flex !my-0">{isSubmitting ? 'Subscribing...' : 'Subscribe'}</p>
            </div>
          </button>
        </form>
      </div>
    </>
  )
}
