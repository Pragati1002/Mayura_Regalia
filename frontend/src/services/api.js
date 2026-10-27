const isProduction = process.env.NODE_ENV === 'production';
const configuredApiUrl = process.env.REACT_APP_API_URL?.trim() || '';
const isLocalApiUrl = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?(?:\/|$)/i.test(configuredApiUrl);

// Never send a production visitor's browser to a localhost API. If a cloud API
// host is configured, use it; otherwise call the API on this app's Render host.
const apiUrl = isProduction && (!configuredApiUrl || isLocalApiUrl)
  ? ''
  : configuredApiUrl || 'http://localhost:5000';
const apiOrigin = apiUrl
  ? (/^https?:\/\//i.test(apiUrl) ? apiUrl : `https://${apiUrl}`)
  : '';
const normalizedApiOrigin = apiOrigin.replace(/\/+$/, '');
const API_URL = `${normalizedApiOrigin}${normalizedApiOrigin.endsWith('/api') ? '' : '/api'}`;

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }
  return data;
}

export { API_URL, apiRequest };
