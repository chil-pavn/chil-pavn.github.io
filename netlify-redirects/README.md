# Netlify redirects for GitHub Pages

This folder contains example redirect pages you can use on your GitHub Pages site to forward visitors to Netlify-hosted sites.

Why use these? GitHub Pages is a static host and cannot issue server-side 301/302 responses for custom path-based routing to other origins. These HTML pages perform a client-side redirect (meta refresh + JS fallback) which immediately sends the browser to your Netlify URL.

How to add a redirect for another project

1. Copy `netlify-redirects/project1/index.html` to a new folder named after your project, e.g. `netlify-redirects/project-name/index.html`.
2. Edit the two places in the file that contain `https://your-netlify-site.netlify.app/` and replace them with your Netlify site URL (for example `https://my-cool-site.netlify.app/`).
3. Commit the new folder and push. The redirect will be available at `https://chil-pavn.github.io/netlify-redirects/project-name/`.

Notes and limitations

- This is a client-side redirect, not a server-side 301/302. For most users this behaves the same in the browser, but search engines may treat it differently.
- If you want the URL in the browser to remain `chil-pavn.github.io/project-name/` while showing Netlify content, see the Cloudflare Worker instructions (`CLOUDFLARE_WORKER.md`) — that requires deploying a worker and (optionally) a custom domain or using a `workers.dev` subdomain.
- Keep files in the path you want users to visit. For example, placing a redirect at `project1/index.html` makes it reachable at `/project1/` on GitHub Pages.
