const clone = obj => {
  if (typeof obj === "function" || Object(obj) !== obj) {
    return obj;
  }

  const res = new obj.constructor();
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      res[key] = clone(obj[key]);
    }
  }
  return res;
};

function repush(array, item) {
  for (var i = 0, c = array.length; i < c; i++) {
    if (array[i] === item) {
      return array.push(array.splice(i, 1)[0]);
    }
  }
}

function cacher(f, scope, postprocessor) {
  function newf() {
    var arg = Array.prototype.slice.call(arguments, 0),
      args = arg.join("\u2400"),
      cache = (newf.cache = newf.cache || {}),
      count = (newf.count = newf.count || []);
    if (cache.hasOwnProperty(args)) {
      repush(count, args);
      return postprocessor ? postprocessor(cache[args]) : cache[args];
    }
    count.length >= 1e3 && delete cache[count.shift()];
    count.push(args);
    cache[args] = f.apply(scope, arg);
    return postprocessor ? postprocessor(cache[args]) : cache[args];
  }

  return newf;
}

function paths(ps) {
  var p = (paths.ps = paths.ps || {});
  if (p[ps]) {
    p[ps].sleep = 100;
  } else {
    p[ps] = {
      sleep: 100,
    };
  }
  setTimeout(function () {
    for (var key in p)
      if (p.hasOwnProperty(key) && key != ps) {
        p[key].sleep--;
        !p[key].sleep && delete p[key];
      }
  });
  return p[ps];
}

function box(x, y, width, height) {
  if (x == null) {
    x = y = width = height = 0;
  }
  if (y == null) {
    y = x.y;
    width = x.width;
    height = x.height;
    x = x.x;
  }
  return {
    x: x,
    y: y,
    width: width,
    w: width,
    height: height,
    h: height,
    x2: x + width,
    y2: y + height,
    cx: x + width / 2,
    cy: y + height / 2,
    r1: Math.min(width, height) / 2,
    r2: Math.max(width, height) / 2,
    r0: Math.sqrt(width * width + height * height) / 2,
    path: rectPath(x, y, width, height),
    vb: [x, y, width, height].join(" "),
  };
}

function pathClone(pathArray) {
  var res = clone(pathArray);
  //res.toString = toString;
  return res;
}

function findDotsAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t) {
  var t1 = 1 - t,
    t13 = Math.pow(t1, 3),
    t12 = Math.pow(t1, 2),
    t2 = t * t,
    t3 = t2 * t,
    x = t13 * p1x + t12 * 3 * t * c1x + t1 * 3 * t * t * c2x + t3 * p2x,
    y = t13 * p1y + t12 * 3 * t * c1y + t1 * 3 * t * t * c2y + t3 * p2y,
    mx = p1x + 2 * t * (c1x - p1x) + t2 * (c2x - 2 * c1x + p1x),
    my = p1y + 2 * t * (c1y - p1y) + t2 * (c2y - 2 * c1y + p1y),
    nx = c1x + 2 * t * (c2x - c1x) + t2 * (p2x - 2 * c2x + c1x),
    ny = c1y + 2 * t * (c2y - c1y) + t2 * (p2y - 2 * c2y + c1y),
    ax = t1 * p1x + t * c1x,
    ay = t1 * p1y + t * c1y,
    cx = t1 * c2x + t * p2x,
    cy = t1 * c2y + t * p2y,
    alpha = 90 - (Math.atan2(mx - nx, my - ny) * 180) / Math.PI;
  // (mx > nx || my < ny) && (alpha += 180);
  return {
    x: x,
    y: y,
    m: { x: mx, y: my },
    n: { x: nx, y: ny },
    start: { x: ax, y: ay },
    end: { x: cx, y: cy },
    alpha: alpha,
  };
}

function is(o, type) {
  type = String.prototype.toLowerCase.call(type);
  if (type == "finite") {
    return isFinite(o);
  }
  if (type == "array" && (o instanceof Array || (Array.isArray && Array.isArray(o)))) {
    return true;
  }
  return (
    (type == "null" && o === null) ||
    (type == typeof o && o !== null) ||
    (type == "object" && o === Object(o)) ||
    Object.prototype.toString.call(o).slice(8, -1).toLowerCase() == type
  );
}

function bezierBBox(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y) {
  if (!is(p1x, "array")) {
    p1x = [p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y];
  }
  var bbox = curveDim.apply(null, p1x);
  return box(bbox.min.x, bbox.min.y, bbox.max.x - bbox.min.x, bbox.max.y - bbox.min.y);
}

