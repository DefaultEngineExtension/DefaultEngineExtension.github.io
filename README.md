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

The custom `/feedback/` page posts the collected reason, comment and extension
version into the product-specific Set Default Search Engine Google Form:
https://docs.google.com/forms/d/e/1FAIpQLScqTc9bphTqdqbebBUf3nhUiXYUGx1yVJu7PQ_41gkM_9Xy6A/viewform

The verified paragraph entry is `entry.1145454522`. Users fill only the custom
form. Google then displays the product-specific recorded-response confirmation.
Responses can be reviewed in the new form's Responses tab. The recipient mailbox
is not embedded in the frontend; email notifications depend on Google Forms settings.
No server-side relay is used.

Tests: `node --test tests/feedback.test.cjs`.
