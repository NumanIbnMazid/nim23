import { fromLeftVariant, opacityVariant } from '@/content/FramerMotionVariants'
import AnimatedHeading from '@/components/FramerMotion/AnimatedHeading'
import AnimatedText from '@/components/FramerMotion/AnimatedText'

export default function PageTop({
  pageTitle,
  badge,
  headingClass,
  containerClass,
  children,
}: {
  pageTitle: string
  badge?: string
  headingClass?: string
  containerClass?: string
  children?: React.ReactNode
}) {
  return (
    <div className={`w-full flex flex-col gap-3 py-5 select-none mb-10 ${containerClass}`}>
      <div className="flex justify-center">
        <AnimatedHeading
          variants={fromLeftVariant}
          className={`relative inline-flex items-start text-4xl md:text-5xl font-bold text-neutral-900 dark:text-neutral-200 ${headingClass}`}
        >
          {pageTitle}
          {badge && (
            <span className="ml-2 -mt-2 px-2 py-1 text-xs font-bold text-white bg-blue-500 rounded-full">{badge}</span>
          )}
        </AnimatedHeading>
      </div>
      {children && (
        <AnimatedText variants={opacityVariant} className="text-lg text-gray-600 dark:text-gray-400">
          {children}
        </AnimatedText>
      )}
    </div>
  )
}
