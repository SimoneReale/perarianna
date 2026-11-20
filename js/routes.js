(function () {
  window.__wwInitPageArrows = function () {
    window.AriannaContent?.renderArrows();
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

  window.__wwInitPageArrows();
  if (document.fonts?.ready) document.fonts.ready.then(window.__wwSyncRouteIntroWidths);
  else window.__wwSyncRouteIntroWidths();
})();
