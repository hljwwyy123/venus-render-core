class Context {
  points: Array<Object>;

  constructor() {
    this.points = new Array<Object>();
  }

  beginPath(): void {
    this.points = new Array<Object>();
  }

  bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void {
    this.points.push({ x, y });
  }

  lineTo(x: number, y: number): void {
    this.points.push({ x, y });
  }

  moveTo(x: number, y: number): void {
    this.points.push({ x, y });
  }

  quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void {
    this.points.push({ x, y });
  }

  closePath(): void {}
}

export function parsePathString(d: string): Array<object> {
  const ctx = new Context();
  const path = _parsePath(d.match && d.match(/[mzlhvcsqta][^mzlhvcsqta]*/gi));
  _renderPathCommands(ctx, path);
  return ctx.points;
}

export interface Dimension {
  left: number;
  top: number;
  width: number;
  height: number;
}

export default function calcPathString(d: string): Dimension {
  const path = _parsePath(d.match && d.match(/[mzlhvcsqta][^mzlhvcsqta]*/gi));
  return _calcDimensions(path);
}

const min = Math.min,
  max = Math.max,
  PiBy2 = Math.PI / 2,
  commandLengths = {
    m: 2,
    l: 2,
    h: 1,
    v: 1,
    c: 6,
    s: 4,
    q: 4,
    t: 2,
    a: 7,
  },
  repeatedCommands = {
    m: "l",
    M: "L",
  },
  pathOffset = { x: 0, y: 0 },
  arcToSegmentsCache = {},
  boundsOfCurveCache = {},
  cachesBoundsOfCurve = {};

/**
 * @private
 * @param {CanvasRenderingContext2D} ctx context to render path on
 */
