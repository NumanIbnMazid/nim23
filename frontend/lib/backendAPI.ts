
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
const BLOGS_PATH = "blogs/"
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
    ENDPOINT,
    {
      headers: {
        Authorization: `Token ${BACKEND_API_TOKEN}`
      }
    }
  )

  if (allBlogs.ok) {
    const responseData = await allBlogs.json()
    return responseData.data
  } else {
    const errorMessage = `Error fetching Blogs: ${allBlogs.status} ${allBlogs.statusText}`
    console.log(errorMessage)
  }
}

export const getBlogDetails = async (slug: string) => {
  const blogDetails = await fetch(
    BLOGS_ENDPOINT + slug,
    {
      headers: {
        Authorization: `Token ${BACKEND_API_TOKEN}`
      }
    }
  )

  if (blogDetails.ok) {
    const responseData = await blogDetails.json()
    return responseData.data
  } else {
    const errorMessage = `Error fetching Blog Details: ${blogDetails.status} ${blogDetails.statusText}`
    console.log(errorMessage)
  }
}


// *** NEWSLETTER-SUBSCRIPTION ***

// Blogs URL
const NEWSLETTER_SUBSCRIPTION_PATH = "newsletter-subscription/"
const NEWSLETTER_SUBSCRIPTION_ENDPOINT = BACKEND_API_BASE_URL + NEWSLETTER_SUBSCRIPTION_PATH