function isPointInsideBBox(bbox, x, y) {
  return x >= bbox.x && x <= bbox.x + bbox.width && y >= bbox.y && y <= bbox.y + bbox.height;
}

function isBBoxIntersect(bbox1, bbox2) {
  bbox1 = box(bbox1);
  bbox2 = box(bbox2);
  return (
    isPointInsideBBox(bbox2, bbox1.x, bbox1.y) ||
    isPointInsideBBox(bbox2, bbox1.x2, bbox1.y) ||
    isPointInsideBBox(bbox2, bbox1.x, bbox1.y2) ||
    isPointInsideBBox(bbox2, bbox1.x2, bbox1.y2) ||
    isPointInsideBBox(bbox1, bbox2.x, bbox2.y) ||
    isPointInsideBBox(bbox1, bbox2.x2, bbox2.y) ||
    isPointInsideBBox(bbox1, bbox2.x, bbox2.y2) ||
    isPointInsideBBox(bbox1, bbox2.x2, bbox2.y2) ||
    (((bbox1.x < bbox2.x2 && bbox1.x > bbox2.x) || (bbox2.x < bbox1.x2 && bbox2.x > bbox1.x)) &&
      ((bbox1.y < bbox2.y2 && bbox1.y > bbox2.y) || (bbox2.y < bbox1.y2 && bbox2.y > bbox1.y)))
  );
}

function base3(t, p1, p2, p3, p4) {
  var t1 = -3 * p1 + 9 * p2 - 9 * p3 + 3 * p4,
    t2 = t * t1 + 6 * p1 - 12 * p2 + 6 * p3;
  return t * t2 - 3 * p1 + 3 * p2;
}

function bezlen(x1, y1, x2, y2, x3, y3, x4, y4, z) {
  if (z == null) {
    z = 1;
  }
  z = z > 1 ? 1 : z < 0 ? 0 : z;
  var z2 = z / 2,
    n = 12,
    Tvalues = [-0.1252, 0.1252, -0.3678, 0.3678, -0.5873, 0.5873, -0.7699, 0.7699, -0.9041, 0.9041, -0.9816, 0.9816],
    Cvalues = [0.2491, 0.2491, 0.2335, 0.2335, 0.2032, 0.2032, 0.1601, 0.1601, 0.1069, 0.1069, 0.0472, 0.0472],
    sum = 0;
  for (var i = 0; i < n; i++) {
    var ct = z2 * Tvalues[i] + z2,
      xbase = base3(ct, x1, x2, x3, x4),
      ybase = base3(ct, y1, y2, y3, y4),
      comb = xbase * xbase + ybase * ybase;
    sum += Cvalues[i] * Math.sqrt(comb);
  }
  return z2 * sum;
}

function intersect(x1, y1, x2, y2, x3, y3, x4, y4) {
  if (Math.max(x1, x2) < Math.min(x3, x4) || Math.min(x1, x2) > Math.max(x3, x4) || Math.max(y1, y2) < Math.min(y3, y4) || Math.min(y1, y2) > Math.max(y3, y4)) {
    return;
  }
  var nx = (x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4),
    ny = (x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4),
    denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

  if (!denominator) {
    return;
  }
  var px = nx / denominator,
    py = ny / denominator,
    px2 = +px.toFixed(2),
    py2 = +py.toFixed(2);
  if (
    px2 < +Math.min(x1, x2).toFixed(2) ||
    px2 > +Math.max(x1, x2).toFixed(2) ||
    px2 < +Math.min(x3, x4).toFixed(2) ||
    px2 > +Math.max(x3, x4).toFixed(2) ||
    py2 < +Math.min(y1, y2).toFixed(2) ||
    py2 > +Math.max(y1, y2).toFixed(2) ||
    py2 < +Math.min(y3, y4).toFixed(2) ||
    py2 > +Math.max(y3, y4).toFixed(2)
  ) {
    return;
  }
  return { x: px, y: py };
}