function _renderPathCommands(ctx, path) {
  let current, // current instruction
    previous = null,
    subpathStartX = 0,
    subpathStartY = 0,
    x = 0, // current x
    y = 0, // current y
    controlX = 0, // current control point x
    controlY = 0, // current control point y
    tempX,
    tempY,
    l = -pathOffset.x,
    t = -pathOffset.y;

  ctx.beginPath();

  for (let i = 0, len = path.length; i < len; ++i) {
    current = path[i];

    switch (
      current[0] // first letter
    ) {
      case "l": // lineto, relative
        x += current[1];
        y += current[2];
        ctx.lineTo(x + l, y + t);
        break;

      case "L": // lineto, absolute
        x = current[1];
        y = current[2];
        ctx.lineTo(x + l, y + t);
        break;

      case "h": // horizontal lineto, relative
        x += current[1];
        ctx.lineTo(x + l, y + t);
        break;

      case "H": // horizontal lineto, absolute
        x = current[1];
        ctx.lineTo(x + l, y + t);
        break;

      case "v": // vertical lineto, relative
        y += current[1];
        ctx.lineTo(x + l, y + t);
        break;

      case "V": // verical lineto, absolute
        y = current[1];
        ctx.lineTo(x + l, y + t);
        break;

      case "m": // moveTo, relative
        x += current[1];
        y += current[2];
        subpathStartX = x;
        subpathStartY = y;
        ctx.moveTo(x + l, y + t);
        break;

      case "M": // moveTo, absolute
        x = current[1];
        y = current[2];
        subpathStartX = x;
        subpathStartY = y;
        ctx.moveTo(x + l, y + t);
        break;

      case "c": // bezierCurveTo, relative
        tempX = x + current[5];
        tempY = y + current[6];
        controlX = x + current[3];
        controlY = y + current[4];
        ctx.bezierCurveTo(
          x + current[1] + l, // x1
          y + current[2] + t, // y1
          controlX + l, // x2
          controlY + t, // y2
          tempX + l,
          tempY + t
        );
        x = tempX;
        y = tempY;
        break;

      case "C": // bezierCurveTo, absolute
        x = current[5];
        y = current[6];
        controlX = current[3];
        controlY = current[4];
        ctx.bezierCurveTo(current[1] + l, current[2] + t, controlX + l, controlY + t, x + l, y + t);
        break;

      case "s": // shorthand cubic bezierCurveTo, relative
        // transform to absolute x,y
        tempX = x + current[3];
        tempY = y + current[4];

        if (previous[0].match(/[CcSs]/) === null) {
          // If there is no previous command or if the previous command was not a C, c, S, or s,
          // the control point is coincident with the current point
          controlX = x;
          controlY = y;
        } else {
          // calculate reflection of previous control points
          controlX = 2 * x - controlX;
          controlY = 2 * y - controlY;
        }

        ctx.bezierCurveTo(controlX + l, controlY + t, x + current[1] + l, y + current[2] + t, tempX + l, tempY + t);
        // set control point to 2nd one of this command
        // "... the first control point is assumed to be
        // the reflection of the second control point on
        // the previous command relative to the current point."
        controlX = x + current[1];
        controlY = y + current[2];

        x = tempX;
        y = tempY;
        break;

      case "S": // shorthand cubic bezierCurveTo, absolute
        tempX = current[3];
        tempY = current[4];
        if (previous[0].match(/[CcSs]/) === null) {
          // If there is no previous command or if the previous command was not a C, c, S, or s,
          // the control point is coincident with the current point
          controlX = x;
          controlY = y;
        } else {
          // calculate reflection of previous control points
          controlX = 2 * x - controlX;
          controlY = 2 * y - controlY;
        }
        ctx.bezierCurveTo(controlX + l, controlY + t, current[1] + l, current[2] + t, tempX + l, tempY + t);
        x = tempX;
        y = tempY;

        // set control point to 2nd one of this command
        // "... the first control point is assumed to be
        // the reflection of the second control point on
        // the previous command relative to the current point."
        controlX = current[1];
        controlY = current[2];

        break;

      case "q": // quadraticCurveTo, relative
        // transform to absolute x,y
        tempX = x + current[3];
        tempY = y + current[4];

        controlX = x + current[1];
        controlY = y + current[2];

        ctx.quadraticCurveTo(controlX + l, controlY + t, tempX + l, tempY + t);
        x = tempX;
        y = tempY;
        break;

      case "Q": // quadraticCurveTo, absolute
        tempX = current[3];
        tempY = current[4];

        ctx.quadraticCurveTo(current[1] + l, current[2] + t, tempX + l, tempY + t);
        x = tempX;
        y = tempY;
        controlX = current[1];
        controlY = current[2];
        break;

      case "t": // shorthand quadraticCurveTo, relative
        // transform to absolute x,y
        tempX = x + current[1];
        tempY = y + current[2];

        if (previous[0].match(/[QqTt]/) === null) {
          // If there is no previous command or if the previous command was not a Q, q, T or t,
          // assume the control point is coincident with the current point
          controlX = x;
          controlY = y;
        } else {
          // calculate reflection of previous control point
          controlX = 2 * x - controlX;
          controlY = 2 * y - controlY;
        }

        ctx.quadraticCurveTo(controlX + l, controlY + t, tempX + l, tempY + t);
        x = tempX;
        y = tempY;

        break;

      case "T":
        tempX = current[1];
        tempY = current[2];

        if (previous[0].match(/[QqTt]/) === null) {
          // If there is no previous command or if the previous command was not a Q, q, T or t,
          // assume the control point is coincident with the current point
          controlX = x;
          controlY = y;
        } else {
          // calculate reflection of previous control point
          controlX = 2 * x - controlX;
          controlY = 2 * y - controlY;
        }
        ctx.quadraticCurveTo(controlX + l, controlY + t, tempX + l, tempY + t);
        x = tempX;
        y = tempY;
        break;

      case "a":
        // TODO: optimize this
        drawArc(ctx, x + l, y + t, [current[1], current[2], current[3], current[4], current[5], current[6] + x + l, current[7] + y + t]);
        x += current[6];
        y += current[7];
        break;

      case "A":
        // TODO: optimize this
        drawArc(ctx, x + l, y + t, [current[1], current[2], current[3], current[4], current[5], current[6] + l, current[7] + t]);
        x = current[6];
        y = current[7];
        break;

      case "z":
      case "Z":
        x = subpathStartX;
        y = subpathStartY;
        ctx.closePath();
        break;
    }
    previous = current;
  }
}

