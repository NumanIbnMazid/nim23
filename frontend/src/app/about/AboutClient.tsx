'use client'

import { PostType, ExperienceType, EducationType, SkillType, CertificateType, InterestType } from '@/lib/types'
import StaticPage from '@/components/StaticPage'
import { motion } from 'framer-motion'
import { FadeContainer } from '@/content/FramerMotionVariants'
import Loader from '@/components/Loader'
import NoData from '@/components/NoData'
import { HomeHeading } from '@/app/HomeClient'
import dynamic from 'next/dynamic'

const SkillSection = dynamic(() => import('@/components/Home/SkillSection'), { loading: () => <Loader /> })
const ExperienceSection = dynamic(() => import('@/components/Home/ExperienceSection'), { loading: () => <Loader /> })
const Education = dynamic(() => import('@/components/Education'), { loading: () => <Loader /> })
const Certificates = dynamic(() => import('@/components/Certificates'), { loading: () => <Loader /> })
const InterestSection = dynamic(() => import('@/components/Interest'), { loading: () => <Loader /> })

export default function AboutClient({
  about,
  experiences,
  skills,
  educations,
  certificates,
  interests,
}: {
  about: PostType
  experiences: ExperienceType[]
  skills: SkillType[]
  educations: EducationType[]
  certificates: CertificateType[]
  interests: InterestType[]
}) {
  return (
    <>
      <StaticPage metadata={about.meta} page={about} />
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
