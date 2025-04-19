import { FaCheck, FaChevronDown, FaChevronUp } from 'react-icons/fa6'

export default function FieldSection({
  label,
  keyName,
  options,
  isOpen,
  toggleSection,
  formData,
  handleSelect,
  multi,
  isTextInput,
  handleChangeText,
}: any) {
  return (
    <div key={keyName} className="border dark:border-gray-600 border-gray-200 rounded-lg overflow-hidden mb-4">
      <button
        onClick={() => toggleSection(keyName)}
        className="w-full flex justify-between items-center px-4 py-3 bg-gray-100 dark:bg-gray-700 text-left font-medium text-gray-800 dark:text-white"
      >
        <span>{label}</span>
        {isOpen ? <FaChevronUp /> : <FaChevronDown />}
      </button>

      {isOpen && (
        <div className="p-4 bg-white dark:bg-gray-800">
          {isTextInput ? (
            <textarea
              rows={3}
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
              placeholder="E.g. Songs by A.R. Rahman"
              value={formData.other_preferences}
              onChange={(e) => handleChangeText(e.target.value)}
            />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {options?.map((option: string) => {
                const isSelected = multi ? formData[keyName]?.includes(option) : formData[keyName] === option
                return (
                  <button
                    key={option}
                    onClick={() => handleSelect(keyName, option, multi)}
                    className={`py-2 px-3 rounded-lg border transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {option} {isSelected && <FaCheck className="ml-2" />}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