/**
 * Makes a POST request to the BACKEND API to subscribe to the newsletter.
 * @param {string} email - The email address to subscribe to the newsletter.
 * @returns {Promise} A promise that resolves to the response data or an error message.
*/
export const subscribeToNewsletter = async (email: string) => {
  const response = await fetch(NEWSLETTER_SUBSCRIPTION_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${BACKEND_API_TOKEN}`,
    },
    body: JSON.stringify({ email }),
  })

  const responseData = await response.json()
  return responseData.data
}


// *** BLOG-VIEWS ***

// Blogs URL
const BLOG_VIEWS_PATH = "blog-views/"
const BLOG_VIEWS_ENDPOINT = BACKEND_API_BASE_URL + BLOG_VIEWS_PATH

/**
 * Makes a POST request to the BACKEND API.
 * @param {string} slug - The slug of the blog.
 * @returns {Promise} A promise that resolves to the response data or an error message.
*/
export const addBlogViews = async (clientID: string, slug: string) => {
  const response = await fetch(BLOG_VIEWS_ENDPOINT + `?slug=${slug}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${BACKEND_API_TOKEN}`,
    },
    body: JSON.stringify({ clientID }),
  })

  const responseData = await response.json()
  return responseData.data
}


// *** BLOG-LIKE ***

// Blogs URL
const BLOG_LIKE_PATH = "blog-views/like/"
const BLOG_LIKE_ENDPOINT = BACKEND_API_BASE_URL + BLOG_LIKE_PATH

/**
 * Makes a POST request to the BACKEND API.
 * @param {string} slug - The slug of the blog.
 * @returns {Promise} A promise that resolves to the response data or an error message.
*/
export const addBlogLike = async (slug: string) => {
  const response = await fetch(BLOG_LIKE_ENDPOINT + `?slug=${slug}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${BACKEND_API_TOKEN}`,
    },
    body: null,
  })

  const responseData = await response.json()
  return responseData.data
}


// *** BLOG-COMMENT ***

// Blogs URL
const BLOG_COMMENT_PATH = "blog-comments/"
const BLOG_COMMENT_ENDPOINT = BACKEND_API_BASE_URL + BLOG_COMMENT_PATH

/**
 * Makes a POST request to the BACKEND API.
 * @param {string} name - Name of user.
 * @param {string} email - Email address of user.
 * @param {string} comment - Content of the comment.
 * @returns {Promise} A promise that resolves to the response data or an error message.
*/
export const addBlogComment = async (name: string, email: string, comment: string, slug: string) => {
  const response = await fetch(BLOG_COMMENT_ENDPOINT + `?slug=${slug}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${BACKEND_API_TOKEN}`,
    },
    body: JSON.stringify({ name, email, comment }),
  })

  const responseData = await response.json()
  return responseData.data
}


// *** BLOG-COMMENT-LIST ***

// Blog Comments URL
const BLOG_COMMENT_LIST_PATH = "blog-comments/"
const BLOG_COMMENT_LIST_ENDPOINT = BACKEND_API_BASE_URL + BLOG_COMMENT_LIST_PATH

/**
 * Makes a request to the BACKEND API to retrieve all Blog Comments Data.
 */
export const getAllBlogComments = async (slug: string) => {
  const allBlogComments = await fetch(
    BLOG_COMMENT_LIST_ENDPOINT + `?slug=${slug}`,
    {
      method: "GET",
      headers: {
        Authorization: `Token ${BACKEND_API_TOKEN}`
      }
    }
  )

  if (allBlogComments.ok) {
    const responseData = await allBlogComments.json()
    return responseData.data
  } else {
    const errorMessage = `Error fetching Blog Comments: ${allBlogComments.status} ${allBlogComments.statusText}`
    console.log(errorMessage)
  }
}

// *** SNIPPET-VIEWS ***

// Snippets URL
const SNIPPET_VIEWS_PATH = "code-snippet-views/"
const SNIPPET_VIEWS_ENDPOINT = BACKEND_API_BASE_URL + SNIPPET_VIEWS_PATH

/**
 * Makes a POST request to the BACKEND API.
 * @param {string} slug - The slug of the snippet.
 * @returns {Promise} A promise that resolves to the response data or an error message.
*/
export const addSnippetViews = async (clientID: string, slug: string) => {
  const response = await fetch(SNIPPET_VIEWS_ENDPOINT + `?slug=${slug}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${BACKEND_API_TOKEN}`,
    },
    body: JSON.stringify({ clientID }),
  })

  const responseData = await response.json()
  return responseData.data
}


// *** SNIPPET-LIKE ***

// Snippets URL
const SNIPPET_LIKE_PATH = "code-snippet-views/like/"
const SNIPPET_LIKE_ENDPOINT = BACKEND_API_BASE_URL + SNIPPET_LIKE_PATH

/**
 * Makes a POST request to the BACKEND API.
 * @param {string} slug - The slug of the snippet.
 * @returns {Promise} A promise that resolves to the response data or an error message.
*/
export const addSnippetLike = async (slug: string) => {
  const response = await fetch(SNIPPET_LIKE_ENDPOINT + `?slug=${slug}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${BACKEND_API_TOKEN}`,
    },
    body: null,
  })

  const responseData = await response.json()
  return responseData.data
}


// *** SNIPPET-COMMENT ***

// Snippets URL
const SNIPPET_COMMENT_PATH = "code-snippet-comments/"
const SNIPPET_COMMENT_ENDPOINT = BACKEND_API_BASE_URL + SNIPPET_COMMENT_PATH

/**
 * Makes a POST request to the BACKEND API.
 * @param {string} name - Name of user.
 * @param {string} email - Email address of user.
 * @param {string} comment - Content of the comment.
 * @returns {Promise} A promise that resolves to the response data or an error message.
*/
export const addSnippetComment = async (name: string, email: string, comment: string, slug: string) => {
  const response = await fetch(SNIPPET_COMMENT_ENDPOINT + `?slug=${slug}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${BACKEND_API_TOKEN}`,
    },
    body: JSON.stringify({ name, email, comment }),
  })

  const responseData = await response.json()
  return responseData.data
}


// *** SNIPPET-COMMENT-LIST ***

// Cnippet Comments URL
const SNIPPET_COMMENT_LIST_PATH = "code-snippet-comments/"
const SNIPPET_COMMENT_LIST_ENDPOINT = BACKEND_API_BASE_URL + SNIPPET_COMMENT_LIST_PATH

/**
 * Makes a request to the BACKEND API to retrieve all Snippet Comments Data.
 */
export const getAllSnippetComments = async (slug: string) => {
  const allSnippetComments = await fetch(
    SNIPPET_COMMENT_LIST_ENDPOINT + `?slug=${slug}`,
    {
      method: "GET",
      headers: {
        Authorization: `Token ${BACKEND_API_TOKEN}`
      }
    }
  )

  if (allSnippetComments.ok) {
    const responseData = await allSnippetComments.json()
    return responseData.data
  } else {
    const errorMessage = `Error fetching Snippet Comments: ${allSnippetComments.status} ${allSnippetComments.statusText}`
    console.log(errorMessage)
  }
}
