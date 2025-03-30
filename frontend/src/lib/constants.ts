export const BLOG_DEFAULT_IMAGE_PATH = '/static-images/blog.png'
export const USER_DEFAULT_IMAGE_PATH = '/static-images/user/avatar-male.png'
export const COMPANY_DEFAULT_IMAGE_PATH = '/static-images/company.png'
export const SKILL_DEFAULT_IMAGE_PATH = '/static-images/skill.png'
export const CERTIFICATE_DEFAULT_IMAGE_PATH = '/static-images/certificate.png'
export const INTEREST_DEFAULT_IMAGE_PATH = '/static-images/interest.png'
export const EDUCATION_DEFAULT_IMAGE_PATH = '/static-images/school.png'
export const PROJECT_DEFAULT_IMAGE_PATH = '/static-images/project.png'
export const SNIPPET_DEFAULT_IMAGE_PATH = '/static-images/code.png'
export const MOVIE_DEFAULT_IMAGE_PATH = '/static-images/movie.png'

const isDev = process.env.NODE_ENV !== 'production' // Check if in development mode
const port = process.env.PORT || 3000 // Use the defined port, otherwise default to 3000

export const PUBLIC_SITE_URL = isDev
  ? `http://localhost:${port}` // Localhost with dynamic port
  : process.env.MODE === 'STAGING'
  ? 'https://nim23-staging.vercel.app'
  : process.env.MODE === 'PRODUCTION'
  ? 'https://nim23.com'
  : 'http://localhost:3000'

export const STATIC_SITE_URL = isDev
  ? `http://localhost:${port}` // Localhost with dynamic port
  : process.env.MODE === 'STAGING'
  ? 'https://nim23-staging.vercel.app'
  : process.env.MODE === 'PRODUCTION'
  ? 'https://nim23.com'
  : 'http://localhost:3000'
