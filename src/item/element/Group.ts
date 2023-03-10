import IRender from "@/item/element/IRender";
import Item from "@/item/Item";
import ItemType from "@/item/ItemType";
import Shape from "@/item/shape/Shape";

export default abstract class Group extends Item implements IRender {
  public readonly _children: Array<Shape | Item>;
  public readonly _childrenAttrs: Array<object>;

  constructor(attrs: object) {
    super(attrs, ItemType.GROUP);

    this._children = new Array<Shape | Item>();
    this._childrenAttrs = new Array<object>();

    this.setAttrs(attrs);
    this.updateBBox();
  }

  render(): Item | Shape | (Item | Shape)[] {
    return this._children;
  }

  public updateBBox(): void {
    let points = [];
    this._children.forEach(child => points.push(...child._bounding.getPoints()));
    this._bounding.updateByPoints(points);
  }
}
