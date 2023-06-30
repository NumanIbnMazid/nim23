
const BACKEND_API_BASE_URL = process.env.BACKEND_API_BASE_URL
const BACKEND_API_TOKEN = process.env.BACKEND_API_TOKEN


// *** PROFILE ***
// Profile URL
const PROFILE_PATH = "users/get_portfolio_user/"
const PROFILE_ENDPOINT = BACKEND_API_BASE_URL + PROFILE_PATH

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
const EXPERIENCE_ENDPOINT = BACKEND_API_BASE_URL + EXPERIENCE_PATH

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
const SKILLS_ENDPOINT = BACKEND_API_BASE_URL + SKILLS_PATH

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
const EDUCATIONS_ENDPOINT = BACKEND_API_BASE_URL + EDUCATIONS_PATH

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
const CERTIFICATES_ENDPOINT = BACKEND_API_BASE_URL + CERTIFICATES_PATH

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

// *** PROJECTS ***

// Projects URL
const PROJECTS_PATH = "projects/"
const PROJECTS_ENDPOINT = BACKEND_API_BASE_URL + PROJECTS_PATH

/**
 * Makes a request to the BACKEND API to retrieve all Projects Data.
 */
export const getAllProjects = async () => {
  const allProjects = await fetch(
    PROJECTS_ENDPOINT,
    {
      headers: {
        Authorization: `Token ${BACKEND_API_TOKEN}`
      }
    }
  )

  if (allProjects.ok) {
    const responseData = await allProjects.json()
    return responseData.data
  } else {
    const errorMessage = `Error fetching Projects: ${allProjects.status} ${allProjects.statusText}`
    console.log(errorMessage)
  }
}

export const getProjectDetails = async (slug: string) => {
  const projectDetails = await fetch(
    PROJECTS_ENDPOINT + slug,
    {
      headers: {
        Authorization: `Token ${BACKEND_API_TOKEN}`
      }
    }
  )

  if (projectDetails.ok) {
    const responseData = await projectDetails.json()
    return responseData.data
  } else {
    const errorMessage = `Error fetching Project Details: ${projectDetails.status} ${projectDetails.statusText}`
    console.log(errorMessage)
  }
}


// *** INTERESTS ***

// Interests URL
const INTERESTS_PATH = "interests/"
const INTERESTS_ENDPOINT = BACKEND_API_BASE_URL + INTERESTS_PATH

/**
 * Makes a request to the BACKEND API to retrieve all Interests Data.
 */
export const getAllInterests = async () => {
  const allInterests = await fetch(
    INTERESTS_ENDPOINT,
    {
      headers: {
        Authorization: `Token ${BACKEND_API_TOKEN}`
      }
    }
  )

  if (allInterests.ok) {
    const responseData = await allInterests.json()
    return responseData.data
  } else {
    const errorMessage = `Error fetching Interests: ${allInterests.status} ${allInterests.statusText}`
    console.log(errorMessage)
  }
}


// *** MOVIES ***

// Movies URL
const MOVIE_PATH = "movies/"
const MOVIE_ENDPOINT = BACKEND_API_BASE_URL + MOVIE_PATH

/**
 * Makes a request to the BACKEND API to retrieve all Movies Data.
 */
export const getAllMovies = async () => {
  const allMovies = await fetch(
    MOVIE_ENDPOINT,
    {
      headers: {
        Authorization: `Token ${BACKEND_API_TOKEN}`
      }
    }
  )

  if (allMovies.ok) {
    const responseData = await allMovies.json()
    return responseData.data
  } else {
    const errorMessage = `Error fetching Movies: ${allMovies.status} ${allMovies.statusText}`
    console.log(errorMessage)
  }
}


// *** CODE_SNIPPETS ***

// Code Snippets URL
const CODE_SNIPPETS_PATH = "code-snippets/"
const CODE_SNIPPETS_ENDPOINT = BACKEND_API_BASE_URL + CODE_SNIPPETS_PATH

/**
 * Makes a request to the BACKEND API to retrieve all Code Snippets Data.
 */
export const getAllCodeSnippets = async () => {
  const allCodeSnippets = await fetch(
    CODE_SNIPPETS_ENDPOINT,
    {
      headers: {
        Authorization: `Token ${BACKEND_API_TOKEN}`
      }
    }
  )

  if (allCodeSnippets.ok) {
    const responseData = await allCodeSnippets.json()
    return responseData.data
  } else {
    const errorMessage = `Error fetching Code Snippets: ${allCodeSnippets.status} ${allCodeSnippets.statusText}`
    console.log(errorMessage)
  }
}

export const getCodeSnippetDetails = async (slug: string) => {
  const codeSnippetDetails = await fetch(
    CODE_SNIPPETS_ENDPOINT + slug,
    {
      headers: {
        Authorization: `Token ${BACKEND_API_TOKEN}`
      }
    }
  )

  if (codeSnippetDetails.ok) {
    const responseData = await codeSnippetDetails.json()
    return responseData.data
  } else {
    const errorMessage = `Error fetching Code Snippet Details: ${codeSnippetDetails.status} ${codeSnippetDetails.statusText}`
    console.log(errorMessage)
  }
}

// *** BLOGS ***

// Blogs URL
const BLOGS_PATH = "/posts"
const BLOGS_ENDPOINT = "https://jsonplaceholder.typicode.com" + BLOGS_PATH

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