function interHelper(bez1, bez2, justCount) {
  var bbox1 = bezierBBox(bez1),
    bbox2 = bezierBBox(bez2);
  if (!isBBoxIntersect(bbox1, bbox2)) {
    return justCount ? 0 : [];
  }
  var l1 = bezlen.apply(0, bez1),
    l2 = bezlen.apply(0, bez2),
    n1 = ~~(l1 / 8),
    n2 = ~~(l2 / 8),
    dots1 = [],
    dots2 = [],
    xy = {},
    res = justCount ? 0 : [];
  for (var i = 0; i < n1 + 1; i++) {
    var p = findDotsAtSegment.apply(0, bez1.concat(i / n1));
    dots1.push({ x: p.x, y: p.y, t: i / n1 });
  }
  for (i = 0; i < n2 + 1; i++) {
    p = findDotsAtSegment.apply(0, bez2.concat(i / n2));
    dots2.push({ x: p.x, y: p.y, t: i / n2 });
  }
  for (i = 0; i < n1; i++) {
    for (var j = 0; j < n2; j++) {
      var di = dots1[i],
        di1 = dots1[i + 1],
        dj = dots2[j],
        dj1 = dots2[j + 1],
        ci = Math.abs(di1.x - di.x) < 0.001 ? "y" : "x",
        cj = Math.abs(dj1.x - dj.x) < 0.001 ? "y" : "x",
        is = intersect(di.x, di.y, di1.x, di1.y, dj.x, dj.y, dj1.x, dj1.y);
      if (is) {
        if (xy[is.x.toFixed(4)] == is.y.toFixed(4)) {
          continue;
        }
        xy[is.x.toFixed(4)] = is.y.toFixed(4);
        var t1 = di.t + Math.abs((is[ci] - di[ci]) / (di1[ci] - di[ci])) * (di1.t - di.t),
          t2 = dj.t + Math.abs((is[cj] - dj[cj]) / (dj1[cj] - dj[cj])) * (dj1.t - dj.t);
        if (t1 >= 0 && t1 <= 1 && t2 >= 0 && t2 <= 1) {
          if (justCount) {
            res++;
          } else {
            res.push({
              x: is.x,
              y: is.y,
              t1: t1,
              t2: t2,
            });
          }
        }
      }
    }
  }
  return res;
}

function interPathHelper(path1, path2, justCount) {
  path1 = path2curve(path1);
  path2 = path2curve(path2);
  var x1,
    y1,
    x2,
    y2,
    x1m,
    y1m,
    x2m,
    y2m,
    bez1,
    bez2,
    res = justCount ? 0 : [];
  for (var i = 0, ii = path1.length; i < ii; i++) {
    var pi = path1[i];
    if (pi[0] == "M") {
      x1 = x1m = pi[1];
      y1 = y1m = pi[2];
    } else {
      if (pi[0] == "C") {
        bez1 = [x1, y1].concat(pi.slice(1));
        x1 = bez1[6];
        y1 = bez1[7];
      } else {
        bez1 = [x1, y1, x1, y1, x1m, y1m, x1m, y1m];
        x1 = x1m;
        y1 = y1m;
      }
      for (var j = 0, jj = path2.length; j < jj; j++) {
        var pj = path2[j];
        if (pj[0] == "M") {
          x2 = x2m = pj[1];
          y2 = y2m = pj[2];
        } else {
          if (pj[0] == "C") {
            bez2 = [x2, y2].concat(pj.slice(1));
            x2 = bez2[6];
            y2 = bez2[7];
          } else {
            bez2 = [x2, y2, x2, y2, x2m, y2m, x2m, y2m];
            x2 = x2m;
            y2 = y2m;
          }
          var intr = interHelper(bez1, bez2, justCount);
          if (justCount) {
            res += intr;
          } else {
            for (var k = 0, kk = intr.length; k < kk; k++) {
              intr[k].segment1 = i;
              intr[k].segment2 = j;
              intr[k].bez1 = bez1;
              intr[k].bez2 = bez2;
            }
            res = res.concat(intr);
          }
        }
      }
    }
  }
  return res;
}

function pathBBox(path) {
  var pth = paths(path);

  if (pth.bbox) {
    return clone(pth.bbox);
  }

  if (!path) {
    return box();
  }

  var pathLocal = path2curve(path);
  var x = 0;
  var y = 0;
  var X = [];
  var Y = [];
  var p = [];

  for (var i = 0, c = pathLocal.length; i < c; i++) {
    p = pathLocal[i];
    if (p[0] == "M") {
      x = p[1];
      y = p[2];
      X.push(x);
      Y.push(y);
      continue;
    }

    var dim = curveDim(x, y, p[1], p[2], p[3], p[4], p[5], p[6]);
    X = X.concat(dim.min.x, dim.max.x);
    Y = Y.concat(dim.min.y, dim.max.y);
    x = p[5];
    y = p[6];
  }

  var xmin = Math.min.apply(0, X);
  var ymin = Math.min.apply(0, Y);
  var xmax = Math.max.apply(0, X);
  var ymax = Math.max.apply(0, Y);
  var bb = box(xmin, ymin, xmax - xmin, ymax - ymin);

  pth.bbox = clone(bb);
  return bb;
}

