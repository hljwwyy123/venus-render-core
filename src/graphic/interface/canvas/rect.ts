import RectGraphicInterface from "../general/rect";
import { Rect } from "@/graphic/types/shape";
import CanvasGraphicInterface from "@/graphic/interface/canvas/shape";

export default interface CanvasRectGraphicInterface extends RectGraphicInterface, CanvasGraphicInterface {
  /**
   * 在canvas中绘制矩形
   *
   * @param rect 矩形对象
   * @param context canvas上下文
   *
   * @returns void
   */
  draw(rect: Rect, context: CanvasRenderingContext2D): void;
  /**
   * 在canvas中擦除矩形
   *
   * @param rect 矩形对象
   * @param context canvas上下文
   *
   * @returns void
   */
  clear(rect: Rect, context: CanvasRenderingContext2D): void;
}
