import Item from "@/item/Item";
import ItemType from "@/item/ItemType";

export default abstract class Shape extends Item {
  constructor(attrs: object, type: ItemType) {
    super(attrs, type);
    this.setAttrs(attrs);
  }

  public setAttrs(attrs: object, deleted: object = {}) {
    super.setAttrs(attrs, deleted);
    this.updateBBox();
  }
}