/**
 * @private
 */
function _parsePath(path) {
  let result = [],
    coords = [],
    currentPath,
    parsed,
    re = /([-+]?((\d+\.\d+)|((\d+)|(\.\d+)))(?:e[-+]?\d+)?)/gi,
    match,
    coordsStr;

  for (let i = 0, coordsParsed, len = path.length; i < len; i++) {
    currentPath = path[i];

    coordsStr = currentPath.slice(1).trim();
    coords.length = 0;

    while ((match = re.exec(coordsStr))) {
      coords.push(match[0]);
    }

    coordsParsed = [currentPath.charAt(0)];

    for (let j = 0, jlen = coords.length; j < jlen; j++) {
      parsed = parseFloat(coords[j]);
      if (!isNaN(parsed)) {
        coordsParsed.push(parsed);
      }
    }

    let command = coordsParsed[0],
      commandLength = commandLengths[command.toLowerCase()],
      repeatedCommand = repeatedCommands[command] || command;

    if (coordsParsed.length - 1 > commandLength) {
      for (let k = 1, klen = coordsParsed.length; k < klen; k += commandLength) {
        result.push([command].concat(coordsParsed.slice(k, k + commandLength)));
        command = repeatedCommand;
      }
    } else {
      result.push(coordsParsed);
    }
  }

  return result;
}

/**
 * Calculate bounding box of a beziercurve
 * @param {Number} x0 starting point
 * @param {Number} y0
 * @param {Number} x1 first control point
 * @param {Number} y1
 * @param {Number} x2 secondo control point
 * @param {Number} y2
 * @param {Number} x3 end of beizer
 * @param {Number} y3
 */
// taken from http://jsbin.com/ivomiq/56/edit  no credits available for that.
function getBoundsOfCurve(x0, y0, x1, y1, x2, y2, x3, y3) {
  let argsString;
  if (cachesBoundsOfCurve) {
    argsString = Array.prototype.join.call(arguments);
    if (boundsOfCurveCache[argsString]) {
      return boundsOfCurveCache[argsString];
    }
  }

  let sqrt = Math.sqrt,
    min = Math.min,
    max = Math.max,
    abs = Math.abs,
    tvalues = [],
    bounds = [[], []],
    a,
    b,
    c,
    t,
    t1,
    t2,
    b2ac,
    sqrtb2ac;

  b = 6 * x0 - 12 * x1 + 6 * x2;
  a = -3 * x0 + 9 * x1 - 9 * x2 + 3 * x3;
  c = 3 * x1 - 3 * x0;

  for (let i = 0; i < 2; ++i) {
    if (i > 0) {
      b = 6 * y0 - 12 * y1 + 6 * y2;
      a = -3 * y0 + 9 * y1 - 9 * y2 + 3 * y3;
      c = 3 * y1 - 3 * y0;
    }

    if (abs(a) < 1e-12) {
      if (abs(b) < 1e-12) {
        continue;
      }
      t = -c / b;
      if (0 < t && t < 1) {
        tvalues.push(t);
      }
      continue;
    }
    b2ac = b * b - 4 * c * a;
    if (b2ac < 0) {
      continue;
    }
    sqrtb2ac = sqrt(b2ac);
    t1 = (-b + sqrtb2ac) / (2 * a);
    if (0 < t1 && t1 < 1) {
      tvalues.push(t1);
    }
    t2 = (-b - sqrtb2ac) / (2 * a);
    if (0 < t2 && t2 < 1) {
      tvalues.push(t2);
    }
  }

  let x,
    y,
    j = tvalues.length,
    jlen = j,
    mt;
  while (j--) {
    t = tvalues[j];
    mt = 1 - t;
    x = mt * mt * mt * x0 + 3 * mt * mt * t * x1 + 3 * mt * t * t * x2 + t * t * t * x3;
    bounds[0][j] = x;

    y = mt * mt * mt * y0 + 3 * mt * mt * t * y1 + 3 * mt * t * t * y2 + t * t * t * y3;
    bounds[1][j] = y;
  }

  bounds[0][jlen] = x0;
  bounds[1][jlen] = y0;
  bounds[0][jlen + 1] = x3;
  bounds[1][jlen + 1] = y3;
  let result = [
    {
      x: min.apply(null, bounds[0]),
      y: min.apply(null, bounds[1]),
    },
    {
      x: max.apply(null, bounds[0]),
      y: max.apply(null, bounds[1]),
    },
  ];
  if (cachesBoundsOfCurve) {
    boundsOfCurveCache[argsString] = result;
  }
  return result;
}

