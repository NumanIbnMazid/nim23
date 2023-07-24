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
            {experiencesLoading ? (
              <Loader topic="Work Experiences" />
            ) : experiences.length > 0 ? (
              <ExperienceSection experiences={experiences} />
            ) : (
              <NoData topic="Work Experiences" />
            )}

            {/* Skills */}
            {skillsLoading ? (
              <Loader topic="Skills" />
            ) : skills.length > 0 ? (
              <SkillSection skills={skills} />
            ) : (
              <NoData topic="Skills" />
            )}

            {/* Educations */}
            {educationsLoading ? (
              <Loader topic="Educations" />
            ) : educations.length > 0 ? (
              <Education educations={educations} />
            ) : (
              <NoData topic="Educations" />
            )}

            {/* Certificates */}
            {certificatesLoading ? (
              <Loader topic="Certificates" />
            ) : certificates.length > 0 ? (
              <Certificates certificates={certificates} />
            ) : (
              <NoData topic="Certificates" />
            )}

            {/* Interests */}
            {interestsLoading ? (
              <Loader topic="Interests" />
            ) : interests.length > 0 ? (
              <InterestSection interests={interests} />
            ) : (
              <NoData topic="Interests" />
            )}
          </div>
        </motion.section>

        {/* Movies */}
        {moviesLoading ? (
          <Loader topic="Recent Watched Movies & TV Series" />
        ) : movies.length > 0 ? (
          <MovieSection movies={movies} />
        ) : (
          <NoData topic="Recent Watched Movies & TV Series" />
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