function rectPath(x, y, w, h, r) {
  if (r) {
    return [
      ["M", +x + +r, y],
      ["l", w - r * 2, 0],
      ["a", r, r, 0, 0, 1, r, r],
      ["l", 0, h - r * 2],
      ["a", r, r, 0, 0, 1, -r, r],
      ["l", r * 2 - w, 0],
      ["a", r, r, 0, 0, 1, -r, -r],
      ["l", 0, r * 2 - h],
      ["a", r, r, 0, 0, 1, r, -r],
      ["z"],
    ];
  }
  var res = [["M", x, y], ["l", w, 0], ["l", 0, h], ["l", -w, 0], ["z"]];
  //res.toString = toString;
  return res;
}

function ellipsePath(x, y, rx, ry, a) {
  if (a == null && ry == null) {
    ry = rx;
  }
  x = +x;
  y = +y;
  rx = +rx;
  ry = +ry;
  if (a != null) {
    var rad = Math.PI / 180,
      x1 = x + rx * Math.cos(-ry * rad),
      x2 = x + rx * Math.cos(-a * rad),
      y1 = y + rx * Math.sin(-ry * rad),
      y2 = y + rx * Math.sin(-a * rad),
      res = [
        ["M", x1, y1],
        ["A", rx, rx, 0, +(a - ry > 180), 0, x2, y2],
      ];
  } else {
    res = [["M", x, y], ["m", 0, -ry], ["a", rx, ry, 0, 1, 1, 0, 2 * ry], ["a", rx, ry, 0, 1, 1, 0, -2 * ry], ["z"]];
  }
  //res.toString = toString;
  return res;
}

const pathCommand = /([a-z])[\s,]*((-?\d*\.?\d*(?:e[\-+]?\d+)?[\s]*,?[\s]*)+)/gi;
const pathValues = /(-?\d*\.?\d*(?:e[\-+]?\d+)?)[\s]*,?[\s]*/gi;

function parsePathString(pathString) {
  if (!pathString) {
    return null;
  }
  var pth = paths(pathString);
  if (pth.arr) {
    return clone(pth.arr);
  }

  var paramCounts = {
      a: 7,
      c: 6,
      o: 2,
      h: 1,
      l: 2,
      m: 2,
      r: 4,
      q: 4,
      s: 4,
      t: 2,
      v: 1,
      u: 3,
      z: 0,
    },
    data = [];
  if (is(pathString, "array") && is(pathString[0], "array")) {
    // rough assumption
    data = Snap.path.clone(pathString);
  }
  if (!data.length) {
    String(pathString).replace(pathCommand, function (a, b, c) {
      var params = [],
        name = b.toLowerCase();
      c.replace(pathValues, function (a, b) {
        b && params.push(+b);
      });
      if (name == "m" && params.length > 2) {
        data.push([b].concat(params.splice(0, 2)));
        name = "l";
        b = b == "m" ? "l" : "L";
      }
      if (name == "o" && params.length == 1) {
        data.push([b, params[0]]);
      }
      if (name == "r") {
        data.push([b].concat(params));
      } else
        while (params.length >= paramCounts[name]) {
          data.push([b].concat(params.splice(0, paramCounts[name])));
          if (!paramCounts[name]) {
            break;
          }
        }
    });
  }
  //data.toString = pth.toString;
  pth.arr = clone(data);
  return data;
}