/**
 * @private
 */
function _calcDimensions(path): Dimension {
  let aX = [],
    aY = [],
    current, // current instruction
    previous = null,
    subpathStartX = 0,
    subpathStartY = 0,
    x = 0, // current x
    y = 0, // current y
    controlX = 0, // current control point x
    controlY = 0, // current control point y
    tempX,
    tempY,
    bounds;

  for (let i = 0, len = path.length; i < len; ++i) {
    current = path[i];

    switch (
      current[0] // first letter
    ) {
      case "l": // lineto, relative
        x += current[1];
        y += current[2];
        bounds = [];
        break;

      case "L": // lineto, absolute
        x = current[1];
        y = current[2];
        bounds = [];
        break;

      case "h": // horizontal lineto, relative
        x += current[1];
        bounds = [];
        break;

      case "H": // horizontal lineto, absolute
        x = current[1];
        bounds = [];
        break;

      case "v": // vertical lineto, relative
        y += current[1];
        bounds = [];
        break;

      case "V": // verical lineto, absolute
        y = current[1];
        bounds = [];
        break;

      case "m": // moveTo, relative
        x += current[1];
        y += current[2];
        subpathStartX = x;
        subpathStartY = y;
        bounds = [];
        break;

      case "M": // moveTo, absolute
        x = current[1];
        y = current[2];
        subpathStartX = x;
        subpathStartY = y;
        bounds = [];
        break;

      case "c": // bezierCurveTo, relative
        tempX = x + current[5];
        tempY = y + current[6];
        controlX = x + current[3];
        controlY = y + current[4];
        bounds = getBoundsOfCurve(
          x,
          y,
          x + current[1], // x1
          y + current[2], // y1
          controlX, // x2
          controlY, // y2
          tempX,
          tempY
        );
        x = tempX;
        y = tempY;
        break;

      case "C": // bezierCurveTo, absolute
        controlX = current[3];
        controlY = current[4];
        bounds = getBoundsOfCurve(x, y, current[1], current[2], controlX, controlY, current[5], current[6]);
        x = current[5];
        y = current[6];
        break;

      case "s": // shorthand cubic bezierCurveTo, relative
        // transform to absolute x,y
        tempX = x + current[3];
        tempY = y + current[4];

        if (previous[0].match(/[CcSs]/) === null) {
          // If there is no previous command or if the previous command was not a C, c, S, or s,
          // the control point is coincident with the current point
          controlX = x;
          controlY = y;
        } else {
          // calculate reflection of previous control points
          controlX = 2 * x - controlX;
          controlY = 2 * y - controlY;
        }

        bounds = getBoundsOfCurve(x, y, controlX, controlY, x + current[1], y + current[2], tempX, tempY);
        // set control point to 2nd one of this command
        // "... the first control point is assumed to be
        // the reflection of the second control point on
        // the previous command relative to the current point."
        controlX = x + current[1];
        controlY = y + current[2];
        x = tempX;
        y = tempY;
        break;

      case "S": // shorthand cubic bezierCurveTo, absolute
        tempX = current[3];
        tempY = current[4];
        if (previous[0].match(/[CcSs]/) === null) {
          // If there is no previous command or if the previous command was not a C, c, S, or s,
          // the control point is coincident with the current point
          controlX = x;
          controlY = y;
        } else {
          // calculate reflection of previous control points
          controlX = 2 * x - controlX;
          controlY = 2 * y - controlY;
        }
        bounds = getBoundsOfCurve(x, y, controlX, controlY, current[1], current[2], tempX, tempY);
        x = tempX;
        y = tempY;
        // set control point to 2nd one of this command
        // "... the first control point is assumed to be
        // the reflection of the second control point on
        // the previous command relative to the current point."
        controlX = current[1];
        controlY = current[2];
        break;

      case "q": // quadraticCurveTo, relative
        // transform to absolute x,y
        tempX = x + current[3];
        tempY = y + current[4];
        controlX = x + current[1];
        controlY = y + current[2];
        bounds = getBoundsOfCurve(x, y, controlX, controlY, controlX, controlY, tempX, tempY);
        x = tempX;
        y = tempY;
        break;

      case "Q": // quadraticCurveTo, absolute
        controlX = current[1];
        controlY = current[2];
        bounds = getBoundsOfCurve(x, y, controlX, controlY, controlX, controlY, current[3], current[4]);
        x = current[3];
        y = current[4];
        break;

      case "t": // shorthand quadraticCurveTo, relative
        // transform to absolute x,y
        tempX = x + current[1];
        tempY = y + current[2];
        if (previous[0].match(/[QqTt]/) === null) {
          // If there is no previous command or if the previous command was not a Q, q, T or t,
          // assume the control point is coincident with the current point
          controlX = x;
          controlY = y;
        } else {
          // calculate reflection of previous control point
          controlX = 2 * x - controlX;
          controlY = 2 * y - controlY;
        }

        bounds = getBoundsOfCurve(x, y, controlX, controlY, controlX, controlY, tempX, tempY);
        x = tempX;
        y = tempY;

        break;

      case "T":
        tempX = current[1];
        tempY = current[2];

        if (previous[0].match(/[QqTt]/) === null) {
          // If there is no previous command or if the previous command was not a Q, q, T or t,
          // assume the control point is coincident with the current point
          controlX = x;
          controlY = y;
        } else {
          // calculate reflection of previous control point
          controlX = 2 * x - controlX;
          controlY = 2 * y - controlY;
        }
        bounds = getBoundsOfCurve(x, y, controlX, controlY, controlX, controlY, tempX, tempY);
        x = tempX;
        y = tempY;
        break;

      case "a":
        // TODO: optimize this
        bounds = getBoundsOfArc(x, y, current[1], current[2], current[3], current[4], current[5], current[6] + x, current[7] + y);
        x += current[6];
        y += current[7];
        break;

      case "A":
        // TODO: optimize this
        bounds = getBoundsOfArc(x, y, current[1], current[2], current[3], current[4], current[5], current[6], current[7]);
        x = current[6];
        y = current[7];
        break;

      case "z":
      case "Z":
        x = subpathStartX;
        y = subpathStartY;
        break;
    }
    previous = current;
    bounds.forEach(function (point) {
      aX.push(point.x);
      aY.push(point.y);
    });
    aX.push(x);
    aY.push(y);
  }

  let minX = min(...aX) || 0,
    minY = min(...aY) || 0,
    maxX = max(...aX) || 0,
    maxY = max(...aY) || 0,
    deltaX = maxX - minX,
    deltaY = maxY - minY;

  return {
    left: minX,
    top: minY,
    width: deltaX,
    height: deltaY,
  };
}

