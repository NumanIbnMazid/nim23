# TODO List

- (DONE) Refine Project

  - Remove all templates and static files
  - Remove django unicorn dependency
  - Remove all unnecessary dependencies from requirements

- (DONE) Update Master and Dev Branch with refined project

- (DONE) Design Starter Template

  - Design starter template using tailwind CSS official documentation
  - Minimum Requirements
    - Sticky Navbar (hamburger menu support)
    - Dark/Light Switch
    - TailwindCSS official documentation like background (or like flowbite)
    - A demo body element
    - Footer

- Utilities

  - (DONE) Configure EmailJS (Contact Form). Better if mail would send via backend api.
  - (REMOVED) Fix Utilities Page.
  - (DONE) Fix Every page's meta option.
  - (DONE) Fix Snippets, (REMOVED) Newsletter, (REMOVED) RSS, (REMOVED) dev.to.
  - (DONE) Fix footer.
  - Fix Visitor Count.
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
  - Make Swagger, Redoc, Filebrowser is authenticated required.
  - Implement if blog content contains code, then don't show reading time.
  - Investigate about RSS and Newsletter.
  - (NOT NEEDED) Make frontend server.js Allowed Hosts come from env.
  - Auto remove unused files (media) from backend.
  - Fix order non null violetion in Projects Section.

## Bug Fix

-

## Improvement

- [ ] Fix pydantic env file discovery in config. Get rid of hardcoded relative path.
