import ItemType from "@/item/ItemType";
import Shape from "@/item/shape/Shape";
import Matrix from "@/basic/Matrix";

export default class Other extends Shape {
  tagName: string;

  constructor(tagName: string, attrs: object) {
    super(attrs, ItemType.OTHER);
    this.tagName = tagName;
  }

  applyMatrix(m: Matrix): void {}

  updateBBox() {}
}
