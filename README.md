# EqualAccess. website

The complete static website, with `index.html` at the repository root. All 20 pages, styles, scripts, images, and favicons are included. No build step or package installation is required for this exported copy.

## Enable GitHub Pages

In repository **Settings → Pages**, choose **Deploy from a branch**, select **main** and **/ (root)**, then save.

Intended address: https://aryansejani.github.io/Equalaccess/

Local page and asset links are relative, so they work at the repository URL and on a custom domain. The `.nojekyll` file serves the existing HTML directly. Canonical URLs, social metadata, structured data, and the sitemap use the address above. Update those URLs when moving to a custom domain.

## Update this export

This is a snapshot of the EqualAccess. Sites project at https://equal-access-web.fowler-966.chatgpt.site/. It does not automatically synchronize later edits from that project. In the original source checkout, run `node scripts/build.mjs`, then `node scripts/export-github-pages.mjs <empty-output-directory> https://aryansejani.github.io/Equalaccess/` and commit the exported files to this repository. Keep `index.html`, the page folders, CSS, JavaScript, and assets at the same root level.
