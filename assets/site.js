/* Shared behavior for every page of the portfolio. No libraries. */
(function () {
  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const DRAFT = location.hash === "#draft";
  if (DRAFT) document.documentElement.classList.add("is-draft");

  /* ── optional figures ───────────────────────────────────────
     A figure marked data-optional shows only once its image
     loads. Missing images are hidden from visitors. Open any
     page with #draft at the end of the URL to see placeholders
     for images still to add, with the file name each one needs. */
  document.querySelectorAll("figure[data-optional]").forEach(fig => {
    const img = fig.querySelector("img");
    if (!img) return;
    const miss = () => {
      fig.classList.add("is-missing");
      if (DRAFT) {
        const ph = document.createElement("div");
        ph.className = "fig__ph";
        ph.textContent = "Image to add: " + img.getAttribute("src") + " — " + (img.alt || "");
        img.replaceWith(ph);
      }
    };
    if (img.complete && img.naturalWidth === 0) miss();
    img.addEventListener("error", miss);
  });
  document.querySelectorAll("img[data-optional]").forEach(img => {
    const miss = () => img.classList.add("is-missing");
    if (img.complete && img.naturalWidth === 0) miss();
    img.addEventListener("error", miss);
  });

  /* ── copy the email address ─────────────────────────────── */
  document.querySelectorAll("[data-copy]").forEach(btn => {
    btn.addEventListener("click", () => {
      const text = btn.getAttribute("data-copy");
      const done = () => {
        btn.setAttribute("data-done", "");
        const was = btn.textContent;
        btn.textContent = "Copied";
        setTimeout(() => { btn.removeAttribute("data-done"); btn.textContent = was; }, 1800);
      };
      const select = () => {
        const target = document.querySelector(btn.getAttribute("data-select"));
        if (!target) return;
        const r = document.createRange();
        r.selectNodeContents(target);
        const s = getSelection(); s.removeAllRanges(); s.addRange(r);
        btn.textContent = "Selected, press Ctrl+C";
      };
      try {
        navigator.clipboard.writeText(text).then(done, select);
      } catch (e) { select(); }
    });
  });

  /* ── local time in Seattle and Bangkok ──────────────────── */
  const clocks = document.querySelectorAll("[data-tz]");
  if (clocks.length) {
    const tick = () => clocks.forEach(el => {
      try {
        el.textContent = new Intl.DateTimeFormat("en-US", {
          hour: "numeric", minute: "2-digit", timeZone: el.getAttribute("data-tz")
        }).format(new Date());
      } catch (e) { /* leave the city name alone */ }
    });
    tick(); setInterval(tick, 30000);
  }

  /* ── contents rail for case studies ─────────────────────── */
  const toc = document.querySelector(".toc ol");
  const sections = [...document.querySelectorAll(".article section[id]")];
  if (toc && sections.length) {
    toc.innerHTML = sections.map(s => {
      const h = s.querySelector("h2");
      return `<li><a href="#${s.id}">${h ? h.textContent : s.id}</a></li>`;
    }).join("");
    const links = [...toc.querySelectorAll("a")];
    const setActive = id => links.forEach(a => a.setAttribute("aria-current", a.getAttribute("href") === "#" + id));
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: "-30% 0px -60% 0px" });
    sections.forEach(s => io.observe(s));
  }

  /* ── phone reel: screens in a frame, with captions ──────── */
  window.phoneReel = function (root, screens, every = 4500) {
    if (!root || !screens.length) return;
    const view = root.querySelector(".phone__view");
    const ctrl = root.querySelector(".reel__ctrl");
    const step = root.querySelector(".reel__step");
    const title = root.querySelector(".reel__title");
    const text = root.querySelector(".reel__text");

    view.innerHTML = screens.map(s => `<img src="${s.img}" alt="${s.alt}" loading="lazy">`).join("");
    ctrl.innerHTML = screens.map((s, i) =>
      `<button class="chip" type="button" data-i="${i}" aria-pressed="false">${s.label}</button>`).join("");
    const imgs = [...view.querySelectorAll("img")];
    const chips = [...ctrl.querySelectorAll(".chip")];

    let at = 0, timer = null, held = false;
    const show = i => {
      at = (i + screens.length) % screens.length;
      imgs.forEach((im, n) => im.classList.toggle("on", n === at));
      chips.forEach((c, n) => c.setAttribute("aria-pressed", n === at));
      const s = screens[at];
      step.textContent = `Screen ${at + 1} of ${screens.length}`;
      title.textContent = s.title;
      text.textContent = s.text;
    };
    const play = () => { if (!REDUCED && !timer && !held) timer = setInterval(() => show(at + 1), every); };
    const stop = () => { clearInterval(timer); timer = null; };

    ctrl.addEventListener("click", e => {
      const b = e.target.closest(".chip"); if (!b) return;
      held = true; stop(); show(+b.dataset.i);
    });
    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", play);
    root.addEventListener("focusin", stop);
    new IntersectionObserver(en => en.forEach(x => x.isIntersecting ? play() : stop()), { threshold: .3 }).observe(root);
    show(0);
  };
})();
