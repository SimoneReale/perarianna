(function () {
  window.__wwAboutTextCleanup?.();
  const page = document.querySelector(".page--about");
  const article = page?.querySelector(".transcript");
  if (!article) return;

  const config = window.ARIANNA?.auguri?.movimentoParagrafi || {};
  function number(key, fallback, maximum) {
    return Number.isFinite(config[key]) ? Math.max(0, Math.min(maximum, config[key])) : fallback;
  }
  const settings = {
    attivo: config.attivo !== false,
    ampiezzaX: number("ampiezzaX", 28, 200),
    ampiezzaY: number("ampiezzaY", 16, 200),
    intensita: number("intensita", 30, 150),
    velocita: number("velocita", 1, 4),
    reattivitaMouse: number("reattivitaMouse", 1, 5),
    reattivitaTocco: number("reattivitaTocco", 1, 5),
    raggio: number("raggio", 180, 600),
    ritorno: number("ritorno", 1.8, 12),
  };

  const controller = new AbortController();
  const { signal } = controller;
  const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  const narrowScreen = window.matchMedia("(max-width: 900px)");
  const step = 1 / 60;
  const damping = 2.5;
  const spring = settings.ritorno;
  const noise = settings.intensita;
  let pointer = { x: -10000, y: -10000, type: "mouse", active: false, released: 0 };
  let selecting = false;
  let frame = null;
  let previous = null;
  let accumulator = 0;
  let blocks = [];

  function paint(block) {
    block.element.style.setProperty("--wish-x", `${block.x.toFixed(3)}px`);
    block.element.style.setProperty("--wish-y", `${block.y.toFixed(3)}px`);
  }

  function reset(block) {
    block.element.classList.remove("wish-text");
    block.element.style.removeProperty("--wish-x");
    block.element.style.removeProperty("--wish-y");
  }

  function measure() {
    const maxX = settings.ampiezzaX * (narrowScreen.matches ? .65 : 1);
    const maxY = settings.ampiezzaY * (narrowScreen.matches ? .75 : 1);
    article.style.setProperty("--wish-amplitude-x", `${maxX}px`);
    article.style.setProperty("--wish-amplitude-y", `${maxY}px`);
    blocks.forEach((block) => {
      const rect = block.element.getBoundingClientRect();
      const clip = block.element.closest(".col-left-body, .col-center-scroll")?.getBoundingClientRect();
      block.bounds = {
        left: rect.left - block.x, right: rect.right - block.x,
        top: rect.top - block.y, bottom: rect.bottom - block.y,
      };
      const r = block.bounds;
      block.minX = Math.min(0, Math.max(-maxX, (clip ? Math.max(clip.left, 8) : 8) - r.left));
      block.maxX = Math.max(0, Math.min(maxX, (clip ? Math.min(clip.right, innerWidth - 8) : innerWidth - 8) - r.right));
      block.minY = Math.min(0, Math.max(-maxY, (clip ? clip.top : 8) - r.top));
      block.maxY = maxY;
    });
    // Divide the available gap between neighbouring paragraphs.
    for (let i = 0; i < blocks.length; i++) {
      for (let j = i + 1; j < blocks.length; j++) {
        let a = blocks[i], b = blocks[j];
        if (a.bounds.top > b.bounds.top) [a, b] = [b, a];
        if (a.bounds.right + a.maxX < b.bounds.left + b.minX || b.bounds.right + b.maxX < a.bounds.left + a.minX) continue;
        const gap = b.bounds.top - a.bounds.bottom;
        if (gap < 0) continue;
        const allowance = Math.max(0, (gap - 8) / 2);
        a.maxY = Math.min(a.maxY, allowance);
        b.minY = Math.max(b.minY, -allowance);
      }
    }
    blocks.forEach((block) => {
      block.x = Math.max(block.minX, Math.min(block.maxX, block.x));
      block.y = Math.max(block.minY, Math.min(block.maxY, block.y));
      paint(block);
    });
  }

  const resizeObserver = new ResizeObserver(measure);
  function reconcile() {
    const elements = [...article.querySelectorAll(":scope > p")]
      .filter((element) => element.textContent.trim() && element.getClientRects().length);
    const old = new Map(blocks.map((block) => [block.element, block]));
    blocks = elements.map((element, i) => {
      if (old.has(element)) { const block = old.get(element); old.delete(element); return block; }
      element.classList.add("wish-text");
      resizeObserver.observe(element);
      return { element, x: 0, y: 0, vx: 0, vy: 0, index: i, bounds: null };
    });
    old.forEach((block) => { resizeObserver.unobserve(block.element); reset(block); });
    measure();
  }

  function gaussianPair() {
    const radius = Math.sqrt(-2 * Math.log(1 - Math.random()));
    const angle = Math.random() * Math.PI * 2;
    return [radius * Math.cos(angle), radius * Math.sin(angle)];
  }

  function reaction(block) {
    const rect = block.bounds;
    const nearestX = Math.max(rect.left, Math.min(rect.right, pointer.x));
    const nearestY = Math.max(rect.top, Math.min(rect.bottom, pointer.y));
    const distance = Math.hypot(pointer.x - nearestX, pointer.y - nearestY);
    const radius = settings.raggio;
    let dx = (rect.left + rect.right) / 2 - pointer.x;
    let dy = (rect.top + rect.bottom) / 2 - pointer.y;
    if (Math.hypot(dx, dy) < 1) { dx = block.index % 2 ? 1 : -1; dy = -1; }
    const length = Math.hypot(dx, dy);
    return { x: dx / length, y: dy / length, proximity: radius > 0 ? Math.max(0, 1 - distance / radius) : 0 };
  }

  function advance() {
    const dt = step * settings.velocita;
    const influence = pointer.active ? 1 : pointer.type === "touch" ? Math.max(0, 1 - (performance.now() - pointer.released) / 800) : 0;
    blocks.forEach((block) => {
      const push = reaction(block);
      const strength = push.proximity * influence * (pointer.type === "touch" ? 650 * settings.reattivitaTocco : 480 * settings.reattivitaMouse);
      const [gx, gy] = gaussianPair();
      block.vx += (-spring * block.x - damping * block.vx + push.x * strength) * dt + noise * Math.sqrt(dt) * gx;
      block.vy += (-spring * block.y - damping * block.vy + push.y * strength) * dt + noise * Math.sqrt(dt) * gy;
      const maxSpeed = strength > 0 ? 140 : 30;
      const speed = Math.hypot(block.vx, block.vy);
      if (speed > maxSpeed) { block.vx *= maxSpeed / speed; block.vy *= maxSpeed / speed; }
      block.x += block.vx * dt;
      block.y += block.vy * dt;
      if (block.x < block.minX || block.x > block.maxX) { block.x = Math.max(block.minX, Math.min(block.maxX, block.x)); block.vx = 0; }
      if (block.y < block.minY || block.y > block.maxY) { block.y = Math.max(block.minY, Math.min(block.maxY, block.y)); block.vy = 0; }
    });
  }

  function tick(now) {
    const dt = previous === null ? 0 : Math.min(.05, (now - previous) / 1000);
    previous = now;
    const selection = window.getSelection();
    if (selecting || (selection && !selection.isCollapsed)) {
      accumulator = 0;
    } else {
      accumulator += dt;
      while (accumulator >= step) { advance(); accumulator -= step; }
      blocks.forEach(paint);
    }
    frame = requestAnimationFrame(tick);
  }

  function syncMotion() {
    cancelAnimationFrame(frame);
    previous = null;
    accumulator = 0;
    if (preference.matches || !settings.attivo || settings.velocita === 0) blocks.forEach((block) => { block.x = block.y = block.vx = block.vy = 0; paint(block); });
    measure();
    if (settings.attivo && settings.velocita > 0 && !preference.matches && !document.hidden) frame = requestAnimationFrame(tick);
  }

  function updatePointer(event) {
    if (event.isPrimary === false) return;
    pointer = { x: event.clientX, y: event.clientY, type: event.pointerType, active: true, released: 0 };
  }
  function releasePointer() {
    selecting = false;
    if (pointer.type === "touch") { pointer.active = false; pointer.released = performance.now(); }
  }
  function clearPointer() { selecting = false; pointer.active = false; pointer.released = 0; }

  window.addEventListener("pointermove", updatePointer, { passive: true, signal });
  window.addEventListener("pointerdown", (event) => {
    updatePointer(event);
    selecting = event.pointerType === "mouse" && event.button === 0 && Boolean(event.target.closest(".wish-text:not(a):not(button)"));
    if (event.pointerType !== "touch" || preference.matches || !settings.attivo || settings.velocita === 0) return;
    // An immediate impulse makes a tap visible even after the finger lifts.
    blocks.forEach((block) => {
      const push = reaction(block);
      block.vx += push.x * push.proximity * 90 * settings.reattivitaTocco;
      block.vy += push.y * push.proximity * 90 * settings.reattivitaTocco;
    });
  }, { passive: true, signal });
  window.addEventListener("pointerup", releasePointer, { passive: true, signal });
  window.addEventListener("pointercancel", releasePointer, { passive: true, signal });
  document.addEventListener("pointerleave", clearPointer, { signal });
  window.addEventListener("blur", clearPointer, { signal });
  window.addEventListener("resize", measure, { passive: true, signal });
  document.addEventListener("scroll", measure, { passive: true, capture: true, signal });
  document.addEventListener("visibilitychange", syncMotion, { signal });
  preference.addEventListener("change", syncMotion, { signal });
  const mutationObserver = new MutationObserver(reconcile);
  reconcile();
  mutationObserver.observe(article, { childList: true, subtree: true });
  syncMotion();

  window.__wwAboutTextCleanup = () => {
    cancelAnimationFrame(frame);
    controller.abort();
    resizeObserver.disconnect();
    mutationObserver.disconnect();
    blocks.forEach(reset);
    article.style.removeProperty("--wish-amplitude-x");
    article.style.removeProperty("--wish-amplitude-y");
  };
})();
