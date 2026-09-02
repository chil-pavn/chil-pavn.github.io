# Netlify redirects for GitHub Pages

This folder contains example redirect pages and a Cloudflare Worker example to forward visitors to Netlify-hosted sites.

Added redirects

- /gymmer -> https://sage-phoenix-9e72d3.netlify.app/
  - File: `gymmer/index.html`
- /reframe -> https://reframe-blog.netlify.app/
  - File: `reframe/index.html`

Cloudflare Worker

- The worker is at `netlify-redirects/worker.js` and is pre-configured to proxy:
  - `/gymmer` -> `https://sage-phoenix-9e72d3.netlify.app`
  - `/reframe` -> `https://reframe-blog.netlify.app`
- Deploy this worker to a workers.dev subdomain (or attach it to a custom domain) to serve Netlify content under the same path prefixes.

Quick notes

- The `gymmer` and `reframe` files are client-side redirects (meta-refresh + JS) and will immediately send visitors to the Netlify sites.
- If you want the browser URL to stay under your GitHub Pages domain while serving Netlify content, deploy the Worker and access the worker domain (e.g., `https://<your-account>.workers.dev/gymmer`).

If you'd like, I can:
- Update links on your site to point to `/gymmer/` and `/reframe/`.
- Add HTML that explains each project with a link + redirect.
- Extend the Worker to rewrite absolute links inside HTML responses (useful if the proxied site uses absolute URLs).
