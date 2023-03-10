import ItemType from "@/item/ItemType";
import Box from "@/item/shape/Box";

export default class Image extends Box {
  src: string;

  constructor(attrs: object) {
    super(attrs, ItemType.IMAGE);
  }
}
