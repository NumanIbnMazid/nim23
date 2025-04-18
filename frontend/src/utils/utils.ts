import myImage from '@/assets/images/numan.png'

export const AvatarImage: string = 'https://i.postimg.cc/VNPQXDP7/numan.jpg'
export const homeProfileImage = myImage
export const cvURL: string = 'https://drive.google.com/file/d/1mOH_uleS7qqAitmpZduN6MkQrlJOAsM8/view?usp=sharing'

export const navigationRoutes: string[] = [
  'home',
  'about',
  'projects',
  'snippets',
  'blogs',
  'entertainment',
  'stats',
  'contact',
  'privacy',
  'apps',
]

export const navigationRoutesAll: string[] = [
  'home',
  'about',
  'projects',
  'snippets',
  'blogs',
  'entertainment',
  'stats',
  'contact',
  'privacy',
  'apps',
  'apps/grabit',
  'apps/humanizer-ai',
  'apps/recommendr',
]

export const namedNavigationRoutesAll: { [key: string]: string } = {
  home: 'Home',
  about: 'About',
  projects: 'Projects',
  snippets: 'Snippets',
  blogs: 'Blogs',
  entertainment: 'Entertainment',
  stats: 'Stats',
  contact: 'Contact',
  privacy: 'Privacy',
  apps: 'Apps',
  'apps/grabit': 'Grabit',
  'apps/humanizer-ai': 'Humanizer AI',
  'apps/recommendr': 'Recommendr',
}
