import Shape from "@/item/shape/Shape";
import ItemType from "@/item/ItemType";
import Matrix from "@/basic/Matrix";

export default class Text extends Shape {
  x: number;
  y: number;
  text: string;

  constructor(attrs: object) {
    super(attrs, ItemType.TEXT);
  }

  // 7 * 14 处理
  public updateBBox() {
    const { width, height } = { width: 7, height: 14 };
    this._bounding.setBBox(this.x, this.y, width * this.text.length * 1.5, height * 1.5);
  }

  public applyMatrix(matrix: Matrix): void {
    const { x, y } = matrix.applyToPoint(this.x, this.y);
    this.setAttrs({ x, y });
  }
}
