import Shape from "@/item/shape/Shape";
import Item from "@/item/Item";

export default interface IRender {
  render(): Item | Shape | Array<Item | Shape>;
}
