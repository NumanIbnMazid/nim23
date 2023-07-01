import myImage from "/public/images/profile-pic.png"

export const DEFAULT_IMAGE_URL: string = "https://imgur.com/5dYYce8.png"
export const AvatarImage: string = "https://imgur.com/VAXEwKT.png"
export const homeProfileImage = myImage
export const cvURL: string = "https://drive.google.com/file/d/1mOH_uleS7qqAitmpZduN6MkQrlJOAsM8/view?usp=sharing"

export const navigationRoutes: string[] = [
  "home",
  "about",
  "stats",
  "blogs",
  "projects",
  "code-snippets",
  "contact",
  "privacy",
]

export const snippetsImages: { [key: string]: string } = {
  css: "https://imgur.com/ArD8JIg.png",
  js: "https://imgur.com/lFKi8mB.png",
  react: "https://imgur.com/m2jv6MK.png",
  ts: "https://imgur.com/Ux6L5Uh.png",
  supabase: "https://imgur.com/xgNKVQa.png",
}
