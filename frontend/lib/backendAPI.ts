
const BACKEND_API_BASE_URL = process.env.BACKEND_API_BASE_URL
const BACKEND_API_TOKEN = process.env.BACKEND_API_TOKEN


// *** PROFILE ***
// Profile URL
const PROFILE_PATH = "users/get_portfolio_user/"
const PROFILE_ENDPOINT = "http://127.0.0.1:8000/api/" + PROFILE_PATH

/**
 * Makes a request to the BACKEND API to retrieve Portfolio User Information.
 */
export const getProfileInfo = async () => {
  const portfolioProfile = await fetch(
    PROFILE_ENDPOINT,
    {
      headers: {
        Authorization: `Token ${BACKEND_API_TOKEN}`
      }
    }
  )

  if (portfolioProfile.ok) {
    const responseData = await portfolioProfile.json()
    return responseData.data
  } else {
    const errorMessage = `Error fetching portfolio profile: ${portfolioProfile.status} ${portfolioProfile.statusText}`
    // Handle the error or display the error message
    console.log(errorMessage)
  }
}

// *** SKILLS ***

// Skills URL
const SKILLS_PATH = "/todos?_limit=10"
const SKILLS_ENDPOINT = BACKEND_API_BASE_URL + SKILLS_PATH

/**
 * Makes a request to the BACKEND API to retrieve all Skills Data.
 */
export const getAllSkills = async () => {
  // Make a request to the DEV API to retrieve a specific page of posts
  const allSkills = await fetch(
    SKILLS_ENDPOINT
    // {
    //   headers: {
    //     api_key: DEV_API!,
    //   },
    // }
  )
    .then((response) => response.json())
    .catch((error) => console.log('Error fetching skills:', error))

  // TODO:Integrate with backend API
  // ******* Faking data Starts *******
  const fakeSkillsData = allSkills.map((_skill: { title: string }, index: number) => ({
    name: `Python ${index + 1}`,
    icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYY0pvHu6oaaJRADcCoacoP5BKwJN0i1nqFNCnmKvN&s"
  }))
  // Need to return `fakeSkillsData`
  // ******* Faking data Ends *******

  return fakeSkillsData
}


// *** BLOGS ***

// Blogs URL
const BLOGS_PATH = "/posts"
const BLOGS_ENDPOINT = BACKEND_API_BASE_URL + BLOGS_PATH

/**
 * Makes a request to the BACKEND API to retrieve all Blogs Data.
 */
export const getAllBlogs = async (length?: number | undefined) => {
  let ENDPOINT = null
  // Set limit if length is not undefined
  if (length !== undefined) {
    ENDPOINT = BLOGS_ENDPOINT + `?_limit=${length}`
  }
  else {
    ENDPOINT = BLOGS_ENDPOINT
  }

  const allBlogs = await fetch(
    ENDPOINT
  )
    .then((response) => response.json())
    .catch((error) => console.log('Error fetching blogs:', error))

  // TODO:Integrate with backend API
  // ******* Faking data Starts *******
  const fakeBlogsData = allBlogs.map((blog: { title: any, body: any }, index: number) => ({
    title: blog.title,
    slug: `blog-${index + 1}`,
    url: "https://github.com/NumanIbnMazid",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYY0pvHu6oaaJRADcCoacoP5BKwJN0i1nqFNCnmKvN&s",
    excerpt: blog.body,
    date: new Date(),
    readingTime: {text: "3 min read"},
  }))
  // Need to return `allBlogs`
  // ******* Faking data Ends *******

  return fakeBlogsData
}

// *** EXPERIENCE ***

// Experience URL
const EXPERIENCE_PATH = "/posts?_limit=5"
const EXPERIENCE_ENDPOINT = BACKEND_API_BASE_URL + EXPERIENCE_PATH

/**
 * Makes a request to the BACKEND API to retrieve all Experience Data.
 */
