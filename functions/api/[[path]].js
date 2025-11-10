// API proxy to Worker
export async function onRequest(context) {
  const {
    request,
    env,
    params,
  } = context;

  // Forward request to Worker binding
  if (env.AI_WORKER) {
    return env.AI_WORKER.fetch(request);
  }

  // Fallback: call Worker via URL if binding not available
  const workerUrl = 'https://ai-worker.YOUR_SUBDOMAIN.workers.dev';
  const url = new URL(request.url);
  url.hostname = new URL(workerUrl).hostname;

  return fetch(url, {
    method: request.method,
    headers: request.headers,
    body: request.body,
  });
}
