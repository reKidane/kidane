/* Focus plants in 3D: eight species on a cut soil profile, from Arabidopsis to
 * the vineyard. Procedural models built with three.js (MIT licence, bundled in
 * assets/js/three). Heights are in metres; Arabidopsis is shown 3x.
 * Loaded on demand by kr-plants3d.js. */
import * as THREE from "./three/three.module.min.js";
import { OrbitControls } from "./three/OrbitControls.js";
import { mergeGeometries } from "./three/BufferGeometryUtils.js";

/* ---------- small helpers ---------- */
function rng(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
var V = THREE.Vector3;
var UP = new V(0, 1, 0);

function colorize(geo, color) {
  var c = new THREE.Color(color);
  var n = geo.attributes.position.count;
  var arr = new Float32Array(n * 3);
  for (var i = 0; i < n; i++) {
    arr[i * 3] = c.r;
    arr[i * 3 + 1] = c.g;
    arr[i * 3 + 2] = c.b;
  }
  geo.setAttribute("color", new THREE.BufferAttribute(arr, 3));
  return geo;
}

// Tube whose radius tapers from r0 to r1 along a curve through the points
function taper(points, r0, r1, radial, color) {
  var curve = new THREE.CatmullRomCurve3(points);
  var tub = Math.max(4, points.length * 3);
  var geo = new THREE.TubeGeometry(curve, tub, 1, radial || 6, false);
  var pos = geo.attributes.position;
  for (var i = 0; i <= tub; i++) {
    var c = curve.getPointAt(i / tub);
    var r = r0 + (r1 - r0) * (i / tub);
    for (var j = 0; j <= (radial || 6); j++) {
      var k = i * ((radial || 6) + 1) + j;
      pos.setXYZ(k, c.x + (pos.getX(k) - c.x) * r, c.y + (pos.getY(k) - c.y) * r, c.z + (pos.getZ(k) - c.z) * r);
    }
  }
  geo.computeVertexNormals();
  return colorize(geo, color);
}

// Grass-type leaf: an arching, gently twisted ribbon with a raised midrib
function grassLeaf(o) {
  var segs = 22;
  var pos = [],
    col = [],
    uv = [],
    idx = [];
  var d = new V(Math.cos(o.phi), 0, Math.sin(o.phi));
  var S0 = new V(-Math.sin(o.phi), 0, Math.cos(o.phi));
  var p = new V(0, 0, 0);
  var cb = new THREE.Color(o.base),
    ct = new THREE.Color(o.tip),
    cbrown = new THREE.Color(o.dry || "#b49a5a");
  for (var i = 0; i <= segs; i++) {
    var s = i / segs;
    var th = o.theta0 + o.k * Math.pow(s, 1.5);
    var T = d.clone().multiplyScalar(Math.sin(th)).addScaledVector(UP, Math.cos(th)).normalize();
    if (i > 0) p.addScaledVector(T, o.L / segs);
    var a = o.twist * s;
    var TxS = new V().crossVectors(T, S0);
    var S = S0.clone().multiplyScalar(Math.cos(a)).addScaledVector(TxS, Math.sin(a)).normalize();
    var N = new V().crossVectors(S, T).normalize();
    if (N.y < 0) N.negate();
    var hw = 0.5 * o.w * Math.pow(Math.sin(Math.PI * Math.min(1, Math.pow(s, 0.55) * 1.02)), 0.75);
    if (s > 0.97) hw *= 0.3;
    var mid = p.clone().addScaledVector(N, hw * 0.22);
    var l = p.clone().addScaledVector(S, -hw);
    var r = p.clone().addScaledVector(S, hw);
    pos.push(l.x, l.y, l.z, mid.x, mid.y, mid.z, r.x, r.y, r.z);
    var c = cb.clone().lerp(ct, s);
    if (s > 0.9) c.lerp(cbrown, (s - 0.9) * 6 * (o.dryTip || 0.6));
    var edge = c.clone().multiplyScalar(0.86);
    var midc = c.clone().lerp(new THREE.Color("#e8efd0"), 0.25);
    col.push(edge.r, edge.g, edge.b, midc.r, midc.g, midc.b, edge.r, edge.g, edge.b);
    uv.push(s, 0, s, 0.5, s, 1);
    if (i < segs) {
      var b = i * 3;
      idx.push(b, b + 3, b + 1, b + 1, b + 3, b + 4, b + 1, b + 4, b + 2, b + 2, b + 4, b + 5);
    }
  }
  var g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

// A flat leaf from a 2D outline, laid along +x, then oriented
function flatLeaf(outline, color, scale) {
  var shape = new THREE.Shape(outline.map((q) => new THREE.Vector2(q[0] * scale, q[1] * scale)));
  var g = new THREE.ShapeGeometry(shape, 6);
  g.rotateX(-Math.PI / 2); // lie flat, blade along +x
  // gentle cupping
  var pos = g.attributes.position;
  for (var i = 0; i < pos.count; i++) {
    var z = pos.getZ(i),
      x = pos.getX(i);
    pos.setY(i, pos.getY(i) - Math.abs(z) * 0.18 + x * 0.05);
  }
  g.computeVertexNormals();
  return colorize(g, color);
}

function ovalOutline(len, wid, petiole) {
  var pts = [];
  var n = 26;
  for (var i = 0; i <= n; i++) {
    var t = (i / n) * Math.PI;
    var x = petiole + (len - petiole) * (1 - Math.cos(t)) * 0.5;
    var w = wid * Math.sin(t) * (0.6 + 0.4 * Math.sin(t * 0.9));
    pts.push([x, w]);
  }
  for (var j = n; j >= 0; j--) {
    var t2 = (j / n) * Math.PI;
    var x2 = petiole + (len - petiole) * (1 - Math.cos(t2)) * 0.5;
    var w2 = wid * Math.sin(t2) * (0.6 + 0.4 * Math.sin(t2 * 0.9));
    pts.push([x2, -w2]);
  }
  pts.unshift([0, 0.015 * wid]);
  pts.push([0, -0.015 * wid]);
  return pts;
}

function grapeOutline() {
  var pts = [];
  for (var i = 0; i <= 120; i++) {
    var t = -Math.PI / 2 + 0.22 + (i / 120) * (Math.PI * 2 - 0.44);
    var lobes = 0.78 + 0.22 * Math.cos(5 * (t - Math.PI / 2));
    var teeth = 1 + 0.035 * Math.sin(38 * t);
    var r = lobes * teeth;
    pts.push([0.55 + Math.sin(t + Math.PI / 2) * r * 0.5, Math.cos(t + Math.PI / 2) * r * 0.5]);
  }
  return pts;
}

/* ---------- roots ---------- */
// Roots spread down the cut face (just in front of z = 0) so they read as a soil profile
function rootSystem(o) {
  var r = rng(o.seed);
  var geos = [];
  var fine = [];
  for (var k = 0; k < o.count; k++) {
    var spreadA = (r() - 0.5) * 2 * o.spread;
    var dir = new V(Math.sin(spreadA), -Math.cos(spreadA), 0.15 + r() * 0.2).normalize();
    var p = new V(o.x + (r() - 0.5) * 0.02, -0.01, 0.01);
    var pts = [p.clone()];
    var len = o.depth * (0.55 + r() * 0.5);
    var steps = 12;
    for (var s = 0; s < steps; s++) {
      dir.x += (r() - 0.5) * 0.35;
      dir.y -= o.gravity * (s / steps);
      dir.normalize();
      p = p.clone().addScaledVector(dir, len / steps);
      p.z = Math.min(0.08, Math.max(0.006, p.z));
      pts.push(p);
      // laterals as fine lines
      if (s > 1 && r() < o.lateral) {
        var side = r() < 0.5 ? -1 : 1;
        var q = p.clone();
        var ld = new V(side * (0.6 + r() * 0.5), -0.4 - r() * 0.4, 0).normalize();
        var ll = len * (0.12 + r() * 0.16);
        for (var m = 0; m < 4; m++) {
          var q2 = q.clone().addScaledVector(ld, ll / 4);
          q2.z = q.z;
          ld.y -= 0.12;
          ld.x += (r() - 0.5) * 0.3;
          ld.normalize();
          fine.push(q.x, q.y, q.z, q2.x, q2.y, q2.z);
          q = q2;
        }
      }
    }
    geos.push(taper(pts, o.r0 * (0.7 + r() * 0.5), o.r1, 5, o.color));
  }
  if (o.tap) {
    var tp = [new V(o.x, 0, 0.012)];
    for (var t = 1; t <= 10; t++) tp.push(new V(o.x + Math.sin(t * 0.9 + o.seed) * 0.015, -o.tap * (t / 10), 0.012));
    geos.push(taper(tp, o.tapR, o.r1, 7, o.color));
  }
  var group = new THREE.Group();
  var mat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.7 });
  group.add(new THREE.Mesh(mergeGeometries(geos), mat));
  var lg = new THREE.BufferGeometry();
  lg.setAttribute("position", new THREE.Float32BufferAttribute(fine, 3));
  group.add(new THREE.LineSegments(lg, new THREE.LineBasicMaterial({ color: o.fineColor || o.color, transparent: true, opacity: 0.75 })));
  if (o.nodules) {
    var nd = new THREE.InstancedMesh(
      new THREE.SphereGeometry(0.009, 8, 6),
      new THREE.MeshStandardMaterial({ color: "#e48a8a", roughness: 0.45 }),
      o.nodules
    );
    var mm = new THREE.Matrix4();
    for (var n = 0; n < o.nodules; n++) {
      var a = fine.length ? Math.floor(r() * (fine.length / 3)) * 3 : 0;
      mm.makeTranslation(fine[a] || o.x, fine[a + 1] || -0.1, (fine[a + 2] || 0.01) + 0.004);
      nd.setMatrixAt(n, mm);
    }
    group.add(nd);
  }
  return group;
}