export const getAllExperiences = async () => {

  const allExperiences = await fetch(
    EXPERIENCE_ENDPOINT
  )
    .then((response) => response.json())
    .catch((error) => console.log('Error fetching experiences:', error))

  // TODO:Integrate with backend API
  // ******* Faking data Starts *******
  const fakeExperiencesData = allExperiences.map((experience: { title: any, body: any }) => ({
    title: "Software Engineer",
    company: experience.title.split(' ').slice(0, 3).join(' ').toUpperCase(),
    company_url: "https://github.com/NumanIbnMazid",
    duration: "2018 - 2019",
    description: experience.body
  }))
  // Need to return `allExperiences`
  // ******* Faking data Ends *******

  return fakeExperiencesData
}

// *** PROJECTS ***

// Certificate URL
const PROJECTS_PATH = "/posts?_limit=5"
const PROJECTS_ENDPOINT = BACKEND_API_BASE_URL + PROJECTS_PATH

/**
 * Makes a request to the BACKEND API to retrieve all Certificate Data.
 */
export const getAllProjects = async () => {

  const allProjects = await fetch(
    PROJECTS_ENDPOINT
  )
    .then((response) => response.json())
    .catch((error) => console.log('Error fetching Projects:', error))

  // TODO:Integrate with backend API
  // ******* Faking data Starts *******
  const fakeProjectsData = allProjects.map((project: { title: any, body: any }, index: number) => ({
    id: index,
    name: project.title.split(' ').slice(0, 3).join(' ').toUpperCase(),
    description: project.body,
    coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYY0pvHu6oaaJRADcCoacoP5BKwJN0i1nqFNCnmKvN&s",
    tools: ["Python", "Django", "JavaScript", "React", "Redux", "Node.js", "Express.js", "MongoDB", "PostgreSQL", "Docker", "AWS"],
    githubURL: "https://github.com/NumanIbnMazid",
    previewURL: "https://github.com/NumanIbnMazid"
  }))
  // Need to return `allExperiences`
  // ******* Faking data Ends *******

  return fakeProjectsData
}

// *** CERTIFICATES ***

// Certificate URL
const CERTIFICATES_PATH = "/posts?_limit=5"
const CERTIFICATES_ENDPOINT = BACKEND_API_BASE_URL + CERTIFICATES_PATH

/**
 * Makes a request to the BACKEND API to retrieve all Certificate Data.
 */
export const getAllCertificates = async () => {

  const allCertificates = await fetch(
    CERTIFICATES_ENDPOINT
  )
    .then((response) => response.json())
    .catch((error) => console.log('Error fetching Certificates:', error))

  // TODO:Integrate with backend API
  // ******* Faking data Starts *******
  const fakeCertificatesData = allCertificates.map((certificate: { title: any, body: any }, index: number) => ({
    id: index,
    title: certificate.title.split(' ').slice(0, 3).join(' ').toUpperCase(),
    orgName: "Hackerrank",
    orgLogo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYY0pvHu6oaaJRADcCoacoP5BKwJN0i1nqFNCnmKvN&s",
    issuedDate: new Date(),
    url: "https://github.com/NumanIbnMazid"
  }))
  // Need to return `allExperiences`
  // ******* Faking data Ends *******

  return fakeCertificatesData
}


// *** MOVIES ***

// Experience URL
const MOVIE_PATH = "/posts?_limit=5"
const MOVIE_ENDPOINT = BACKEND_API_BASE_URL + MOVIE_PATH

/**
 * Makes a request to the BACKEND API to retrieve all Movie Data.
 */
export const getAllMovies = async () => {

  const allMovies = await fetch(
    MOVIE_ENDPOINT
  )
    .then((response) => response.json())
    .catch((error) => console.log('Error fetching Movies:', error))

  // ******* Faking data Starts *******
  const fakeMoviesData = allMovies.map((movie: { title: any, body: any }, index: number) => ({
    id: index,
    url: "https://github.com/NumanIbnMazid",
    name: movie.title.split(' ').slice(0, 3).join(' ').toUpperCase(),
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYY0pvHu6oaaJRADcCoacoP5BKwJN0i1nqFNCnmKvN&s",
    watched: false,
    rating: 4
  }))
  // Need to return `allMovies`
  // ******* Faking data Ends *******
  return fakeMoviesData
}
