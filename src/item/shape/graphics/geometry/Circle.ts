import Shape from "@/item/shape/Shape";
import ItemType from "@/item/ItemType";
import Matrix from "@/basic/Matrix";

export default class Circle extends Shape {
  cx: number;
  cy: number;
  r: number;

  constructor(attrs: object, type: ItemType = ItemType.CIRCLE) {
    super(attrs, type);
  }

  public updateBBox(): void {
    this._bounding.setBBox(this.cx - this.r, this.cy - this.r, this.r * 2, this.r * 2);
  }

  public applyMatrix(m: Matrix): void {
    const { x: cx, y: cy } = m.applyToPoint(this.cx, this.cy);
    // const {scale} = m.decompose();
    // this.setAttrs({cx, cy, r: this.r * scale.x});
    this.setAttrs({ cx, cy });
  }
}
