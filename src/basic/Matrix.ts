export default class Matrix {
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  f: number;

  constructor(a: number = 1, b: number = 0, c: number = 0, d: number = 1, e: number = 0, f: number = 0) {
    this.a = +a;
    this.b = +b;
    this.c = +c;
    this.d = +d;
    this.e = +e;
    this.f = +f;
  }

  /**
   * reset
   */
  reset() {
    this.a = 1;
    this.b = 0;
    this.c = 0;
    this.d = 1;
    this.e = 0;
    this.f = 0;

    return this;
  }

  /**
   * setTransform
   */
  setTransform(a: number = 1, b: number = 0, c: number = 0, d: number = 1, e: number = 0, f: number = 0) {
    this.a = +a;
    this.b = +b;
    this.c = +c;
    this.d = +d;
    this.e = +e;
    this.f = +f;
    return this;
  }

  /**
   * Adds the given matrix to existing one
   - a (number)
   - b (number)
   - c (number)
   - d (number)
   - e (number)
   - f (number)
   */
  add(a: number, b: number, c: number, d: number, e: number, f: number) {
    const aNew = a * this.a + b * this.c,
      bNew = a * this.b + b * this.d;

    this.e += e * this.a + f * this.c;
    this.f += e * this.b + f * this.d;
    this.c = c * this.a + d * this.c;
    this.d = c * this.b + d * this.d;

    this.a = aNew;
    this.b = bNew;

    return this;
  }

  /**
   * Multiplies a passed affine transform to the left: M * this.
   - a (number)
   - b (number)
   - c (number)
   - d (number)
   - e (number)
   - f (number)
   */
  multLeft(a: number, b: number, c: number, d: number, e: number, f: number) {
    const aNew = a * this.a + c * this.b,
      cNew = a * this.c + c * this.d,
      eNew = a * this.e + c * this.f + e;

    this.b = b * this.a + d * this.b;
    this.d = b * this.c + d * this.d;
    this.f = b * this.e + d * this.f + f;

    this.a = aNew;
    this.c = cNew;
    this.e = eNew;

    return this;
  }

  /**
   * Matrix.clone
   *
   * Returns a copy of the matrix
   */
  clone() {
    return new Matrix(this.a, this.b, this.c, this.d, this.e, this.f);
  }

  /**
   * Matrix.translate
   * Translate the matrix
   - x (number) horizontal offset distance
   - y (number) vertical offset distance
   */
  translate(x: number, y: number) {
    this.e += x * this.a + y * this.c;
    this.f += x * this.b + y * this.d;
    return this;
  }

  /**
   * Scales the matrix
   - x (number) amount to be scaled, with `1` resulting in no change
   - y (number) #optional amount to scale along the vertical axis. (Otherwise `x` applies to both axes.)
   - cx (number) #optional horizontal origin point from which to scale
   - cy (number) #optional vertical origin point from which to scale
   * Default cx, cy is the middle point of the element.
   */
  scale(x: number, y: number, cx: number = undefined, cy: number = undefined) {
    y == null && (y = x);

    (cx || cy) && this.translate(cx, cy);

    this.a *= x;
    this.b *= x;
    this.c *= y;
    this.d *= y;

    (cx || cy) && this.translate(-cx, -cy);

    return this;
  }

  skew(x: number, y: number, cx: number = undefined, cy: number = undefined) {
    y == null && (y = x);

    (cx || cy) && this.translate(cx, cy);

    this.c = Math.tan((x / 180) * Math.PI);
    this.b = Math.tan((y / 180) * Math.PI);

    (cx || cy) && this.translate(-cx, -cy);

    return this;
  }

  flip(axis: string, around: number) {
    if (axis === "x") {
      this.scale(-1, 1, around, 0);
    } else if (axis === "y") {
      this.scale(1, -1, 0, around);
    }
    return this;
  }

  /**
   * Matrix.rotate
   * Rotates the matrix
   - a (number) angle of rotation, in degrees
   - x (number) horizontal origin point from which to rotate
   - y (number) vertical origin point from which to rotate
   */
  rotate(a: number, x: number = undefined, y: number = undefined) {
    a = (a / 180) * Math.PI;
    x = x || 0;
    y = y || 0;

    const cos = +Math.cos(a).toFixed(9),
      sin = +Math.sin(a).toFixed(9);
    this.add(cos, sin, -sin, cos, x, y);

    return this.add(1, 0, 0, 1, -x, -y);
  }

  /**
   * Apply current matrix to x and y point.
   * Returns a point object.
   *
   * @param {number} x - value for x
   * @param {number} y - value for y
   * @returns {{x: number, y: number}} A new transformed point object
   */
  applyToPoint(x: number, y: number) {
    return {
      x: x * this.a + y * this.c + this.e,
      y: x * this.b + y * this.d + this.f,
    };
  }

  /**
   * Apply current matrix to array with point objects or point pairs.
   * Returns a new array with points in the same format as the input array.
   *
   * A point object is an object literal:
   *
   * {x: x, y: y}
   *
   * so an array would contain either:
   *
   * [{x: x1, y: y1}, {x: x2, y: y2}, ... {x: xn, y: yn}]
   *
   *
   * @param {Array} points - array with point objects or pairs
   * @returns {Array} A new array with transformed points
   */
  applyToArray(points) {
    let p;
    const mxPoints = [];
    for (let i = 0; (p = points[i]); i++) {
      p = this.applyToPoint(p.x, p.y);
      mxPoints.push(p);
    }
    return mxPoints;
  }

  // https://github.com/deoxxa/transformation-matrix-js/blob/master/src/matrix.js
  decompose() {
    let me = this,
      a = me.a,
      b = me.b,
      c = me.c,
      d = me.d,
      acos = Math.acos,
      atan = Math.atan,
      sqrt = Math.sqrt,
      pi = Math.PI,
      translate = { x: me.e, y: me.f },
      rotation = 0,
      scale = { x: 1, y: 1 },
      skew = { x: 0, y: 0 },
      determ = a * d - b * c; // determinant(), skip DRY here...

    // Apply the QR-like decomposition.
    if (a || b) {
      const r = sqrt(a * a + b * b);
      rotation = b > 0 ? acos(a / r) : -acos(a / r);
      scale = { x: r, y: determ / r };
      skew.x = atan((a * c + b * d) / (r * r));
    } else if (c || d) {
      const s = sqrt(c * c + d * d);
      rotation = pi * 0.5 - (d > 0 ? acos(-c / s) : -acos(c / s));
      scale = { x: determ / s, y: s };
      skew.y = atan((a * c + b * d) / (s * s));
    } else {
      // a = b = c = d = 0
      scale = { x: 0, y: 0 }; // = invalid matrix
    }

    return {
      scale: scale,
      translate: translate,
      rotation: (rotation * 180) / pi,
      skew: skew,
    };
  }

  /**
   * Compares current matrix with another matrix. Returns true if equal
   * (within epsilon tolerance).
   * @param {Transform} m - matrix to compare this matrix with
   * @returns {boolean}
   */
  isEqual(m: Matrix) {
    const me = this,
      q = me._q;

    return q(me.a, m.a) && q(me.b, m.b) && q(me.c, m.c) && q(me.d, m.d) && q(me.e, m.e) && q(me.f, m.f);
  }

  _q(f1, f2) {
    return Math.abs(f1 - f2) < 1e-14;
  }

  /**
   * Returns an array with current matrix values.
   * @returns {Array}
   */
  toArray() {
    const me = this;
    return [me.a, me.b, me.c, me.d, me.e, me.f];
  }

  getInverse() {
    let a = this.a,
      b = this.b,
      c = this.c,
      d = this.d,
      e = this.e,
      f = this.f,
      m = new Matrix(),
      dt = a * d - b * c;

    m.a = d / dt;
    m.b = -b / dt;
    m.c = -c / dt;
    m.d = a / dt;
    m.e = (c * f - d * e) / dt;
    m.f = -(a * f - b * e) / dt;

    return m;
  }
}
