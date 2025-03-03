import { useState } from 'react'
import { toast } from 'sonner' // ✅ Using Sonner for better notifications
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
      <div>
        <h3 className="my-0 text-sm tracking-wider uppercase font-bold">Newsletter</h3>
        <p className="mt-4 text-base">
          Subscribe to nim23's Newsletter for professional insights, industry trends, and valuable tips. Join now (Spam
          Free)!
        </p>
        <form className="relative flex my-4 space-y-0" onSubmit={subscribeNewsletter}>
          <label htmlFor="email-address" className="sr-only">
            Email address
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            <input
              className="px-4 py-2.5 rounded-lg text-lg bg-gray-200 dark:bg-darkSecondary outline-none border-0 w-auto placeholder:text-gray-400 dark:placeholder:text-gray-600 dark:text-gray-300"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="enter your email"
              required
            />
            <button
              type="submit"
              className="w-36 px-4 py-2 m-[3px] bg-white dark:text-white dark:bg-neutral-600/40 rounded-md font-medium font-inter transform duration-200 active:scale-90 select-none"
              disabled={isSubmitting} // ✅ Prevents spam clicking
            >
              <div className="relative flex items-center gap-2 !my-0">
                <AiOutlineSend className="text-xl" />
                <p className="">{isSubmitting ? 'Subscribing...' : 'Subscribe'}</p>
              </div>
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
