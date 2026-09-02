/*
  Example Cloudflare Worker to proxy /project1/* to a Netlify site and fall back to GitHub Pages for other paths.
  Edit the two constants below to match your Netlify target and your GitHub Pages origin.
*/

const GITHUB_PAGES_ORIGIN = 'https://chil-pavn.github.io';

addEventListener('fetch', event => {
  event.respondWith(handle(event.request));
});

async function handle(request) {
  const url = new URL(request.url);
  // Route /project1/* to a Netlify site (change this to your Netlify URL)
  if (url.pathname.startsWith('/project1')) {
    const targetOrigin = 'https://your-netlify-site.netlify.app';
    const newPath = url.pathname.replace('/project1', '') || '/';
    const targetUrl = targetOrigin + newPath + url.search;

    // Copy original headers and set Host to the target host
    const headers = new Headers(request.headers);
    headers.set('host', new URL(targetOrigin).host);

    const proxyReq = new Request(targetUrl, {
      method: request.method,
      headers,
      body: request.body,
      redirect: 'follow'
    });

    const resp = await fetch(proxyReq);

    // Optional: if the origin responded with a redirect, rewrite Location so it stays routed
    if (resp.status >= 300 && resp.status < 400 && resp.headers.has('location')) {
      const location = resp.headers.get('location');
      // If location points to the Netlify origin, rewrite it to keep the worker domain path prefix
      if (location.startsWith(targetOrigin)) {
        const rewritten = location.replace(targetOrigin, url.origin + '/project1');
        const headersOut = new Headers(resp.headers);
        headersOut.set('location', rewritten);
        return new Response(resp.body, { status: resp.status, statusText: resp.statusText, headers: headersOut });
      }
    }

    return resp;
  }

  // Fallback: fetch from your GitHub Pages origin
  const originUrl = GITHUB_PAGES_ORIGIN + url.pathname + url.search;
  const originReq = new Request(originUrl, request);
  return fetch(originReq);
}
