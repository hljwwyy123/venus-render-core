import ItemType from "@/item/ItemType";
import Circle from "./Circle";

export default class Arc extends Circle {
  start: number;
  end: number;

  constructor(attrs: object) {
    super(attrs, ItemType.ARC);
  }
}
