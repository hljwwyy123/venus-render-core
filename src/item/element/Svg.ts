import Matrix from "@/basic/Matrix";
import ItemType from "@/item/ItemType";
import Item from "@/item/Item";

export default class Svg extends Item {
  public updateBBox() {
    throw new Error("Method not implemented.");
  }
  public applyMatrix(m: Matrix): void {
    throw new Error("Method not implemented.");
  }
  constructor(attrs: object) {
    super(attrs, ItemType.SVG);
    this.setAttrs(attrs);
  }
}
