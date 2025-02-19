'use client'

import { useState, useEffect } from 'react'
import ReactModal from 'react-modal'
import PDFViewer from '@/components/PDFViewer'
import Image from 'next/image'
import { getFileExtension } from '@/lib/utils/file'
import { isImageFile } from '@/lib/utils/image'

interface MediaModalProps {
  title: string
  file: string
  description: string
}

const MediaModal: React.FC<MediaModalProps> = ({ title, file, description }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false)

  // ✅ Ensure `setAppElement` is only called on the client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      ReactModal.setAppElement('#__next')
    }
  }, [])

  const openModal = () => setModalIsOpen(true)
  const closeModal = () => setModalIsOpen(false)

  const renderFile = (file: string) => {
    if (!file) {
      return (
        <div className="flex items-center justify-center">
          <p className="text-red-500">No file attached!</p>
        </div>
      )
    }

    const fileExtension = getFileExtension(file)

    // ✅ Handle PDFs separately
    if (fileExtension === 'pdf') {
      return <PDFViewer base64String={file} />
    }

    // ✅ Handle Cloudinary images and Base64 images
    if (isImageFile(file)) {
      return (
        <Image
          src={file}
          alt={title}
          className="mb-4"
          width={1000}
          height={1000}
          quality={75}
          unoptimized // ✅ Prevents Next.js from re-optimizing Cloudinary images
          style={{ width: 'auto', height: 'auto' }}
        />
      )
    }

    return (
      <div className="flex items-center justify-center">
        <p className="text-red-500">Unsupported file type!</p>
      </div>
    )
  }

  return (
    <>
      <button
        className="text-slate-800 dark:text-slate-200 px-4 py-2 bg-sky-400 dark:bg-sky-800 rounded-lg hover:bg-sky-500 dark:hover:bg-sky-900"
        onClick={openModal}
      >
        {title}
      </button>

      <ReactModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Media Modal"
        className="modal dark:bg-slate-800 dark:text-slate-100"
        overlayClassName="modal-overlay"
      >
        {/* Modal Body */}
        <div className="h-full">
          {/* Header Section */}
          <div className="sticky top-0 bg-white dark:bg-slate-800 py-3 z-10">
            <button
              className="absolute top-4 right-0 font-extrabold bg-red-700 text-red-300 rounded-full hover:text-red-400"
              onClick={closeModal}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-2xl font-bold mb-2 text-center">{title}</h2>
          </div>

          {/* Modal Content */}
          <div className="flex-1 overflow-y-auto">
            {renderFile(file)}
            <p className="mt-4">{description}</p>
          </div>

          {/* Modal Footer */}
          <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded" onClick={closeModal}>
            Close
          </button>
        </div>
      </ReactModal>
    </>
  )
}

export default MediaModal
