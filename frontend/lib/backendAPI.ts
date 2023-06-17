
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

// *** EXPERIENCE ***

// Experience URL

const EXPERIENCE_PATH = "professional-experiences/"
const EXPERIENCE_ENDPOINT = "http://127.0.0.1:8000/api/" + EXPERIENCE_PATH

/**
 * Makes a request to the BACKEND API to retrieve all Experience Data.
 */
export const getAllExperiences = async (length?: number | undefined) => {
  let ENDPOINT = null
  // Set limit if length is not undefined
  if (length !== undefined) {
    ENDPOINT = EXPERIENCE_ENDPOINT + `?_limit=${length}`
  }
  else {
    ENDPOINT = EXPERIENCE_ENDPOINT
  }

  const allExperiences = await fetch(
    ENDPOINT,
    {
      headers: {
        Authorization: `Token ${BACKEND_API_TOKEN}`
      }
    }
  )

  if (allExperiences.ok) {
    const responseData = await allExperiences.json()
    return responseData.data
  } else {
    const errorMessage = `Error fetching professional experiences: ${allExperiences.status} ${allExperiences.statusText}`
    // Handle the error or display the error message
    console.log(errorMessage)
  }
}

// *** SKILLS ***

// Skills URL
const SKILLS_PATH = "skills/"
const SKILLS_ENDPOINT = "http://127.0.0.1:8000/api/" + SKILLS_PATH

/**
 * Makes a request to the BACKEND API to retrieve all Skills Data.
 */
export const getAllSkills = async () => {
  const allSkills = await fetch(
    SKILLS_ENDPOINT,
    {
      headers: {
        Authorization: `Token ${BACKEND_API_TOKEN}`
      }
    }
  )

  if (allSkills.ok) {
    const responseData = await allSkills.json()
    return responseData.data
  } else {
    const errorMessage = `Error fetching Skills: ${allSkills.status} ${allSkills.statusText}`
    console.log(errorMessage)
  }
}

// *** EDUCATIONS ***

// Educations URL
const EDUCATIONS_PATH = "educations/"
const EDUCATIONS_ENDPOINT = "http://127.0.0.1:8000/api/" + EDUCATIONS_PATH

/**
 * Makes a request to the BACKEND API to retrieve all Educations Data.
 */
export const getAllEducations = async () => {
  const allEducations = await fetch(
    EDUCATIONS_ENDPOINT,
    {
      headers: {
        Authorization: `Token ${BACKEND_API_TOKEN}`
      }
    }
  )

  if (allEducations.ok) {
    const responseData = await allEducations.json()
    return responseData.data
  } else {
    const errorMessage = `Error fetching Educations: ${allEducations.status} ${allEducations.statusText}`
    console.log(errorMessage)
  }
}

// *** CERTIFICATES ***

// Certificates URL
const CERTIFICATES_PATH = "certifications/"
const CERTIFICATES_ENDPOINT = "http://127.0.0.1:8000/api/" + CERTIFICATES_PATH

/**
 * Makes a request to the BACKEND API to retrieve all Certificates Data.
 */
export const getAllCertificates = async () => {
  const allCertificates = await fetch(
    CERTIFICATES_ENDPOINT,
    {
      headers: {
        Authorization: `Token ${BACKEND_API_TOKEN}`
      }
    }
  )

  if (allCertificates.ok) {
    const responseData = await allCertificates.json()
    return responseData.data
  } else {
    const errorMessage = `Error fetching Educations: ${allCertificates.status} ${allCertificates.statusText}`
    console.log(errorMessage)
  }
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