/**
 * Calculate bounding box of a elliptic-arc
 * @param {Number} fx start point of arc
 * @param {Number} fy
 * @param {Number} rx horizontal radius
 * @param {Number} ry vertical radius
 * @param {Number} rot angle of horizontal axe
 * @param {Number} large 1 or 0, whatever the arc is the big or the small on the 2 points
 * @param {Number} sweep 1 or 0, 1 clockwise or counterclockwise direction
 * @param {Number} tx end point of arc
 * @param {Number} ty
 */
function getBoundsOfArc(fx, fy, rx, ry, rot, large, sweep, tx, ty) {
  let fromX = 0,
    fromY = 0,
    bound,
    bounds = [],
    segs = arcToSegments(tx - fx, ty - fy, rx, ry, large, sweep, rot);

  for (let i = 0, len = segs.length; i < len; i++) {
    bound = getBoundsOfCurve(fromX, fromY, segs[i][0], segs[i][1], segs[i][2], segs[i][3], segs[i][4], segs[i][5]);
    bounds.push({ x: bound[0].x + fx, y: bound[0].y + fy });
    bounds.push({ x: bound[1].x + fx, y: bound[1].y + fy });
    fromX = segs[i][4];
    fromY = segs[i][5];
  }
  return bounds;
}

/* Adapted from http://dxr.mozilla.org/mozilla-central/source/content/svg/content/src/nsSVGPathDataParser.cpp
 * by Andrea Bogazzi code is under MPL. if you don't have a copy of the license you can take it here
 * http://mozilla.org/MPL/2.0/
 */