function pathToAbsolute(pathArray) {
  var pth = paths(pathArray);
  if (pth.abs) {
    return pathClone(pth.abs);
  }
  if (!is(pathArray, "array") || !is(pathArray && pathArray[0], "array")) {
    // rough assumption
    pathArray = parsePathString(pathArray);
  }
  if (!pathArray || !pathArray.length) {
    return [["M", 0, 0]];
  }
  var res = [],
    x = 0,
    y = 0,
    mx = 0,
    my = 0,
    start = 0,
    pa0;
  if (pathArray[0][0] == "M") {
    x = +pathArray[0][1];
    y = +pathArray[0][2];
    mx = x;
    my = y;
    start++;
    res[0] = ["M", x, y];
  }
  var crz = pathArray.length == 3 && pathArray[0][0] == "M" && pathArray[1][0].toUpperCase() == "R" && pathArray[2][0].toUpperCase() == "Z";
  for (var r, pa, i = start, ii = pathArray.length; i < ii; i++) {
    res.push((r = []));
    pa = pathArray[i];
    pa0 = pa[0];
    if (pa0 != pa0.toUpperCase()) {
      r[0] = pa0.toUpperCase();
      switch (r[0]) {
        case "A":
          r[1] = pa[1];
          r[2] = pa[2];
          r[3] = pa[3];
          r[4] = pa[4];
          r[5] = pa[5];
          r[6] = +pa[6] + x;
          r[7] = +pa[7] + y;
          break;
        case "V":
          r[1] = +pa[1] + y;
          break;
        case "H":
          r[1] = +pa[1] + x;
          break;
        case "R":
          var dots = [x, y].concat(pa.slice(1));
          for (var j = 2, jj = dots.length; j < jj; j++) {
            dots[j] = +dots[j] + x;
            dots[++j] = +dots[j] + y;
          }
          res.pop();
          res = res.concat(catmullRom2bezier(dots, crz));
          break;
        case "O":
          res.pop();
          dots = ellipsePath(x, y, pa[1], pa[2]);
          dots.push(dots[0]);
          res = res.concat(dots);
          break;
        case "U":
          res.pop();
          res = res.concat(ellipsePath(x, y, pa[1], pa[2], pa[3]));
          r = ["U"].concat(res[res.length - 1].slice(-2));
          break;
        case "M":
          mx = +pa[1] + x;
          my = +pa[2] + y;
        default:
          for (j = 1, jj = pa.length; j < jj; j++) {
            r[j] = +pa[j] + (j % 2 ? x : y);
          }
      }
    } else if (pa0 == "R") {
      dots = [x, y].concat(pa.slice(1));
      res.pop();
      res = res.concat(catmullRom2bezier(dots, crz));
      r = ["R"].concat(pa.slice(-2));
    } else if (pa0 == "O") {
      res.pop();
      dots = ellipsePath(x, y, pa[1], pa[2]);
      dots.push(dots[0]);
      res = res.concat(dots);
    } else if (pa0 == "U") {
      res.pop();
      res = res.concat(ellipsePath(x, y, pa[1], pa[2], pa[3]));
      r = ["U"].concat(res[res.length - 1].slice(-2));
    } else {
      for (var k = 0, kk = pa.length; k < kk; k++) {
        r[k] = pa[k];
      }
    }
    pa0 = pa0.toUpperCase();
    if (pa0 != "O") {
      switch (r[0]) {
        case "Z":
          x = +mx;
          y = +my;
          break;
        case "H":
          x = r[1];
          break;
        case "V":
          y = r[1];
          break;
        case "M":
          mx = r[r.length - 2];
          my = r[r.length - 1];
        default:
          x = r[r.length - 2];
          y = r[r.length - 1];
      }
    }
  }
  //res.toString = toString;
  pth.abs = pathClone(res);
  return res;
}

function l2c(x1, y1, x2, y2) {
  return [x1, y1, x2, y2, x2, y2];
}

function q2c(x1, y1, ax, ay, x2, y2) {
  var _13 = 1 / 3,
    _23 = 2 / 3;
  return [_13 * x1 + _23 * ax, _13 * y1 + _23 * ay, _13 * x2 + _23 * ax, _13 * y2 + _23 * ay, x2, y2];
}

// Returns bounding box of cubic bezier curve.
// Source: http://blog.hackers-cafe.net/2009/06/how-to-calculate-bezier-curves-bounding.html
// Original version: NISHIO Hirokazu
// Modifications: https://github.com/timo22345
function curveDim(x0, y0, x1, y1, x2, y2, x3, y3) {
  var tvalues = [],
    bounds = [[], []],
    a,
    b,
    c,
    t,
    t1,
    t2,
    b2ac,
    sqrtb2ac;
  for (var i = 0; i < 2; ++i) {
    if (i == 0) {
      b = 6 * x0 - 12 * x1 + 6 * x2;
      a = -3 * x0 + 9 * x1 - 9 * x2 + 3 * x3;
      c = 3 * x1 - 3 * x0;
    } else {
      b = 6 * y0 - 12 * y1 + 6 * y2;
      a = -3 * y0 + 9 * y1 - 9 * y2 + 3 * y3;
      c = 3 * y1 - 3 * y0;
    }
    if (Math.abs(a) < 1e-12) {
      if (Math.abs(b) < 1e-12) {
        continue;
      }
      t = -c / b;
      if (0 < t && t < 1) {
        tvalues.push(t);
      }
      continue;
    }
    b2ac = b * b - 4 * c * a;
    sqrtb2ac = Math.sqrt(b2ac);
    if (b2ac < 0) {
      continue;
    }
    t1 = (-b + sqrtb2ac) / (2 * a);
    if (0 < t1 && t1 < 1) {
      tvalues.push(t1);
    }
    t2 = (-b - sqrtb2ac) / (2 * a);
    if (0 < t2 && t2 < 1) {
      tvalues.push(t2);
    }
  }

  var x,
    y,
    j = tvalues.length,
    jlen = j,
    mt;
  while (j--) {
    t = tvalues[j];
    mt = 1 - t;
    bounds[0][j] = mt * mt * mt * x0 + 3 * mt * mt * t * x1 + 3 * mt * t * t * x2 + t * t * t * x3;
    bounds[1][j] = mt * mt * mt * y0 + 3 * mt * mt * t * y1 + 3 * mt * t * t * y2 + t * t * t * y3;
  }

  bounds[0][jlen] = x0;
  bounds[1][jlen] = y0;
  bounds[0][jlen + 1] = x3;
  bounds[1][jlen + 1] = y3;
  bounds[0].length = bounds[1].length = jlen + 2;

  return {
    min: { x: Math.min.apply(0, bounds[0]), y: Math.min.apply(0, bounds[1]) },
    max: { x: Math.max.apply(0, bounds[0]), y: Math.max.apply(0, bounds[1]) },
  };
}