/* ---------- plants ---------- */
var leafMat = () => new THREE.MeshStandardMaterial({ vertexColors: true, side: THREE.DoubleSide, roughness: 0.62, metalness: 0 });

function instanced(geo, mat, list) {
  var m = new THREE.InstancedMesh(geo, mat, Math.max(1, list.length));
  var c = new THREE.Color();
  list.forEach(function (it, i) {
    m.setMatrixAt(i, it.m);
    if (it.c) m.setColorAt(i, c.set(it.c));
  });
  m.count = list.length;
  m.castShadow = true;
  return m;
}

function grassPlant(o) {
  var r = rng(o.seed);
  var g = new THREE.Group();
  var geos = [];
  var grains = [];
  var awns = [];
  for (var t = 0; t < o.tillers; t++) {
    var lean = o.tillers > 1 ? (t / (o.tillers - 1) - 0.5) * o.fan : 0;
    var az = r() * Math.PI * 2;
    var h = o.height * (o.tillers > 1 ? 0.85 + r() * 0.15 : 1);
    var pts = [];
    for (var i = 0; i <= 8; i++) {
      var f = i / 8;
      pts.push(new V(Math.sin(lean) * h * f * f * 0.6 + Math.cos(az) * 0.004 * t, h * f, Math.sin(lean * 0.6) * 0.04 * f));
    }
    var culm = new THREE.CatmullRomCurve3(pts);
    geos.push(taper(pts, o.culmR, o.culmR * 0.55, 7, o.culm));
    // leaves alternate up the stem
    for (var n = 0; n < o.leaves; n++) {
      var f2 = 0.04 + (n / o.leaves) * o.leafTop;
      var node = culm.getPointAt(f2);
      var L = o.leafLen * (1 - 0.45 * Math.pow(n / o.leaves, 1.6)) * (0.9 + r() * 0.2);
      var leaf = grassLeaf({
        L: L,
        w: o.leafW * (0.85 + r() * 0.3),
        phi: (n % 2 ? Math.PI : 0) + (r() - 0.5) * 0.9 + az * 0.15,
        theta0: o.theta0 + r() * 0.15,
        k: o.droop * (0.8 + r() * 0.5),
        twist: (r() - 0.5) * 1.6,
        base: o.leafBase,
        tip: o.leafTip,
        dryTip: o.dryTip,
      });
      leaf.translate(node.x, node.y, node.z);
      geos.push(leaf);
      // node ring
      var ring = new THREE.TorusGeometry(o.culmR * 1.25, o.culmR * 0.28, 5, 10);
      ring.rotateX(Math.PI / 2);
      ring.translate(node.x, node.y, node.z);
      geos.push(colorize(ring, o.culm));
    }
    var top = culm.getPointAt(1);
    if (o.head) o.head({ top: top, r: r, geos: geos, grains: grains, awns: awns, culm: culm });
  }
  var mesh = new THREE.Mesh(mergeGeometries(geos), leafMat());
  mesh.castShadow = true;
  g.add(mesh);
  if (grains.length) {
    var gg = o.grainGeo || new THREE.SphereGeometry(1, 7, 5);
    g.add(instanced(gg, new THREE.MeshStandardMaterial({ roughness: 0.55 }), grains));
  }
  if (awns.length) {
    var ag = new THREE.BufferGeometry();
    ag.setAttribute("position", new THREE.Float32BufferAttribute(awns, 3));
    g.add(new THREE.LineSegments(ag, new THREE.LineBasicMaterial({ color: o.awnColor || "#d9c58f", transparent: true, opacity: 0.8 })));
  }
  return g;
}

