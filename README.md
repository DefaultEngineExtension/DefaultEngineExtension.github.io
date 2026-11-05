# Set Default Search Engine landing page

Static English/Russian landing page for the Set Default Search Engine Chrome extension.
GitHub Pages deploys the `main` branch from the repository root. The site
uses `index.html`, `style.css`, `script.js`, and `assets/` directly; there
is no build step.

Live URL: https://defaultsearch.online/

The page explains that the extension redirects result navigations from supported
search engines, including address-bar searches when Chrome uses a supported
provider. Chrome's displayed search setting itself remains unchanged.


Preview locally: `python3 -m http.server 8765 --directory .`
Open http://localhost:8765/. The demo does not change browser search settings.
Language follows the browser (Russian or English fallback) and can be changed manually.

## Uninstall feedback

`/feedback/` uses the existing shared Google Form. Every submission starts with
`[Set Default Search Engine] Uninstall feedback` and includes the extension version.
The support mailbox is never embedded in the frontend. Google Forms controls the
confirmation page and email notifications; its current confirmation title still
refers to YouTube Subtitle Downloader. For product-specific confirmation and email
subjects, create a separate Google Form and update the form action and entry ID.
Publish this page before releasing the extension uninstall link.
