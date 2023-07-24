import MDXContent from "@lib/MDXContent"
import pageMeta from "@content/meta"
import {
  MovieType,
  PostType,
  ExperienceType,
  EducationType,
  SkillType,
  CertificateType,
  InterestType,
} from '@lib/types'
import StaticPage from "@components/StaticPage"
import {
  getAllExperiences,
  getAllEducations,
  getAllMovies,
  getAllSkills,
  getAllCertificates,
  getAllInterests,
} from '@lib/backendAPI'
import { useEffect, useState } from 'react'
import { motion } from "framer-motion"
import { FadeContainer } from "@content/FramerMotionVariants"
import SkillSection from "@components/Home/SkillSection"
import ExperienceSection from "@components/Home/ExperienceSection"
import Education from "@components/Education"
import Certificates from "@components/Certificates"
import InterestSection from "@components/Interest"
import MovieSection from "@components/Movies"
import Loader from '@components/Loader'
import NoData from "@components/NoData"
import { HomeHeading } from '../pages'
import AnimatedHeading from '@components/FramerMotion/AnimatedHeading'
import { headingFromLeft } from '@content/FramerMotionVariants'

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
  const [moviesLoading, setMoviesLoading] = useState(true)

  const [experiences, setExperiences] = useState<ExperienceType[]>([])
  const [skills, setSkills] = useState<SkillType[]>([])
  const [educations, setEducations] = useState<EducationType[]>([])
  const [certificates, setCertificates] = useState<CertificateType[]>([])
  const [interests, setInterests] = useState<InterestType[]>([])
  const [movies, setMovies] = useState<MovieType[]>([])

  const fetchExperiences = async () => {
    const experiencesData: ExperienceType[] = await getAllExperiences()
    setExperiences(experiencesData)
    setExperiencesLoading(false)
  }

  const fetchSkills = async () => {
    const skillsData: SkillType[] = await getAllSkills()
    setSkills(skillsData)
    setSkillsLoading(false)
  }

  const fetchCertificates = async () => {
    const certificatesData: CertificateType[] = await getAllCertificates()
    setCertificates(certificatesData)
    setCertificatesLoading(false)
  }

  const fetchInterests = async () => {
    const interestsData = await getAllInterests()
    setInterests(interestsData)
    setInterestsLoading(false)
  }

  const fetchEducations = async () => {
    const educationsData: EducationType[] = await getAllEducations()
    setEducations(educationsData)
    setEducationsLoading(false)
  }

  const fetchMovies = async () => {
    const moviesData: MovieType[] = await getAllMovies()
    setMovies(moviesData)
    setMoviesLoading(false)
  }

  useEffect(() => {
    fetchExperiences()
    fetchEducations()
    fetchSkills()
    fetchCertificates()
    fetchInterests()
    fetchMovies()
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
                {experiences.length}
              </span>
            </AnimatedHeading>
            {experiencesLoading ? (
              <Loader />
            ) : experiences.length > 0 ? (
              <ExperienceSection experiences={experiences} showHomeHeading={false} />
            ) : (
              <NoData />
            )}

            {/* Skills */}
            <HomeHeading title="Skills" />
            {skillsLoading ? (
              <Loader />
            ) : skills.length > 0 ? (
              <SkillSection skills={skills} showHomeHeading={false} />
            ) : (
              <NoData />
            )}

            {/* Educations */}
            <HomeHeading title="Educations" />
            {educationsLoading ? (
              <Loader />
            ) : educations.length > 0 ? (
              <Education educations={educations} showHomeHeading={false} />
            ) : (
              <NoData />
            )}

            {/* Certificates */}
            <HomeHeading title="Certificates" />
            {certificatesLoading ? (
              <Loader />
            ) : certificates.length > 0 ? (
              <Certificates certificates={certificates} showHomeHeading={false} />
            ) : (
              <NoData />
            )}

            {/* Interests */}
            <HomeHeading title="Interests" />
            {interestsLoading ? (
              <Loader />
            ) : interests.length > 0 ? (
              <InterestSection interests={interests} showHomeHeading={false} />
            ) : (
              <NoData />
            )}
          </div>
        </motion.section>

        {/* Movies */}
        <HomeHeading title="Recent Watched Movies & TV Series" />
        {moviesLoading ? (
          <Loader />
        ) : movies.length > 0 ? (
          <MovieSection movies={movies} showHomeHeading={false} />
        ) : (
          <NoData />
        )}
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
