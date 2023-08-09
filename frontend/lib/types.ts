import { Variants } from "framer-motion"
import { MDXRemoteSerializeResult } from "next-mdx-remote"
import React from "react"
import { IconType } from "react-icons/lib"
import { ReadTimeResults } from "reading-time"


/* Static Data Types */
export type PersonalStaticData = {
  name: string,
  nickname: string,
  current_designation: string,
  current_company: string,
  about: string
}

export type StaticData = {
  personal: PersonalStaticData
}

/* Profile Types */
export type ProfileType = {
  id: number
  username: string
  email: string
  name: string
  slug: string
  nickname: string
  gender: string
  image: string
  dob: string
  website: string
  contact: string
  contact_email: string
  linkedin: string
  github: string
  address: string
  about: string
  is_portfolio_user: string
  resume_link: string
  is_active: string
  is_staff: string
  is_superuser: string
  date_joined: string
  last_login: string
  updated_at: string
}

/* Custom Animated Components types */
export type AnimatedTAGProps = {
  variants: Variants
  className?: string
  children: React.ReactNode
  infinity?: boolean
}

/* Spotify Track  */
export type SpotifyTrack = {
  id: number
  title: string
  url: string
  coverImage: {
    url: string
  }
  artist: string
}

/* Spotify Artist  */
export type SpotifyArtist = {
  id: number
  name: string
  url: string
  coverImage: {
    url: string
  }
  popularity: number
}

export type MediaType = {
  id: number
  title: string
  slug: string
  file: string
  description: string
  created_at: string
  updated_at: string
}

export type ProjectType = {
  id: string
  title: string
  slug: string
  image: string
  short_description: string
  technology?: string
  duration: string
  duration_in_days?: string
  preview_url?: string
  github_url?: string
  description?: string
  project_media?: MediaType[]
  created_at: string
  updated_at: string
}

export type ExperienceType = {
  id: number
  slug: string
  company: string
  company_image: string
  company_url?: string
  address?: string
  designation: string
  job_type: string
  job_location_type?: string
  start_date: string
  end_date?: string
  duration: string
  duration_in_days: string
  currently_working?: string
  description?: string
  created_at: string
  updated_at: string
}

export type SkillType = {
  id: number
  slug: string
  title: string
  image: string
  level?: string
  order: number
  created_at: string
  updated_at: string
}

export type EducationType = {
  id: number
  slug: string
  school: string
  image: string
  degree: string
  address?: string
  field_of_study?: string
  duration: string
  grade?: string
  activities?: string
  description?: string
  education_media?: MediaType[]
  created_at: string
  updated_at: string
}

export type CertificateType = {
  id: string
  title: string
  slug: string
  organization: string
  address?: string
  image: string
  issue_date: string
  expiration_date?: string
  credential_id?: string
  credential_url?: string
  description?: string
  certification_media?: MediaType[]
  created_at: string
  updated_at: string
}

export type InterestType = {
  id: number
  slug: string
  title: string
  icon: string
  order: number
  created_at: string
  updated_at: string
}

export type SocialPlatform = {
  title: string
  Icon: IconType
  url: string
}

export type UtilityType = {
  title: string
  data: {
    name: string
    description: string
    Icon: IconType | JSX.Element
    link: string
  }[]
}

export type Utilities = {
  title: string
  description: string
  lastUpdate: string
  data: UtilityType[]
}

export type CodeSnippetType = {
  slug: string
  title: string
  overview?: string
  image: string
  language?: string
  tags?: string
  content: string
  order: number
  created_at: string
  updated_at: string
}

export type BlogCategoryType = {
  id: number
  name: string
  slug: string
  created_at: string
  updated_at: string
}

export type TableOfContents = {
  id: string
  level: number
  heading: string
}

export type BlogType = {
  id: number
  slug: string
  title: string
  category?: BlogCategoryType
  image: string
  overview?: string
  content: string
  author: string
  tags?: string
  status: string
  order: number
  table_of_contents: TableOfContents[]
  created_at: string
  updated_at: string
}

export type FrontMatter = {
  slug: string
  readingTime: ReadTimeResults
  excerpt: string
  title: string
  date: string
  keywords: string
  image: string
  url: string
}

export type PostType = {
  meta: FrontMatter
  source: MDXRemoteSerializeResult
  tableOfContents: TableOfContents[]
}

export type SupportMe = {
  name: string
  url: string
  Icon: IconType
}

export type Song = {
  album: string
  artist: string
  albumImageUrl: string
  isPlaying: boolean
  songUrl: string
  title: string
}

export type FormInput = {
  to_name: string
  first_name: string
  last_name: string
  email: string
  subject: string
  message: string
}

export type SpotifyAccessToken = {
  access_token: string
}

export type GithubRepo = {
  stargazers_count: number
  fork: boolean
  forks_count: number
}

export type PageData = {
  title: string
  description: string
  image: string
  keywords: string
}

export type PageMeta = {
  home: PageData
  stats: PageData
  blogs: PageData
  certificates: PageData
  projects: PageData
  about: PageData
  media: PageData
  privacy: PageData
  contact: PageData
  snippets: PageData
}

export type MovieType = {
  id: number
  slug: string
  name: string
  image: string
  url?: string
  year?: number
  watched: boolean
  rating?: number
  created_at: string
  updated_at: string
}

export type YoutubeVideoType = {
  id: {
    videoId: string
  }
  snippet: {
    title: string
    description: string
    thumbnails: {
      default: {
        url: string
        width: number
        height: number
      }
      medium: {
        url: string
        width: number
        height: number
      }
      high: {
        url: string
        width: number
        height: number
      }
    }
    publishedAt: string
  },
  nextPageToken: string,
  prevPageToken: string,
  pageInfo: {
    totalResults: number
    resultsPerPage: number
  }
}
