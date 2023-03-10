import CanvasCacheGraphicInterface from "../../interface/canvas/cache";
import { Cache } from "@/graphic/types/shape";
import { getClearBox } from "@/graphic/utils/box";
import ItemType from "@/item/ItemType";

const CanvasCacheGraphic: CanvasCacheGraphicInterface = {
  type: ItemType.CACHE,

  draw: function (image: Cache, context: CanvasRenderingContext2D): void {
    context.drawImage(image.canvas, image.x, image.y, image.width, image.height);
  },

  clear: function (image: Cache, context: CanvasRenderingContext2D): void {
    const clearBox = getClearBox(image);
    context.clearRect(clearBox.x, clearBox.y, clearBox.width, clearBox.height);
  },

  getClearBox,
};

export default CanvasCacheGraphic;
