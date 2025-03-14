'use client'

import { ExperienceType, EducationType, SkillType, CertificateType, InterestType } from '@/lib/types'
import { motion } from 'framer-motion'
import { FadeContainer } from '@/content/FramerMotionVariants'
import Loader from '@/components/Loader'
import NoData from '@/components/NoData'
import { HomeHeading } from '@/app/HomeClient'
import dynamic from 'next/dynamic'
import AnimatedDiv from '@/components/FramerMotion/AnimatedDiv'
import PageTop from '@/components/PageTop'
import { opacityVariant } from '@/content/FramerMotionVariants'

const SkillSection = dynamic(() => import('@/components/Home/SkillSection'), { loading: () => <Loader /> })
const ExperienceSection = dynamic(() => import('@/components/Home/ExperienceSection'), { loading: () => <Loader /> })
const Education = dynamic(() => import('@/components/Education'), { loading: () => <Loader /> })
const Certificates = dynamic(() => import('@/components/Certificates'), { loading: () => <Loader /> })
const InterestSection = dynamic(() => import('@/components/Interest'), { loading: () => <Loader /> })

export default function AboutClient({
  experiences,
  skills,
  educations,
  certificates,
  interests,
}: {
  experiences: ExperienceType[]
  skills: SkillType[]
  educations: EducationType[]
  certificates: CertificateType[]
  interests: InterestType[]
}) {
  return (
    <>
      <section className="pageTop bg-darkWhitePrimary dark:bg-darkPrimary">
        <PageTop containerClass="mb-0" pageTitle="About me" />
        <AnimatedDiv variants={opacityVariant} className="max-w-full prose dark:prose-invert">
          Thank you for taking time to learn more about me. I am Numan Ibn Mazid. You can call me Numan. I'm excited to
          share a glimpse into my background, work experience, education, my projects, what I like etc.
        </AnimatedDiv>
      </section>
      <div className="relative max-w-4xl mx-auto bg-darkWhitePrimary dark:bg-darkPrimary dark:text-gray-100 2xl:max-w-5xl 3xl:max-w-7xl">
        <motion.section
          initial="hidden"
          whileInView="visible"
          variants={FadeContainer}
          viewport={{ once: true }}
          className="grid min-h-screen py-7 place-content-center"
        >
          <div>
            {/* Experiences */}
            {experiences.length > 0 ? (
              <ExperienceSection experiences={experiences} showHomeHeading={true} />
            ) : (
              <NoData />
            )}

            {/* Skills */}
            <HomeHeading title="Skills" />
            {skills.length > 0 ? <SkillSection skills={skills} showHomeHeading={false} /> : <NoData />}

            {/* Educations */}
            <HomeHeading title="Educations" />
            {educations.length > 0 ? <Education educations={educations} showHomeHeading={false} /> : <NoData />}

            {/* Certificates */}
            <HomeHeading title="Certificates" />
            {certificates.length > 0 ? (
              <Certificates certificates={certificates} showHomeHeading={false} />
            ) : (
              <NoData />
            )}

            {/* Interests */}
            <HomeHeading title="Interests" />
            {interests.length > 0 ? <InterestSection interests={interests} showHomeHeading={false} /> : <NoData />}
          </div>
        </motion.section>
      </div>
    </>
  )
}