function grainAt(p, sx, sy, sz, rot, color) {
  var m = new THREE.Matrix4().compose(p, new THREE.Quaternion().setFromEuler(rot), new V(sx, sy, sz));
  return { m: m, c: color };
}

function sorghum(seed) {
  return grassPlant({
    seed: seed,
    height: 2.15,
    tillers: 1,
    fan: 0,
    culmR: 0.012,
    culm: "#6f8f3a",
    leaves: 11,
    leafTop: 0.78,
    leafLen: 0.78,
    leafW: 0.075,
    theta0: 0.45,
    droop: 1.9,
    leafBase: "#3f7a2f",
    leafTip: "#5c9a3c",
    dryTip: 0.5,
    head: function (h) {
      var c = h.top.clone().add(new V(0, 0.14, 0));
      h.geos.push(taper([h.top, c.clone().add(new V(0, -0.02, 0))], 0.006, 0.004, 6, "#7d8f45"));
      for (var i = 0; i < 1100; i++) {
        var u = h.r() * 2 - 1,
          a = h.r() * Math.PI * 2;
        var rad = Math.sqrt(1 - u * u) * (0.6 + 0.4 * h.r());
        var p = new V(Math.cos(a) * rad * 0.055 * (1 - u * 0.25), u * 0.14, Math.sin(a) * rad * 0.055 * (1 - u * 0.25)).add(c);
        var col = new THREE.Color().setHSL(0.03 + h.r() * 0.03, 0.55, 0.28 + h.r() * 0.12);
        h.grains.push(grainAt(p, 0.0058, 0.0068, 0.0058, new THREE.Euler(h.r(), h.r(), h.r()), col));
      }
    },
  });
}

function maize(seed) {
  return grassPlant({
    seed: seed,
    height: 2.35,
    tillers: 1,
    fan: 0,
    culmR: 0.016,
    culm: "#7a9a45",
    leaves: 13,
    leafTop: 0.8,
    leafLen: 0.92,
    leafW: 0.085,
    theta0: 0.55,
    droop: 2.1,
    leafBase: "#3b7a2c",
    leafTip: "#5f9f40",
    dryTip: 0.5,
    awnColor: "#c9a86a",
    head: function (h) {
      // tassel
      var base = h.top.clone();
      var tipT = base.clone().add(new V(0.01, 0.36, 0));
      h.geos.push(taper([base, base.clone().add(new V(0.004, 0.18, 0)), tipT], 0.004, 0.0015, 5, "#cdb873"));
      for (var b = 0; b < 12; b++) {
        var y0 = 0.05 + h.r() * 0.16;
        var a = h.r() * Math.PI * 2;
        var p0 = base.clone().add(new V(0, y0, 0));
        var pts = [p0];
        for (var s = 1; s <= 5; s++) {
          var f = s / 5;
          pts.push(p0.clone().add(new V(Math.cos(a) * 0.2 * f, 0.08 * f - 0.14 * f * f, Math.sin(a) * 0.2 * f)));
        }
        h.geos.push(taper(pts, 0.0018, 0.0008, 4, "#d6c27e"));
        for (var k = 1; k < pts.length; k++) {
          h.grains.push(grainAt(pts[k], 0.004, 0.012, 0.004, new THREE.Euler(0, a, 0.3), "#d9c486"));
        }
      }
      // ear with husk and silk
      var node = h.culm.getPointAt(0.52);
      var ear = new THREE.LatheGeometry(
        [0, 0.02, 0.06, 0.12, 0.17, 0.21, 0.24].map((y, i, arr) => new THREE.Vector2(0.03 * Math.sin(((i + 0.3) / arr.length) * Math.PI) + 0.004, y)),
        12
      );
      ear.rotateZ(-0.45);
      ear.translate(node.x + 0.02, node.y - 0.02, node.z + 0.01);
      h.geos.push(colorize(ear, "#93ad5f"));
      var tip = new V(node.x + 0.13, node.y + 0.2, node.z + 0.01);
      for (var sl = 0; sl < 26; sl++) {
        var aa = h.r() * Math.PI * 2;
        h.awns.push(tip.x, tip.y, tip.z, tip.x + Math.cos(aa) * 0.05 + 0.03, tip.y + 0.02 - h.r() * 0.08, tip.z + Math.sin(aa) * 0.05);
      }
    },
  });
}

