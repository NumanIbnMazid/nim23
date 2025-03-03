import Image from 'next/image'

type Props = {
  designation: string
  company: string
  company_image: string
  company_url?: string | null
  address?: string | null
  job_type: string
  job_location_type?: string | null
  duration: string
  duration_in_days: string
  description?: any | null
}

export function TimelineItem({
  designation,
  company,
  company_image,
  company_url = null,
  address = null,
  job_type,
  job_location_type,
  duration,
  duration_in_days,
  description = null,
}: Props) {
  return (
    <>
      <article className="relative grid md:grid-cols-6 md:gap-10 before:content-[''] mx-6 before:block before:h-full before:absolute before:left-[-25px] md:before:left-[-37px] before:border-l-2 before:border-gray-300 dark:before:border-gray-700 md:space-x-4 pb-5">
        <div className="relative pb-6 md:col-span-2">
          <div className="sticky top-28">
            <svg
              className="absolute left-[-38px] md:left-[-50px] color-bg-default color-fg-muted bg-white dark:bg-dark rounded-full dark:text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="28"
              height="28"
            >
              <path
                fillRule="evenodd"
                d="M15.5 11.75a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0zm1.444-.75a5.001 5.001 0 00-9.888 0H2.75a.75.75 0 100 1.5h4.306a5.001 5.001 0 009.888 0h4.306a.75.75 0 100-1.5h-4.306z"
                fill="currentColor"
              ></path>
            </svg>
            <h3 className="p-0 m-0 font-bold">{designation}</h3>

            {company_image ? (
              <div className="mt-2">
                {company_url ? (
                  <a className="p-0 m-0" href={company_url} target="_blank" rel="noreferrer">
                    <Image
                      src={company_image}
                      className="rounded-full shadow filter"
                      width={60}
                      height={60}
                      alt={company}
                      quality={50}
                    />
                    <p className="p-0 m-0 mt-4">{company}</p>
                  </a>
                ) : (
                  <div className="p-0 m-0">
                    <Image
                      src={company_image}
                      className="rounded-full shadow filter"
                      width={70}
                      height={70}
                      alt={company}
                      quality={100}
                    />
                    <p className="p-0 m-0 mt-4">{company}</p>
                  </div>
                )}
              </div>
            ) : null}

            {address ? <p className="p-0 m-0 text-sm font-light text-gray-500">{address}</p> : null}

            <p className="p-0 m-0 text-sm text-gray-500">
              <span className="font-bold">{duration}</span>
              <span className="ml-2 font-light">({duration_in_days})</span>
            </p>

            {job_type ? <span className="p-0 m-0 text-sm font-light text-gray-500 italic">[{job_type}]</span> : null}
            {job_location_type ? (
              <span className="p-0 m-0 ps-2 text-sm font-light text-gray-500 italic">[{job_location_type}]</span>
            ) : null}
          </div>
        </div>
        <div
          className="relative md:border-gray-300 md:dark:border-gray-400 md:col-span-4 text-sm text-inherit font-light pt-6"
          dangerouslySetInnerHTML={{ __html: description }}
        ></div>
      </article>
    </>
  )
}
