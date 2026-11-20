(function () {
  if (window.__ariannaMusic) return;
  // Only the decorative background is silent. IDE previews are also iframes.
  if (window.frameElement?.id === "routes-backdrop") return;
  window.__ariannaMusic = true;

  const rootUrl = new URL("../", document.currentScript.src);
  const settings = window.ARIANNA?.musica || {};
  const audio = document.createElement("audio");
  audio.id = "birthday-music";
  audio.src = new URL(settings.file || "mp3/carro_armato.mp3", rootUrl).href;
  audio.preload = "auto";
  audio.loop = true;
  audio.playsInline = true;
  audio.volume = Math.max(0, Math.min(1, settings.volume ?? 0.8));
  document.body.appendChild(audio);

  const toggle = document.createElement("button");
  toggle.id = "music-toggle";
  toggle.className = "music-toggle link-dotted";
  toggle.type = "button";
  toggle.textContent = "suono";
  toggle.setAttribute("aria-label", "Ascolta la canzone per Arianna");
  toggle.setAttribute("aria-pressed", "false");
  document.body.appendChild(toggle);

  const gestureEvents = ["pointerup", "touchend", "click"];
  let unlocked = false;
  let pending = null;
  let wantsPlayback = false;

  function syncToggle() {
    const playing = !audio.paused && !audio.error;
    toggle.textContent = playing ? "suono on" : "suono off";
    toggle.setAttribute("aria-pressed", String(playing));
    toggle.setAttribute("aria-label", playing ? "Metti in pausa la canzone" : "Riprendi la canzone");
  }

  function showError(error) {
    toggle.textContent = "riprova audio";
    toggle.title = "La canzone non è partita. Tocca per riprovare.";
    toggle.setAttribute("aria-label", toggle.title);
    toggle.setAttribute("aria-pressed", "false");
    console.warn("Audio per Arianna:", error?.message || audio.error?.message || "Riproduzione non disponibile");
  }

  function play({ fromHover = false } = {}) {
    wantsPlayback = true;
    // A real click can retry immediately, even if a hover attempt is pending.
    if ((pending && (!pending.fromHover || fromHover)) || !audio.paused) return;
    if (audio.error) audio.load();
    audio.muted = false;
    toggle.textContent = "suono…";
    toggle.removeAttribute("title");
    // No await, timer or fetch before play(): keep the original user gesture.
    const attempt = { fromHover, promise: audio.play() };
    pending = attempt;
    attempt.promise.catch((error) => {
      if (pending !== attempt) return;
      if (fromHover && error.name === "NotAllowedError") {
        // Hover does not grant user activation in browsers that block autoplay.
        // Keep the first-click handlers available without displaying an error.
        wantsPlayback = false;
        toggle.textContent = "suono";
        toggle.setAttribute("aria-label", "Ascolta la canzone per Arianna");
        return;
      }
      if (wantsPlayback) showError(error);
    }).finally(() => {
      if (pending === attempt) pending = null;
    });
  }

  function onGesture(event) {
    if (unlocked || event.target.closest("#music-toggle")) return;
    if (event.type === "pointerup" && event.button !== 0) return;
    play();
  }

  function onFirstHover(event) {
    if (unlocked || event.pointerType === "touch") return;
    if (!event.target.closest(".solar-body, .dot--solid.dot--trigger")) return;
    document.removeEventListener("pointerover", onFirstHover, true);
    play({ fromHover: true });
  }

  toggle.addEventListener("click", () => {
    if (!audio.paused && wantsPlayback) {
      wantsPlayback = false;
      audio.pause();
    } else play();
  });

  audio.addEventListener("playing", () => {
    unlocked = true;
    gestureEvents.forEach((type) => document.removeEventListener(type, onGesture, true));
    document.removeEventListener("pointerover", onFirstHover, true);
    syncToggle();
  });
  audio.addEventListener("pause", syncToggle);
  audio.addEventListener("error", () => {
    if (wantsPlayback) showError(audio.error);
  });
  // Capture works even when a photo preview stops event propagation.
  gestureEvents.forEach((type) => document.addEventListener(type, onGesture, true));
  // Delegation also covers the dots rebuilt when returning to the home page.
  document.addEventListener("pointerover", onFirstHover, true);
})();
