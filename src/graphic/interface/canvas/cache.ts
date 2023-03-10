import { Cache } from "@/graphic/types/shape";
import CanvasGraphicInterface from "@/graphic/interface/canvas/shape";
import CacheGraphicInterface from "@/graphic/interface/general/cache";

export default interface CanvasCacheGraphicInterface extends CacheGraphicInterface, CanvasGraphicInterface {
  /**
   * 在canvas中绘制图片
   *
   * @param image 图片对象
   * @param context canvas上下文
   *
   * @returns void
   */
  draw(image: Cache, context: CanvasRenderingContext2D): void;
  /**
   * 在canvas中擦除图片
   *
   * @param image 图片对象
   * @param context canvas上下文
   *
   * @returns void
   */
  clear(image: Cache, context: CanvasRenderingContext2D): void;
}
