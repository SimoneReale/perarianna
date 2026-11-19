(function () {
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
    const canvas = document.querySelector(".page-home .canvas");
    if (!canvas) return;
    canvas.querySelectorAll(".dot--trigger, .dot-captions").forEach((node) => node.remove());
    const captions = document.createElement("div");
    captions.className = "dot-captions";
    captions.setAttribute("aria-hidden", "true");

    memories.forEach((memory, index) => {
      const dot = document.createElement("a");
      dot.className = "dot dot--solid dot--trigger";
      dot.href = memoryUrl(memory);
      dot.dataset.href = dot.href;
      dot.dataset.caption = String(index);
      dot.setAttribute("aria-label", memory.titolo || `Ricordo ${index + 1}`);
      const position = memory.posizione || [15 + (index * 23) % 70, 25 + (index * 17) % 55];
      dot.style.left = `${Math.max(5, Math.min(95, position[0]))}%`;
      dot.style.top = `${Math.max(15, Math.min(85, position[1]))}%`;

      const photo = photosFor(memory)[0];
      if (photo) {
        const image = document.createElement("img");
        image.className = "dot-preview";
        image.src = siteUrl(photo.file);
        image.alt = photo.alt || "";
        dot.appendChild(image);
      }

      const caption = document.createElement("p");
      caption.className = "dot-caption";
      text(caption, [memory.titolo, memory.descrizione].filter(Boolean).join("\n"));
      caption.hidden = true;
      captions.appendChild(caption);
      canvas.appendChild(dot);
    });
    canvas.appendChild(captions);
  }

  function renderRoutes() {
    const list = document.querySelector(".routes-list");
    if (!list) return;
    list.replaceChildren();
    list.style.setProperty("--route-count", memories.length);
    memories.forEach((memory, index) => {
      const item = document.createElement("li");
      item.className = "route";
      item.style.setProperty("--route-column", index % 5);
      item.style.setProperty("--route-row", index);
      const link = document.createElement("a");
      link.className = "route__link";
      link.href = memoryUrl(memory);
      const bullet = document.createElement("span");
      bullet.className = "route__bullet";
      bullet.setAttribute("aria-hidden", "true");
      const copy = document.createElement("span");
      copy.className = "route__text";
      const title = document.createElement("span");
      title.className = "route__title link-dotted";
      text(title, memory.titolo || `Ricordo ${index + 1}`);
      const description = document.createElement("span");
      description.className = "route__school";
      text(description, memory.descrizione);
      copy.append(title, description);
      link.append(bullet, copy);
      item.appendChild(link);
      list.appendChild(item);
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
    renderRoutes();
    renderAbout();
    renderMemory(pageUrl);
  }

  window.AriannaContent = { siteUrl, memoryUrl, currentMemory, photosFor, render, renderArrows };
  render();
})();
