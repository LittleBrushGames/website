(() => {
  const production = ['andynata.com', 'www.andynata.com'].includes(location.hostname);
  if (!production && !['localhost', '127.0.0.1'].includes(location.hostname)) return;
  const id = 'G-DLNT4X7N46';
  const key = 'andynata-analytics-consent-v1';
  const lifetime = 180 * 24 * 60 * 60 * 1000;
  let choice;
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    if (saved && Date.now() - saved.time < lifetime) choice = saved.value;
  } catch { /* Unavailable storage leaves analytics off until a choice is made. */ }

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  gtag('consent', 'default', {
    analytics_storage: 'denied', ad_storage: 'denied',
    ad_user_data: 'denied', ad_personalization: 'denied'
  });
  let loaded = false;
  function enable() {
    if (loaded || !production) return;
    loaded = true;
    window['ga-disable-' + id] = false;
    gtag('consent', 'update', { analytics_storage: 'granted' });
    gtag('js', new Date());
    gtag('config', id, { allow_google_signals: false, allow_ad_personalization_signals: false, cookie_expires: lifetime / 1000 });
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
    document.head.append(script);
  }

  const style = document.createElement('link');
  style.rel = 'stylesheet';
  style.href = '/analytics.css';
  document.head.append(style);
  const dialog = document.createElement('dialog');
  dialog.className = 'analytics-consent';
  dialog.setAttribute('aria-labelledby', 'analytics-title');
  dialog.innerHTML = `<h2 id="analytics-title">Help us understand what you enjoy</h2>
    <p>With your permission, we use Google Analytics cookies to measure visits, traffic sources and interactions on this website. Google receives usage and device information. We do not enable advertising personalization.</p>
    <p>You can use the whole site without analytics and change your choice at any time through <strong>Cookie settings</strong>. Your choice and analytics cookies last up to 180 days. <a href="https://legal.littlebrushgames.com/privacy.html">Privacy policy</a> · <a href="https://policies.google.com/technologies/partner-sites">How Google uses website data</a></p>
    <form method="dialog"><button value="denied" autofocus>Reject analytics</button><button value="granted">Accept analytics</button></form>`;
  document.body.append(dialog);
  const settingsContainers = [document.querySelector('.footer__meta'), document.querySelector('.page-notes')].filter(Boolean);
  if (!settingsContainers.length) settingsContainers.push(document.querySelector('footer') || document.body);
  for (const container of settingsContainers) {
    const settings = document.createElement('button');
    settings.type = 'button';
    settings.className = 'analytics-settings';
    settings.textContent = 'Cookie settings';
    container.append(settings);
    settings.addEventListener('click', () => { dialog.returnValue = ''; dialog.showModal(); });
  }
  dialog.addEventListener('close', () => {
    const value = dialog.returnValue;
    if (!['granted', 'denied'].includes(value)) return;
    choice = value;
    try { localStorage.setItem(key, JSON.stringify({ value, time: Date.now() })); } catch { /* This visit only. */ }
    if (value === 'granted') enable();
    else {
      window['ga-disable-' + id] = true;
      gtag('consent', 'update', { analytics_storage: 'denied' });
      for (const cookie of document.cookie.split(';')) {
        const name = cookie.split('=')[0].trim();
        if (!/^_ga(?:_|$)/.test(name)) continue;
        for (const domain of ['', location.hostname, '.andynata.com']) {
          document.cookie = name + '=; Max-Age=0; Path=/' + (domain ? '; Domain=' + domain : '');
        }
      }
      // Unload the previously accepted tag so revocation also stops automatic events.
      if (loaded) location.reload();
    }
  });
  window.addEventListener('storage', event => {
    if (event.key !== key) return;
    window['ga-disable-' + id] = true;
    location.reload();
  });
  if (choice === 'granted') enable();
  else if (choice !== 'denied') dialog.showModal();
})();
