import BBox from "@/basic/BBox";
import Matrix from "@/basic/Matrix";
import Point from "@/basic/Point";
import Item from "@/item/Item";
import Shape from "@/item/shape/Shape";

export default class TransformManager {
  private items: [];

  private transformOrigin: object;

  private prevMatrix: Matrix;

  private transformMatrix: Matrix;

  private translateMatrix: Matrix;

  private rotateMatrix: Matrix;

  private skewMatrix: Matrix;

  private scaleMatrix: Matrix;

  constructor(items, options = {}) {
    this.items = items || [];
    this.prevMatrix = new Matrix();
    this.translateMatrix = new Matrix();
    this.rotateMatrix = new Matrix();
    this.skewMatrix = new Matrix();
    this.scaleMatrix = new Matrix();
    this.transformOrigin = getCenterOfItems(this.items);
  }

  addItems(items) {
    this.items = this.items.concat(items);
    this.setItems(this.items);
  }

  setItems(items) {
    this.items = items;
    this.transformOrigin = getCenterOfItems(this.items);
  }

  reset() {
    this.transform({ rotate: 0, translateX: 0, translateY: 0 });
    this.translateMatrix.reset();
    this.rotateMatrix.reset();
    this.scaleMatrix.reset();
    this.skewMatrix.reset();
  }

  transform(config = {}) {
    const { rotate, translateX, translateY, scaleX = 1, scaleY = 1, skewX = 0, skewY = 0, apply = true } = config;

    let matrix = (this.transformMatrix = new Matrix());
    if (translateX !== undefined || translateY !== undefined) {
      this.translateMatrix = new Matrix();
      this.translateMatrix.translate(translateX, translateY);
      matrix.multLeft(...this.translateMatrix.toArray());
    }

    if (skewX !== undefined || skewY !== undefined) {
      this.skewMatrix = new Matrix();
      this.skewMatrix.skew(skewX, skewY, this.transformOrigin.x, this.transformOrigin.y);
      matrix.multLeft(...this.skewMatrix.toArray());
    }

    if (scaleX !== undefined || scaleY !== undefined) {
      this.scaleMatrix = new Matrix();
      this.scaleMatrix.scale(scaleX, scaleY, this.transformOrigin.x, this.transformOrigin.y);
      matrix.multLeft(...this.scaleMatrix.toArray());
    }

    if (rotate !== undefined) {
      this.rotateMatrix = new Matrix();
      this.rotateMatrix.rotate(rotate, this.transformOrigin.x, this.transformOrigin.y);
      matrix.multLeft(...this.rotateMatrix.toArray());
    }
    const [a, b, c, d, e, f] = matrix.toArray();
    apply && applyMatrix(this.items, this.prevMatrix.getInverse().multLeft(a, b, c, d, e, f));
    this.prevMatrix = matrix;
  }
}

function getBBoxOfItems(items: Array<Item | Shape>): BBox {
  const bounding = new BBox();
  let points = [];
  items.forEach(item => {
    if (item && item._bounding && !item._bounding.isEmpty()) {
      points.push(...item._bounding.getPoints());
    }
  });
  bounding.updateByPoints(points);
  return bounding;
}

function getCenterOfItems(items: Array<Item | Shape>): Point {
  return getBBoxOfItems(items).cc();
}

function applyMatrix(items: Array<Item | Shape>, matrix: Matrix) {
  items.forEach(item => {
    item.applyMatrix(matrix);
  });
}
