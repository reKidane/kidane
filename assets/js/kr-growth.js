/* Growth under stress: two plants grown side by side over 60 days.
 * Left: well watered. Right: the chosen stress (drought, salinity, heat, combined).
 * Illustrative model drawn on a canvas; no external libraries.
 * Leaves sit on a 137.5 degree spiral and the plant turns slowly, so depth,
 * foreshortening and front/back shading give a 3D view. A cut-away pot shows roots. */
(function () {
  "use strict";

  var DAYS = 60;
  var ONSET = 12; // stress begins
  var FULL = 26; // stress fully developed

  var STRESS = {
    control: { name: "Well watered", g: 1, wilt: 0, chlor: 0, burn: 0, pale: 0, curl: 0, ls: 1, root: 1, spread: 1, water: 0.9, salt: 0, heat: 0 },
    drought: {
      name: "Drought",
      g: 0.55,
      wilt: 0.8,
      chlor: 0.3,
      burn: 0.1,
      pale: 0.1,
      curl: 0,
      ls: 0.72,
      root: 1.3,
      spread: 0.65,
      water: 0.12,
      salt: 0,
      heat: 0,
    },
    salinity: {
      name: "Salinity",
      g: 0.62,
      wilt: 0.25,
      chlor: 0.55,
      burn: 0.75,
      pale: 0,
      curl: 0,
      ls: 0.76,
      root: 0.72,
      spread: 0.85,
      water: 0.75,
      salt: 1,
      heat: 0,
    },
    heat: {
      name: "Heat",
      g: 0.72,
      wilt: 0.35,
      chlor: 0.25,
      burn: 0.15,
      pale: 0.55,
      curl: 0.7,
      ls: 0.8,
      root: 0.9,
      spread: 0.9,
      water: 0.55,
      salt: 0,
      heat: 1,
    },
    combined: {
      name: "Combined stress",
      g: 0.4,
      wilt: 0.9,
      chlor: 0.75,
      burn: 0.6,
      pale: 0.35,
      curl: 0.45,
      ls: 0.6,
      root: 0.85,
      spread: 0.7,
      water: 0.15,
      salt: 1,
      heat: 1,
    },
  };

  function clamp(v, a, b) {
    return v < a ? a : v > b ? b : v;
  }
  function smooth(a, b, x) {
    var t = clamp((x - a) / (b - a), 0, 1);
    return t * t * (3 - 2 * t);
  }
  function mix(a, b, t) {
    return a + (b - a) * t;
  }
  function logistic(d) {
    return 1 / (1 + Math.exp(-0.12 * (d - 28)));
  }
  function rng(seed) {
    return function () {
      seed |= 0;
      seed = (seed + 0x6d2b79f5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // Stress level and plant traits on a given day
  function traits(key, day) {
    var s = STRESS[key];
    var r = key === "control" ? 0 : smooth(ONSET, FULL, day);
    var base = logistic(day) - logistic(0);
    var top = logistic(DAYS) - logistic(0);
    var before = logistic(Math.min(day, ONSET)) - logistic(0);
    var h = key === "control" ? base : before + (base - before) * mix(1, s.g, smooth(ONSET, ONSET + 6, day));
    var interval = 3.6 / Math.sqrt(mix(1, s.g, r));
    var leaves = day < 2 ? 0 : Math.min(16, Math.floor((day - 2) / 3.6) + 1);
    if (key !== "control" && day > ONSET) {
      leaves = Math.floor((ONSET - 2) / 3.6) + 1 + Math.floor((day - ONSET) / interval);
      leaves = Math.min(16, leaves);
    }
    return {
      r: r,
      height: h / top, // 0..1 of control at day 60
      leaves: leaves,
      wilt: s.wilt * r,
      chlor: s.chlor * r,
      burn: s.burn * r,
      pale: s.pale * r,
      curl: s.curl * r,
      ls: mix(1, s.ls, r),
      root: mix(1, s.root, r),
      spread: mix(1, s.spread, r),
      water: key === "control" ? s.water : mix(0.9, s.water, r),
      salt: s.salt * r,
      heat: s.heat * r,
    };
  }

  function greenness(t) {
    return Math.round(100 * (1 - 0.7 * t.chlor - 0.25 * t.pale - 0.15 * t.burn));
  }

  function init(root) {
    var canvas = root.querySelector("canvas");
    var ctx = canvas.getContext("2d");
    if (!ctx) return;
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var slider = root.querySelector(".kr-growth-day");
    var playBtn = root.querySelector(".kr-growth-play");
    var dayOut = root.querySelector(".kr-growth-dayout");
    var outs = {
      left: root.querySelectorAll('[data-side="left"] [data-k]'),
      right: root.querySelectorAll('[data-side="right"] [data-k]'),
    };
    var rightName = root.querySelector('[data-side="right"] .kr-growth-name');
    var stress = root.getAttribute("data-stress") || "combined";
    var day = reduce ? 48 : 0;
    var playing = !reduce;
    var visible = true;
    var last = 0;
    var clock = 0;
    var W = 0,
      H = 0,
      dpr = 1;
    var seeds = { left: 11, right: 29 };
    var drops = [];

    function size() {
      var w = canvas.clientWidth;
      var h = Math.round(clamp(w * 0.56, 360, 560));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.style.height = h + "px";
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      W = w;
      H = h;
    }

    /* ---------- scene ---------- */
    function background(x0, w, t, isRight) {
      var g = ctx.createLinearGradient(0, 0, 0, H);
      var heat = isRight ? t.heat : 0;
      g.addColorStop(0, "rgb(" + Math.round(mix(18, 70, heat)) + "," + Math.round(mix(44, 38, heat)) + "," + Math.round(mix(32, 24, heat)) + ")");
      g.addColorStop(0.62, "rgb(" + Math.round(mix(27, 92, heat)) + "," + Math.round(mix(58, 52, heat)) + "," + Math.round(mix(40, 30, heat)) + ")");
      g.addColorStop(1, "#0f1d15");
      ctx.fillStyle = g;
      ctx.fillRect(x0, 0, w, H);

      // soft light from the upper corner
      var lx = isRight ? x0 + w * 0.85 : x0 + w * 0.15;
      var glow = ctx.createRadialGradient(lx, H * 0.08, 0, lx, H * 0.08, w * 0.9);
      glow.addColorStop(0, heat > 0.05 ? "rgba(255,170,70," + (0.18 + 0.32 * heat) + ")" : "rgba(226,179,74,0.16)");
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(x0, 0, w, H);

      if (heat > 0.05) {
        // sun disc with slowly turning rays
        var sx = x0 + w * 0.86,
          sy = H * 0.13,
          sr = Math.min(w, H) * 0.045;
        ctx.save();
        ctx.translate(sx, sy);
        ctx.rotate(clock * 0.15);
        ctx.strokeStyle = "rgba(255,196,90," + 0.55 * heat + ")";
        ctx.lineWidth = 2;
        for (var i = 0; i < 12; i++) {
          ctx.rotate(Math.PI / 6);
          ctx.beginPath();
          ctx.moveTo(sr * 1.5, 0);
          ctx.lineTo(sr * (2.2 + 0.25 * Math.sin(clock * 2 + i)), 0);
          ctx.stroke();
        }
        ctx.restore();
        ctx.fillStyle = "rgba(255,206,110," + 0.9 * heat + ")";
        ctx.beginPath();
        ctx.arc(sx, sy, sr, 0, Math.PI * 2);
        ctx.fill();
        // heat shimmer
        ctx.strokeStyle = "rgba(255,210,150," + 0.06 * heat + ")";
        ctx.lineWidth = 1.5;
        for (var k = 0; k < 4; k++) {
          var yy = H * (0.3 + k * 0.07);
          ctx.beginPath();
          for (var xx = x0 + w * 0.08; xx < x0 + w * 0.92; xx += 6) {
            var yv = yy + Math.sin(xx * 0.035 + clock * 2.4 + k * 1.7) * (2 + k) + Math.sin(xx * 0.11 - clock * 1.3) * 1.2;
            if (xx === x0 + w * 0.08) ctx.moveTo(xx, yv);
            else ctx.lineTo(xx, yv);
          }
          ctx.stroke();
        }
      }
    }

    function pot(cx, t, isRight, seed) {
      // The pot is cut in half: the front half is removed, so the soil is seen
      // as a vertical section and the stem and roots meet at the soil line.
      var topY = H * 0.68,
        potH = H * 0.27,
        tw = Math.min(W * 0.2, H * 0.42),
        bw = tw * 0.76,
        ry = tw * 0.12,
        wt = Math.max(4, tw * 0.04); // wall thickness
      var wet = t.water;
      var surf = "rgb(" + Math.round(mix(170, 74, wet)) + "," + Math.round(mix(136, 54, wet)) + "," + Math.round(mix(96, 36, wet)) + ")";

      // back half of the rim and the soil surface behind the cut
      ctx.fillStyle = "#8f4f31";
      ctx.beginPath();
      ctx.ellipse(cx, topY, tw / 2 + wt, ry + wt * 0.6, 0, Math.PI, 0);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = surf;
      ctx.beginPath();
      ctx.ellipse(cx, topY, tw / 2, ry, 0, Math.PI, 0);
      ctx.closePath();
      ctx.fill();
      if (t.salt > 0.05) {
        var rr = rng(seed + 13);
        for (var q = 0; q < 60 * t.salt; q++) {
          var a = Math.PI + rr() * Math.PI,
            d = Math.sqrt(rr());
          var sx = cx + Math.cos(a) * d * tw * 0.47,
            sy = topY + Math.sin(a) * d * ry * 0.9;
          var tw2 = 0.5 + 0.5 * Math.sin(clock * 3 + q);
          ctx.fillStyle = "rgba(255,255,255," + (0.5 + 0.5 * tw2) * t.salt + ")";
          ctx.fillRect(sx - 1, sy - 1, 2.2, 2.2);
        }
      }
      if (wet < 0.35) {
        // dry crust cracks on the surface
        var rk = rng(seed + 21);
        ctx.strokeStyle = "rgba(70,46,28," + (0.7 - wet) + ")";
        ctx.lineWidth = 1;
        for (var k = 0; k < 5; k++) {
          var kx = cx + (rk() - 0.5) * tw * 0.8,
            ky = topY - rk() * ry * 0.8;
          ctx.beginPath();
          ctx.moveTo(kx, ky);
          ctx.lineTo(kx + (rk() - 0.5) * 22, ky + (rk() - 0.5) * 4);
          ctx.stroke();
        }
      }

      // pot wall in section: terracotta band around the cut face
      var wall = ctx.createLinearGradient(cx - tw / 2 - wt, 0, cx + tw / 2 + wt, 0);
      wall.addColorStop(0, "#9c5636");
      wall.addColorStop(0.5, "#c47a4f");
      wall.addColorStop(1, "#8a4a2e");
      ctx.fillStyle = wall;
      ctx.beginPath();
      ctx.moveTo(cx - tw / 2 - wt, topY);
      ctx.lineTo(cx - bw / 2 - wt, topY + potH + wt);
      ctx.lineTo(cx + bw / 2 + wt, topY + potH + wt);
      ctx.lineTo(cx + tw / 2 + wt, topY);
      ctx.closePath();
      ctx.fill();

      // soil in section
      var soil = ctx.createLinearGradient(0, topY, 0, topY + potH);
      soil.addColorStop(0, "rgb(" + Math.round(mix(150, 62, wet)) + "," + Math.round(mix(118, 44, wet)) + "," + Math.round(mix(82, 30, wet)) + ")");
      soil.addColorStop(1, "rgb(" + Math.round(mix(118, 40, wet)) + "," + Math.round(mix(92, 28, wet)) + "," + Math.round(mix(62, 20, wet)) + ")");
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx - tw / 2, topY);
      ctx.lineTo(cx - bw / 2, topY + potH);
      ctx.lineTo(cx + bw / 2, topY + potH);
      ctx.lineTo(cx + tw / 2, topY);
      ctx.closePath();
      ctx.fillStyle = soil;
      ctx.fill();
      ctx.clip();

      // soil texture
      var rt = rng(seed + 3);
      for (var g = 0; g < 160; g++) {
        ctx.fillStyle = rt() < 0.5 ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.05)";
        ctx.fillRect(cx + (rt() - 0.5) * tw, topY + rt() * potH, 2, 2);
      }
      // water held in the soil
      if (wet > 0.3) {
        var wg = ctx.createLinearGradient(0, topY + potH * (1 - wet), 0, topY + potH);
        wg.addColorStop(0, "rgba(60,120,150,0)");
        wg.addColorStop(1, "rgba(60,120,150," + 0.2 * wet + ")");
        ctx.fillStyle = wg;
        ctx.fillRect(cx - tw, topY, tw * 2, potH * 1.2);
      }
      // dry cracks running down from the surface
      if (wet < 0.35) {
        var rc = rng(seed + 5);
        ctx.strokeStyle = "rgba(60,40,24," + (0.6 - wet) + ")";
        ctx.lineWidth = 1.2;
        for (var c = 0; c < 6; c++) {
          var px = cx + (rc() - 0.5) * tw * 0.85,
            py = topY;
          ctx.beginPath();
          ctx.moveTo(px, py);
          for (var st = 0; st < 4; st++) {
            px += (rc() - 0.5) * 10;
            py += 6 + rc() * 12;
            ctx.lineTo(px, py);
          }
          ctx.stroke();
        }
      }
      // salt specks through the soil
      if (t.salt > 0.05) {
        var rs = rng(seed + 9);
        ctx.fillStyle = "rgba(245,245,240," + 0.75 * t.salt + ")";
        for (var p = 0; p < 90 * t.salt; p++) {
          ctx.fillRect(cx + (rs() - 0.5) * tw, topY + Math.pow(rs(), 1.6) * potH, 1.6, 1.6);
        }
      }
      // the cut face catches light at the edges: soft shading for depth
      var sh = ctx.createLinearGradient(cx - tw / 2, 0, cx + tw / 2, 0);
      sh.addColorStop(0, "rgba(0,0,0,0.22)");
      sh.addColorStop(0.18, "rgba(0,0,0,0)");
      sh.addColorStop(0.82, "rgba(0,0,0,0)");
      sh.addColorStop(1, "rgba(0,0,0,0.26)");
      ctx.fillStyle = sh;
      ctx.fillRect(cx - tw, topY, tw * 2, potH);
      roots(cx, topY, potH, tw, t, seed);
      ctx.restore();

      // soil line and the top of the cut walls
      ctx.strokeStyle = "rgba(255,240,220,0.35)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx - tw / 2, topY + 0.5);
      ctx.lineTo(cx + tw / 2, topY + 0.5);
      ctx.stroke();
      ctx.fillStyle = "#d89466";
      ctx.fillRect(cx - tw / 2 - wt, topY - 1, wt, 2.5);
      ctx.fillRect(cx + tw / 2, topY - 1, wt, 2.5);
      return { topY: topY, tw: tw, potH: potH };
    }

    function roots(cx, y0, potH, tw, t, seed) {
      var r = rng(seed);
      var grow = clamp((day - 1) / 42, 0, 1);
      if (grow <= 0) return;
      var D = potH * 0.92 * clamp(grow * t.root * 0.85, 0, 1);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      // taproot: a gently winding curve
      var pts = [];
      var n = 14,
        wob = (r() - 0.5) * 0.6;
      for (var i = 0; i <= n; i++) {
        var f = i / n;
        pts.push({ x: cx + (Math.sin(f * 3 + wob * 4) - Math.sin(wob * 4)) * tw * 0.035, y: y0 + D * f });
      }
      function stroke(path, w0, w1, a) {
        for (var k = 0; k < path.length - 1; k++) {
          ctx.strokeStyle = "rgba(240,226,200," + a + ")";
          ctx.lineWidth = mix(w0, w1, k / (path.length - 1));
          ctx.beginPath();
          ctx.moveTo(path[k].x, path[k].y);
          ctx.lineTo(path[k + 1].x, path[k + 1].y);
          ctx.stroke();
        }
      }
      // lateral roots bend down as they grow outward
      var laterals = Math.round(mix(5, 9, t.spread - 0.5));
      for (var L = 0; L < laterals; L++) {
        var f0 = 0.08 + (L / laterals) * 0.75 + r() * 0.05;
        var base = pts[Math.min(n, Math.round(f0 * n))];
        var side = L % 2 === 0 ? -1 : 1;
        var len = tw * 0.42 * t.spread * (1 - f0 * 0.55) * clamp(grow * 1.15 - f0 * 0.4, 0, 1);
        if (len < 3) continue;
        var ang = side * (1.05 + r() * 0.35);
        var path = [];
        var x = base.x,
          y = base.y;
        for (var q = 0; q <= 10; q++) {
          path.push({ x: x, y: y });
          var dir = ang * (1 - q / 16); // gravitropism pulls the tip downward
          x += Math.sin(dir) * (len / 10);
          y += Math.cos(dir) * (len / 10) * 0.9 + 0.6;
        }
        stroke(path, 1.8, 0.6, 0.78);
        // fine rootlets
        for (var h = 2; h < path.length - 1; h += 3) {
          var rl = len * (0.18 + r() * 0.12);
          var a2 = ang + side * (r() * 0.6 - 0.9);
          ctx.strokeStyle = "rgba(240,226,200,0.45)";
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(path[h].x, path[h].y);
          ctx.quadraticCurveTo(
            path[h].x + Math.sin(a2) * rl * 0.6,
            path[h].y + Math.cos(a2) * rl * 0.6,
            path[h].x + Math.sin(a2) * rl,
            path[h].y + Math.cos(a2) * rl + rl * 0.3
          );
          ctx.stroke();
        }
      }
      stroke(pts, 3.2, 1, 0.9);
    }

    /* ---------- plant ---------- */
    function leafColor(t, age, depthShade, i, n) {
      // older (lower) leaves yellow first under stress
      var old = n > 1 ? 1 - i / (n - 1) : 0;
      var y = clamp(t.chlor * (0.35 + 0.9 * old), 0, 1);
      var hue = mix(112, 52, y);
      var sat = mix(52, 68, y) - 18 * t.pale;
      var lig = mix(34, 50, y) + 14 * t.pale;
      lig *= depthShade;
      return { h: hue, s: sat, l: lig, burn: clamp(t.burn * (0.3 + old), 0, 1) };
    }

    function drawLeaf(bx, by, L, wdt, az, elev, droop, curl, col, z) {
      // 3D direction of the leaf, projected to the screen
      var ce = Math.cos(elev),
        se = Math.sin(elev);
      var dx = Math.cos(az) * ce,
        dy = se,
        dz = Math.sin(az) * ce;
      var len2d = L * (0.35 + 0.65 * Math.sqrt(dx * dx + dy * dy));
      var tipX = bx + dx * L,
        tipY = by - dy * L + droop * L * 0.75;
      var midX = bx + dx * L * 0.55,
        midY = by - dy * L * 0.55 - L * 0.18 * (1 - droop) + droop * L * 0.1;
      // blade width: wide when facing the viewer, narrow edge-on; curled leaves narrow
      var face = 0.35 + 0.65 * Math.abs(dz) + 0.3 * Math.abs(se);
      var halfW = wdt * clamp(face, 0.3, 1) * (1 - 0.55 * curl) * 0.5;
      var nx = -(tipY - by),
        ny = tipX - bx;
      var nl = Math.sqrt(nx * nx + ny * ny) || 1;
      nx /= nl;
      ny /= nl;
      var c1x = midX + nx * halfW * 1.4,
        c1y = midY + ny * halfW * 1.4;
      var c2x = midX - nx * halfW * 1.4,
        c2y = midY - ny * halfW * 1.4;
      var grad = ctx.createLinearGradient(c1x, c1y, c2x, c2y);
      grad.addColorStop(0, "hsl(" + col.h + "," + col.s + "%," + Math.min(70, col.l + 10) + "%)");
      grad.addColorStop(0.5, "hsl(" + col.h + "," + col.s + "%," + col.l + "%)");
      grad.addColorStop(1, "hsl(" + col.h + "," + col.s + "%," + Math.max(10, col.l - 9) + "%)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(bx, by);
      ctx.quadraticCurveTo(c1x, c1y, tipX, tipY);
      ctx.quadraticCurveTo(c2x, c2y, bx, by);
      ctx.fill();
      // necrotic tip under salt and heat
      if (col.burn > 0.08) {
        ctx.save();
        ctx.clip();
        var bg = ctx.createRadialGradient(tipX, tipY, 0, tipX, tipY, L * 0.45 * col.burn + 2);
        bg.addColorStop(0, "rgba(96,58,28,0.95)");
        bg.addColorStop(1, "rgba(96,58,28,0)");
        ctx.fillStyle = bg;
        ctx.fillRect(tipX - L, tipY - L, L * 2, L * 2);
        ctx.restore();
      }
      // midrib
      ctx.strokeStyle = "hsla(" + col.h + "," + (col.s - 10) + "%," + Math.min(78, col.l + 22) + "%,0.6)";
      ctx.lineWidth = 0.9;
      ctx.beginPath();
      ctx.moveTo(bx, by);
      ctx.quadraticCurveTo(midX, midY, tipX, tipY);
      ctx.stroke();
      return len2d;
    }

    function plant(cx, groundY, t, key, seed) {
      var Hmax = H * 0.5;
      var h = Math.max(4, Hmax * t.height);
      var sway = reduce ? 0 : Math.sin(clock * 1.1 + seed) * (3 + 6 * (1 - t.wilt));
      var nod = t.wilt * 0.55; // the stem tip bends over when wilting
      var spin = reduce ? 0.6 : clock * 0.22; // slow turn gives the 3D view
      var Lbase = Math.min(W * 0.075, H * 0.15, W * 0.5 * 0.2) * (W < 600 ? 1.45 : 1) * t.ls;

      function stemAt(f) {
        var bend = Math.pow(f, 2.2);
        return {
          x: cx + sway * bend + Math.sin(nod * f * 1.6) * h * 0.18 * f,
          y: groundY - h * f + (1 - Math.cos(nod * f * 1.6)) * h * 0.25 * f,
        };
      }

      // leaves, sorted back to front by depth
      var leaves = [];
      for (var i = 0; i < t.leaves; i++) {
        var emerge = 2 + i * 3.6;
        var age = Math.max(0, day - emerge);
        var grow = clamp(age / 8, 0, 1);
        if (grow <= 0) continue;
        var f = 0.12 + 0.86 * ((i + 1) / (t.leaves + 1));
        var az = i * 2.39996 + spin; // golden angle
        var z = Math.sin(az);
        var sizeF = 1 - 0.35 * (i / Math.max(1, t.leaves));
        leaves.push({ i: i, f: f, az: az, z: z, L: Lbase * sizeF * (0.35 + 0.65 * grow), age: age });
      }
      leaves.sort(function (a, b) {
        return a.z - b.z;
      });

      function drawSet(front) {
        leaves.forEach(function (lf) {
          if (front !== lf.z >= 0) return;
          var p = stemAt(lf.f);
          var elev = (0.55 - 1.25 * t.wilt + 0.55 * t.curl) * (0.8 + 0.2 * lf.f);
          var droop = clamp(t.wilt * (0.6 + 0.6 * (1 - lf.f)), 0, 0.95);
          var shade = 0.78 + 0.22 * ((lf.z + 1) / 2);
          var col = leafColor(t, lf.age, shade, lf.i, t.leaves);
          drawLeaf(p.x, p.y, lf.L, lf.L * 0.62, lf.az, elev, droop, t.curl, col, lf.z);
        });
      }

      drawSet(false);
      // stem
      var stemCol = "hsl(" + mix(105, 60, t.chlor * 0.6) + "," + (42 - 10 * t.pale) + "%," + (30 + 8 * t.pale) + "%)";
      ctx.strokeStyle = stemCol;
      ctx.lineCap = "round";
      var segs = 18;
      for (var s = 0; s < segs; s++) {
        var a = stemAt(s / segs),
          b = stemAt((s + 1) / segs);
        ctx.lineWidth = mix(Math.max(2, h * 0.03), 1.2, s / segs);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
      drawSet(true);
      // apical bud
      var tip = stemAt(1);
      ctx.fillStyle = "hsl(" + mix(100, 70, t.chlor) + ",55%," + (42 + 10 * t.pale) + "%)";
      ctx.beginPath();
      ctx.ellipse(tip.x, tip.y, 3, 5, 0.3 * nod, 0, Math.PI * 2);
      ctx.fill();
    }

    function rain(cx, topY, tw, isRight, t) {
      if (reduce) return;
      if (!isRight || t.water > 0.5) {
        if (Math.random() < 0.08) drops.push({ x: cx + (Math.random() - 0.5) * tw * 0.8, y: topY - H * 0.62, v: 0, side: isRight });
      }
      ctx.fillStyle = "rgba(140,200,240,0.75)";
      drops = drops.filter(function (d) {
        if (d.side !== isRight) return true;
        d.v += 0.35;
        d.y += d.v;
        ctx.beginPath();
        ctx.ellipse(d.x, d.y, 1.4, 3.6, 0, 0, Math.PI * 2);
        ctx.fill();
        return d.y < topY;
      });
    }

    function label(x, text, sub) {
      ctx.font = "600 " + Math.round(clamp(W * 0.016, 12, 16)) + "px Poppins, system-ui, sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.92)";
      ctx.fillText(text, x, 30);
      ctx.font = "500 " + Math.round(clamp(W * 0.012, 10, 13)) + "px Poppins, system-ui, sans-serif";
      ctx.fillStyle = "rgba(226,179,74,0.95)";
      ctx.fillText(sub, x, 50);
    }

    function draw() {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var half = W / 2;
      var tl = traits("control", day),
        tr = traits(stress, day);
      background(0, half, tl, false);
      background(half, half, tr, true);
      // divider
      ctx.fillStyle = "rgba(226,179,74,0.35)";
      ctx.fillRect(half - 0.5, H * 0.06, 1, H * 0.88);

      var pl = pot(half * 0.5, tl, false, seeds.left);
      var pr = pot(half * 1.5, tr, true, seeds.right);
      rain(half * 0.5, pl.topY, pl.tw, false, tl);
      if (tr.water > 0.5) rain(half * 1.5, pr.topY, pr.tw, true, tr);
      plant(half * 0.5, pl.topY, tl, "control", seeds.left);
      plant(half * 1.5, pr.topY, tr, stress, seeds.right);

      label(18, "Well watered", "Control");
      label(half + 18, STRESS[stress].name, day < ONSET ? "Stress starts on day " + ONSET : "Under stress");
      readouts(tl, tr);
    }

    var lastOut = -1;
    function readouts(tl, tr) {
      var d = Math.floor(day);
      if (dayOut) dayOut.textContent = "Day " + d;
      if (slider && document.activeElement !== slider) slider.value = day;
      if (d === lastOut) return;
      lastOut = d;
      [
        [outs.left, tl],
        [outs.right, tr],
      ].forEach(function (pair) {
        var t = pair[1];
        var vals = { height: Math.round(48 * t.height) + " cm", leaves: t.leaves, green: greenness(t) + "%" };
        Array.prototype.forEach.call(pair[0], function (el) {
          el.textContent = vals[el.getAttribute("data-k")];
        });
      });
    }

    function frame(ts) {
      var dt = last ? Math.min(0.05, (ts - last) / 1000) : 0;
      last = ts;
      clock += dt;
      if (playing) {
        day += dt * 3.2; // about 19 seconds for 60 days
        if (day > DAYS + 4) day = 0;
      }
      if (visible) draw();
      requestAnimationFrame(frame);
    }

    /* ---------- controls ---------- */
    Array.prototype.forEach.call(root.querySelectorAll(".kr-growth-stress button"), function (b) {
      b.addEventListener("click", function () {
        stress = b.getAttribute("data-stress");
        Array.prototype.forEach.call(root.querySelectorAll(".kr-growth-stress button"), function (o) {
          o.setAttribute("aria-pressed", o === b ? "true" : "false");
        });
        if (rightName) rightName.textContent = STRESS[stress].name;
        lastOut = -1;
        if (!reduce) day = 0;
        draw();
      });
    });
    if (playBtn)
      playBtn.addEventListener("click", function () {
        playing = !playing;
        playBtn.setAttribute("aria-pressed", playing ? "false" : "true");
        playBtn.setAttribute("aria-label", playing ? "Pause" : "Play");
        root.classList.toggle("is-paused", !playing);
      });
    if (slider) {
      slider.max = DAYS;
      slider.addEventListener("input", function () {
        day = +slider.value;
        lastOut = -1;
        draw();
      });
    }
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (e) {
        visible = e[0].isIntersecting;
      }).observe(root);
    }
    var rt;
    window.addEventListener("resize", function () {
      clearTimeout(rt);
      rt = setTimeout(function () {
        size();
        draw();
      }, 150);
    });
    if (reduce) root.classList.add("is-paused");
    size();
    draw();
    requestAnimationFrame(frame);
  }

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }
  ready(function () {
    Array.prototype.forEach.call(document.querySelectorAll("[data-kr-growth]"), init);
  });
})();
