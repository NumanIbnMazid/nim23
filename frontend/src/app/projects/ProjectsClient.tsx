'use client' // ✅ Mark as a Client Component

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FadeContainer } from '@/content/FramerMotionVariants'
import Loader from '@/components/Loader'
import NoData from '@/components/NoData'
import dynamic from 'next/dynamic'
import { ProjectType } from '@/lib/types'
import Pagination from 'rc-pagination'
import 'rc-pagination/assets/index.css'
import { getLocalStorageItem, setLocalStorageItem } from '@/lib/utils/localStorage'
import '@/styles/pagination.css'

const ProjectSection = dynamic(() => import('@/components/ProjectSection'), {
  loading: () => <Loader />,
})

const ITEMS_PER_PAGE = 6 // Adjust as needed

export default function ProjectsClient({ initialProjects }: { initialProjects: ProjectType[] }) {
  const [currentPage, setCurrentPage] = useState<number>(() => {
    const savedPage = Number(getLocalStorageItem('snippetCurrentPage', 1)) || 1
    // Make sure that saved page is less than total pages if total pages less then savedPages
    return Math.min(savedPage, Math.ceil(initialProjects.length / ITEMS_PER_PAGE)) || 1
  })

  const [paginatedProjects, setPaginatedProjects] = useState<ProjectType[]>([])

  useEffect(() => {
    setLocalStorageItem('projectCurrentPage', currentPage)
  }, [currentPage])

  useEffect(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    setPaginatedProjects(initialProjects.slice(startIndex, endIndex))
  }, [initialProjects, currentPage])

  const totalItems = initialProjects.length

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    setLocalStorageItem('projectCurrentPage', page)
  }

  return (
    <>
      {initialProjects && initialProjects.length > 0 ? (
        <div className="relative max-w-4xl mx-auto bg-darkWhitePrimary dark:bg-darkPrimary dark:text-gray-100 2xl:max-w-5xl 3xl:max-w-7xl">
          <motion.section
            initial="hidden"
            whileInView="visible"
            variants={FadeContainer}
            viewport={{ once: true }}
            className="grid min-h-screen py-20 place-content-center"
          >
            <div>
              <ProjectSection projects={paginatedProjects} />
              <div className="flex justify-center items-center mt-4">
                <Pagination
                  current={currentPage}
                  total={totalItems}
                  showTotal={(total) => `Total ${total} Projects`}
                  pageSize={ITEMS_PER_PAGE}
                  onChange={handlePageChange}
                  showSizeChanger={false}
                  showQuickJumper
                  className="custom-pagination"
                />
              </div>
            </div>
          </motion.section>
        </div>
      ) : (
        <div className="mt-16">
          <NoData />
        </div>
      )}
    </>
  )
}