function a2c(x1, y1, rx, ry, angle, large_arc_flag, sweep_flag, x2, y2, recursive) {
  // for more information of where this math came from visit:
  // http://www.w3.org/TR/SVG11/implnote.html#ArcImplementationNotes
  var _120 = (Math.PI * 120) / 180,
    rad = (Math.PI / 180) * (+angle || 0),
    res = [],
    xy,
    rotate = cacher(function (x, y, rad) {
      var X = x * Math.cos(rad) - y * Math.sin(rad),
        Y = x * Math.sin(rad) + y * Math.cos(rad);
      return { x: X, y: Y };
    });
  if (!rx || !ry) {
    return [x1, y1, x2, y2, x2, y2];
  }
  if (!recursive) {
    xy = rotate(x1, y1, -rad);
    x1 = xy.x;
    y1 = xy.y;
    xy = rotate(x2, y2, -rad);
    x2 = xy.x;
    y2 = xy.y;
    var cos = Math.cos((Math.PI / 180) * angle),
      sin = Math.sin((Math.PI / 180) * angle),
      x = (x1 - x2) / 2,
      y = (y1 - y2) / 2;
    var h = (x * x) / (rx * rx) + (y * y) / (ry * ry);
    if (h > 1) {
      h = Math.sqrt(h);
      rx = h * rx;
      ry = h * ry;
    }
    var rx2 = rx * rx,
      ry2 = ry * ry,
      k = (large_arc_flag == sweep_flag ? -1 : 1) * Math.sqrt(Math.abs((rx2 * ry2 - rx2 * y * y - ry2 * x * x) / (rx2 * y * y + ry2 * x * x))),
      cx = (k * rx * y) / ry + (x1 + x2) / 2,
      cy = (k * -ry * x) / rx + (y1 + y2) / 2,
      f1 = Math.asin(((y1 - cy) / ry).toFixed(9)),
      f2 = Math.asin(((y2 - cy) / ry).toFixed(9));

    f1 = x1 < cx ? Math.PI - f1 : f1;
    f2 = x2 < cx ? Math.PI - f2 : f2;
    f1 < 0 && (f1 = Math.PI * 2 + f1);
    f2 < 0 && (f2 = Math.PI * 2 + f2);
    if (sweep_flag && f1 > f2) {
      f1 = f1 - Math.PI * 2;
    }
    if (!sweep_flag && f2 > f1) {
      f2 = f2 - Math.PI * 2;
    }
  } else {
    f1 = recursive[0];
    f2 = recursive[1];
    cx = recursive[2];
    cy = recursive[3];
  }
  var df = f2 - f1;
  if (Math.abs(df) > _120) {
    var f2old = f2,
      x2old = x2,
      y2old = y2;
    f2 = f1 + _120 * (sweep_flag && f2 > f1 ? 1 : -1);
    x2 = cx + rx * Math.cos(f2);
    y2 = cy + ry * Math.sin(f2);
    res = a2c(x2, y2, rx, ry, angle, 0, sweep_flag, x2old, y2old, [f2, f2old, cx, cy]);
  }
  df = f2 - f1;
  var c1 = Math.cos(f1),
    s1 = Math.sin(f1),
    c2 = Math.cos(f2),
    s2 = Math.sin(f2),
    t = Math.tan(df / 4),
    hx = (4 / 3) * rx * t,
    hy = (4 / 3) * ry * t,
    m1 = [x1, y1],
    m2 = [x1 + hx * s1, y1 - hy * c1],
    m3 = [x2 + hx * s2, y2 - hy * c2],
    m4 = [x2, y2];
  m2[0] = 2 * m1[0] - m2[0];
  m2[1] = 2 * m1[1] - m2[1];
  if (recursive) {
    return [m2, m3, m4].concat(res);
  } else {
    res = [m2, m3, m4].concat(res).join().split(",");
    var newres = [];
    for (var i = 0, ii = res.length; i < ii; i++) {
      newres[i] = i % 2 ? rotate(res[i - 1], res[i], rad).y : rotate(res[i], res[i + 1], rad).x;
    }
    return newres;
  }
}

