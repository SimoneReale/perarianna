(function () {
  // HOME: modifica questi due valori e ricarica la pagina.
  const sistemaSolare = {
    dimensione: 1,       // Scala: 0.8 = più piccolo, 1 = normale, 1.2 = più grande.
    numeroStelline: 35,  // Stelline decorative: 0 per nasconderle (massimo 200).
  };

  if (window.AriannaContent) return;

  const rootUrl = new URL("../", document.currentScript.src);
  const config = window.ARIANNA;
  if (!config) return;
  const memories = config.ricordi || [];

  function siteUrl(path) {
    return new URL(path, rootUrl).href;
  }

  function memoryUrl(memory) {
    const url = new URL("ricordo.html", rootUrl);
    url.searchParams.set("id", memory.id);
    return url.href;
  }

  function currentMemory(pageUrl = location.href) {
    const id = new URL(pageUrl, rootUrl).searchParams.get("id") || document.body.dataset.memoryId;
    return memories.find((memory) => memory.id === id) || memories[0];
  }

  function photosFor(memory) {
    if (memory?.foto !== "tutte") return memory?.foto || [];
    const seen = new Set();
    return memories.flatMap((entry) => Array.isArray(entry.foto) ? entry.foto : [])
      .filter((photo) => {
        if (seen.has(photo.file)) return false;
        seen.add(photo.file);
        return true;
      });
  }

  function text(element, value) {
    if (!element) return;
    element.replaceChildren();
    const lines = String(value ?? "").split("\n");
    lines.forEach((line, index) => {
      if (index) element.appendChild(document.createElement("br"));
      element.appendChild(document.createTextNode(line));
    });
    element.hidden = !value;
  }

  function paragraphs(element, values) {
    if (!element) return;
    element.replaceChildren();
    (values || []).filter(Boolean).forEach((value) => {
      const p = document.createElement("p");
      text(p, value);
      element.appendChild(p);
    });
  }

  function renderHome() {
    const canvas = document.querySelector(".page-home .solar-bodies");
    if (!canvas) return;
    canvas.replaceChildren();
    const scale = Number.isFinite(sistemaSolare.dimensione) && sistemaSolare.dimensione > 0
      ? sistemaSolare.dimensione : 1;
    canvas.closest(".solar-system").style.setProperty("--solar-scale", scale);
    const sun = memories.find((memory) => memory.foto === "tutte") || memories[0];
    const colors = ["blue", "yellow", "orange", "purple", "green", "pink"];
    let planetIndex = 0;

    memories.forEach((memory, index) => {
      const isSun = memory === sun;
      const dot = document.createElement("a");
      dot.className = `dot--trigger solar-body ${isSun ? "solar-sun" : "solar-planet"}`;
      dot.href = memoryUrl(memory);
      dot.dataset.href = dot.href;
      dot.setAttribute("aria-label", memory.titolo || `Ricordo ${index + 1}`);
      const art = document.createElement("img");
      art.className = "solar-body-art";
      art.alt = "";
      art.draggable = false;
      art.src = siteUrl(isSun ? "assets/solar/stellina.svg?v=20261120-mauve3" : `assets/solar/planet-${colors[planetIndex % colors.length]}.svg`);
      if (!isSun) dot.dataset.planet = String(planetIndex++);
      dot.appendChild(art);

      const preview = document.createElement("span");
      preview.className = "solar-preview";
      const entrance = document.createElement("span");
      entrance.className = "solar-preview-content";
      const floating = document.createElement("span");
      floating.className = "solar-preview-float";
      const photo = photosFor(memory)[0];
      if (photo) {
        const image = document.createElement("img");
        image.className = "dot-preview";
        image.src = siteUrl(photo.file);
        image.alt = photo.alt || "";
        image.draggable = false;
        floating.appendChild(image);
      }

      const caption = document.createElement("span");
      caption.className = "solar-caption";
      text(caption, [memory.titolo, memory.descrizione].filter(Boolean).join("\n"));
      floating.appendChild(caption);
      entrance.appendChild(floating);
      preview.appendChild(entrance);
      dot.appendChild(preview);
      canvas.appendChild(dot);
    });
  }

  function renderAbout() {
    if (!document.body.classList.contains("page-about")) return;
    const about = config.auguri || {};
    text(document.querySelector(".route-title"), about.titolo);
    text(document.querySelector(".col-left-body .route-meta p"), config.nome);
    text(document.querySelector(".route-intro"), about.introduzione);
    text(document.querySelector(".conversations-heading"), about.titoloElenco);
    paragraphs(document.querySelector(".conversations-heading + .route-meta"), about.elenco);
    paragraphs(document.querySelector(".transcript"), about.paragrafi);
  }

  function renderArrows(pageUrl = location.href) {
    if (!document.body.classList.contains("page-overview")) return;
    const memory = currentMemory(pageUrl);
    const index = memories.indexOf(memory);
    for (const [selector, offset] of [[".page-arrows__left", -1], [".page-arrows__right", 1]]) {
      const link = document.querySelector(selector);
      if (!link) continue;
      link.hidden = memories.length < 2;
      if (index >= 0) link.href = memoryUrl(memories[(index + offset + memories.length) % memories.length]);
    }
  }

  function renderMemory(pageUrl) {
    if (!document.body.classList.contains("page-overview")) return;
    const memory = currentMemory(pageUrl);
    if (!memory) return;
    document.body.dataset.memoryId = memory.id;
    document.title = `per arianna — ${memory.titolo || "ricordo"}`;
    text(document.querySelector(".route-title"), memory.titolo);
    text(document.querySelector(".route-intro"), memory.descrizione);
    text(document.querySelector("[data-memory-name]"), config.nome);
    text(document.querySelector("[data-memory-signature]"), config.firma);
    text(document.querySelector(".col-left-body > .conversations-desc"), memory.augurio);
    document.querySelectorAll(".conversations-item .conversations-desc").forEach((node) => node.remove());
    renderArrows(pageUrl);
  }

  function render(pageUrl = location.href) {
    renderHome();
    renderAbout();
    renderMemory(pageUrl);
  }

  window.AriannaContent = { sistemaSolare, siteUrl, memoryUrl, currentMemory, photosFor, render, renderArrows };
  render();
})();
