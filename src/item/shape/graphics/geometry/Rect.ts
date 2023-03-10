import ItemType from "@/item/ItemType";
import Box from "@/item/shape/Box";

export default class Rect extends Box {
  constructor(attrs: object) {
    super(attrs, ItemType.RECT);
  }
}
