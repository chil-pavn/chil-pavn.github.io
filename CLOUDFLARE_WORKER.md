# Cloudflare Worker: proxy routing to Netlify (example)

This file explains a minimal Cloudflare Worker you can deploy to route specific path prefixes to your Netlify sites while falling back to your GitHub Pages site for other paths.

High-level options

- If you have a custom domain: add it to Cloudflare, point DNS as needed, then attach a Worker route (e.g., `example.com/*`). The Worker can proxy paths like `/project1/*` to Netlify while serving other paths from your origin.
- If you don't own a domain: you can still publish the Worker to your `*.workers.dev` subdomain (Cloudflare provides this automatically). For example `https://your-account.workers.dev/project1` can be routed to Netlify while other paths proxy to `https://chil-pavn.github.io`.

Quick deploy (Dashboard)

1. Log in to Cloudflare (dashboard) on your phone.
2. Open "Workers & Pages" → "Create a Service" or use the Workers editor.
3. Create a new Worker and paste the code from `netlify-redirects/worker.js` (edit the target URLs in the file first).
4. Save and Deploy. The worker will be available at `https://<your-account>.workers.dev` (or attach to your domain if you added one to Cloudflare).

Quick deploy (Wrangler CLI)

1. Install Wrangler (locally): `npm install -g wrangler`.
2. Authenticate: `wrangler login`.
3. Create a worker project or use `wrangler publish --name my-worker netlify-redirects/worker.js` (see Wrangler docs).

Limitations & gotchas

- Absolute links and assets in proxied Netlify sites may still point to the Netlify origin; you may need to adjust site settings or rewrite HTML if you need perfect same-origin behavior.
- Cookies, CORS, and WebSockets can require special handling.
- If your Netlify site issues redirects (Location response headers), the Worker should forward them, but you may need to rewrite locations so they keep routing through the Worker domain.

If you want, I can produce a version of the Worker that rewrites Location headers and rewrites simple absolute links in HTML responses — tell me the Netlify URLs and I will customize it.
