import ItemType from "@/item/ItemType";
import isPointInPolygon from "@/util/pointInPolygon";
import Poly, { toArrayPoints } from "@/item/shape/Poly";

export default class Polygon extends Poly {
  constructor(attrs: object) {
    super(attrs, ItemType.POLYGON);
  }

  public isPointInside(x: number, y: number): boolean {
    if (!super.isPointInside(x, y)) return false;
    return isPointInPolygon(toArrayPoints(this.points), { x, y });
  }
}
