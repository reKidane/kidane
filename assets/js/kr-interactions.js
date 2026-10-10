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
    var targets = document.querySelectorAll(".about-section, .about-page .social, .projects .col, .news tr");
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
      if (tabs[current].scrollIntoView && root.querySelector(".kr-explorer-tabs").scrollWidth > root.clientWidth) {
        tabs[current].scrollIntoView({ block: "nearest", inline: "center", behavior: reduceMotion ? "auto" : "smooth" });
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

    select(0);
  }

  ready(function () {
    navbarOnScroll();
    pageToc();
    listFilter();
    copyEmail();
    revealOnScroll();
    researchExplorer();
  });
})();
