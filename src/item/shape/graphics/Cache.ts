import ItemType from "@/item/ItemType";
import Box from "@/item/shape/Box";

export default class Cache extends Box {
  canvas: object;

  constructor(attrs: object) {
    super(attrs, ItemType.CACHE);
  }
}
