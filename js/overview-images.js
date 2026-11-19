(function () {
  const rootUrl = new URL("../", document.currentScript.src);
  const prefetched = new Set();
  const preloadCache = new Map();

  function parseImageEntry(item) {
    if (typeof item === "string") return { src: item, scale: null, credit: "", alt: "" };
    return {
      src: item.file,
      scale: item.scala ?? null,
      credit: item.didascalia || "",
      alt: item.alt || "",
    };
  }

  function assetRoot() {
    return rootUrl.href;
  }

  function getSetForBody() {
    return window.AriannaContent.photosFor(window.AriannaContent.currentMemory());
  }

  function preloadImage(src) {
    const url = new URL(src, rootUrl).href;
    if (preloadCache.has(url)) return preloadCache.get(url);
    const promise = new Promise((resolve, reject) => {
      const image = new Image();
      image.decoding = "async";
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error(`Failed to load ${url}`));
      image.src = url;
    });
    preloadCache.set(url, promise);
    return promise;
  }

  function prefetchOverview(href) {
    const url = new URL(href, location.href);
    const id = url.searchParams.get("id");
    const memory = (window.ARIANNA.ricordi || []).find((entry) => entry.id === id);
    if (!memory || prefetched.has(id)) return;
    prefetched.add(id);
    window.AriannaContent.photosFor(memory).forEach((photo) => {
      preloadImage(photo.file).catch(() => {});
    });
  }

  window.__wwOverviewImages = {
    parseImageEntry,
    assetRoot,
    getSetForBody,
    preloadImage,
    prefetchOverview,
  };
})();
