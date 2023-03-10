import CircleGraphicInterface from "../general/circle";
import { Circle } from "@/graphic/types/shape";
import CanvasGraphicInterface from "@/graphic/interface/canvas/shape";

export default interface CanvasCircleGraphicInterface extends CircleGraphicInterface, CanvasGraphicInterface {
  /**
   * 在canvas中绘制圆形
   *
   * @param circle 圆形对象
   * @param context canvas上下文
   *
   * @returns void
   */
  draw(circle: Circle, context: CanvasRenderingContext2D): void;
  /**
   * 在canvas中擦除圆形
   *
   * @param circle 圆形对象
   * @param context canvas上下文
   *
   * @returns void
   */
  clear(circle: Circle, context: CanvasRenderingContext2D): void;
}
