import MDXContent from "@lib/MDXContent"
import pageMeta from "@content/meta"
import { MovieType, PostType, ExperienceType, EducationType, ProjectType } from "@lib/types"
import StaticPage from "@components/StaticPage"
import { getAllExperiences, getAllEducations, getAllProjects, getAllMovies } from "@lib/backendAPI"
import { useEffect, useState } from 'react'
import MovieCard from "@components/MovieCard"
import { motion } from "framer-motion"
import { FadeContainer, opacityVariant } from "@content/FramerMotionVariants"
import AnimatedDiv from "@components/FramerMotion/AnimatedDiv"
import SkillSection from "@components/Home/SkillSection"
import ExperienceSection from "@components/Home/ExperienceSection"
import Education from "@components/Education"
import Certificates from "@components/Certificates"
import ProjectSection from "@components/ProjectSection"
import InterestSection from "@components/Interest"
import Loader from "@components/Loader"
import NoData from "@components/NoData"


export default function About({
  about
}: {
  about: PostType
  movies: MovieType[]
}) {
  const [isLoading, setIsLoading] = useState(true)

  const [experiences, setExperiences] = useState<ExperienceType[]>([])
  const [educations, setEducations] = useState<EducationType[]>([])
  const [projects, setProjects] = useState<ProjectType[]>([])
  const [movies, setMovies] = useState([])

  const fetchExperiences = async () => {
    const experiencesData: ExperienceType[] = await getAllExperiences()
    setExperiences(experiencesData)
  }

  const fetchEducations = async () => {
    const educationsData: EducationType[] = await getAllEducations()
    setEducations(educationsData)
  }

  const fetchProjects = async () => {
    const projectsData: ProjectType[] = await getAllProjects()
    setProjects(projectsData)
  }

  const fetchMovies = async () => {
    const moviesData = await getAllMovies()
    setMovies(moviesData)
  }

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        fetchExperiences(),
        fetchEducations(),
        fetchProjects(),
        fetchMovies(),
      ]);

      setIsLoading(false)
    }

    fetchData()
  }, [])

  // ******* Loader Starts *******
  if (isLoading === true) {
    return (
      <Loader />
    )
  }
  // ******* Loader Ends *******

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
            {experiences.length > 0 ? (
              <ExperienceSection experiences={experiences} />
            ):
              <NoData topic="Experiences" />
            }
            {/* Skills */}
            <SkillSection />
            {educations.length > 0 ? (
              <Education educations={educations} />
            ):
              <NoData topic="Educations" />
            }
            {/* Certificates */}
            <Certificates />
            {/* Projects */}
            {projects.length > 0 ? (
              <ProjectSection projects={projects} />
            ):
              <NoData topic="Projects" />
            }
            {/* Interests */}
            <InterestSection />
          </div>
        </motion.section>

        {/* Movies */}
        {movies.length > 0 ? (
          <div className="-mt-5 pageTop print:hidden">
            <motion.h3
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={opacityVariant}
              className="w-full my-2 text-3xl font-bold font-inter flex justify-center items-center text-slate-500 dark:text-slate-100"
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
        ) :
          <NoData topic="Movies" />
        }
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
