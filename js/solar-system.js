(function () {
  window.__wwSolarCleanup?.();
  const canvas = document.querySelector(".solar-canvas");
  if (!canvas) return;

  const root = new URL("../assets/solar/", document.currentScript.src);
  const controller = new AbortController();
  const { signal } = controller;
  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  const hoverPreference = window.matchMedia("(hover: hover)");
  const system = canvas.querySelector(".solar-system");
  const bodies = [...canvas.querySelectorAll(".solar-body")];
  const planets = [...canvas.querySelectorAll(".solar-planet")];
  const rings = [[225, 145], [335, 205], [435, 265]];
  const tilt = -18 * Math.PI / 180;
  const starts = [-2.7, .55, 2.6, -.75];
  const orbitCounts = [0, 0, 0];
  const planetStates = planets.map((element, i) => {
    const ring = i < 2 ? 0 : 1 + (i - 2) % 2;
    const slot = orbitCounts[ring]++;
    return { element, ring, angle: starts[i] ?? slot * 2.399 + ring, speed: .065 / (1 + ring * .45) };
  });

  // Reuse the supplied SVGs as small drifting stars, without photo links.
  const starFiles = ["celeste_scarabocchio", "viola_scintilla", "verde_piccola", "corallo", "gialla", "lilla_scarabocchio", "azzurra_allungata"];
  const positions = [[12,22,34], [83,18,28], [7,57,25], [88,75,37], [26,85,29], [60,13,31], [94,40,26], [36,17,24], [15,77,23], [74,88,29], [48,89,25], [91,90,22], [6,38,26], [69,20,22]];
  const starLayer = canvas.querySelector(".solar-stars");
  starLayer.replaceChildren();
  const stars = positions.map(([x, y, size], i) => {
    const element = document.createElement("img");
    element.className = "solar-spark";
    element.src = new URL(`stella_${starFiles[i % starFiles.length]}.svg`, root).href;
    element.alt = "";
    element.draggable = false;
    element.style.left = `${x}%`;
    element.style.top = `${y}%`;
    element.style.width = `${size}px`;
    starLayer.appendChild(element);
    return { element, x, y, dx: 0, dy: 0, rotation: (i % 5 - 2) * 11, phase: i * 1.73 };
  });

  let openBody = null;
  let frameId = null;
  let previous = null;
  let elapsed = 0;
  let width = window.innerWidth;
  let height = window.innerHeight;
  let pointer = { x: -1000, y: -1000 };

  function placePreview() {
    if (!openBody) return;
    const preview = openBody.querySelector(".solar-preview");
    preview.style.marginLeft = "0px";
    preview.style.marginTop = "0px";
    const rect = preview.getBoundingClientRect();
    const inset = 16;
    preview.style.marginLeft = `${Math.max(inset - rect.left, Math.min(0, width - inset - rect.right))}px`;
    preview.style.marginTop = `${Math.max(inset - rect.top, Math.min(0, height - inset - rect.bottom))}px`;
  }

  function closePreview() {
    openBody?.classList.remove("is-open");
    openBody = null;
    system.classList.remove("is-exploring");
  }

  function openPreview(body) {
    if (openBody !== body) closePreview();
    openBody = body;
    body.classList.add("is-open");
    system.classList.add("is-exploring");
    placePreview();
  }

  bodies.forEach((body) => {
    let touchPointer = false;
    let previewWasOpen = false;
    body.addEventListener("pointerdown", (event) => {
      touchPointer = event.pointerType === "touch";
      previewWasOpen = openBody === body;
    }, { signal });
    body.addEventListener("pointerenter", (event) => {
      if (event.pointerType !== "touch" && hoverPreference.matches) openPreview(body);
    }, { signal });
    body.addEventListener("pointerleave", (event) => {
      if (event.pointerType !== "touch" && hoverPreference.matches && document.activeElement !== body) closePreview();
    }, { signal });
    body.addEventListener("focus", () => openPreview(body), { signal });
    body.addEventListener("blur", () => {
      if (openBody === body) closePreview();
    }, { signal });
    body.addEventListener("click", (event) => {
      if (!touchPointer && hoverPreference.matches) return;
      // Focus can reveal the photo between touchstart and click. Only a photo
      // that was already open when the tap began may navigate.
      if (previewWasOpen && openBody === body && event.target.closest(".dot-preview")) return;
      event.preventDefault();
      event.stopPropagation();
      openPreview(body);
    }, { signal });
    body.querySelector(".dot-preview")?.addEventListener("load", () => {
      if (openBody === body) placePreview();
    }, { signal });
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".solar-body")) closePreview();
  }, { signal });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closePreview();
  }, { signal });
  window.addEventListener("pointermove", (event) => {
    pointer = { x: event.clientX, y: event.clientY };
  }, { passive: true, signal });
  function clearPointer() { pointer = { x: -1000, y: -1000 }; }
  document.addEventListener("pointerleave", clearPointer, { signal });
  window.addEventListener("pointerup", (event) => {
    if (event.pointerType === "touch") clearPointer();
  }, { signal });
  window.addEventListener("pointercancel", clearPointer, { signal });
  window.addEventListener("resize", () => {
    width = window.innerWidth;
    height = window.innerHeight;
    placePreview();
  }, { signal });

  function positionPlanets() {
    planetStates.forEach(({ element, ring, angle }) => {
      const [rx, ry] = rings[ring];
      const x = rx * Math.cos(angle);
      const y = ry * Math.sin(angle);
      element.style.left = `${(500 + x * Math.cos(tilt) - y * Math.sin(tilt)) / 10}%`;
      element.style.top = `${(350 + x * Math.sin(tilt) + y * Math.cos(tilt)) / 7}%`;
    });
  }

  function tick(now) {
    const dt = previous === null ? 0 : Math.min((now - previous) / 1000, .05);
    previous = now;
    elapsed += dt;
    if (!openBody) planetStates.forEach((planet) => { planet.angle += planet.speed * dt; });
    positionPlanets();
    stars.forEach((star) => {
      const dx = star.x / 100 * width - pointer.x;
      const dy = star.y / 100 * height - pointer.y;
      const distance = Math.hypot(dx, dy);
      const force = Math.max(0, 1 - distance / 140) * 48;
      const ease = 1 - Math.exp(-dt * 3);
      star.dx += ((dx / (distance || 1)) * force - star.dx) * ease;
      star.dy += ((dy / (distance || 1)) * force - star.dy) * ease;
      const floatX = Math.sin(elapsed * .24 + star.phase) * 9;
      const floatY = Math.cos(elapsed * .3 + star.phase) * 12;
      star.element.style.transform = `translate(calc(-50% + ${star.dx + floatX}px), calc(-50% + ${star.dy + floatY}px)) rotate(${star.rotation + Math.sin(elapsed * .22 + star.phase) * 10}deg)`;
    });
    frameId = requestAnimationFrame(tick);
  }

  function syncMotion() {
    cancelAnimationFrame(frameId);
    previous = null;
    if (!motionPreference.matches && !document.hidden) frameId = requestAnimationFrame(tick);
    else stars.forEach((star) => { star.element.style.transform = `translate(-50%, -50%) rotate(${star.rotation}deg)`; });
  }
  motionPreference.addEventListener("change", syncMotion, { signal });
  document.addEventListener("visibilitychange", syncMotion, { signal });
  positionPlanets();
  syncMotion();
  window.__wwSolarCleanup = () => {
    cancelAnimationFrame(frameId);
    controller.abort();
    closePreview();
  };
})();
