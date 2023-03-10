import Item from "@/item/Item";
import ItemType from "@/item/ItemType";

export default abstract class HtmlItem extends Item {
  tagName: string;
  props: object;

  protected constructor(tagName: string, props: object) {
    super(props, ItemType.HTML);
    this.tagName = tagName;
    this.props = props;
  }
}
