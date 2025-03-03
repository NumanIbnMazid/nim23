// *** Migration Starts ***

// *** ====================== Blog ====================== ***
export const getBlogs = async () => {
    const res = await fetch('/api/blogs');

    if (!res.ok) {
        throw new Error("Failed to fetch blogs");
    }

    return res.json();
};

export const getBlogBySlug = async (slug: string) => {
    const res = await fetch(`/api/blogs/${slug}`);

    if (!res.ok) {
        throw new Error("Failed to fetch blog");
    }

    return res.json();
};


// ==================================================================
// ==================================================================
// ========================== LEGACY CODES ==========================


const BACKEND_API_BASE_URL = process.env.BACKEND_API_BASE_URL
export const BACKEND_API_TOKEN = process.env.BACKEND_API_TOKEN

// *** ====================== BACKEND API URLs ====================== ***
// Profile URL
const PROFILE_PATH = "users/get_portfolio_user/"
export const PROFILE_ENDPOINT = BACKEND_API_BASE_URL + PROFILE_PATH

// Blogs URL
const BLOGS_PATH = "blogs/"
export const BLOGS_ENDPOINT = BACKEND_API_BASE_URL + BLOGS_PATH

// Blog Views URL
const BLOG_VIEWS_PATH = "blog-views/"
export const BLOG_VIEWS_ENDPOINT = BACKEND_API_BASE_URL + BLOG_VIEWS_PATH

// Blog Like URL
const BLOG_LIKE_PATH = "blog-views/like/"
export const BLOG_LIKE_ENDPOINT = BACKEND_API_BASE_URL + BLOG_LIKE_PATH

// Blog Comment URL
const BLOG_COMMENT_PATH = "blog-comments/"
export const BLOG_COMMENT_ENDPOINT = BACKEND_API_BASE_URL + BLOG_COMMENT_PATH

// Newsletter Subscription URL
const NEWSLETTER_SUBSCRIPTION_PATH = "newsletter-subscription/"
export const NEWSLETTER_SUBSCRIPTION_ENDPOINT = BACKEND_API_BASE_URL + NEWSLETTER_SUBSCRIPTION_PATH

// Code Snippets URL
const CODE_SNIPPETS_PATH = "code-snippets/"
export const CODE_SNIPPETS_ENDPOINT = BACKEND_API_BASE_URL + CODE_SNIPPETS_PATH

// Code Snippet Views URL
const SNIPPET_VIEWS_PATH = "code-snippet-views/"
export const SNIPPET_VIEWS_ENDPOINT = BACKEND_API_BASE_URL + SNIPPET_VIEWS_PATH

// Code Snippet Likes URL
const SNIPPET_LIKE_PATH = "code-snippet-views/like/"
export const SNIPPET_LIKE_ENDPOINT = BACKEND_API_BASE_URL + SNIPPET_LIKE_PATH

// Code Snippet Comment URL
const SNIPPET_COMMENT_PATH = "code-snippet-comments/"
export const SNIPPET_COMMENT_ENDPOINT = BACKEND_API_BASE_URL + SNIPPET_COMMENT_PATH

// Code Snippet Comment List URL
const SNIPPET_COMMENT_LIST_PATH = "code-snippet-comments/"
export const SNIPPET_COMMENT_LIST_ENDPOINT = BACKEND_API_BASE_URL + SNIPPET_COMMENT_LIST_PATH

// Movies URL
const MOVIE_PATH = "movies/"
export const MOVIE_ENDPOINT = BACKEND_API_BASE_URL + MOVIE_PATH

// Experience URL
const EXPERIENCE_PATH = "professional-experiences/"
export const EXPERIENCE_ENDPOINT = BACKEND_API_BASE_URL + EXPERIENCE_PATH

// Educations URL
const EDUCATIONS_PATH = "educations/"
export const EDUCATIONS_ENDPOINT = BACKEND_API_BASE_URL + EDUCATIONS_PATH

// Skills URL
const SKILLS_PATH = "skills/"
export const SKILLS_ENDPOINT = BACKEND_API_BASE_URL + SKILLS_PATH

// Certificates URL
const CERTIFICATES_PATH = "certifications/"
export const CERTIFICATES_ENDPOINT = BACKEND_API_BASE_URL + CERTIFICATES_PATH

// Interests URL
const INTERESTS_PATH = "interests/"
export const INTERESTS_ENDPOINT = BACKEND_API_BASE_URL + INTERESTS_PATH

// Projects URL
const PROJECTS_PATH = "projects/"
export const PROJECTS_ENDPOINT = BACKEND_API_BASE_URL + PROJECTS_PATH
