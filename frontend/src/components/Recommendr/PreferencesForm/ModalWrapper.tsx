import ReactModal from 'react-modal'
import FieldSection from '@/components/Recommendr/PreferencesForm/FieldSection'
import { FaPaperPlane } from 'react-icons/fa6'

export default function ModalWrapper({
  isOpen,
  closeModal,
  fields,
  formData,
  handleSelect,
  openSections,
  toggleSection,
  handleChangeText,
  canSubmit,
  handleSubmit,
}: any) {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Advanced Filters"
      className="modal dark:bg-slate-800 dark:text-slate-100 p-6 rounded-lg shadow-lg max-w-2xl mx-auto my-20 overflow-auto outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
    >
      <div className="h-full">
        <div className="sticky top-0 bg-white dark:bg-slate-800 py-3 z-10">
          <button
            className="absolute top-4 right-0 font-extrabold bg-rose-500 text-red-300 rounded-full hover:bg-rose-700"
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
          <h2 className="text-2xl font-bold mb-2 text-center">Advanced Filters</h2>
        </div>

        <div className="flex-1 overflow-y-auto">
          {fields.map((field: any) => (
            <FieldSection
              key={field.key}
              label={field.label}
              keyName={field.key}
              options={field.options}
              isOpen={openSections.includes(field.key)}
              toggleSection={toggleSection}
              formData={formData}
              handleSelect={handleSelect}
              multi={field.multi}
              isTextInput={field.isTextInput}
              handleChangeText={handleChangeText}
            />
          ))}
        </div>

        <div className="flex justify-between items-center pt-2">
          <button className="mt-4 bg-rose-500 hover:bg-rose-700 text-white px-4 py-2 rounded" onClick={closeModal}>
            Close
          </button>
          {canSubmit && (
            <button
              onClick={handleSubmit}
              className="inline-flex items-center gap-2 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
            >
              Get Recommendation <FaPaperPlane />
            </button>
          )}
        </div>
      </div>
    </ReactModal>
  )
}
