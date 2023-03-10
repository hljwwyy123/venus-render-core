import ItemType from "@/item/ItemType";
import Poly from "@/item/shape/Poly";

export default class Polyline extends Poly {
  constructor(attrs: object) {
    super(attrs, ItemType.POLYLINE);
  }
}