function path2curve(path, path2) {
  var pth = !path2 && paths(path);

  if (!path2 && pth.curve) {
    return pathClone(pth.curve);
  }

  var p = pathToAbsolute(path);
  var p2 = path2 && pathToAbsolute(path2);
  var attrs = { x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: null, qy: null };
  var attrs2 = { x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: null, qy: null };

  var processPath = function (path, d, pcom) {
    var nx, ny;
    if (!path) {
      return ["C", d.x, d.y, d.x, d.y, d.x, d.y];
    }
    !(path[0] in { T: 1, Q: 1 }) && (d.qx = d.qy = null);
    switch (path[0]) {
      case "M":
        d.X = path[1];
        d.Y = path[2];
        break;
      case "A":
        path = ["C"].concat(a2c.apply(0, [d.x, d.y].concat(path.slice(1))));
        break;
      case "S":
        if (pcom == "C" || pcom == "S") {
          // In "S" case we have to take into account, if the previous command is C/S.
          nx = d.x * 2 - d.bx; // And reflect the previous
          ny = d.y * 2 - d.by; // command's control point relative to the current point.
        } else {
          // or some else or nothing
          nx = d.x;
          ny = d.y;
        }
        path = ["C", nx, ny].concat(path.slice(1));
        break;
      case "T":
        if (pcom == "Q" || pcom == "T") {
          // In "T" case we have to take into account, if the previous command is Q/T.
          d.qx = d.x * 2 - d.qx; // And make a reflection similar
          d.qy = d.y * 2 - d.qy; // to case "S".
        } else {
          // or something else or nothing
          d.qx = d.x;
          d.qy = d.y;
        }
        path = ["C"].concat(q2c(d.x, d.y, d.qx, d.qy, path[1], path[2]));
        break;
      case "Q":
        d.qx = path[1];
        d.qy = path[2];
        path = ["C"].concat(q2c(d.x, d.y, path[1], path[2], path[3], path[4]));
        break;
      case "L":
        path = ["C"].concat(l2c(d.x, d.y, path[1], path[2]));
        break;
      case "H":
        path = ["C"].concat(l2c(d.x, d.y, path[1], d.y));
        break;
      case "V":
        path = ["C"].concat(l2c(d.x, d.y, d.x, path[1]));
        break;
      case "Z":
        path = ["C"].concat(l2c(d.x, d.y, d.X, d.Y));
        break;
    }
    return path;
  };

  var fixArc = function (pp, i) {
    if (pp[i].length > 7) {
      pp[i].shift();
      var pi = pp[i];
      while (pi.length) {
        pcoms1[i] = "A"; // if created multiple C:s, their original seg is saved
        p2 && (pcoms2[i] = "A"); // the same as above
        pp.splice(i++, 0, ["C"].concat(pi.splice(0, 6)));
      }
      pp.splice(i, 1);
      ii = Math.max(p.length, (p2 && p2.length) || 0);
    }
  };

  var fixM = function (path1, path2, a1, a2, i) {
    if (path1 && path2 && path1[i][0] == "M" && path2[i][0] != "M") {
      path2.splice(i, 0, ["M", a2.x, a2.y]);
      a1.bx = 0;
      a1.by = 0;
      a1.x = path1[i][1];
      a1.y = path1[i][2];
      ii = Math.max(p.length, (p2 && p2.length) || 0);
    }
  };

  var pcoms1 = []; // path commands of original path p
  var pcoms2 = []; // path commands of original path p2
  var pfirst = ""; // temporary holder for original path command
  var pcom = ""; // holder for previous path command of original path

  for (var i = 0, ii = Math.max(p.length, (p2 && p2.length) || 0); i < ii; i++) {
    p[i] && (pfirst = p[i][0]); // save current path command

    if (pfirst != "C") {
      // C is not saved yet, because it may be result of conversion
      pcoms1[i] = pfirst; // Save current path command
      i && (pcom = pcoms1[i - 1]); // Get previous path command pcom
    }
    p[i] = processPath(p[i], attrs, pcom); // Previous path command is inputted to processPath

    if (pcoms1[i] != "A" && pfirst == "C") pcoms1[i] = "C"; // A is the only command
    // which may produce multiple C:s
    // so we have to make sure that C is also C in original path

    fixArc(p, i); // fixArc adds also the right amount of A:s to pcoms1

    if (p2) {
      // the same procedures is done to p2
      p2[i] && (pfirst = p2[i][0]);
      if (pfirst != "C") {
        pcoms2[i] = pfirst;
        i && (pcom = pcoms2[i - 1]);
      }
      p2[i] = processPath(p2[i], attrs2, pcom);

      if (pcoms2[i] != "A" && pfirst == "C") {
        pcoms2[i] = "C";
      }

      fixArc(p2, i);
    }

    fixM(p, p2, attrs, attrs2, i);
    fixM(p2, p, attrs2, attrs, i);

    var seg = p[i];
    var seg2 = p2 && p2[i];
    var seglen = seg.length;
    var seg2len = p2 && seg2.length;

    attrs.x = seg[seglen - 2];
    attrs.y = seg[seglen - 1];
    attrs.bx = parseFloat(seg[seglen - 4]) || attrs.x;
    attrs.by = parseFloat(seg[seglen - 3]) || attrs.y;
    attrs2.bx = p2 && (parseFloat(seg2[seg2len - 4]) || attrs2.x);
    attrs2.by = p2 && (parseFloat(seg2[seg2len - 3]) || attrs2.y);
    attrs2.x = p2 && seg2[seg2len - 2];
    attrs2.y = p2 && seg2[seg2len - 1];
  }

  if (!p2) {
    pth.curve = pathClone(p);
  }
  return p2 ? [p, p2] : p;
}

