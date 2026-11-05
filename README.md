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

The custom `/feedback/` page submits JSON to the separate server endpoint and stays
on the same page. A local thank-you appears only after the server verifies that
Google Forms recorded the response. Failed requests preserve the typed feedback.

Server source: `backend/feedback-handler.mjs` (not executed by GitHub Pages).
Deployment project: appgprj_6aec97453a688191b7fd719381ddabcd.
Endpoint: https://defaultsearch-feedback-api.finitelyric4.chatgpt.site/feedback
Public access must be confirmed and anonymous access verified before this frontend
change is released to main. The server was initially created owner-private.

The intake is the existing shared Google Form, with a fixed product label in each
response. Users never navigate to it. The recipient email is not in the frontend.
Google Forms notification settings continue to control mail delivery.

Tests: `node --test tests/feedback.test.cjs`.
