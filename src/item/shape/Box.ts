import Shape from "@/item/shape/Shape";
import Matrix from "@/basic/Matrix";

export default class Box extends Shape {
  x: number;
  y: number;
  width: number;
  height: number;

  public updateBBox(): void {
    this._bounding.setBBox(this.x, this.y, this.width, this.height);
  }

  public applyMatrix(matrix: Matrix): void {
    const { x, y } = matrix.applyToPoint(this.x, this.y);
    const { scale } = matrix.decompose();
    this.setAttrs({ x, y, width: this.width * scale.x, height: this.height * scale.y });
  }
}