function arcToSegments(toX, toY, rx, ry, large, sweep, rotateX) {
  let argsString = Array.prototype.join.call(arguments);
  if (arcToSegmentsCache[argsString]) {
    return arcToSegmentsCache[argsString];
  }

  let PI = Math.PI,
    th = (rotateX * PI) / 180,
    sinTh = sin(th),
    cosTh = cos(th),
    fromX = 0,
    fromY = 0;

  rx = Math.abs(rx);
  ry = Math.abs(ry);

  let px = -cosTh * toX * 0.5 - sinTh * toY * 0.5,
    py = -cosTh * toY * 0.5 + sinTh * toX * 0.5,
    rx2 = rx * rx,
    ry2 = ry * ry,
    py2 = py * py,
    px2 = px * px,
    pl = rx2 * ry2 - rx2 * py2 - ry2 * px2,
    root = 0;

  if (pl < 0) {
    let s = Math.sqrt(1 - pl / (rx2 * ry2));
    rx *= s;
    ry *= s;
  } else {
    root = (large === sweep ? -1.0 : 1.0) * Math.sqrt(pl / (rx2 * py2 + ry2 * px2));
  }

  let cx = (root * rx * py) / ry,
    cy = (-root * ry * px) / rx,
    cx1 = cosTh * cx - sinTh * cy + toX * 0.5,
    cy1 = sinTh * cx + cosTh * cy + toY * 0.5,
    mTheta = calcVectorAngle(1, 0, (px - cx) / rx, (py - cy) / ry),
    dtheta = calcVectorAngle((px - cx) / rx, (py - cy) / ry, (-px - cx) / rx, (-py - cy) / ry);

  if (sweep === 0 && dtheta > 0) {
    dtheta -= 2 * PI;
  } else if (sweep === 1 && dtheta < 0) {
    dtheta += 2 * PI;
  }

  // Convert into cubic bezier segments <= 90deg
  let segments = Math.ceil(Math.abs((dtheta / PI) * 2)),
    result = [],
    mDelta = dtheta / segments,
    mT = ((8 / 3) * Math.sin(mDelta / 4) * Math.sin(mDelta / 4)) / Math.sin(mDelta / 2),
    th3 = mTheta + mDelta;

  for (let i = 0; i < segments; i++) {
    result[i] = segmentToBezier(mTheta, th3, cosTh, sinTh, rx, ry, cx1, cy1, mT, fromX, fromY);
    fromX = result[i][4];
    fromY = result[i][5];
    mTheta = th3;
    th3 += mDelta;
  }
  arcToSegmentsCache[argsString] = result;
  return result;
}

