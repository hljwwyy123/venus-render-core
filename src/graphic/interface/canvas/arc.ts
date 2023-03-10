import CircleGraphicInterface from "../general/circle";
import { Arc } from "@/graphic/types/shape";
import CanvasGraphicInterface from "@/graphic/interface/canvas/shape";

export default interface CanvasArcGraphicInterface extends CircleGraphicInterface, CanvasGraphicInterface {
  /**
   * 在canvas中绘制圆形
   *
   * @param arc 圆形对象
   * @param context canvas上下文
   *
   * @returns void
   */
  draw(arc: Arc, context: CanvasRenderingContext2D): void;
  /**
   * 在canvas中擦除圆形
   *
   * @param arc 圆形对象
   * @param context canvas上下文
   *
   * @returns void
   */
  clear(arc: Arc, context: CanvasRenderingContext2D): void;
}
