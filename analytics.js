// Retire the previous GA4 installation. Cloudflare injects cookieless Web Analytics.
(() => {
  if (!['andynata.com', 'www.andynata.com'].includes(location.hostname)) return;
  window['ga-disable-G-DLNT4X7N46'] = true;
  try { localStorage.removeItem('andynata-analytics-consent-v1'); } catch { /* Storage may be blocked. */ }
  for (const cookie of document.cookie.split(';')) {
    const name = cookie.split('=')[0].trim();
    if (!/^_ga(?:_|$)/.test(name)) continue;
    for (const domain of ['', location.hostname, '.andynata.com']) {
      document.cookie = name + '=; Max-Age=0; Path=/' + (domain ? '; Domain=' + domain : '');
    }
  }
})();
