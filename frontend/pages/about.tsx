import MDXContent from "@lib/MDXContent"
import pageMeta from "@content/meta"
import {
  PostType,
  ExperienceType,
  EducationType,
  SkillType,
  CertificateType,
  InterestType,
} from '@lib/types'
import StaticPage from "@components/StaticPage"
import {
} from '@lib/backendAPI'
import { useEffect, useState } from 'react'
import { motion } from "framer-motion"
import { FadeContainer } from "@content/FramerMotionVariants"
import Loader from '@components/Loader'
import NoData from "@components/NoData"
import { HomeHeading } from '../pages'
import AnimatedHeading from '@components/FramerMotion/AnimatedHeading'
import { headingFromLeft } from '@content/FramerMotionVariants'
import dynamic from 'next/dynamic'

const SkillSection = dynamic(() => import('@components/Home/SkillSection'), {
  loading: () => <Loader />,
})

const ExperienceSection = dynamic(() => import('@components/Home/ExperienceSection'), {
  loading: () => <Loader />,
})

const Education = dynamic(() => import('@components/Education'), {
  loading: () => <Loader />,
})

const Certificates = dynamic(() => import('@components/Certificates'), {
  loading: () => <Loader />,
})

const InterestSection = dynamic(() => import('@components/Interest'), {
  loading: () => <Loader />,
})


export default function About({
  about
}: {
  about: PostType
}) {

  // Loaders
  const [experiencesLoading, setExperiencesLoading] = useState(true)
  const [skillsLoading, setSkillsLoading] = useState(true)
  const [educationsLoading, setEducationsLoading] = useState(true)
  const [certificatesLoading, setCertificatesLoading] = useState(true)
  const [interestsLoading, setInterestsLoading] = useState(true)

  const [experiences, setExperiences] = useState<ExperienceType[]>([])
  const [skills, setSkills] = useState<SkillType[]>([])
  const [educations, setEducations] = useState<EducationType[]>([])
  const [certificates, setCertificates] = useState<CertificateType[]>([])
  const [interests, setInterests] = useState<InterestType[]>([])

  const fetchExperiences = async () => {
    try {
      const response = await fetch(`/api/experiences?limit=${encodeURIComponent("")}`)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      // Parse the JSON body
      const experiencesData: ExperienceType[] = await response.json()
      setExperiences(experiencesData)
      setExperiencesLoading(false)
    } catch (error) {
      // Handle errors
      console.error('Fetch error:', error)
    }
  }

  const fetchSkills = async () => {
    try {
      const response = await fetch(`/api/skills`)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      // Parse the JSON body
      const skillsData: SkillType[] = await response.json()
      setSkills(skillsData)
      setSkillsLoading(false)
    } catch (error) {
      // Handle errors
      console.error('Fetch error:', error)
    }
  }

  const fetchCertificates = async () => {
    try {
      const response = await fetch(`/api/certificates`)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      // Parse the JSON body
      const certificatesData: CertificateType[] = await response.json()
      setCertificates(certificatesData)
      setCertificatesLoading(false)
    } catch (error) {
      // Handle errors
      console.error('Fetch error:', error)
    }
  }

  const fetchInterests = async () => {
    try {
      const response = await fetch(`/api/interests`)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      // Parse the JSON body
      const interestsData: InterestType[] = await response.json()
      setInterests(interestsData)
      setInterestsLoading(false)
    } catch (error) {
      // Handle errors
      console.error('Fetch error:', error)
    }
  }

  const fetchEducations = async () => {
    try {
      const response = await fetch(`/api/educations`)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      // Parse the JSON body
      const educationsData: EducationType[] = await response.json()
      setEducations(educationsData)
      setEducationsLoading(false)
    } catch (error) {
      // Handle errors
      console.error('Fetch error:', error)
    }
  }

  useEffect(() => {
    fetchExperiences()
    fetchEducations()
    fetchSkills()
    fetchCertificates()
    fetchInterests()
  }, [])

  return (
    <>
      <StaticPage metadata={pageMeta.about} page={about} />
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
            <AnimatedHeading
              className="w-full my-2 text-3xl font-bold text-left font-inter flex justify-center items-center"
              variants={headingFromLeft}
            >
              <span className="mr-2">Work Experiences</span>
              <span className="px-2 py-1 text-xs font-bold text-white bg-blue-500 rounded-full">
                {experiences?.length || 0}
              </span>
            </AnimatedHeading>
            {experiencesLoading ? (
              <Loader />
            ) : experiences && experiences.length > 0 ? (
              <ExperienceSection experiences={experiences} showHomeHeading={false} />
            ) : (
              <NoData />
            )}

            {/* Skills */}
            <HomeHeading title="Skills" />
            {skillsLoading ? (
              <Loader />
            ) : skills && skills.length > 0 ? (
              <SkillSection skills={skills} showHomeHeading={false} />
            ) : (
              <NoData />
            )}

            {/* Educations */}
            <HomeHeading title="Educations" />
            {educationsLoading ? (
              <Loader />
            ) : educations && educations.length > 0 ? (
              <Education educations={educations} showHomeHeading={false} />
            ) : (
              <NoData />
            )}

            {/* Certificates */}
            <HomeHeading title="Certificates" />
            {certificatesLoading ? (
              <Loader />
            ) : certificates && certificates.length > 0 ? (
              <Certificates certificates={certificates} showHomeHeading={false} />
            ) : (
              <NoData />
            )}

            {/* Interests */}
            <HomeHeading title="Interests" />
            {interestsLoading ? (
              <Loader />
            ) : interests && interests.length > 0 ? (
              <InterestSection interests={interests} showHomeHeading={false} />
            ) : (
              <NoData />
            )}
          </div>
        </motion.section>
      </div>
    </>
  )
}

export async function getStaticProps() {
  const { post: about } = await new MDXContent("static_pages").getPostFromSlug(
    "about"
  );
  return {
    props: {
      about
    },
  }
}
