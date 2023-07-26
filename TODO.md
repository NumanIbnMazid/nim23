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
  - Add YouTube Videos Page.
  - Implement `generate_order` pre_save signal as a decorator and use in all django models where order is used.
  - (DONE) Implement Loader in All pages.
  - (DONE) Create and Update Site Logo.
  - Remove all custom model manager as these are not needed in this project scope.
  - (DONE) Fix blog slug page.
  - (DONE) Generate auto token after expiration or make token to expire never.
  - (DONE) Test Rich Text Editor Image or File Upload and keep only Tinymce, remove others.
  - (DONE) Implement Tailwind Documentation Page's Background Color.
  - Implement Blog Comment, Reply, Like Features.
  - Add PDF Reader or Modal on Project Details.
  - Implemet Full Text Search.
  - (NOT NEEDED) Configure for MySQL Database.
  - (DONE) Generate normal requirements.txt.
  - (DONE) Fix File Browser in cPanel.
  - (DONE) Make Swagger, Redoc, Filebrowser is authenticated required.
  - Implement if blog content contains code, then don't show reading time.
  - Investigate about RSS and Newsletter.
  - (NOT NEEDED) Make frontend server.js Allowed Hosts come from env.
  - (DONE) Auto remove unused files (media) from backend.
  - (DONE) Fix Page Title (browser tab title).
  - (DONE) Fix Blog Details Page Content Width.
  - (DONE) Fix Contact Page's Mail Sending. Mail sending not working in live and change the mail to nim23.official.
  - (DONE) FIx Newsletter subscription message.
  - (DONE) Replace `autoSlugWithFieldAndUUID` to `autoslugFromField` in backend models like blog, project etc.
  - Fix Order Null Violation. Interests section is working on Server.
  - (DONE) Add Job Location Type in Professional Experience section like: Hybrid, Remote, Onsite.
  - (DONE) Fix Project Details page's Technology background color. Use project index page.
  - (DONE) Fix unnecessary loading time if api fetch finished.
  - Fix Social Media Share Page Title and Description.
  - (DONE) Add submit issue page.
  - (DONE) Enlarge Certificate Image Size and add Modal (Image Viewer) on image click.
  - (DONE) Bring blog title center in blog details page.
  - (DONE) Add some padding in Recent watched movies section's heading (Mobile View).
  - Rename Code-Snippets to Snippets.
  - Make movies section horizontal scrollbar larger.
  - Fix skill order violation in server (urgent).
  - Provide fixed height width (style) to skill images.
  - Use Lazyloading on images: <https://web.dev/codelab-use-lazysizes-to-lazyload-images/>.
  - (DONE) Add Image viewer for Media Pages like Project Details.
  - (DONE) Fix Project List Click Event. It includes link of project but navigating to project details.

## Bug Fix

-

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
