export default function Loader() {
  return (
    <div className="flex items-center justify-center mt-12 p-12 relative max-w-4xl mx-auto bg-darkWhitePrimary dark:bg-darkPrimary dark:text-gray-100 2xl:max-w-5xl 3xl:max-w-7xl">
      <div className="flex flex-col items-center">
        <svg
          className="animate-spin h-16 w-16 text-gray-600"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647zM20 12c0-3.042-1.135-5.824-3-7.938l-3 2.647A7.962 7.962 0 0120 12h4a8 8 0 01-8 8v-4z"
          ></path>
        </svg>
        <span className="mt-4 font-bold text-slate-600">Loading ...</span>
      </div>
    </div>
  )
}

