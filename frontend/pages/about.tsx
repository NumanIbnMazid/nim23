import MDXContent from "@lib/MDXContent"
import pageMeta from "@content/meta"
import { MovieType, PostType, ExperienceType, EducationType } from "@lib/types"
import StaticPage from "@components/StaticPage"
import { getAllExperiences, getAllEducations, getAllMovies } from "@lib/backendAPI"
import { useEffect, useState } from 'react'
import MovieCard from "@components/MovieCard"
import { motion } from "framer-motion"
import { FadeContainer, opacityVariant } from "@content/FramerMotionVariants"
import AnimatedDiv from "@components/FramerMotion/AnimatedDiv"
import SkillSection from "@components/Home/SkillSection"
import ExperienceSection from "@components/Home/ExperienceSection"
import Education from "@components/Education"
import Certificates from "@components/Certificates"
import Projects from "@components/Projects"


export default function About({
  about
}: {
  about: PostType
  movies: MovieType[]
}) {

  const [experiences, setExperiences] = useState<ExperienceType[]>([])
  const [educations, setEducations] = useState<EducationType[]>([])
  const [movies, setMovies] = useState([])

  const fetchExperiences = async () => {
    const experiencesData: ExperienceType[] = await getAllExperiences()
    setExperiences(experiencesData)
  }

  const fetchEducations = async () => {
    const educationsData: EducationType[] = await getAllEducations()
    setEducations(educationsData)
  }

  const fetchMovies = async () => {
    const moviesData = await getAllMovies()
    setMovies(moviesData)
  }

  useEffect(() => {
    fetchExperiences()
    fetchEducations()
    fetchMovies()
  }, [])

  // ******* Loader Starts *******
  if (movies.length === 0) {
    return <div>Loading...</div>
  }
  // ******* Loader Ends *******

  return (
    <>
      <StaticPage metadata={pageMeta.about} page={about} />

      <div className="relative max-w-4xl mx-auto dark:bg-darkPrimary dark:text-gray-100 2xl:max-w-5xl 3xl:max-w-7xl">
        <motion.section
          initial="hidden"
          whileInView="visible"
          variants={FadeContainer}
          viewport={{ once: true }}
          className="grid min-h-screen py-20 place-content-center"
        >
          <div>
            <ExperienceSection experiences={experiences} />
            <SkillSection />
            <Education educations={educations} />
            <Certificates />
            <Projects />
          </div>
        </motion.section>
      </div>

      <div className="-mt-5 pageTop print:hidden">
        <motion.h3
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={opacityVariant}
          className="my-2 text-xl font-bold text-left md:text-3xl"
        >
          Recent watched Movies & TV Series
        </motion.h3>

        <AnimatedDiv
          variants={FadeContainer}
          className="flex items-center gap-2 pt-10 pb-5 overflow-x-scroll md:gap-4 horizontal-scrollbar"
        >
          {movies.map((movie: MovieType) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </AnimatedDiv>
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
