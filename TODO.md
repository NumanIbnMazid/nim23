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
  - (DONE) Auto remove unused files (media) from backend.
  - Fix order non null violetion in Projects Section.
  - (DONE) Fix Page Title (browser tab title).
  - (DONE) Fix Blog Details Page Content Width.
  - Fix Contact Page's Mail Sending. Mail sending not working in live and change the mail to nim23.official.
  - (DONE) FIx Newsletter subscription message.

## Bug Fix

-

## Improvement

- [ ] Fix pydantic env file discovery in config. Get rid of hardcoded relative path.

Performance Analyzer: <https://pagespeed.web.dev>

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