function smallGrain(seed, kind) {
  var barley = kind === "barley";
  return grassPlant({
    seed: seed,
    height: barley ? 0.88 : 0.98,
    tillers: 7,
    fan: 0.42,
    culmR: 0.0032,
    culm: barley ? "#cbb978" : "#b8b25e",
    leaves: 4,
    leafTop: 0.62,
    leafLen: barley ? 0.24 : 0.26,
    leafW: barley ? 0.014 : 0.016,
    theta0: 0.6,
    droop: 1.6,
    leafBase: barley ? "#b9b277" : "#8fa24a",
    leafTip: barley ? "#d6c890" : "#c2b36a",
    dryTip: 1,
    awnColor: barley ? "#cdb575" : "#c9a86a",
    head: function (h) {
      var dir = barley ? new V(0.35, 0.7, 0.05).normalize() : new V(0.05, 1, 0).normalize();
      var len = barley ? 0.085 : 0.095;
      var nSp = barley ? 18 : 16;
      for (var i = 0; i < nSp; i++) {
        var f = i / nSp;
        var d = dir.clone();
        if (barley) d.add(new V(0.25 * f, -0.9 * f * f, 0)).normalize(); // nodding head
        var p = h.top.clone().addScaledVector(d, len * f + 0.01);
        var rows = barley ? 3 : 2;
        for (var rr = 0; rr < rows; rr++) {
          var side = (i % 2 ? 1 : -1) * (rr === 2 ? 0 : 1);
          var off = new V(side * 0.006, 0, rr === 2 ? 0.006 : 0);
          var gp = p.clone().add(off);
          h.grains.push(
            grainAt(
              gp,
              barley ? 0.0034 : 0.0042,
              barley ? 0.0085 : 0.0075,
              barley ? 0.0034 : 0.004,
              new THREE.Euler(0, 0, side * 0.35 - d.x * 0.6),
              barley ? "#dccb8e" : "#cfa95c"
            )
          );
          var al = barley ? 0.075 + h.r() * 0.025 : 0.025 + h.r() * 0.02;
          var ad = d
            .clone()
            .add(new V(side * 0.12, 0.05, 0))
            .normalize();
          h.awns.push(gp.x, gp.y, gp.z, gp.x + ad.x * al, gp.y + ad.y * al, gp.z + ad.z * al);
        }
      }
    },
  });
}

function bean(seed, kind) {
  // common bean (bush type) or mung bean: trifoliate leaves, flowers, hanging pods
  var mung = kind === "mung";
  var r = rng(seed);
  var g = new THREE.Group();
  var geos = [];
  var H = mung ? 0.62 : 0.5;
  var stemC = mung ? "#6f8a3c" : "#5f8a36";
  var main = [new V(0, 0, 0), new V(0.01, H * 0.35, 0), new V(-0.01, H * 0.7, 0.01), new V(0.005, H, 0)];
  geos.push(taper(main, 0.007, 0.003, 6, stemC));
  var leaflet = ovalOutline(mung ? 0.11 : 0.1, mung ? 0.045 : 0.05, 0.004);
  var pods = [];
  var flowers = [];
  var branches = mung ? 6 : 7;
  for (var b = 0; b < branches; b++) {
    var f = 0.18 + (b / branches) * 0.8;
    var az = b * 2.4 + r() * 0.4;
    var base = new THREE.CatmullRomCurve3(main).getPointAt(f);
    var plen = 0.12 + r() * 0.08;
    var tip = base.clone().add(new V(Math.cos(az) * plen, plen * 0.55, Math.sin(az) * plen * 0.7));
    geos.push(
      taper(
        [
          base,
          base
            .clone()
            .lerp(tip, 0.5)
            .add(new V(0, 0.02, 0)),
          tip,
        ],
        0.003,
        0.0018,
        5,
        stemC
      )
    );
    // trifoliate leaf: one terminal and two lateral leaflets
    for (var l = 0; l < 3; l++) {
      var lg = flatLeaf(leaflet, new THREE.Color().setHSL(0.27 + r() * 0.03, 0.55, 0.17 + r() * 0.07), 1 + (l === 0 ? 0.15 : 0));
      var ang = az + (l === 0 ? 0 : l === 1 ? 1.2 : -1.2);
      lg.rotateZ(-0.25 - r() * 0.3);
      lg.rotateY(-ang);
      lg.translate(tip.x, tip.y, tip.z);
      geos.push(lg);
    }
    // pods hang from the lower nodes, flowers from the upper ones
    if (b < branches - 2) {
      var np = mung ? 4 : 2 + Math.round(r());
      for (var p = 0; p < np; p++) {
        var pa = az + (p - np / 2) * 0.35;
        var pl = mung ? 0.08 : 0.11;
        var pr = base.clone().add(new V(Math.cos(pa) * 0.025, -0.01, Math.sin(pa) * 0.02));
        var pe = pr.clone().add(new V(Math.cos(pa) * pl * 0.35, mung ? pl * 0.35 : -pl * 0.95, Math.sin(pa) * pl * 0.25));
        var mid = pr
          .clone()
          .lerp(pe, 0.5)
          .add(new V(0.01, mung ? 0.01 : -0.005, 0));
        geos.push(taper([pr, mid, pe], mung ? 0.0035 : 0.0055, 0.0015, 6, mung ? "#3f4f2a" : "#86a84a"));
      }
    } else {
      for (var fl = 0; fl < 3; fl++) {
        flowers.push({
          m: new THREE.Matrix4().makeTranslation(tip.x + (r() - 0.5) * 0.03, tip.y + 0.01 + r() * 0.02, tip.z + (r() - 0.5) * 0.03),
          c: mung ? "#e8d23c" : "#f2eef7",
        });
      }
    }
  }
  var mesh = new THREE.Mesh(mergeGeometries(geos), leafMat());
  mesh.castShadow = true;
  g.add(mesh);
  if (flowers.length) g.add(instanced(new THREE.SphereGeometry(0.008, 8, 6), new THREE.MeshStandardMaterial({ roughness: 0.5 }), flowers));
  return g;
}

