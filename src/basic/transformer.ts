import Item from "@/item/Item";
import Shape from "@/item/shape/Shape";
import Matrix from "./Matrix";
import Point from "./Point";
import BBox from "./BBox";

export function translateItems(items: Array<Item | Shape>, x: number, y: number) {
  const matrix = new Matrix();
  matrix.translate(x, y);
  applyMatrix(items, matrix);
}

export function scaleItems(items: Array<Item | Shape>, x: number, y: number) {
  const center = centerItems(items);
  const matrix = new Matrix();

  matrix.scale(x, y, center.x, center.y);

  applyMatrix(items, matrix);
}

export function rotateItems(items: Array<Item | Shape>, a: number) {
  const center = centerItems(items);
  const matrix = new Matrix();

  matrix.rotate(a, center.x, center.y);

  applyMatrix(items, matrix);
}

function centerItems(items: Array<Item | Shape>): Point {
  const bounding = new BBox();
  const points = [];
  items.forEach(item => points.push(...item._bounding.getPoints()));
  bounding.updateByPoints(points);

  return bounding.cc();
}

function applyMatrix(items: Array<Item | Shape>, matrix: Matrix) {
  items.forEach(item => {
    item.applyMatrix(matrix);
  });
}

function q(f1, f2) {
  return Math.abs(f1 - f2) < 1e-6;
}

export default class Transformer {
  matrix: Matrix;

  constructor() {
    this.matrix = new Matrix();
  }

  public transform(items: Array<Item | Shape>, matrix: Matrix) {
    const { scale, translate, rotation } = matrix.decompose();
    const { scale: s, translate: t, rotation: r } = this.matrix.decompose();

    if (!q(scale.x, 1) && !q(scale.y, 1)) {
      scaleItems(items, scale.x / s.x, scale.y / s.y);
    }

    if (!q(rotation, 0)) {
      rotateItems(items, rotation - r);
    }

    if (!q(translate.x, 0) && !q(translate.y, 0)) {
      translateItems(items, translate.x - t.x, translate.y - t.y);
    }

    this.matrix.setTransform(...matrix.toArray());
  }
}
