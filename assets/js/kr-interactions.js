/*
 * Site interactions for rekidane.github.io/kidane
 *
 * 1. Navbar gains a shadow once the page scrolls.
 * 2. "On this page" navigation with scroll tracking on long pages.
 * 3. Live search and topic filters on the Publications and Presentations pages.
 * 4. Copy-email button on the home page.
 * 5. Gentle reveal of home sections and project cards as they scroll into view.
 *
 * Everything is progressive: without JavaScript the pages read exactly as before.
 */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === "text") node.textContent = attrs[k];
        else if (k === "html") node.innerHTML = attrs[k];
        else node.setAttribute(k, attrs[k]);
      });
    }
    (children || []).forEach(function (c) {
      if (c) node.appendChild(c);
    });
    return node;
  }

  function slugify(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  }

  /* ---------------------------------------------------------------------
   * 1. Navbar shadow on scroll
   * ------------------------------------------------------------------- */
  function navbarOnScroll() {
    var nav = document.getElementById("navbar");
    if (!nav) return;
    var ticking = false;
    function update() {
      nav.classList.toggle("kr-scrolled", window.scrollY > 8);
      ticking = false;
    }
    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          window.requestAnimationFrame(update);
          ticking = true;
        }
      },
      { passive: true }
    );
    update();
  }

  /* ---------------------------------------------------------------------
   * 2. On-this-page navigation
   * ------------------------------------------------------------------- */
  function pageToc() {
    var post = document.querySelector(".post");
    var article = post && post.querySelector(":scope > article");
    if (!article) return;
    if (post.classList.contains("about-page")) return;
    if (document.getElementById("toc-sidebar")) return;
    if (article.querySelector(".app-embed, .projects, .kr-explorer")) return;

    var headings = Array.prototype.slice.call(article.querySelectorAll(":scope > h2"));
    if (headings.length < 3) return;

    var list = el("ol", { class: "kr-toc-list" });
    headings.forEach(function (h) {
      if (!h.id) h.id = slugify(h.textContent) || "section";
      var label = h.textContent.replace(/^\s*\d+\.\s*/, "").trim();
      var a = el("a", { href: "#" + h.id, text: label });
      list.appendChild(el("li", null, [a]));
    });

    var toc = el("nav", { class: "kr-toc", "aria-label": "On this page" }, [el("p", { class: "kr-toc-title", text: "On this page" }), list]);

    post.classList.add("has-kr-toc");
    article.insertBefore(toc, article.firstChild);

    var links = Array.prototype.slice.call(list.querySelectorAll("a"));

    links.forEach(function (a) {
      a.addEventListener("click", function () {
        setActive(a.getAttribute("href").slice(1));
      });
    });

    function setActive(id) {
      links.forEach(function (a) {
        var on = a.getAttribute("href") === "#" + id;
        a.classList.toggle("is-active", on);
        if (on) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      });
    }

    var ticking = false;
    function track() {
      var current = headings[0].id;
      headings.forEach(function (h) {
        if (h.getBoundingClientRect().top < window.innerHeight * 0.3) current = h.id;
      });
      setActive(current);
      ticking = false;
    }
    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          window.requestAnimationFrame(track);
          ticking = true;
        }
      },
      { passive: true }
    );
    setActive(headings[0].id);
  }

  /* ---------------------------------------------------------------------
   * 3. Live search and filters for list pages
   * ------------------------------------------------------------------- */
  var FILTER_PAGES = [
    {
      match: /\/publications\/?$/,
      noun: ["record", "records"],
      placeholder: "Search publications",
      filters: [
        { label: "All", test: null },
        { label: "Grapevine", test: /vitis|grape|vine|syrah|viticultur|gewurztraminer|wine|rootstock/i },
        { label: "Sorghum", test: /sorghum/i },
        { label: "Preprints", section: 0 },
        { label: "Peer-reviewed", section: 1 },
      ],
    },
    {
      match: /\/presentations\/?$/,
      noun: ["presentation", "presentations"],
      placeholder: "Search presentations",
      filters: [
        { label: "All", test: null },
        { label: "Oral", test: /oral presentation/i },
        { label: "Poster", test: /poster/i },
        { label: "Grapevine", test: /vitis|grape|vine|syrah|viticultur|wine|rootstock/i },
      ],
    },
  ];

  function listFilter() {
    var path = window.location.pathname;
    var config = null;
    FILTER_PAGES.forEach(function (c) {
      if (c.match.test(path)) config = c;
    });
    if (!config) return;

    var article = document.querySelector(".post > article");
    if (!article) return;

    // Collect the Markdown sections: each h2 followed by its lists.
    var sections = [];
    var current = null;
    Array.prototype.forEach.call(article.children, function (node) {
      if (node.tagName === "H2") {
        current = { heading: node, nodes: [], items: [] };
        sections.push(current);
      } else if (current) {
        current.nodes.push(node);
        if (node.tagName === "OL" || node.tagName === "UL") {
          Array.prototype.forEach.call(node.children, function (li) {
            if (li.tagName === "LI") current.items.push(li);
          });
        }
      }
    });
    sections = sections.filter(function (s) {
      return s.items.length > 0;
    });
    if (!sections.length) return;

    var total = 0;
    sections.forEach(function (s, i) {
      s.index = i;
      s.items.forEach(function (li) {
        li.setAttribute("data-kr-text", li.textContent.toLowerCase().replace(/\s+/g, " "));
        total++;
      });
    });

    var input = el("input", {
      type: "search",
      class: "kr-filter-input",
      placeholder: config.placeholder,
      "aria-label": config.placeholder,
      autocomplete: "off",
    });
    var chips = el("div", { class: "kr-filter-chips", role: "group", "aria-label": "Filter" });
    var count = el("p", { class: "kr-filter-count", "aria-live": "polite" });
    var empty = el("p", { class: "kr-filter-empty", text: "No matches. Clear the search or choose All." });
    empty.hidden = true;

    var active = 0;
    config.filters.forEach(function (f, i) {
      var b = el("button", { type: "button", class: "kr-chip", "aria-pressed": i === 0 ? "true" : "false", text: f.label });
      b.addEventListener("click", function () {
        active = i;
        Array.prototype.forEach.call(chips.children, function (c, j) {
          c.setAttribute("aria-pressed", j === i ? "true" : "false");
        });
        apply();
      });
      chips.appendChild(b);
    });

    var searchWrap = el("div", { class: "kr-filter-search" }, [
      el("i", { class: "fa-solid fa-magnifying-glass", "aria-hidden": "true" }),
      input,
      el("kbd", { class: "kr-filter-kbd", text: "/" }),
    ]);

    var bar = el("div", { class: "kr-filter" }, [searchWrap, chips, count]);
    article.insertBefore(bar, sections[0].heading);
    article.insertBefore(empty, sections[0].heading);

    function apply() {
      var q = input.value.trim().toLowerCase();
      var terms = q ? q.split(/\s+/) : [];
      var f = config.filters[active];
      var shown = 0;

      sections.forEach(function (s) {
        var inSection = f.section === undefined || f.section === s.index;
        var sectionShown = 0;
        s.items.forEach(function (li) {
          var text = li.getAttribute("data-kr-text");
          var ok = inSection && (!f.test || f.test.test(text));
          for (var t = 0; ok && t < terms.length; t++) {
            if (text.indexOf(terms[t]) === -1) ok = false;
          }
          li.hidden = !ok;
          if (ok) sectionShown++;
        });
        var hideSection = sectionShown === 0;
        s.heading.hidden = hideSection;
        s.nodes.forEach(function (n) {
          n.hidden = hideSection;
        });
        shown += sectionShown;
      });

      var filtered = q || f.test || f.section !== undefined;
      count.textContent = filtered
        ? "Showing " + shown + " of " + total + " " + config.noun[1]
        : total + " " + (total === 1 ? config.noun[0] : config.noun[1]);
      empty.hidden = shown !== 0;
    }

    var timer;
    input.addEventListener("input", function () {
      clearTimeout(timer);
      timer = setTimeout(apply, 80);
    });
    input.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        input.value = "";
        apply();
      }
    });
    document.addEventListener("keydown", function (e) {
      var tag = (document.activeElement && document.activeElement.tagName) || "";
      if (e.key === "/" && !/INPUT|TEXTAREA|SELECT/.test(tag) && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        input.focus();
      }
    });

    apply();
  }

  /* ---------------------------------------------------------------------
   * 4. Copy email
   * ------------------------------------------------------------------- */
  var toastTimer;
  function toast(message) {
    var t = document.getElementById("kr-toast");
    if (!t) {
      t = el("div", { id: "kr-toast", class: "kr-toast", role: "status", "aria-live": "polite" });
      document.body.appendChild(t);
    }
    t.textContent = message;
    t.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      t.classList.remove("is-visible");
    }, 2200);
  }

  function copyEmail() {
    var links = document.querySelectorAll('.about-page .more-info a[href^="mailto:"]');
    Array.prototype.forEach.call(links, function (a) {
      var address = a.getAttribute("href").replace(/^mailto:/, "");
      var btn = el("button", {
        type: "button",
        class: "kr-copy",
        "aria-label": "Copy email address",
        title: "Copy email address",
        html: '<i class="fa-regular fa-copy" aria-hidden="true"></i>',
      });
      btn.addEventListener("click", function () {
        function done() {
          btn.innerHTML = '<i class="fa-solid fa-check" aria-hidden="true"></i>';
          toast("Email address copied");
          setTimeout(function () {
            btn.innerHTML = '<i class="fa-regular fa-copy" aria-hidden="true"></i>';
          }, 2000);
        }
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(address).then(done, function () {
            window.location.href = "mailto:" + address;
          });
        } else {
          window.location.href = "mailto:" + address;
        }
      });
      a.parentNode.classList.add("kr-email-line");
      a.parentNode.appendChild(btn);
    });
  }

  /* ---------------------------------------------------------------------
   * 5. Reveal on scroll
   * ------------------------------------------------------------------- */
  function revealOnScroll() {
    if (reduceMotion || !("IntersectionObserver" in window)) return;
    var targets = document.querySelectorAll(".about-section, .projects .col, .news tr, .kr-intro, .kr-about, .kr-stories, .kr-connect");
    if (!targets.length) return;
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );
    Array.prototype.forEach.call(targets, function (t, i) {
      // Already on screen at load: show immediately, no animation.
      if (t.getBoundingClientRect().top < window.innerHeight * 0.92) return;
      t.classList.add("kr-reveal");
      if (t.matches(".projects .col, .news tr")) {
        var siblings = Array.prototype.indexOf.call(t.parentNode.children, t);
        t.style.transitionDelay = Math.min(siblings, 4) * 70 + "ms";
      }
      io.observe(t);
    });
  }

  /* ---------------------------------------------------------------------
   * 6. Research explorer: themes from cell to climate
   * ------------------------------------------------------------------- */
  function researchExplorer() {
    var root = document.getElementById("research-explorer");
    if (!root) return;
    var tabs = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
    var panels = Array.prototype.slice.call(root.querySelectorAll('[role="tabpanel"]'));
    var zones = Array.prototype.slice.call(root.querySelectorAll(".kr-zone"));
    var steps = root.querySelectorAll(".kr-step");
    var count = root.querySelector(".kr-step-count");
    if (!tabs.length || tabs.length !== panels.length) return;

    root.classList.add("is-ready");
    var current = 0;
    var svg = root.querySelector(".kr-scales svg");
    var order = ["cell", "plant", "vineyard", "trials", "climate"];
    var full = svg ? svg.getAttribute("viewBox") : null;

    // On narrow screens, zoom the drawing to the scales that are lit.
    function frame(lit) {
      if (!svg) return;
      if (window.innerWidth >= 768) {
        svg.setAttribute("viewBox", full);
        root.classList.remove("is-zoomed");
        return;
      }
      var idx = lit
        .map(function (z) {
          return order.indexOf(z);
        })
        .filter(function (i) {
          return i !== -1;
        });
      if (!idx.length) return;
      var a = Math.min.apply(null, idx);
      var b = Math.max.apply(null, idx);
      // Scales that are far apart (genome and field trials) would shrink the
      // drawing too much on a phone, so show the larger one.
      if (b - a > 1) a = b;
      svg.setAttribute("viewBox", a * 240 + " 0 " + (b - a + 1) * 240 + " 240");
      root.classList.add("is-zoomed");
    }

    var resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        frame((tabs[current].getAttribute("data-zones") || "").split(/\s+/));
      }, 150);
    });

    function select(i, focus) {
      current = (i + tabs.length) % tabs.length;
      tabs.forEach(function (t, j) {
        var on = j === current;
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.tabIndex = on ? 0 : -1;
        panels[j].hidden = !on;
      });
      var lit = (tabs[current].getAttribute("data-zones") || "").split(/\s+/);
      zones.forEach(function (z) {
        z.classList.toggle("is-on", lit.indexOf(z.getAttribute("data-zone")) !== -1);
      });
      frame(lit);
      if (count) count.textContent = current + 1 + " of " + tabs.length;
      if (steps.length === 2) {
        steps[0].disabled = current === 0;
        steps[1].disabled = current === tabs.length - 1;
      }
      if (focus) tabs[current].focus();
      // Scroll only the tab strip sideways; never move the page.
      var strip = root.querySelector(".kr-explorer-tabs");
      if (strip && strip.scrollWidth > strip.clientWidth) {
        var t = tabs[current];
        var left = strip.scrollLeft + t.getBoundingClientRect().left - strip.getBoundingClientRect().left - (strip.clientWidth - t.offsetWidth) / 2;
        if (strip.scrollTo) strip.scrollTo({ left: left, behavior: reduceMotion ? "auto" : "smooth" });
        else strip.scrollLeft = left;
      }
    }

    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () {
        select(i);
      });
      t.addEventListener("keydown", function (e) {
        var k = e.key;
        if (k === "ArrowRight" || k === "ArrowDown") {
          e.preventDefault();
          select(current + 1, true);
        } else if (k === "ArrowLeft" || k === "ArrowUp") {
          e.preventDefault();
          select(current - 1, true);
        } else if (k === "Home") {
          e.preventDefault();
          select(0, true);
        } else if (k === "End") {
          e.preventDefault();
          select(tabs.length - 1, true);
        }
      });
    });

    Array.prototype.forEach.call(steps, function (b) {
      b.addEventListener("click", function () {
        select(current + parseInt(b.getAttribute("data-step"), 10));
      });
    });

    // Clicking a scale in the drawing jumps to the first theme at that scale.
    zones.forEach(function (z) {
      z.addEventListener("click", function () {
        var name = z.getAttribute("data-zone");
        for (var e = 0; e < tabs.length; e++) {
          if ((tabs[e].getAttribute("data-zones") || "").trim() === name) {
            select(e);
            return;
          }
        }
        for (var i = 0; i < tabs.length; i++) {
          if ((tabs[i].getAttribute("data-zones") || "").split(/\s+/).indexOf(name) !== -1) {
            select(i);
            return;
          }
        }
      });
    });

    // Omics layers: pointing at a layer highlights where it sits in the drawing.
    var omicCards = root.querySelectorAll(".kr-omics [data-omic]");
    function peek(name) {
      if (name) root.setAttribute("data-omic-focus", name);
      else root.removeAttribute("data-omic-focus");
      zones.forEach(function (z) {
        z.classList.toggle("is-peek", !!name && !!z.querySelector('[data-omic="' + name + '"]'));
      });
    }
    Array.prototype.forEach.call(omicCards, function (card) {
      var name = card.getAttribute("data-omic");
      card.addEventListener("mouseenter", function () {
        peek(name);
      });
      card.addEventListener("mouseleave", function () {
        peek(null);
      });
      card.addEventListener("focus", function () {
        peek(name);
      });
      card.addEventListener("blur", function () {
        peek(null);
      });
      card.addEventListener("click", function () {
        peek(root.getAttribute("data-omic-focus") === name ? null : name);
      });
    });

    var fromHash = -1;
    tabs.forEach(function (t, i) {
      if (window.location.hash && "#" + t.getAttribute("aria-controls") === window.location.hash) fromHash = i;
    });
    select(fromHash >= 0 ? fromHash : 0);
    if (fromHash >= 0) {
      setTimeout(function () {
        root.scrollIntoView({ block: "start", behavior: reduceMotion ? "auto" : "smooth" });
      }, 150);
    }
  }

  /* ---------------------------------------------------------------------
   * 7. Loading screen, shown once per visit
   * ------------------------------------------------------------------- */
  function loader() {
    var el = document.getElementById("kr-loader");
    if (!el) return;
    function hide() {
      el.classList.add("is-done");
      try {
        sessionStorage.setItem("krSeen", "1");
      } catch (e) {}
      setTimeout(function () {
        if (el.parentNode) el.parentNode.removeChild(el);
      }, 700);
    }
    if (document.documentElement.classList.contains("kr-seen")) {
      if (el.parentNode) el.parentNode.removeChild(el);
      return;
    }
    var start = Date.now();
    function done() {
      setTimeout(hide, Math.max(0, 900 - (Date.now() - start)));
    }
    if (document.readyState === "complete") done();
    else window.addEventListener("load", done);
    setTimeout(hide, 2600); // never block the page for long
  }

  /* ---------------------------------------------------------------------
   * 8. Rotating words (header tagline and hero role)
   * ------------------------------------------------------------------- */
  function rotators() {
    var els = document.querySelectorAll(".kr-rotator[data-words]");
    Array.prototype.forEach.call(els, function (el) {
      var words = el.getAttribute("data-words").split("|").filter(Boolean);
      if (words.length < 2) return;
      var i = 0;
      if (reduceMotion) return;
      setInterval(function () {
        el.classList.add("is-out");
        setTimeout(function () {
          i = (i + 1) % words.length;
          el.textContent = words[i];
          el.classList.remove("is-out");
        }, 380);
      }, 2800);
    });
  }

  /* ---------------------------------------------------------------------
   * 9. Home: header sits over the hero until the page scrolls
   * ------------------------------------------------------------------- */
  function heroHeader() {
    if (!document.body.classList.contains("kr-home")) return;
    var hero = document.querySelector(".kr-hero");
    if (!hero) return;
    function update() {
      var past = window.scrollY > 60;
      document.body.classList.toggle("kr-over-hero", !past);
    }
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  /* ---------------------------------------------------------------------
   * 10. Research in numbers: pinned section that scrolls sideways
   * ------------------------------------------------------------------- */
  function numbersScroller() {
    var section = document.querySelector(".kr-numbers");
    if (!section) return;
    var track = section.querySelector(".kr-numbers-track");
    var dots = section.querySelectorAll(".kr-numbers-dots span");
    var cards = track ? track.children : [];
    if (!track || !cards.length) return;

    var wide = window.matchMedia("(min-width: 992px)");
    function setup() {
      var on = wide.matches && !reduceMotion;
      section.classList.toggle("is-pinned", on);
      if (!on) {
        section.style.height = "";
        track.style.transform = "";
        return;
      }
      // Section is as tall as the sideways distance plus one screen.
      var distance = track.scrollWidth - track.clientWidth;
      section.style.height = window.innerHeight + Math.max(0, distance) + "px";
      section.setAttribute("data-distance", distance);
      tick();
    }
    var ticking = false;
    function tick() {
      ticking = false;
      var distance = parseFloat(section.getAttribute("data-distance") || 0);
      var r = section.getBoundingClientRect();
      var span = section.offsetHeight - window.innerHeight;
      var p = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0;
      if (section.classList.contains("is-pinned")) track.style.transform = "translate3d(" + -p * distance + "px,0,0)";
      var active = Math.min(cards.length - 1, Math.round(p * (cards.length - 1)));
      if (!section.classList.contains("is-pinned")) {
        // stacked layout: active card is the one nearest the middle of the screen
        var mid = window.innerHeight / 2,
          best = 1e9;
        Array.prototype.forEach.call(cards, function (c, i) {
          var cr = c.getBoundingClientRect();
          var d = Math.abs(cr.top + cr.height / 2 - mid);
          if (d < best) {
            best = d;
            active = i;
          }
        });
      }
      Array.prototype.forEach.call(dots, function (d, i) {
        d.classList.toggle("is-active", i === active);
      });
    }
    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          ticking = true;
          window.requestAnimationFrame(tick);
        }
      },
      { passive: true }
    );
    var rt;
    window.addEventListener("resize", function () {
      clearTimeout(rt);
      rt = setTimeout(setup, 150);
    });
    window.addEventListener("load", setup);
    setup();
  }

  /* ---------------------------------------------------------------------
   * 11. Story cards: one open at a time
   * ------------------------------------------------------------------- */
  function storyCards() {
    var items = document.querySelectorAll(".kr-story");
    Array.prototype.forEach.call(items, function (d) {
      d.addEventListener("toggle", function () {
        if (!d.open) return;
        Array.prototype.forEach.call(items, function (o) {
          if (o !== d) o.open = false;
        });
      });
    });
  }

  /* ---------------------------------------------------------------------
   * 12. Hero network: drifting nodes and links, like a metabolic network
   * ------------------------------------------------------------------- */
  function heroNetwork() {
    var hero = document.querySelector(".kr-hero");
    if (!hero || reduceMotion || !window.requestAnimationFrame) return;
    var canvas = document.createElement("canvas");
    canvas.className = "kr-hero-net";
    canvas.setAttribute("aria-hidden", "true");
    hero.insertBefore(canvas, hero.firstChild);
    var ctx = canvas.getContext("2d");
    if (!ctx) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = 0,
      h = 0,
      nodes = [],
      mouse = { x: -1e4, y: -1e4 },
      running = false,
      raf = 0;
    var palette = ["226,179,74", "255,255,255", "120,190,160", "47,128,194"];

    function resize() {
      var r = hero.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var count = Math.round(Math.min(70, Math.max(24, (w * h) / 22000)));
      nodes = [];
      for (var i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          r: 1 + Math.random() * 2.2,
          c: palette[i % palette.length],
        });
      }
    }

    function frame() {
      ctx.clearRect(0, 0, w, h);
      var link = Math.min(170, w / 7);
      for (var i = 0; i < nodes.length; i++) {
        var a = nodes[i];
        var dxm = mouse.x - a.x,
          dym = mouse.y - a.y,
          dm = Math.sqrt(dxm * dxm + dym * dym);
        if (dm < 200 && dm > 1) {
          a.vx += (dxm / dm) * 0.012;
          a.vy += (dym / dm) * 0.012;
        }
        a.vx *= 0.995;
        a.vy *= 0.995;
        a.x += a.vx;
        a.y += a.vy;
        if (a.x < 0 || a.x > w) a.vx *= -1;
        if (a.y < 0 || a.y > h) a.vy *= -1;
        for (var j = i + 1; j < nodes.length; j++) {
          var b = nodes[j],
            dx = a.x - b.x,
            dy = a.y - b.y,
            d = Math.sqrt(dx * dx + dy * dy);
          if (d < link) {
            ctx.strokeStyle = "rgba(226,179,74," + (1 - d / link) * 0.22 + ")";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        ctx.fillStyle = "rgba(" + a.c + ",0.55)";
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (running) raf = window.requestAnimationFrame(frame);
    }

    function start() {
      if (running) return;
      running = true;
      raf = window.requestAnimationFrame(frame);
    }
    function stop() {
      running = false;
      window.cancelAnimationFrame(raf);
    }

    hero.addEventListener("pointermove", function (e) {
      var r = hero.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    });
    hero.addEventListener("pointerleave", function () {
      mouse.x = mouse.y = -1e4;
    });
    var rt;
    window.addEventListener("resize", function () {
      clearTimeout(rt);
      rt = setTimeout(resize, 200);
    });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        entries[0].isIntersecting && !document.hidden ? start() : stop();
      }).observe(hero);
    } else start();
    document.addEventListener("visibilitychange", function () {
      document.hidden ? stop() : start();
    });
    resize();
    start();
  }

  /* ---------------------------------------------------------------------
   * 13. Headings that rise in word by word
   * ------------------------------------------------------------------- */
  function splitHeadings() {
    if (reduceMotion || !("IntersectionObserver" in window)) return;
    var heads = document.querySelectorAll(
      ".kr-intro-heading, .kr-numbers-head h2, .kr-stories-title, .kr-connect h2, .about-section .section-heading, .kr-about .section-heading"
    );
    if (!heads.length) return;
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    Array.prototype.forEach.call(heads, function (hd) {
      var n = 0;
      var walker = document.createTreeWalker(hd, NodeFilter.SHOW_TEXT, null);
      var texts = [];
      while (walker.nextNode()) texts.push(walker.currentNode);
      texts.forEach(function (t) {
        var parts = t.nodeValue.split(/(\s+)/);
        var frag = document.createDocumentFragment();
        parts.forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) {
            frag.appendChild(document.createTextNode(part));
            return;
          }
          var outer = document.createElement("span");
          outer.className = "kr-word";
          var inner = document.createElement("span");
          inner.textContent = part;
          inner.style.transitionDelay = Math.min(n++, 14) * 55 + "ms";
          outer.appendChild(inner);
          frag.appendChild(outer);
        });
        t.parentNode.replaceChild(frag, t);
      });
      hd.classList.add("kr-split");
      io.observe(hd);
    });
  }

  /* ---------------------------------------------------------------------
   * 14. Numbers count up the first time they appear
   * ------------------------------------------------------------------- */
  function countUp() {
    var vals = document.querySelectorAll(".kr-number-value");
    if (!vals.length || reduceMotion || !("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          io.unobserve(e.target);
          var node = e.target,
            end = parseInt(node.getAttribute("data-value"), 10),
            t0 = performance.now(),
            dur = 1400;
          (function step(now) {
            var p = Math.min(1, (now - t0) / dur);
            var eased = 1 - Math.pow(1 - p, 3);
            node.textContent = Math.round(end * eased);
            if (p < 1) window.requestAnimationFrame(step);
          })(t0);
        });
      },
      { threshold: 0.4 }
    );
    Array.prototype.forEach.call(vals, function (v) {
      var n = parseInt(v.textContent, 10);
      if (isNaN(n)) return;
      v.setAttribute("data-value", n);
      v.style.minWidth = v.textContent.trim().length + "ch";
      v.textContent = "0";
      io.observe(v);
    });
  }

  /* ---------------------------------------------------------------------
   * 15. Photos wipe open, hero photo drifts with scroll
   * ------------------------------------------------------------------- */
  function photoMotion() {
    if (reduceMotion || !("IntersectionObserver" in window)) return;
    var pics = document.querySelectorAll(".kr-number-photo, .kr-about .profile figure");
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target._krPic.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    Array.prototype.forEach.call(pics, function (p) {
      // Watch the unclipped parent: a fully clipped photo never counts as visible.
      var watch = p.parentNode;
      watch._krPic = p;
      p.classList.add("kr-wipe");
      io.observe(watch);
    });

    var photo = document.querySelector(".kr-hero-photo");
    var emblem = document.querySelector(".kr-hero-emblem");
    if (!photo) return;
    var ticking = false;
    function drift() {
      ticking = false;
      var y = window.scrollY || window.pageYOffset;
      if (y > window.innerHeight * 1.2) return;
      photo.style.transform = "translate3d(0," + y * 0.12 + "px,0)";
      if (emblem) emblem.style.transform = "rotate(" + y * 0.08 + "deg)";
    }
    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          ticking = true;
          window.requestAnimationFrame(drift);
        }
      },
      { passive: true }
    );
  }

  /* ---------------------------------------------------------------------
   * 16. Cards tilt toward the pointer; buttons lean toward it
   * ------------------------------------------------------------------- */
  function pointerMotion() {
    if (reduceMotion || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    Array.prototype.forEach.call(document.querySelectorAll(".kr-story, .kr-wall .kr-fig"), function (card) {
      card.classList.add("kr-tilt");
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5,
          py = (e.clientY - r.top) / r.height - 0.5;
        var amt = card.classList.contains("kr-story") ? 2 : 5;
        card.style.setProperty("--kr-rx", (-py * amt).toFixed(2) + "deg");
        card.style.setProperty("--kr-ry", (px * amt).toFixed(2) + "deg");
        card.style.setProperty("--kr-mx", ((px + 0.5) * 100).toFixed(1) + "%");
        card.style.setProperty("--kr-my", ((py + 0.5) * 100).toFixed(1) + "%");
      });
      card.addEventListener("pointerleave", function () {
        card.style.setProperty("--kr-rx", "0deg");
        card.style.setProperty("--kr-ry", "0deg");
      });
    });
    Array.prototype.forEach.call(document.querySelectorAll(".kr-btn"), function (btn) {
      btn.addEventListener("pointermove", function (e) {
        var r = btn.getBoundingClientRect();
        var dx = e.clientX - (r.left + r.width / 2),
          dy = e.clientY - (r.top + r.height / 2);
        btn.style.transform = "translate(" + dx * 0.18 + "px," + dy * 0.28 + "px)";
      });
      btn.addEventListener("pointerleave", function () {
        btn.style.transform = "";
      });
    });
  }

  /* ---------------------------------------------------------------------
   * 17. Figure viewer: the card grows into a full-screen viewer, with
   *     zoom, pan, swipe, keyboard, a filmstrip and the paper credit
   * ------------------------------------------------------------------- */
  var krViewer = null;

  function figureViewer() {
    var cards = document.querySelectorAll("[data-kr-fig]");
    if (!cards.length) return;
    var EASE = "cubic-bezier(0.2, 0.8, 0.2, 1)";
    var lb,
      frame,
      img,
      stage,
      info,
      strip,
      countEl,
      group = [],
      index = 0,
      opener = null,
      busy = false;
    var zoom = { s: 1, x: 0, y: 0 };

    function el(tag, cls, html) {
      var n = document.createElement(tag);
      if (cls) n.className = cls;
      if (html) n.innerHTML = html;
      return n;
    }

    function build() {
      lb = el("div", "kr-lb");
      lb.setAttribute("role", "dialog");
      lb.setAttribute("aria-modal", "true");
      lb.setAttribute("aria-label", "Figure viewer");
      lb.hidden = true;
      lb.innerHTML =
        '<div class="kr-lb-backdrop"></div>' +
        '<div class="kr-lb-bar"><span class="kr-lb-count"></span><div class="kr-lb-tools">' +
        '<button type="button" data-act="out" aria-label="Zoom out"><i class="fa-solid fa-minus"></i></button>' +
        '<button type="button" data-act="in" aria-label="Zoom in"><i class="fa-solid fa-plus"></i></button>' +
        '<button type="button" data-act="reset" aria-label="Fit to screen"><i class="fa-solid fa-compress"></i></button>' +
        '<a class="kr-lb-dl" data-act="full" target="_blank" rel="noopener" aria-label="Open the image in a new tab"><i class="fa-solid fa-arrow-up-right-from-square"></i></a>' +
        '<button type="button" data-act="close" class="kr-lb-close" aria-label="Close viewer"><i class="fa-solid fa-xmark"></i></button>' +
        "</div></div>" +
        '<div class="kr-lb-stage"><div class="kr-lb-frame"><img class="kr-lb-img" alt=""></div>' +
        '<button type="button" class="kr-lb-nav kr-lb-prev" data-act="prev" aria-label="Previous figure"><i class="fa-solid fa-arrow-left"></i></button>' +
        '<button type="button" class="kr-lb-nav kr-lb-next" data-act="next" aria-label="Next figure"><i class="fa-solid fa-arrow-right"></i></button>' +
        '<p class="kr-lb-hint">Scroll or double-click to zoom, drag to pan</p></div>' +
        '<aside class="kr-lb-info"><span class="kr-fig-kicker"></span><h2 class="kr-lb-title"></h2>' +
        '<p class="kr-lb-caption"></p><p class="kr-lb-paper"></p><p class="kr-lb-credit"></p></aside>' +
        '<div class="kr-lb-strip" role="list"></div>';
      document.body.appendChild(lb);
      frame = lb.querySelector(".kr-lb-frame");
      img = lb.querySelector(".kr-lb-img");
      stage = lb.querySelector(".kr-lb-stage");
      info = lb.querySelector(".kr-lb-info");
      strip = lb.querySelector(".kr-lb-strip");
      countEl = lb.querySelector(".kr-lb-count");

      lb.addEventListener("click", function (e) {
        var b = e.target.closest("[data-act]");
        if (e.target.classList.contains("kr-lb-backdrop") || (e.target === stage && zoom.s === 1)) return close();
        if (!b) return;
        var act = b.getAttribute("data-act");
        if (act === "close") close();
        else if (act === "prev") go(-1);
        else if (act === "next") go(1);
        else if (act === "in") zoomBy(1.6);
        else if (act === "out") zoomBy(1 / 1.6);
        else if (act === "reset") setZoom(1, 0, 0, true);
      });
      document.addEventListener("keydown", function (e) {
        if (lb.hidden) return;
        if (e.key === "Escape") close();
        else if (e.key === "ArrowRight") go(1);
        else if (e.key === "ArrowLeft") go(-1);
        else if (e.key === "+" || e.key === "=") zoomBy(1.6);
        else if (e.key === "-") zoomBy(1 / 1.6);
        else if (e.key === "0") setZoom(1, 0, 0, true);
        else if (e.key === "Tab") {
          var f = lb.querySelectorAll("button, a[href]");
          var first = f[0],
            last = f[f.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            last.focus();
            e.preventDefault();
          } else if (!e.shiftKey && document.activeElement === last) {
            first.focus();
            e.preventDefault();
          }
        }
      });

      // Zoom with the wheel around the pointer; double-click toggles
      stage.addEventListener(
        "wheel",
        function (e) {
          e.preventDefault();
          zoomAt(Math.exp(-e.deltaY * 0.0018), e.clientX, e.clientY);
        },
        { passive: false }
      );
      frame.addEventListener("dblclick", function (e) {
        if (zoom.s > 1) setZoom(1, 0, 0, true);
        else zoomAt(2.5, e.clientX, e.clientY, true);
      });

      // Drag to pan when zoomed, swipe to change figure when not
      var drag = null;
      stage.addEventListener("pointerdown", function (e) {
        if (e.target.closest("button")) return;
        drag = { x: e.clientX, y: e.clientY, ox: zoom.x, oy: zoom.y, moved: false };
        if (zoom.s > 1) stage.setPointerCapture(e.pointerId);
      });
      stage.addEventListener("pointermove", function (e) {
        if (!drag) return;
        var dx = e.clientX - drag.x,
          dy = e.clientY - drag.y;
        if (Math.abs(dx) + Math.abs(dy) > 4) drag.moved = true;
        if (zoom.s > 1) setZoom(zoom.s, drag.ox + dx, drag.oy + dy);
        else if (drag.moved) frame.style.transform = "translateX(" + dx * 0.4 + "px)";
      });
      stage.addEventListener("pointerup", function (e) {
        if (!drag) return;
        var dx = e.clientX - drag.x;
        if (zoom.s === 1) {
          frame.style.transform = "";
          if (Math.abs(dx) > 60) go(dx < 0 ? 1 : -1);
        }
        drag = null;
      });
      window.addEventListener("resize", function () {
        if (!lb.hidden) fit();
      });
    }

    function data(card) {
      return {
        full: card.getAttribute("data-full"),
        thumb: card.querySelector("img").getAttribute("src"),
        title: card.getAttribute("data-title"),
        caption: card.getAttribute("data-caption"),
        paper: card.getAttribute("data-paper"),
        credit: card.getAttribute("data-credit"),
        kicker: card.querySelector(".kr-fig-kicker").textContent,
        w: +card.querySelector("img").getAttribute("width"),
        h: +card.querySelector("img").getAttribute("height"),
      };
    }

    function visibleGroup(card) {
      var root = card.closest("[data-kr-gallery]") || document;
      return Array.prototype.filter.call(root.querySelectorAll("[data-kr-fig]"), function (c) {
        return c.offsetParent !== null || c === card;
      });
    }

    // Size the frame to fit the stage while keeping the figure's aspect ratio
    function fit() {
      var d = data(group[index]);
      var r = stage.getBoundingClientRect();
      var maxW = r.width * 0.9,
        maxH = r.height * 0.86;
      var scale = Math.min(maxW / d.w, maxH / d.h, 1.6);
      frame.style.width = Math.round(d.w * scale) + "px";
      frame.style.height = Math.round(d.h * scale) + "px";
    }

    function fill() {
      var d = data(group[index]);
      img.src = d.thumb;
      img.alt = d.title;
      var hi = new Image();
      hi.onload = function () {
        if (data(group[index]).full === d.full) img.src = d.full;
      };
      hi.src = d.full;
      info.querySelector(".kr-fig-kicker").textContent = d.kicker;
      info.querySelector(".kr-lb-title").textContent = d.title;
      info.querySelector(".kr-lb-caption").textContent = d.caption;
      info.querySelector(".kr-lb-paper").textContent = d.paper;
      info.querySelector(".kr-lb-credit").innerHTML = d.credit;
      lb.querySelector(".kr-lb-dl").href = d.full;
      countEl.textContent = index + 1 + " / " + group.length;
      Array.prototype.forEach.call(strip.children, function (t, i) {
        t.classList.toggle("is-active", i === index);
        t.setAttribute("aria-current", i === index ? "true" : "false");
      });
      var active = strip.children[index];
      if (active)
        strip.scrollTo({ left: active.offsetLeft - strip.clientWidth / 2 + active.offsetWidth / 2, behavior: reduceMotion ? "auto" : "smooth" });
      info.classList.remove("is-in");
      void info.offsetWidth;
      info.classList.add("is-in");
      setZoom(1, 0, 0);
      fit();
    }

    function buildStrip() {
      strip.innerHTML = "";
      group.forEach(function (c, i) {
        var b = el("button", "kr-lb-thumb");
        b.type = "button";
        b.setAttribute("role", "listitem");
        b.setAttribute("aria-label", "Show figure " + (i + 1) + ": " + c.getAttribute("data-title"));
        b.innerHTML = '<img alt="" src="' + c.querySelector("img").getAttribute("src") + '">';
        b.addEventListener("click", function () {
          if (i !== index) go(i - index);
        });
        strip.appendChild(b);
      });
    }

    function flip(fromRect, reverse) {
      var to = frame.getBoundingClientRect();
      var sx = fromRect.width / to.width,
        sy = fromRect.height / to.height;
      var dx = fromRect.left - to.left,
        dy = fromRect.top - to.top;
      var a = "translate(" + dx + "px," + dy + "px) scale(" + sx + "," + sy + ")";
      var frames = [
        { transform: a, borderRadius: "14px" },
        { transform: "none", borderRadius: "6px" },
      ];
      return frame.animate(reverse ? frames.reverse() : frames, {
        duration: reverse ? 520 : 680,
        easing: EASE,
        fill: "both",
      });
    }

    function open(card) {
      if (!lb) build();
      opener = card;
      group = visibleGroup(card);
      index = group.indexOf(card);
      buildStrip();
      lb.hidden = false;
      document.documentElement.classList.add("kr-lb-lock");
      fill();
      void lb.offsetWidth;
      lb.classList.add("is-open");
      var thumb = card.querySelector("img");
      if (!reduceMotion && thumb && thumb.getBoundingClientRect().width) {
        card.classList.add("is-lifted");
        flip(thumb.getBoundingClientRect()).finished.then(function () {
          frame.getAnimations().forEach(function (an) {
            an.cancel();
          });
        });
      }
      setTimeout(function () {
        lb.querySelector(".kr-lb-close").focus({ preventScroll: true });
      }, 60);
    }

    function close() {
      if (!lb || lb.hidden || busy) return;
      busy = true;
      var card = group[index];
      var thumb = card && card.querySelector("img");
      var r = thumb && thumb.getBoundingClientRect();
      var onScreen = r && r.width && r.bottom > 0 && r.top < window.innerHeight;
      setZoom(1, 0, 0);
      lb.classList.remove("is-open");
      lb.classList.add("is-closing");
      var done = function () {
        frame.getAnimations().forEach(function (an) {
          an.cancel();
        });
        lb.hidden = true;
        lb.classList.remove("is-closing");
        document.documentElement.classList.remove("kr-lb-lock");
        Array.prototype.forEach.call(document.querySelectorAll(".kr-fig.is-lifted"), function (c) {
          c.classList.remove("is-lifted");
        });
        busy = false;
        if (card) card.focus({ preventScroll: true });
      };
      if (!reduceMotion && onScreen) flip(r, true).finished.then(done);
      else setTimeout(done, reduceMotion ? 0 : 320);
    }

    function go(step) {
      if (busy || group.length < 2) return;
      busy = true;
      var dir = step > 0 ? 1 : -1;
      var next = (index + step + group.length) % group.length;
      var outA = reduceMotion
        ? null
        : frame.animate(
            [
              { transform: "none", opacity: 1, filter: "blur(0)" },
              { transform: "translateX(" + -dir * 90 + "px) scale(0.94) rotateY(" + dir * 8 + "deg)", opacity: 0, filter: "blur(6px)" },
            ],
            { duration: 260, easing: "cubic-bezier(0.5, 0, 0.75, 0)", fill: "both" }
          );
      var swap = function () {
        index = next;
        Array.prototype.forEach.call(document.querySelectorAll(".kr-fig.is-lifted"), function (c) {
          c.classList.remove("is-lifted");
        });
        group[index].classList.add("is-lifted");
        fill();
        if (outA) outA.cancel();
        var inA = reduceMotion
          ? null
          : frame.animate(
              [
                { transform: "translateX(" + dir * 110 + "px) scale(0.94) rotateY(" + -dir * 8 + "deg)", opacity: 0, filter: "blur(6px)" },
                { transform: "none", opacity: 1, filter: "blur(0)" },
              ],
              { duration: 520, easing: EASE }
            );
        if (inA)
          inA.finished.then(function () {
            busy = false;
          });
        else busy = false;
      };
      if (outA) outA.finished.then(swap);
      else swap();
    }

    function setZoom(s, x, y, animate) {
      s = Math.max(1, Math.min(6, s));
      if (s === 1) {
        x = 0;
        y = 0;
      } else {
        var fw = frame.clientWidth,
          fh = frame.clientHeight;
        var mx = (fw * (s - 1)) / 2,
          my = (fh * (s - 1)) / 2;
        x = Math.max(-mx, Math.min(mx, x));
        y = Math.max(-my, Math.min(my, y));
      }
      zoom = { s: s, x: x, y: y };
      img.style.transition = animate && !reduceMotion ? "transform 0.45s " + EASE : "none";
      img.style.transform = "translate(" + x + "px," + y + "px) scale(" + s + ")";
      lb.classList.toggle("is-zoomed", s > 1);
    }

    function zoomAt(f, cx, cy, animate) {
      var r = frame.getBoundingClientRect();
      var px = cx - (r.left + r.width / 2),
        py = cy - (r.top + r.height / 2);
      var s = Math.max(1, Math.min(6, zoom.s * f));
      var k = s / zoom.s;
      setZoom(s, px - (px - zoom.x) * k, py - (py - zoom.y) * k, animate);
    }

    function zoomBy(f) {
      var r = frame.getBoundingClientRect();
      zoomAt(f, r.left + r.width / 2, r.top + r.height / 2, true);
    }

    Array.prototype.forEach.call(cards, function (card) {
      card.addEventListener("click", function (e) {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
        e.preventDefault();
        open(card);
      });
    });
    krViewer = { open: open };
  }

  /* ---------------------------------------------------------------------
   * 18. Gallery spotlight: featured figures cross-fade on a slow timer
   * ------------------------------------------------------------------- */
  function spotlight() {
    var root = document.querySelector(".kr-spotlight");
    if (!root) return;
    var slides = root.querySelectorAll(".kr-spot");
    var dotsBox = root.querySelector(".kr-spot-dots");
    if (!slides.length) return;
    var i = 0,
      timer = null,
      DUR = 7000,
      paused = false,
      visible = true;
    root.style.setProperty("--kr-spot-dur", DUR + "ms");
    var dots = Array.prototype.map.call(slides, function (s, n) {
      var d = document.createElement("button");
      d.type = "button";
      d.className = "kr-spot-dot";
      d.setAttribute("role", "tab");
      d.setAttribute("aria-label", "Featured figure " + (n + 1));
      d.innerHTML = "<span></span>";
      d.addEventListener("click", function () {
        show(n);
        restart();
      });
      dotsBox.appendChild(d);
      return d;
    });
    function show(n) {
      var prev = i;
      i = (n + slides.length) % slides.length;
      Array.prototype.forEach.call(slides, function (s, k) {
        s.classList.toggle("is-active", k === i);
        s.classList.toggle("is-leaving", k === prev && prev !== i);
        s.setAttribute("aria-hidden", k === i ? "false" : "true");
      });
      dots.forEach(function (d, k) {
        d.classList.toggle("is-active", k === i);
        d.setAttribute("aria-selected", k === i ? "true" : "false");
      });
    }
    function restart() {
      clearInterval(timer);
      root.classList.remove("is-timing");
      void root.offsetWidth;
      if (reduceMotion || paused || !visible) return;
      root.classList.add("is-timing");
      timer = setInterval(function () {
        show(i + 1);
        root.classList.remove("is-timing");
        void root.offsetWidth;
        root.classList.add("is-timing");
      }, DUR);
    }
    Array.prototype.forEach.call(root.querySelectorAll(".kr-spot-arrow"), function (b) {
      b.addEventListener("click", function () {
        show(i + +b.getAttribute("data-dir"));
        restart();
      });
    });
    Array.prototype.forEach.call(root.querySelectorAll(".kr-spot-open"), function (b) {
      b.addEventListener("click", function () {
        var card = document.querySelector("#fig-" + b.getAttribute("data-open") + " [data-kr-fig]");
        if (card && krViewer) krViewer.open(card);
      });
    });
    root.addEventListener("mouseenter", function () {
      paused = true;
      restart();
    });
    root.addEventListener("mouseleave", function () {
      paused = false;
      restart();
    });
    root.addEventListener("focusin", function () {
      paused = true;
      restart();
    });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) {
        visible = en[0].isIntersecting;
        restart();
      }).observe(root);
    }
    show(0);
    restart();
  }

  /* ---------------------------------------------------------------------
   * 19. Gallery wall: cards rise in as they arrive; filters re-flow with FLIP
   * ------------------------------------------------------------------- */
  function figureWall() {
    var wall = document.querySelector(".kr-wall");
    if (!wall) return;
    var items = Array.prototype.slice.call(wall.querySelectorAll(".kr-wall-item"));

    if (!reduceMotion && "IntersectionObserver" in window) {
      wall.classList.add("kr-wall-anim");
      var io = new IntersectionObserver(
        function (entries) {
          var n = 0;
          entries.forEach(function (e) {
            if (!e.isIntersecting) return;
            e.target.style.setProperty("--kr-delay", n++ * 90 + "ms");
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
      );
      items.forEach(function (it) {
        io.observe(it);
      });
    }

    var chips = document.querySelectorAll(".kr-gfilter .kr-gchip");
    var running = false;
    Array.prototype.forEach.call(chips, function (chip) {
      chip.addEventListener("click", function () {
        if (running || chip.classList.contains("is-active")) return;
        Array.prototype.forEach.call(chips, function (c) {
          c.classList.toggle("is-active", c === chip);
          c.setAttribute("aria-pressed", c === chip ? "true" : "false");
        });
        apply(chip.getAttribute("data-filter"));
      });
    });

    function matches(it, f) {
      return f === "all" || (" " + it.getAttribute("data-tags") + " ").indexOf(" " + f + " ") > -1;
    }

    function apply(f) {
      var shown = items.filter(function (it) {
        return !it.hidden;
      });
      var leaving = shown.filter(function (it) {
        return !matches(it, f);
      });
      var staying = shown.filter(function (it) {
        return matches(it, f);
      });
      var entering = items.filter(function (it) {
        return it.hidden && matches(it, f);
      });
      if (reduceMotion || !wall.animate) {
        items.forEach(function (it) {
          it.hidden = !matches(it, f);
          it.classList.add("is-in");
        });
        return;
      }
      running = true;
      var outs = leaving.map(function (it) {
        return it.animate(
          [
            { opacity: 1, transform: "scale(1)", filter: "blur(0)" },
            { opacity: 0, transform: "scale(0.9)", filter: "blur(4px)" },
          ],
          { duration: 240, easing: "cubic-bezier(0.5, 0, 0.75, 0)", fill: "forwards" }
        ).finished;
      });
      Promise.all(outs).then(function () {
        var first = new Map();
        staying.forEach(function (it) {
          first.set(it, it.getBoundingClientRect());
        });
        leaving.forEach(function (it) {
          it.getAnimations().forEach(function (a) {
            a.cancel();
          });
          it.hidden = true;
        });
        entering.forEach(function (it) {
          it.hidden = false;
          it.classList.add("is-in");
        });
        staying.forEach(function (it) {
          var a = first.get(it),
            b = it.getBoundingClientRect();
          var dx = a.left - b.left,
            dy = a.top - b.top;
          if (dx || dy)
            it.animate([{ transform: "translate(" + dx + "px," + dy + "px)" }, { transform: "none" }], {
              duration: 620,
              easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
            });
        });
        var ins = entering.map(function (it, n) {
          return it.animate(
            [
              { opacity: 0, transform: "translateY(40px) scale(0.94)", filter: "blur(6px)" },
              { opacity: 1, transform: "none", filter: "blur(0)" },
            ],
            { duration: 640, delay: 120 + n * 70, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)", fill: "backwards" }
          ).finished;
        });
        Promise.all(ins).then(function () {
          running = false;
        });
        if (!ins.length) running = false;
      });
    }
  }

  ready(function () {
    navbarOnScroll();
    pageToc();
    listFilter();
    copyEmail();
    revealOnScroll();
    researchExplorer();
    loader();
    rotators();
    heroHeader();
    numbersScroller();
    storyCards();
    heroNetwork();
    splitHeadings();
    countUp();
    photoMotion();
    pointerMotion();
    figureViewer();
    spotlight();
    figureWall();
  });
})();
