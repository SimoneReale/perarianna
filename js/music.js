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
    if (document.body.classList.contains("intro-pending")) return;
    if (unlocked || event.target.closest("#music-toggle")) return;
    if (event.type === "pointerup" && event.button !== 0) return;
    play();
  }

  function onFirstHover(event) {
    if (document.body.classList.contains("intro-pending")) return;
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

  // The entrance is dismissed in the same user gesture that starts the song.
  // Keep this initializer persistent so returning home does not show it again.
  window.__ariannaInitEntrance = function () {
    const entrance = document.getElementById("site-entrance");
    if (!entrance) return;

    function revealHome() {
      document.body.classList.remove("intro-pending");
      document.querySelectorAll("[data-entrance-inert]").forEach((node) => {
        node.inert = false;
      });
    }

    if (window.__ariannaEntered) {
      revealHome();
      entrance.remove();
      return;
    }

    function enter(event) {
      event.preventDefault();
      event.stopPropagation();
      if (entrance.classList.contains("is-leaving")) return;
      window.__ariannaEntered = true;
      play();
      revealHome();
      entrance.classList.add("is-leaving");
      document.dispatchEvent(new Event("arianna:entered"));
      const delay = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 650;
      setTimeout(() => {
        entrance.remove();
        document.querySelector(".page--home .logo")?.focus({ preventScroll: true });
      }, delay);
    }

    entrance.addEventListener("click", enter);
    entrance.addEventListener("keydown", (event) => {
      if (event.key === "Tab") {
        event.preventDefault();
        entrance.querySelector("button").focus();
        return;
      }
      if (event.target.closest("button")) return;
      if (event.key === "Enter" || event.key === " ") enter(event);
    });
    entrance.focus({ preventScroll: true });
  };
  window.__ariannaInitEntrance();
})();