function segmentToBezier(th2, th3, cosTh, sinTh, rx, ry, cx1, cy1, mT, fromX, fromY) {
  let costh2 = cos(th2),
    sinth2 = sin(th2),
    costh3 = cos(th3),
    sinth3 = sin(th3),
    toX = cosTh * rx * costh3 - sinTh * ry * sinth3 + cx1,
    toY = sinTh * rx * costh3 + cosTh * ry * sinth3 + cy1,
    cp1X = fromX + mT * (-cosTh * rx * sinth2 - sinTh * ry * costh2),
    cp1Y = fromY + mT * (-sinTh * rx * sinth2 + cosTh * ry * costh2),
    cp2X = toX + mT * (cosTh * rx * sinth3 + sinTh * ry * costh3),
    cp2Y = toY + mT * (sinTh * rx * sinth3 - cosTh * ry * costh3);

  return [cp1X, cp1Y, cp2X, cp2Y, toX, toY];
}

/*
 * Private
 */
function calcVectorAngle(ux, uy, vx, vy) {
  let ta = Math.atan2(uy, ux),
    tb = Math.atan2(vy, vx);
  if (tb >= ta) {
    return tb - ta;
  } else {
    return 2 * Math.PI - (ta - tb);
  }
}

/**
 * Draws arc
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} fx
 * @param {Number} fy
 * @param {Array} coords
 */
function drawArc(ctx, fx, fy, coords) {
  let rx = coords[0],
    ry = coords[1],
    rot = coords[2],
    large = coords[3],
    sweep = coords[4],
    tx = coords[5],
    ty = coords[6],
    segs = [[], [], [], []],
    segsNorm = arcToSegments(tx - fx, ty - fy, rx, ry, large, sweep, rot);

  for (let i = 0, len = segsNorm.length; i < len; i++) {
    segs[i][0] = segsNorm[i][0] + fx;
    segs[i][1] = segsNorm[i][1] + fy;
    segs[i][2] = segsNorm[i][2] + fx;
    segs[i][3] = segsNorm[i][3] + fy;
    segs[i][4] = segsNorm[i][4] + fx;
    segs[i][5] = segsNorm[i][5] + fy;
    ctx.bezierCurveTo(ctx, ...segs[i]);
  }
}

/**
 * Calculate the cos of an angle, avoiding returning floats for known results
 * @static
 * @memberOf fabric.util
 * @param {Number} angle the angle in radians or in degree
 * @return {Number}
 */
function cos(angle) {
  if (angle === 0) {
    return 1;
  }
  if (angle < 0) {
    // cos(a) = cos(-a)
    angle = -angle;
  }
  let angleSlice = angle / PiBy2;
  switch (angleSlice) {
    case 1:
    case 3:
      return 0;
    case 2:
      return -1;
  }
  return Math.cos(angle);
}

/**
 * Calculate the sin of an angle, avoiding returning floats for known results
 * @static
 * @memberOf fabric.util
 * @param {Number} angle the angle in radians or in degree
 * @return {Number}
 */
function sin(angle) {
  if (angle === 0) {
    return 0;
  }
  let angleSlice = angle / PiBy2,
    sign = 1;
  if (angle < 0) {
    // sin(-a) = -sin(a)
    sign = -1;
  }
  switch (angleSlice) {
    case 1:
      return sign;
    case 2:
      return 0;
    case 3:
      return -sign;
  }
  return Math.sin(angle);
}
