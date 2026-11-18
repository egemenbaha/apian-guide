const productionHost = 'apianwiki.space';

function referringOrigin(value) {
  try {
    const url = new URL(value);
    if (['http:', 'https:'].includes(url.protocol) && url.hostname !== productionHost) return url.origin;
  } catch { /* Direct visits have no referrer. */ }
  return '';
}

export function startAnalytics(websiteId, browser = window) {
  const { location, navigator, document } = browser;
  if (!websiteId || location.hostname !== productionHost || navigator.globalPrivacyControl ||
      ['1', 'yes'].includes(navigator.doNotTrack || browser.doNotTrack)) return null;

  const script = document.createElement('script');
  script.src = 'https://cloud.umami.is/script.js';
  script.async = true;
  script.referrerPolicy = 'no-referrer';
  script.dataset.websiteId = websiteId;
  script.dataset.autoPageview = 'false';
  script.dataset.doNotTrack = 'true';
  script.dataset.excludeSearch = 'true';
  script.dataset.excludeHash = 'true';
  const ready = new Promise(resolve => {
    script.onload = () => resolve(browser.umami);
    script.onerror = () => resolve(null);
  });
  document.head.append(script);

  let page;
  let referrer = referringOrigin(document.referrer);
  function send(name) {
    // Capture this page before the asynchronous tracker finishes loading.
    const payload = {
      website: websiteId, hostname: productionHost, language: navigator.language,
      ...page, referrer,
    };
    if (name) payload.name = name;
    ready.then(tracker => tracker?.track(payload)).catch(() => {});
  }
  return {
    view(topic) {
      if (page) referrer = page.url;
      page = topic ? { url: `/konu/${topic.id}`, title: topic.title } : { url: '/', title: 'Ana sayfa' };
      send();
    },
    searchResult() {
      if (page) send('search-result-opened');
    },
  };
}
