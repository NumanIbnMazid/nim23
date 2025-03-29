'use client'

import AnimatedDiv from '@/components/FramerMotion/AnimatedDiv'
import PageTop from '@/components/PageTop'
import { opacityVariant } from '@/content/FramerMotionVariants'

export default function PrivacyClient() {
  return (
    <>
      <section className="pageTop bg-darkWhitePrimary dark:bg-darkPrimary">
        <PageTop containerClass="mb-0" pageTitle="Privacy Policy" />
        <AnimatedDiv variants={opacityVariant} className="max-w-full prose dark:prose-invert">
          <div className="container mx-auto px-4">
            <p className="mb-4">
              nim23.com gives values and respects to your privacy. This Privacy Policy outlines how this site collect,
              use, and protect your personal information when you visit this site.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">Information Collection and Use</h2>
            <p className="mb-4">
              When you visit this website, nim23.com collect certain information about you, such as your name, email
              address, and any other information you provide voluntarily. nim23.com uses this information solely for
              the purpose of improving your experience on this website and providing you with the requested services.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">Use of Cookies</h2>
            <p className="mb-4">
              nim23.com may use cookies and similar technologies to enhance your browsing experience on our website.
              Cookies are small text files that are stored on your device to collect information about your visit.
              These cookies helps nim23.com to analyze website traffic, customize content, and remember your
              preferences. You have the option to disable cookies in your browser settings, but please note that some
              features of this website may not function properly without them.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">Data Security</h2>
            <p className="mb-4">
              nim23.com takes data security seriously and implement appropriate measures to protect your personal
              information from unauthorized access, disclosure, alteration, or destruction. However, please be aware
              that no method of transmission over the internet or electronic storage is 100% secure, and nim23.com
              cannot guarantee absolute security of your data.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">Third-Party Links</h2>
            <p className="mb-4">
              nim23.com may contain links to third-party websites or services. nim23.com is not responsible for the
              privacy practices or content of those websites. nim23.com encourages you to review the privacy policies
              of any third-party sites you visit.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">Children's Privacy</h2>
            <p className="mb-4">
              nim23.com do not knowingly collect personal information from children. If you believe nim23.com
              unintentionally collected information from a child, please contact immediately via nim23.com's contact
              page, and nim23.com will take steps to remove that information from records.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">Changes to This Privacy Policy</h2>
            <p className="mb-4">
              nim23.com reserve the right to update or modify this Privacy Policy at any time. Any changes will be
              effective immediately upon posting on this page. nim23.com encourages you to review this Privacy Policy
              periodically to stay informed about how nim23.com collects, uses, and protects your personal information.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">Contact Us</h2>
            <p className="mb-4">
              If you have any questions or concerns about this Privacy Policy or your personal information, please
              don't hesitate to contact via nim23.com's contact page. nim23.com is always there to address any queries
              and ensure your privacy is respected.
            </p>

            <p>Thank you for trusting nim23.com with your personal information.</p>
          </div>
        </AnimatedDiv>
      </section>
    </>
  )
}