function grapevine(seed) {
  var r = rng(seed);
  var g = new THREE.Group();
  var wood = new THREE.MeshStandardMaterial({ color: "#5b3d27", roughness: 0.9 });
  var post = new THREE.MeshStandardMaterial({ color: "#6e4b30", roughness: 0.95 });
  [-1.05, 1.05].forEach(function (x) {
    var m = new THREE.Mesh(new THREE.BoxGeometry(0.07, 2.25, 0.07), post);
    m.position.set(x, 1.1, -0.05);
    m.castShadow = true;
    g.add(m);
  });
  var wireMat = new THREE.MeshStandardMaterial({ color: "#9aa0a3", metalness: 0.7, roughness: 0.35 });
  [0.98, 1.38, 1.78].forEach(function (y) {
    var w = new THREE.Mesh(new THREE.CylinderGeometry(0.0025, 0.0025, 2.1, 5), wireMat);
    w.rotation.z = Math.PI / 2;
    w.position.set(0, y, -0.05);
    g.add(w);
  });
  var wg = [];
  var trunk = [];
  for (var i = 0; i <= 8; i++) trunk.push(new V(Math.sin(i * 1.3) * 0.025, (i / 8) * 0.96, -0.05 + Math.cos(i * 0.9) * 0.01));
  wg.push(taper(trunk, 0.045, 0.03, 9, "#5b3d27"));
  [-1, 1].forEach(function (s) {
    var arm = [trunk[8].clone()];
    for (var k = 1; k <= 6; k++) arm.push(new V(s * 0.15 * k, 0.97 + Math.sin(k) * 0.008, -0.05));
    wg.push(taper(arm, 0.03, 0.016, 7, "#5b3d27"));
  });
  var wm = new THREE.Mesh(mergeGeometries(wg), new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.92 }));
  wm.castShadow = true;
  g.add(wm);

  var shootGeos = [];
  var leaves = [];
  var berries = [];
  var leafGeo = flatLeaf(grapeOutline(), "#ffffff", 1);
  leafGeo.translate(-0.55, 0, 0);
  leafGeo.rotateX(Math.PI / 2); // face +z, stand upright
  for (var sh = 0; sh < 9; sh++) {
    var x = -0.86 + sh * 0.215 + (r() - 0.5) * 0.03;
    var pts = [new V(x, 0.98, -0.05), new V(x + (r() - 0.5) * 0.05, 1.4, -0.05), new V(x + (r() - 0.5) * 0.08, 1.88, -0.05)];
    shootGeos.push(taper(pts, 0.006, 0.003, 5, "#6d7a3a"));
    var curve = new THREE.CatmullRomCurve3(pts);
    for (var n = 0; n < 12; n++) {
      var p = curve.getPointAt(0.08 + n * 0.077);
      var side = n % 2 ? 1 : -1;
      var sc = 0.11 + r() * 0.06;
      var q = new THREE.Quaternion().setFromEuler(
        new THREE.Euler((r() - 0.5) * 0.7, side > 0 ? (r() - 0.5) * 0.8 : Math.PI + (r() - 0.5) * 0.8, (r() - 0.5) * 0.9)
      );
      var pos = p.clone().add(new V((r() - 0.5) * 0.08, 0, side * (0.05 + r() * 0.04)));
      var c = new THREE.Color().setHSL(0.27 + r() * 0.04, 0.48, 0.24 + r() * 0.12);
      leaves.push({ m: new THREE.Matrix4().compose(pos, q, new V(sc, sc, sc)), c: c });
    }
    // a bunch below every shoot
    var bx = x + 0.02,
      by = 0.94;
    for (var bb = 0; bb < 75; bb++) {
      var t = r();
      var rad = 0.055 * Math.pow(1 - t, 0.75) * Math.sqrt(r());
      var a = r() * Math.PI * 2;
      var bp = new V(bx + Math.cos(a) * rad, by - t * 0.19, 0.02 + Math.sin(a) * rad);
      var bc = new THREE.Color().setHSL(0.83 + r() * 0.04, 0.45, 0.13 + r() * 0.07);
      berries.push({ m: new THREE.Matrix4().compose(bp, new THREE.Quaternion(), new V(1, 1.08, 1)), c: bc });
    }
  }
  var sm = new THREE.Mesh(mergeGeometries(shootGeos), new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.7 }));
  g.add(sm);
  g.add(instanced(leafGeo, new THREE.MeshStandardMaterial({ side: THREE.DoubleSide, roughness: 0.58, vertexColors: true }), leaves));
  g.add(
    instanced(
      new THREE.SphereGeometry(0.0095, 10, 8),
      new THREE.MeshPhysicalMaterial({ roughness: 0.3, clearcoat: 0.6, clearcoatRoughness: 0.4 }),
      berries
    )
  );
  return g;
}

function arabidopsis(seed) {
  // shown 3x life size, as in the source figure
  var r = rng(seed);
  var g = new THREE.Group();
  var geos = [];
  var rosette = ovalOutline(0.11, 0.032, 0.035);
  for (var i = 0; i < 16; i++) {
    var lg = flatLeaf(rosette, new THREE.Color().setHSL(0.28, 0.45, 0.24 + r() * 0.08), 0.8 + r() * 0.35);
    lg.rotateZ(0.18 + r() * 0.15);
    lg.rotateY(-(i * 2.39996));
    lg.translate(0, 0.006, 0);
    geos.push(lg);
  }
  var stemC = "#7f9a4b";
  var main = [new V(0, 0, 0), new V(0.01, 0.3, 0), new V(-0.01, 0.6, 0.01), new V(0.005, 0.9, 0)];
  geos.push(taper(main, 0.005, 0.002, 6, stemC));
  var stems = [main];
  for (var b = 0; b < 3; b++) {
    var f = 0.25 + b * 0.12;
    var base = new THREE.CatmullRomCurve3(main).getPointAt(f);
    var az = b * 2.2;
    var tip = base.clone().add(new V(Math.cos(az) * 0.2, 0.42 - b * 0.06, Math.sin(az) * 0.12));
    var br = [
      base,
      base
        .clone()
        .lerp(tip, 0.5)
        .add(new V(0, 0.03, 0)),
      tip,
    ];
    geos.push(taper(br, 0.003, 0.0015, 5, stemC));
    stems.push(br);
    var cl = flatLeaf(ovalOutline(0.06, 0.016, 0.004), "#456f35", 1);
    cl.rotateZ(0.5);
    cl.rotateY(-az);
    cl.translate(base.x, base.y, base.z);
    geos.push(cl);
  }
  var flowers = [];
  stems.forEach(function (st) {
    var c = new THREE.CatmullRomCurve3(st);
    for (var s = 0; s < 9; s++) {
      var f = 0.45 + s * 0.055;
      var p = c.getPointAt(Math.min(0.98, f));
      var a = s * 2.4;
      var pe = p.clone().add(new V(Math.cos(a) * 0.025, 0.045, Math.sin(a) * 0.025));
      geos.push(taper([p, pe], 0.0022, 0.0016, 4, "#a3b55c")); // siliques
    }
    var top = c.getPointAt(1);
    for (var k = 0; k < 6; k++)
      flowers.push({
        m: new THREE.Matrix4().makeTranslation(top.x + (r() - 0.5) * 0.025, top.y + r() * 0.02, top.z + (r() - 0.5) * 0.025),
        c: "#ffffff",
      });
  });
  var mesh = new THREE.Mesh(mergeGeometries(geos), leafMat());
  mesh.castShadow = true;
  g.add(mesh);
  g.add(instanced(new THREE.SphereGeometry(0.007, 8, 6), new THREE.MeshStandardMaterial({ roughness: 0.4 }), flowers));
  return g;
}

