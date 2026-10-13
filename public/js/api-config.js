// Native builds use the hosted backend; the web app keeps using its same-origin API.
window.NAKSHA_API_BASE_URL = window.Capacitor
  ? 'https://naksha-jathakam.vercel.app'
  : '';
