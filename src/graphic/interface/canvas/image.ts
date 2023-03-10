import ImageGraphicInterface from "../general/image";
import { Image } from "@/graphic/types/shape";
import CanvasGraphicInterface from "@/graphic/interface/canvas/shape";

export default interface CanvasImageGraphicInterface extends ImageGraphicInterface, CanvasGraphicInterface {
  /**
   * 在canvas中绘制图片
   *
   * @param image 图片对象
   * @param context canvas上下文
   *
   * @returns void
   */
  draw(image: Image, context: CanvasRenderingContext2D): void;
  /**
   * 在canvas中擦除图片
   *
   * @param image 图片对象
   * @param context canvas上下文
   *
   * @returns void
   */
  clear(image: Image, context: CanvasRenderingContext2D): void;
}
