import { BsThreeDots } from 'react-icons/bs'
import { FacebookShareButton, LinkedinShareButton, TwitterShareButton, WhatsappShareButton } from 'react-share'

import useShare from '../hooks/useShare'
import { toast } from 'sonner' // ✅ Replaced Toastify with Sonner
import { FiCopy, FiLinkedin } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { GrFacebookOption, GrTwitter } from 'react-icons/gr'

type Props = {
  className: string
  title: string
  url: string
  summary: string
  cover_image: string
  children: React.ReactNode
}

export default function ShareOnSocialMedia({ className, title, url, summary, cover_image, children }: Props) {
  const { isShareSupported } = useShare()

  async function handleShare() {
    try {
      const blob = await fetch(cover_image).then((res) => res.blob())
      const file = new File([blob], 'image.png', { type: 'image/png' })

      if (window.navigator.share) {
        await window.navigator.share({
          title: title,
          text: summary,
          url: url,
          files: [file],
        })
        toast.success('Thanks for sharing! ✅')
      }
    } catch (error) {
      console.error('Sharing failed:', error)
      toast.error('⚠️ Could not share the content.')
    }
  }

  // Copy to clipboard function
  function copyTextToClipboard(text: string) {
    if (!navigator.clipboard) {
      toast.error("❌ Your device doesn't support this feature.")
      return
    }
    navigator.clipboard.writeText(text).then(
      () => toast.success('✅ Link Copied Successfully!'),
      (err) => {
        console.error(err)
        toast.error('⚠️ Something went wrong while copying.')
      }
    )
  }

  return (
    <>
      <div className={`${className} transform sm:scale-150 my-5`}>
        <FacebookShareButton quote={title} url={url}>
          <div className="p-2 text-white bg-gray-700 rounded-full hover:bg-cyan-700">
            <GrFacebookOption className="w-4 h-4" />
          </div>
        </FacebookShareButton>
        <TwitterShareButton title={title} url={url} related={['@NumanIbnMazid']}>
          <div className="p-2 text-white bg-gray-700 rounded-full hover:bg-cyan-700">
            <GrTwitter className="w-4 h-4" />
          </div>
        </TwitterShareButton>
        <LinkedinShareButton title={title} summary={summary} url={url} source={url}>
          <div className="p-2 text-white bg-gray-700 rounded-full hover:bg-cyan-700">
            <FiLinkedin className="w-4 h-4 " />
          </div>
        </LinkedinShareButton>
        <WhatsappShareButton title={title} url={url}>
          <div className="bg-gray-700 text-white p-1.5 rounded-full hover:bg-cyan-700">
            <FaWhatsapp className="w-5 h-5 " />
          </div>
        </WhatsappShareButton>
        <div className="p-2 text-white bg-gray-700 rounded-full cursor-pointer hover:bg-cyan-700">
          <FiCopy className="w-4 h-4 " onClick={() => copyTextToClipboard(url)} />
        </div>

        {/* Children of components */}
        {children}

        {isShareSupported && (
          <div
            className="p-2 text-white bg-gray-700 rounded-full cursor-pointer hover:bg-sky-700"
            onClick={handleShare}
          >
            <BsThreeDots className="w-4 h-4" />
          </div>
        )}
      </div>
    </>
  )
}
