const BACKEND_API_BASE_URL = process.env.BACKEND_API_BASE_URL

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
  const fakeSkillsData = allSkills.map((skill: { title: any }, index: number) => ({
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
let BLOGS_ENDPOINT = BACKEND_API_BASE_URL + BLOGS_PATH

/**
 * Makes a request to the BACKEND API to retrieve all Blogs Data.
 */
export const getAllBlogs = async (length?: number | undefined) => {
  // Set limit if length is not undefined
  if (length !== undefined) {
    BLOGS_ENDPOINT = BLOGS_ENDPOINT + `?_limit=${length}`
  }

  const allBlogs = await fetch(
    BLOGS_ENDPOINT
  )
    .then((response) => response.json())
    .catch((error) => console.log('Error fetching blogs:', error))

  // TODO:Integrate with backend API
  // ******* Faking data Starts *******
  const fakeBlogsData = allBlogs.map((blog: { title: any, body: any }, index: number) => ({
    title: blog.title,
    slug: `blog-${index + 1}`,
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
let EXPERIENCE_ENDPOINT = BACKEND_API_BASE_URL + EXPERIENCE_PATH

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
  const fakeExperiencesData = allExperiences.map((experience: { title: any, body: any }, index: number) => ({
    title: "Software Engineer",
    company: experience.title.split(' ').slice(0, 3).join(' ').toUpperCase(),
    company_url: "https:selise.com",
    duration: "2018 - 2019",
    description: experience.body
  }))
  // Need to return `allExperiences`
  // ******* Faking data Ends *******

  return fakeExperiencesData
}

// *** MOVIES ***

// Experience URL
const MOVIE_PATH = "/posts?_limit=5"
let MOVIE_ENDPOINT = BACKEND_API_BASE_URL + MOVIE_PATH

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
    url: "https:example.com",
    name: movie.title.split(' ').slice(0, 3).join(' ').toUpperCase(),
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYY0pvHu6oaaJRADcCoacoP5BKwJN0i1nqFNCnmKvN&s",
    watched: false,
    rating: 4
  }))
  // Need to return `allMovies`
  // ******* Faking data Ends *******
  return fakeMoviesData
}
