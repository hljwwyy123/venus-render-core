import ItemType from "@/item/ItemType";
import Shape from "@/item/shape/Shape";
import calcPathString from "@/basic/fabric";
import { pointInSvgPath } from "@/util/pointInSvgPath";

import Matrix from "@/basic/Matrix";

export default class Path extends Shape {
  d: string;

  constructor(attrs: object) {
    super(attrs, ItemType.PATH);
  }

  public updateBBox(): void {
    const { left, top, width, height } = calcPathString(this.d);
    this._bounding.setBBox(left, top, width, height);
  }

  public applyMatrix(m: Matrix): void {
    // TODO
  }

  public isPointInside(x: number, y: number): boolean {
    return pointInSvgPath(this.d, x, y);
  }
}
