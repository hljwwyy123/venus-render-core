import Shape from "@/item/shape/Shape";
import ItemType from "@/item/ItemType";
import Matrix from "@/basic/Matrix";

export default class Line extends Shape {
  x1: number;
  y1: number;
  x2: number;
  y2: number;

  constructor(attrs: object) {
    super(attrs, ItemType.LINE);
  }

  public updateBBox(): void {
    this._bounding.updateByPoints([
      { x: this.x1, y: this.y1 },
      { x: this.x2, y: this.y2 },
    ]);
  }

  public applyMatrix(matrix: Matrix): void {
    const array = matrix.applyToArray([
      { x: this.x1, y: this.y1 },
      { x: this.x2, y: this.y2 },
    ]);
    this.setAttrs({ x1: array[0].x, y1: array[0].y, x2: array[1].x, y2: array[1].y });
  }
}
