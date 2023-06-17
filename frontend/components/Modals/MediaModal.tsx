import { useState } from 'react'
import ReactModal from 'react-modal'

// Set the app element to avoid accessibility warnings
ReactModal.setAppElement('#__next')

interface MediaModalProps {
  title: string
  file: string
  description: string
}

const MediaModal: React.FC<MediaModalProps> = ({ title, file, description }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false)

  const openModal = () => {
    setModalIsOpen(true)
  }

  const closeModal = () => {
    setModalIsOpen(false)
  }

  return (
    <>
      <button className="text-slate-700 dark:text-slate-200 px-4 py-2 bg-sky-400 dark:bg-sky-800 rounded-lg" onClick={openModal}>
        {title}
      </button>

      <ReactModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Media Modal"
        className="modal dark:bg-slate-800 dark:text-slate-100"
        overlayClassName="modal-overlay"
      >
        <button
          className="absolute top-2 right-2 text-red-500 hover:text-red-700"
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
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <img src={file} alt={title} className="mb-4" />
        <p>{description}</p>

        <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded" onClick={closeModal}>
          Close
        </button>
      </ReactModal>
    </>
  )
}

export default MediaModal