// http://schepers.cc/getting-to-the-point
function catmullRom2bezier(crp, z) {
  var d = [];

  for (var i = 0, c = crp.length; c - 2 * !z > i; i += 2) {
    var p = [
      { x: +crp[i - 2], y: +crp[i - 1] },
      { x: +crp[i], y: +crp[i + 1] },
      { x: +crp[i + 2], y: +crp[i + 3] },
      { x: +crp[i + 4], y: +crp[i + 5] },
    ];

    if (z) {
      if (!i) {
        p[0] = { x: +crp[c - 2], y: +crp[c - 1] };
      } else if (c - 4 == i) {
        p[3] = { x: +crp[0], y: +crp[1] };
      } else if (c - 2 == i) {
        p[2] = { x: +crp[0], y: +crp[1] };
        p[3] = { x: +crp[2], y: +crp[3] };
      }
    } else {
      if (c - 4 == i) {
        p[3] = p[2];
      } else if (!i) {
        p[0] = { x: +crp[i], y: +crp[i + 1] };
      }
    }

    d.push(["C", (-p[0].x + 6 * p[1].x + p[2].x) / 6, (-p[0].y + 6 * p[1].y + p[2].y) / 6, (p[1].x + 6 * p[2].x - p[3].x) / 6, (p[1].y + 6 * p[2].y - p[3].y) / 6, p[2].x, p[2].y]);
  }

  return d;
}

const pointInSvgPath = (path, x, y) => {
  const bbox = pathBBox(path);

  if (!isPointInsideBBox(bbox, x, y)) {
    return false;
  }

  if (
    interPathHelper(
      path,
      [
        ["M", x, y],
        ["H", bbox.x2 + 10],
      ],
      1
    ) %
      2 !==
    1
  ) {
    return false;
  }

  return true;
};

const pointInSvgPathBox = (path, bbox, x, y) => {
  if (!isPointInsideBBox(bbox, x, y)) {
    return false;
  }

  if (
    interPathHelper(
      path,
      [
        ["M", x, y],
        ["H", bbox.x2 + 10],
      ],
      1
    ) %
      2 !==
    1
  ) {
    return false;
  }

  return true;
};

const getPointsAndIntersectingPaths = (paths, points) => {
  const pathBBoxes = paths.map(({ id, data }) => ({ id, data, bbox: pathBBox(data) }));

  return points.map(({ id: pointId, x, y }) => {
    const intersectingPathIds = pathBBoxes
      .filter(({ data, bbox }) => {
        if (!isPointInsideBBox(bbox, x, y)) {
          return false;
        }

        if (
          interPathHelper(
            data,
            [
              ["M", x, y],
              ["H", bbox.x2 + 10],
            ],
            1
          ) %
            2 !==
          1
        ) {
          return false;
        }

        return true;
      })
      .map(({ id }) => id);
    return { pointId, x, y, intersectingPathIds };
  });
};

module.exports = {
  pathBBox,
  pointInSvgPath,
  pointInSvgPathBox,
  getPointsAndIntersectingPaths,
};
