/*
  Cloudflare Worker: proxy multiple path prefixes to Netlify sites and fall back to GitHub Pages.
  Routes configured below:
    /gymmer  -> https://sage-phoenix-9e72d3.netlify.app
    /reframe -> https://reframe-blog.netlify.app

  How it works:
  - Requests starting with a configured prefix are proxied to the corresponding Netlify origin.
  - The worker preserves the remainder of the path and query string.
  - Redirect Location headers from Netlify are rewritten so they continue to route through the worker path prefix.
  - All other requests are fetched from the GitHub Pages origin.

  Edit the GITHUB_PAGES_ORIGIN or ROUTES map if you change origins.
*/

const GITHUB_PAGES_ORIGIN = 'https://chil-pavn.github.io';

// Map path prefixes (starting with a leading slash) to Netlify origins
const ROUTES = {
  '/gymmer': 'https://sage-phoenix-9e72d3.netlify.app',
  '/reframe': 'https://reframe-blog.netlify.app'
};

addEventListener('fetch', event => {
  event.respondWith(handle(event.request));
});

async function handle(request) {
  const url = new URL(request.url);

  // Find a matching route prefix (longest prefix wins)
  const prefix = Object.keys(ROUTES).sort((a, b) => b.length - a.length).find(p => url.pathname.startsWith(p));

  if (prefix) {
    const targetOrigin = ROUTES[prefix];
    const newPath = url.pathname.slice(prefix.length) || '/';
    const targetUrl = targetOrigin + newPath + url.search;

    // Forward request to Netlify origin, keeping most headers
    const headers = new Headers(request.headers);
    // Set Host header to target host to help some origins
    headers.set('Host', new URL(targetOrigin).host);

    const proxyReq = new Request(targetUrl, {
      method: request.method,
      headers,
      body: request.body,
      redirect: 'manual'
    });

    const resp = await fetch(proxyReq);

    // If the origin returned a redirect, rewrite Location to keep traffic routed through the worker
    if (resp.status >= 300 && resp.status < 400 && resp.headers.has('location')) {
      const location = resp.headers.get('location');
      if (location && location.startsWith(targetOrigin)) {
        // Rewrite so: targetOrigin/some -> workerOrigin/prefix/some
        const rewritten = location.replace(targetOrigin, url.origin + prefix);
        const headersOut = new Headers(resp.headers);
        headersOut.set('location', rewritten);
        return new Response(resp.body, { status: resp.status, statusText: resp.statusText, headers: headersOut });
      }
    }

    // For non-redirect responses, return as-is. (You may want to rewrite HTML/absolute links here if needed.)
    return resp;
  }

  // No matching route: fetch from GitHub Pages origin
  const originUrl = GITHUB_PAGES_ORIGIN + url.pathname + url.search;
  const originReq = new Request(originUrl, request);
  return fetch(originReq);
}