function citrus(seed) {
  // pruned orchard tree: short trunk, scaffold branches, rounded evergreen canopy with fruit
  var r = rng(seed);
  var g = new THREE.Group();
  var wg = [];
  var trunk = [new V(0, 0, -0.05), new V(0.02, 0.35, -0.12), new V(-0.01, 0.7, -0.22)];
  wg.push(taper(trunk, 0.06, 0.045, 9, "#6b5844"));
  var cc = new V(0, 1.5, -0.38);
  for (var b = 0; b < 5; b++) {
    var a = b * 1.26 + r() * 0.3;
    var end = cc.clone().add(new V(Math.cos(a) * 0.5, 0.15 + r() * 0.35, Math.sin(a) * 0.38));
    wg.push(
      taper(
        [
          trunk[2].clone(),
          trunk[2]
            .clone()
            .lerp(end, 0.5)
            .add(new V(0, 0.08, 0)),
          end,
        ],
        0.035,
        0.012,
        7,
        "#6b5844"
      )
    );
  }
  var wm = new THREE.Mesh(mergeGeometries(wg), new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9 }));
  wm.castShadow = true;
  g.add(wm);
  var leafGeo = flatLeaf(ovalOutline(1, 0.42, 0.06), "#ffffff", 1);
  leafGeo.translate(-0.5, 0, 0);
  var leaves = [];
  var rad = new V(0.82, 0.8, 0.62);
  for (var i = 0; i < 1300; i++) {
    var u = r() * 2 - 1,
      th = r() * Math.PI * 2;
    var k = Math.sqrt(1 - u * u);
    var n = new V(k * Math.cos(th), u, k * Math.sin(th));
    var depth = 0.78 + r() * 0.26;
    var p = new V(n.x * rad.x * depth, n.y * rad.y * depth * (n.y < 0 ? 0.75 : 1), n.z * rad.z * depth).add(cc);
    var q = new THREE.Quaternion().setFromUnitVectors(
      new V(0, 1, 0),
      n
        .clone()
        .add(new V((r() - 0.5) * 0.8, 0.4, (r() - 0.5) * 0.8))
        .normalize()
    );
    q.multiply(new THREE.Quaternion().setFromAxisAngle(UP, r() * Math.PI * 2));
    var sc = 0.075 + r() * 0.04;
    leaves.push({ m: new THREE.Matrix4().compose(p, q, new V(sc, sc, sc)), c: new THREE.Color().setHSL(0.31 + r() * 0.03, 0.5, 0.16 + r() * 0.12) });
  }
  g.add(instanced(leafGeo, new THREE.MeshStandardMaterial({ side: THREE.DoubleSide, roughness: 0.38, vertexColors: true }), leaves));
  var fruit = [];
  for (var f = 0; f < 48; f++) {
    var u2 = r() * 1.6 - 0.9,
      t2 = r() * Math.PI * 2;
    var k2 = Math.sqrt(1 - u2 * u2);
    var fp = new V(k2 * Math.cos(t2) * rad.x * 0.97, u2 * rad.y * 0.92, k2 * Math.sin(t2) * rad.z * 0.97).add(cc);
    var ripe = r() < 0.8;
    fruit.push({
      m: new THREE.Matrix4().compose(fp, new THREE.Quaternion(), new V(1, 0.95, 1)),
      c: ripe ? new THREE.Color().setHSL(0.075 + r() * 0.02, 0.9, 0.5) : new THREE.Color("#8fae3a"),
    });
  }
  g.add(instanced(new THREE.SphereGeometry(0.038, 14, 10), new THREE.MeshPhysicalMaterial({ roughness: 0.45, clearcoat: 0.3 }), fruit));
  return g;
}

/* ---------- soil and scale ---------- */
function soilTexture(w, h, top) {
  var c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  var x = c.getContext("2d");
  var r = rng(top ? 77 : 41);
  if (top) {
    x.fillStyle = "#3b2a1d";
    x.fillRect(0, 0, w, h);
    for (var i = 0; i < 26000; i++) {
      var l = 12 + r() * 26;
      x.fillStyle = "hsl(" + (24 + r() * 12) + ",30%," + l + "%)";
      x.fillRect(r() * w, r() * h, 1 + r() * 2.5, 1 + r() * 2.5);
    }
  } else {
    // horizons A (0 to 0.35 m), B (to 0.9 m) and C (to 1.6 m)
    var hz = [
      [0, 0.22, "#3a281b", "#4a3322"],
      [0.22, 0.56, "#6b4429", "#7d5132"],
      [0.56, 1, "#8f7a5c", "#a08c6c"],
    ];
    hz.forEach(function (b) {
      var gr = x.createLinearGradient(0, b[0] * h, 0, b[1] * h);
      gr.addColorStop(0, b[2]);
      gr.addColorStop(1, b[3]);
      x.fillStyle = gr;
      x.beginPath();
      x.moveTo(0, b[0] * h);
      for (var xx = 0; xx <= w; xx += 40) x.lineTo(xx, b[0] * h + (b[0] > 0 ? Math.sin(xx * 0.01) * 6 + (r() - 0.5) * 5 : 0));
      x.lineTo(w, h);
      x.lineTo(0, h);
      x.closePath();
      x.fill();
    });
    for (var j = 0; j < 60000; j++) {
      var yy = r() * h;
      var deep = yy / h;
      x.fillStyle = "hsla(" + (22 + r() * 16) + "," + (20 + 20 * (1 - deep)) + "%," + (10 + r() * 30 + deep * 22) + "%,0.8)";
      x.fillRect(r() * w, yy, 1 + r() * 2, 1 + r() * 2);
    }
    for (var k = 0; k < 900; k++) {
      var py = h * (0.55 + r() * 0.45);
      x.fillStyle = "hsl(30," + (8 + r() * 10) + "%," + (45 + r() * 25) + "%)";
      x.beginPath();
      x.ellipse(r() * w, py, 2 + r() * 5, 1.5 + r() * 3.5, r() * 3, 0, Math.PI * 2);
      x.fill();
    }
  }
  var t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

function scaleRod(x) {
  var g = new THREE.Group();
  var red = new THREE.MeshStandardMaterial({ color: "#c8322c", roughness: 0.5 });
  var white = new THREE.MeshStandardMaterial({ color: "#f3f1ea", roughness: 0.5 });
  for (var i = 0; i < 16; i++) {
    var y0 = -1.5 + i * 0.25;
    var m = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.25, 10), i % 2 ? white : red);
    m.position.set(x, y0 + 0.125, 0.06);
    m.castShadow = true;
    g.add(m);
  }
  return g;
}

