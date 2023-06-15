// Page Components START----------
import BlogsSection from "@components/Home/BlogsSection"
import SkillSection from "@components/Home/SkillSection"
import ExperienceSection from "@components/Home/ExperienceSection"
import Image from "next/image"
import Metadata from "@components/MetaData"
import Contact from "@components/Contact"
import {
  FadeContainer,
  headingFromLeft,
  opacityVariant,
  popUp,
} from "@content/FramerMotionVariants"
import AnimatedHeading from "@components/FramerMotion/AnimatedHeading"
import { homeProfileImage, cvURL } from "@utils/utils"
import getRSS from "@lib/generateRSS"
import generateSitemap from "@lib/sitemap"
import { motion } from "framer-motion"
import { FiDownload } from "react-icons/fi"
import pageMeta from "@content/meta"
import staticData from "@content/StaticData"
import React from "react"
import Link from "next/link"
import { useEffect, useState } from 'react'
import { getProfileInfo, getAllExperiences, getAllBlogs } from "@lib/backendAPI"
import { ProfileType, ExperienceType } from "@lib/types"


export default function Home() {
  const [profileInfo, setProfileInfo] = useState<ProfileType | null>(null)
  const [experiences, setExperiences] = useState<ExperienceType[]>([])
  const [blogs, setBlogs] = useState([])

  const fetchExperiences = async () => {
    const experiencesData: ExperienceType[] = await getAllExperiences()
    setExperiences(experiencesData)
  }

  const fetchProfileInfo = async () => {
    const profileData: ProfileType = await getProfileInfo()
    setProfileInfo(profileData)
  }

  const fetchBlogs = async () => {
    const blogsData = await getAllBlogs(3)
    setBlogs(blogsData)
  }

  useEffect(() => {
    fetchProfileInfo()
    fetchExperiences()
    fetchBlogs()
  }, [])

  // // ******* Loader Starts *******
  // if (blogs.length === 0) {
  //   return <div>Loading...</div>
  // }
  // // ******* Loader Ends *******

  return (
    <>
      <Metadata
        title="Numan Ibn Mazid's Portfolio"
        description={pageMeta.home.description}
        previewImage={pageMeta.home.image}
        keywords={pageMeta.home.keywords}
      />
      <div className="relative max-w-4xl mx-auto dark:bg-darkPrimary dark:text-gray-100 2xl:max-w-5xl 3xl:max-w-7xl">
        <motion.section
          initial="hidden"
          whileInView="visible"
          variants={FadeContainer}
          viewport={{ once: true }}
          className="grid min-h-screen py-20 place-content-center"
        >
          <div className="relative flex flex-col items-center w-full gap-10 mx-auto">
            <motion.div
              variants={popUp}
              className="relative flex items-center justify-center p-3 rounded-full overflow-hidden w-44 h-44 xs:w-64 xs:h-64 before:absolute before:inset-0 before:border-t-4 before:border-b-4 before:border-black before:dark:border-white before:rounded-full before:animate-photo-spin"
            >
              <Image
                src={profileInfo?.image || homeProfileImage}
                className="rounded-full shadow filter"
                width={933}
                height={933}
                alt="cover Profile Image"
                quality={100}
                priority
              />
            </motion.div>

            <div className="flex flex-col w-full gap-3 p-5 text-center select-none ">
              <div className="flex flex-col gap-1">
                <motion.h1
                  variants={opacityVariant}
                  className="text-5xl font-bold lg:text-6xl font-arial"
                >
                  {profileInfo?.name}
                  {profileInfo?.nickname && <span className="ml-4 text-5xl font-light">({profileInfo.nickname})</span>}
                </motion.h1>
                <motion.p
                  variants={opacityVariant}
                  className="font-medium text-xs md:text-sm lg:text-2xl text-[#383838] dark:text-gray-200"
                >
                  {staticData.personal.profession}
                </motion.p>
              </div>

              <motion.p
                variants={opacityVariant}
                className=" text-[#474747] dark:text-gray-300 font-medium text-sm md:text-base text-center"
              >
                {staticData.personal.current_position}
              </motion.p>
              <motion.p
                variants={opacityVariant}
                className=" text-[#474747] dark:text-gray-300 font-medium text-sm md:text-base text-center"
              >
                {profileInfo?.about || staticData.personal.about}
              </motion.p>

              <div className="flex items-center justify-center p-4">
                <div className="w-1/2 h-0.5 bg-gradient-to-r from-gray-300 via-transparent to-gray-300"></div>
              </div>

              <motion.p
                variants={opacityVariant}
                className=" text-[#474747] dark:text-gray-300 font-small font-light text-sm md:text-base text-center"
              >
                Address: {profileInfo?.address || "Dhaka, Bangladesh"}
              </motion.p>
              <motion.p
                variants={opacityVariant}
                className=" text-[#474747] dark:text-gray-300 font-small font-light text-sm md:text-base text-center"
              >
                <span>Email: </span>
                <span className="text-sky-800 dark:text-sky-400">
                  <a href={`mailto:${profileInfo?.contact_email || "numanibnmazid@gmail.com"}`}>
                    {profileInfo?.contact_email || "numanibnmazid@gmail.com"}
                  </a>
                </span>
              </motion.p>
              <motion.p
                variants={opacityVariant}
                className=" text-[#474747] dark:text-gray-300 font-small font-light text-sm md:text-base text-center"
              >
                <span>Contact: </span>
                <span className="text-sky-800 dark:text-sky-400">
                  <a href={`tel:${profileInfo?.contact || "+880 1685238317"}`}>
                    {profileInfo?.contact || "+880 1685238317"}
                  </a>
                </span>
              </motion.p>
            </div>

            <Link
              href={cvURL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2 transition-transform border border-gray-500 rounded-md outline-none select-none dark:border-gray-400 hover:bg-white dark:hover:bg-neutral-800 active:scale-95"
            >
              <FiDownload />
              <p>Resume</p>
            </Link>
          </div>
        </motion.section>

        <div>

          {/* Experience Section */}
          <ExperienceSection experiences={experiences} />

          {/* View all experiences link */}
          <Link
            href="/about"
            className="flex items-center justify-center gap-1 font-medium transition border-transparent font-inter active:scale-95 active:border-black w-fit group md:ml-7"
          >
            View all experiences
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="w-6 h-6 ml-1 transition group-hover:translate-x-2"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.5 12h-15m11.667-4l3.333 4-3.333-4zm3.333 4l-3.333 4 3.333-4z"
              ></path>
            </svg>
          </Link>

          {/* Skills Section */}
          <SkillSection />

          {/* Blogs Section */}
          <BlogsSection blogs={blogs} />

          {/* Contact Section */}
          <Contact />
        </div>
      </div>
    </>
  );
}

export function HomeHeading({ title }: { title: React.ReactNode | string }) {
  return (
    <AnimatedHeading
      className="w-full my-2 text-3xl font-bold text-left font-inter flex justify-center items-center"
      variants={headingFromLeft}
    >
      {title}
    </AnimatedHeading>
  );
}

export async function getStaticProps() {
  await getRSS();
  await generateSitemap();

  return {
    props: { },
  };
}
