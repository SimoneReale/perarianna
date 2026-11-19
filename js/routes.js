(function () {
  const STORAGE_KEY = "ww-routes-backdrop";
  const rootUrl = new URL("../", document.currentScript.src);

  function isRoutesPage(url) {
    return new URL(url, rootUrl).pathname.endsWith("/routes.html");
  }

  document.addEventListener("click", (event) => {
    const link = event.target.closest('a[href*="routes.html"]');
    if (!link || isRoutesPage(location.href)) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, location.href);
    } catch (_) {
      // Some embedded previews disable session storage.
    }
  });

  window.__wwInitPageArrows = function () {
    window.AriannaContent?.renderArrows();
  };

  window.__wwInitRoutesBackdrop = function () {
    const iframe = document.getElementById("routes-backdrop");
    if (!iframe) return;
    let stored;
    try {
      stored = sessionStorage.getItem(STORAGE_KEY);
    } catch (_) {}
    const fallback = new URL("index.html", rootUrl).href;
    try {
      const source = new URL(stored || document.referrer || fallback, rootUrl);
      iframe.src = source.href.startsWith(rootUrl.href) && !isRoutesPage(source.href)
        ? source.href : fallback;
    } catch (_) {
      iframe.src = fallback;
    }
  };

  function syncRouteIntroWidth(intro) {
    intro.style.width = "";
    const range = document.createRange();
    range.selectNodeContents(intro);
    for (let pass = 0; pass < 4; pass += 1) {
      const rects = range.getClientRects();
      if (!rects.length) return;
      let maxWidth = 0;
      for (const rect of rects) maxWidth = Math.max(maxWidth, rect.width);
      const nextWidth = `${Math.ceil(maxWidth)}px`;
      if (intro.style.width === nextWidth) return;
      intro.style.width = nextWidth;
    }
  }

  window.__wwSyncRouteIntroWidths = function () {
    requestAnimationFrame(() => document.querySelectorAll(".route-intro").forEach(syncRouteIntroWidth));
  };

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(window.__wwSyncRouteIntroWidths, 100);
  });

  window.__wwInitRoutesBackdrop();
  window.__wwInitPageArrows();
  if (document.fonts?.ready) document.fonts.ready.then(window.__wwSyncRouteIntroWidths);
  else window.__wwSyncRouteIntroWidths();
})();
