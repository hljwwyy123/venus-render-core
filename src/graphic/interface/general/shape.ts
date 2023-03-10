import { ItemType } from "@/item/index";
import { Shape } from "@/graphic/types/shape";

export default interface ShapeGraphicInterface {
  type: ItemType;

  draw(shape: Shape, container: object, zIndex?: number): void;

  clear(shape: Shape, container: object): void;
}
