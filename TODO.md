# TODO List

- (DONE) Refine Project

  - (DONE) Remove all templates and static files
  - (DONE) Remove django unicorn dependency
  - (DONE) Remove all unnecessary dependencies from requirements

- (DONE) Update Master and Dev Branch with refined project

- (DONE) Design Starter Template

  - (DONE) Design starter template using tailwind CSS official documentation
  - Minimum Requirements
    - (DONE) Sticky Navbar (hamburger menu support)
    - (DONE) Dark/Light Switch
    - (DONE) TailwindCSS official documentation like background (or like flowbite)
    - (DONE) A demo body element
    - (DONE) Footer

- Utilities

  - (DONE) Configure EmailJS (Contact Form). Better if mail would send via backend api.
  - (REMOVED) Fix Utilities Page.
  - (DONE) Fix Every page's meta option.
  - (DONE) Fix Snippets, (REMOVED) Newsletter, (REMOVED) RSS, (REMOVED) dev.to.
  - (DONE) Fix footer.
  - (DONE) Fix Visitor Count.
  - (DONE) Fix Bar code Scanner.
  - (REMOVED) Fix Spotify.
  - Implement Youtube Stats.
  - (DONE) Add YouTube Videos Page.
  - Implement `generate_order` pre_save signal as a decorator and use in all django models where order is used.
  - (DONE) Implement Loader in All pages.
  - (DONE) Create and Update Site Logo.
  - Remove all custom model manager as these are not needed in this project scope.
  - (DONE) Fix blog slug page.
  - (DONE) Generate auto token after expiration or make token to expire never.
  - (DONE) Test Rich Text Editor Image or File Upload and keep only Tinymce, remove others.
  - (DONE) Implement Tailwind Documentation Page's Background Color.
  - (DONE) Implement Blog Comment, Reply (NOT NEEDED), Like Features.
  - Add PDF Reader or Modal on Project Details.
  - Implemet Full Text Search.
  - (NOT NEEDED) Configure for MySQL Database.
  - (DONE) Generate normal requirements.txt.
  - (DONE) Fix File Browser in cPanel.
  - (DONE) Make Swagger, Redoc, Filebrowser is authenticated required.
  - (DONE) Implement if blog content contains code, then don't show reading time.
  - Investigate about RSS and Newsletter.
  - (NOT NEEDED) Make frontend server.js Allowed Hosts come from env.
  - (DONE) Auto remove unused files (media) from backend.
  - (DONE) Fix Page Title (browser tab title).
  - (DONE) Fix Blog Details Page Content Width.
  - (DONE) Fix Contact Page's Mail Sending. Mail sending not working in live and change the mail to nim23.official.
  - (DONE) FIx Newsletter subscription message.
  - (DONE) Replace `autoSlugWithFieldAndUUID` to `autoslugFromField` in backend models like blog, project etc.
  - (DONE) Fix Order Null Violation. Interests section is working on Server.
  - (DONE) Add Job Location Type in Professional Experience section like: Hybrid, Remote, Onsite.
  - (DONE) Fix Project Details page's Technology background color. Use project index page.
  - (DONE) Fix unnecessary loading time if api fetch finished.
  - Fix Social Media Share Page Title and Description.
  - (DONE) Add submit issue page.
  - (DONE) Enlarge Certificate Image Size and add Modal (Image Viewer) on image click.
  - (DONE) Bring blog title center in blog details page.
  - (DONE) Add some padding in Recent watched movies section's heading (Mobile View).
  - (DONE) Rename Code-Snippets to Snippets.
  - Make movies section horizontal scrollbar larger.
  - (DONE) Fix skill order violation in server (urgent).
  - (DONE) Provide fixed height width (style) to skill images.
  - (DONE) Use Lazyloading on images: <https://web.dev/codelab-use-lazysizes-to-lazyload-images/>.
  - (DONE) Add Image viewer for Media Pages like Project Details.
  - (DONE) Fix Project List Click Event. It includes link of project but navigating to project details.
  - (DONE) Remove Slideshow plugin from certificate image viewer.
  - (NOT NEEDED) Provide srcSet in Project Details media image viewer so that all images can slideshow.
  - (DONE) Identify from where the text "0" is coming in project details page (i-Host) and fix it.
  - (DONE) Make blogs and snippets code block horizontal scrollable.
  - (DONE) Add tags to snippets.
  - Try to add dark mode in Django Admin.
  - (DONE) Add some margin in project detail's page's description.
  - (DONE) Place the project links top of the project details page instead of bottom.
  - (DONE) Bring Technology and Link center in project details page.
  - (NOT NEEDED) Load all videos from youtube instead of 10 and add pagination.
  - (DONE) Move Recent Watched Movies to Media page from About.
  - (DONE) Donot show Youtube Videos section even not page title if youtube videos are not available.
  - (DONE) Remove Maximum height from code section (snippets/blogs).
  - (DONE) Sort blogs by latest and order.
  - (DONE) Blog PDF is not respecting the scrollable content.
  - (DONE) Fix commands color in blog in light mode.
  - (DONE) Remove Clickable link in code blocks.
  - (DONE) Remove or Fix Table of Contents in Blog Print mode.
  - (DONE) Fix timezone (BD).
  - (DONE) Add comment like and total view features in Snippets.
  - (DONE) Fix Like Bug.
  - (DONE) Fix newsletter subscription bug.
  - (DONE) Fix Blog and Snippet Details page's Dynamic Meta loading issue. Meta is loading, there is no initial loader.
  - Use SWR for Data Fetching.
  - (DONE) Investigate on app routes and get the differences between app and pages routes.
  - (DONE) On every details page like blog details, project details, details api is calling twice. Once in getServersideProps and another in useEffect. Fix it. It is initially done because of dynamic meta tags issue. In server side props or any other server side function we don't have acces of useContext or localstorage. So we cannot use method `useClientID`. Now we are passing hardcoded client id 1. But it is not a good practice. So we need to fix it.
  - Create a installation guide for the project on README.md.
  - Fix different BACKEND_API_BASE_URL for production and development. Make identical.
  - Fix Details page bug in Docker environment.
  - Make BLOG_ENDPOINT Dynamic in BlogLayout.
  - (DONE) Fix Blog View Increment API. First api calls gives error but later ones don't.
  - (DONE) Fix code highlighting.
  - (DONE) Fix font in work experience section.
  - (DONE) Fix Newsletter section's email placeholder.
  - (DONE) While click print button, disable scroll on code highlight section.
  - Add functionality for newsletter feature.
  - (DONE) Remove `export const dynamic = 'force-dynamic'` from every page.tsx. Then check yarn build if it fails. Specially in Home Page. Others are working fine a guess, but removing would be better.
  - (DONE) Add audio file size to show in format details. Remove file size if still providing incorrect information.
  - (DONE) Add progress of download.
  - (DONE) Add Iframe to show video details.
  - (DONE) Fix status message after error: processing videos.
  - (DONE) Hide media type and other fields while fetching video information.
  - (DONE) Fix Audio download issue.
  - (DONE) Add yt-dlp fallback for other platforms support.
  - Implement API Rate Limiting.
  - (DONE) Add timer to detect problems while downloading and show error message.
  - (DONE) Problem while download taking more that 1 minute because of Vercel limitation. Implement chunk by chunk download on content with timer.
  - Debug Video download Error for this URL: https://www.youtube.com/watch?v=kKndI2sAiBU&ab_channel=DeeptoNews. Error: Failed to download media file! ErrnoError: FS error
  - Integrate image viewer in blog or snippets details page.
  - Implement API rate limiting globally and for humanizer_ai.
  - Add minimum word count in humanizer ai.
  - (NOT NEEDED) Recommendr: Download IMDB data locally after a certain period of time and look in that instead of everytime fetching from IMDB.
  - Recommendr: Add uniqueness of recommendation while recommending media using recommendr.
  - Recommendr: Ask user in frontend about what metadata they wants and warn them it will be slow.
  - Recommendr: Make recommendr preferences dynamic from database.
  - Recommendr: Add play button for spotify music.
  - (DONE) Recommendr: Show Mandatory fields first, and then all other fields collapsed. So that user might not have to press next everytime to filter.
  - (DONE) Recommendr: Keep form state while updating preferences.
  - (DONE) Recommendr: Show engaging message while fetching recommendations.
  - (DONE) Recommendr: Show current active filters.
  - Recommendr: Generate preferences in such a way so that they do not contradict with each other.


## Improvement

- [ ] Fix pydantic env file discovery in config. Get rid of hardcoded relative path.

## Performance Analyzer

<https://pagespeed.web.dev>

### 18-07-2023

Mobile:

Performance: 26
Accessibility: 96
Best Practices: 83
SEO: 98

Desktop:

Performance: 66
Accessibility: 96
Best Practices: 83
SEO: 100

### 18-07-2023 (After Optimization)

Mobile:

Performance: 50
Accessibility: 96
Best Practices: 83
SEO: 99

Desktop:

Performance: 70
Accessibility: 96
Best Practices: 83
SEO: 100

### 19-07-2023

Mobile:

Performance: 54
Accessibility: 98
Best Practices: 83
SEO: 99

Desktop:

Performance: 95
Accessibility: 98
Best Practices: 83
SEO: 100

### 27-03-2025

Mobile:

Performance: 69
Accessibility: 98
Best Practices: 100
SEO: 100

Desktop:

Performance: 92
Accessibility: 98
Best Practices: 100
SEO: 100