/* ---------- scene ---------- */
var PLANTS = [
  {
    key: "sorghum",
    name: "Sorghum",
    latin: "Sorghum bicolor",
    x: -5.35,
    h: 2.38,
    make: sorghum,
    roots: { count: 26, depth: 1.35, spread: 0.75, r0: 0.0035, r1: 0.0008, lateral: 0.45, gravity: 0.05 },
  },
  {
    key: "maize",
    name: "Maize",
    latin: "Zea mays",
    x: -3.9,
    h: 2.7,
    make: maize,
    roots: { count: 30, depth: 1.45, spread: 0.85, r0: 0.004, r1: 0.0008, lateral: 0.45, gravity: 0.04 },
  },
  {
    key: "barley",
    name: "Barley",
    latin: "Hordeum vulgare",
    x: -2.6,
    h: 1.05,
    make: (s) => smallGrain(s, "barley"),
    roots: { count: 18, depth: 1.05, spread: 0.6, r0: 0.0022, r1: 0.0006, lateral: 0.4, gravity: 0.06 },
  },
  {
    key: "wheat",
    name: "Bread wheat",
    latin: "Triticum aestivum",
    x: -1.6,
    h: 1.1,
    lift: 0.55,
    make: (s) => smallGrain(s, "wheat"),
    roots: { count: 18, depth: 1.15, spread: 0.55, r0: 0.0022, r1: 0.0006, lateral: 0.4, gravity: 0.06 },
  },
  {
    key: "bean",
    name: "Common bean",
    latin: "Phaseolus vulgaris",
    x: -0.65,
    h: 0.6,
    make: (s) => bean(s, "common"),
    roots: { count: 9, depth: 0.55, spread: 1.0, r0: 0.0022, r1: 0.0006, lateral: 0.7, gravity: 0.06, tap: 0.6, tapR: 0.006, nodules: 26 },
  },
  {
    key: "mung",
    name: "Mung bean",
    latin: "Vigna radiata",
    x: 0.25,
    h: 0.72,
    lift: 0.5,
    make: (s) => bean(s, "mung"),
    roots: { count: 9, depth: 0.55, spread: 0.95, r0: 0.0022, r1: 0.0006, lateral: 0.7, gravity: 0.06, tap: 0.7, tapR: 0.006, nodules: 22 },
  },
  {
    key: "citrus",
    name: "Citrus",
    latin: "Citrus spp.",
    x: 1.85,
    h: 2.38,
    make: citrus,
    roots: {
      count: 12,
      depth: 1.25,
      spread: 1.15,
      r0: 0.01,
      r1: 0.002,
      lateral: 0.5,
      gravity: 0.03,
      color: "#8a6a4c",
      fineColor: "#ad9272",
      tap: 0.9,
      tapR: 0.018,
    },
  },
  {
    key: "grapevine",
    name: "Grapevine",
    latin: "Vitis vinifera",
    x: 4.05,
    h: 2.25,
    make: grapevine,
    roots: {
      count: 12,
      depth: 1.45,
      spread: 1.0,
      r0: 0.012,
      r1: 0.002,
      lateral: 0.5,
      gravity: 0.035,
      color: "#7a5b3e",
      fineColor: "#a88b68",
      tap: 1.2,
      tapR: 0.02,
    },
  },
  {
    key: "arabidopsis",
    name: "Arabidopsis (×3)",
    latin: "Arabidopsis thaliana",
    x: 5.95,
    h: 0.95,
    make: arabidopsis,
    roots: { count: 6, depth: 0.3, spread: 1.1, r0: 0.0014, r1: 0.0005, lateral: 0.8, gravity: 0.08, tap: 0.42, tapR: 0.0035 },
  },
];

