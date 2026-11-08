/* Loads the 3D focus-plant scene only when it is about to scroll into view.
 * Without WebGL (or if loading fails) the static figure stays in place. */
(function () {
  "use strict";
  function webgl() {
    try {
      var c = document.createElement("canvas");
      return !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl")));
    } catch (e) {
      return false;
    }
  }
  function start(root) {
    if (root._krStarted) return;
    root._krStarted = true;
    root.classList.add("is-loading");
    import(root.getAttribute("data-module"))
      .then(function (mod) {
        mod.mount(root);
      })
      .catch(function () {
        root.classList.add("is-fallback");
      })
      .finally(function () {
        root.classList.remove("is-loading");
      });
  }
  function init() {
    var roots = document.querySelectorAll("[data-kr-plants3d]");
    if (!roots.length) return;
    if (!webgl()) {
      Array.prototype.forEach.call(roots, function (r) {
        r.classList.add("is-fallback");
      });
      return;
    }
    if (!("IntersectionObserver" in window)) return Array.prototype.forEach.call(roots, start);
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            io.unobserve(e.target);
            start(e.target);
          }
        });
      },
      { rootMargin: "600px 0px" }
    );
    Array.prototype.forEach.call(roots, function (r) {
      io.observe(r);
    });
  }
  if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);
})();