export function mount(root) {
  var stage = root.querySelector(".kr-p3-stage");
  var labelsBox = root.querySelector(".kr-p3-labels");
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.domElement.className = "kr-p3-canvas";
  stage.appendChild(renderer.domElement);

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(30, 2, 0.05, 100);

  scene.add(new THREE.HemisphereLight("#eef6ff", "#5a4630", 1.15));
  var sun = new THREE.DirectionalLight("#fff3df", 2.4);
  sun.position.set(-5, 9, 7);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  var sc = sun.shadow.camera;
  sc.left = -8;
  sc.right = 8;
  sc.top = 4;
  sc.bottom = -3;
  sc.near = 1;
  sc.far = 30;
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.02;
  scene.add(sun);
  var fill = new THREE.DirectionalLight("#cfe3ff", 0.6);
  fill.position.set(6, 3, 5);
  scene.add(fill);

  // soil slab: x from -5.9 to 6.1, depth 1.6 m, 1.1 m deep into the page
  var front = soilTexture(2048, 300, false);
  var topT = soilTexture(1024, 120, true);
  var sideMat = new THREE.MeshStandardMaterial({ map: front, roughness: 1 });
  var soil = new THREE.Mesh(new THREE.BoxGeometry(13.6, 1.6, 1.1), [
    sideMat,
    sideMat,
    new THREE.MeshStandardMaterial({ map: topT, roughness: 1 }),
    new THREE.MeshStandardMaterial({ color: "#2e2016" }),
    sideMat,
    sideMat,
  ]);
  soil.position.set(-0.15, -0.8, -0.55);
  soil.receiveShadow = true;
  scene.add(soil);
  scene.add(scaleRod(-6.45));

  var swayers = [];
  PLANTS.forEach(function (p, i) {
    var plant = p.make(31 + i * 17);
    plant.position.set(p.x, 0, -0.03);
    plant.traverse(function (o) {
      if (o.isMesh) o.castShadow = true;
    });
    scene.add(plant);
    swayers.push({ obj: plant, phase: i * 1.7, amp: p.key === "grapevine" ? 0.003 : 0.012 });
    var ro = Object.assign({ seed: 101 + i * 13, x: p.x, color: "#e9dcc0", fineColor: "#efe4cc" }, p.roots);
    scene.add(rootSystem(ro));
  });

  // labels
  var labels = PLANTS.map(function (p) {
    var el = document.createElement("div");
    el.className = "kr-p3-label";
    el.innerHTML = "<strong>" + p.name + "</strong><em>" + p.latin + "</em>";
    labelsBox.appendChild(el);
    return { el: el, key: p.key, pos: new V(p.x, p.h + 0.22 + (p.lift || 0), 0), near: new V(p.x, p.h + 0.12, 0) };
  });
  [
    ["+2 m", 2],
    ["+1 m", 1],
    ["0 m", 0],
    ["-1 m", -1],
  ].forEach(function (t) {
    var el = document.createElement("div");
    el.className = "kr-p3-tick";
    el.textContent = t[0];
    labelsBox.appendChild(el);
    labels.push({ el: el, pos: new V(-6.4, t[1], 0.08), tick: true });
  });

  // camera and controls
  var controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.minPolarAngle = 0.6;
  controls.maxPolarAngle = 1.66;
  controls.minAzimuthAngle = -0.85;
  controls.maxAzimuthAngle = 0.85;
  controls.rotateSpeed = 0.55;
  renderer.domElement.style.touchAction = "pan-y";

  var home = { target: new V(-0.2, 0.68, -0.3), dist: 15.5 };
  var view = { target: home.target.clone(), dist: home.dist };
  function placeCamera(target, dist) {
    var az = controls.getAzimuthalAngle ? controls.getAzimuthalAngle() : 0;
    var pol = controls.getPolarAngle ? controls.getPolarAngle() : 1.35;
    controls.target.copy(target);
    camera.position.set(
      target.x + dist * Math.sin(pol) * Math.sin(az),
      target.y + dist * Math.cos(pol),
      target.z + dist * Math.sin(pol) * Math.cos(az)
    );
  }

  function resize() {
    var w = stage.clientWidth;
    var h = Math.round(w < 600 ? Math.max(260, w * 0.72) : Math.max(380, Math.min(660, w * 0.52)));
    stage.style.height = h + "px";
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // fit the slab (14 m wide, -1.6 to +2.8 m tall) to the canvas
    var vf = THREE.MathUtils.degToRad(camera.fov) / 2;
    var hf = Math.atan(Math.tan(vf) * camera.aspect);
    home.dist = Math.max(7.3 / Math.tan(hf), 2.25 / Math.tan(vf)) * 1.02;
    camera.updateProjectionMatrix();
  }
  resize();
  camera.position.set(home.target.x, home.target.y + home.dist * Math.cos(1.36), home.target.z + home.dist * Math.sin(1.36));
  controls.target.copy(home.target);
  controls.update();

  // fly to a plant
  var fly = null;
  var current = "all";
  function focus(key) {
    current = key;
    var t, d;
    if (key === "all") {
      t = home.target.clone();
      d = home.dist;
    } else {
      var p = PLANTS.find((q) => q.key === key);
      t = new V(p.x, Math.max(0.12, p.h * 0.4), 0);
      d = Math.max(2.4, p.h * 3.1) / Math.min(1, camera.aspect / 1.6);
    }
    fly = { t0: performance.now(), from: controls.target.clone(), to: t, d0: camera.position.distanceTo(controls.target), d1: d };
    if (reduce) {
      placeCamera(t, d);
      fly = null;
    }
  }
  Array.prototype.forEach.call(root.querySelectorAll(".kr-p3-chips button"), function (b) {
    b.addEventListener("click", function () {
      Array.prototype.forEach.call(root.querySelectorAll(".kr-p3-chips button"), (o) => o.setAttribute("aria-pressed", o === b ? "true" : "false"));
      focus(b.getAttribute("data-plant"));
      idleAt = performance.now();
    });
  });

  var idleAt = performance.now();
  var dir = 1;
  controls.addEventListener("start", function () {
    idleAt = Infinity;
  });
  controls.addEventListener("end", function () {
    idleAt = performance.now();
  });

  var visible = true;
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (e) {
      visible = e[0].isIntersecting;
    }).observe(root);
  }
  var rt;
  window.addEventListener("resize", function () {
    clearTimeout(rt);
    rt = setTimeout(resize, 150);
  });

  var tmp = new V();
  var clock = new THREE.Clock();
  function tick() {
    requestAnimationFrame(tick);
    if (!visible || document.hidden) return;
    var t = clock.getElapsedTime();
    if (fly) {
      var k = Math.min(1, (performance.now() - fly.t0) / 1300);
      var e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      placeCamera(fly.from.clone().lerp(fly.to, e), fly.d0 + (fly.d1 - fly.d0) * e);
      if (k >= 1) fly = null;
    }
    // gentle idle drift from side to side
    if (!reduce && !fly && performance.now() - idleAt > 4000) {
      var az = controls.getAzimuthalAngle();
      if (az > 0.45) dir = -1;
      if (az < -0.45) dir = 1;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.35 * dir;
    } else controls.autoRotate = false;
    if (!reduce)
      swayers.forEach(function (s) {
        s.obj.rotation.z = Math.sin(t * 0.9 + s.phase) * s.amp;
        s.obj.rotation.x = Math.sin(t * 0.7 + s.phase * 1.3) * s.amp * 0.5;
      });
    controls.update();
    renderer.render(scene, camera);
    var w = stage.clientWidth,
      h = stage.clientHeight;
    labels.forEach(function (l) {
      tmp.copy(current === l.key && l.near ? l.near : l.pos).project(camera);
      var narrow = w < 600;
      var hide = narrow && (l.tick || current === "all" || l.key !== current);
      var off = hide || tmp.z > 1 || tmp.x < -1.1 || tmp.x > 1.1 || tmp.y < -1.1 || tmp.y > 1.1;
      l.el.style.opacity = off ? 0 : 1;
      l.el.style.transform =
        "translate(" + ((tmp.x + 1) / 2) * w + "px," + ((1 - tmp.y) / 2) * h + "px) " + (l.tick ? "translate(4px,-50%)" : "translate(-50%,-100%)");
    });
  }
  tick();
  root.classList.add("is-ready");
}
