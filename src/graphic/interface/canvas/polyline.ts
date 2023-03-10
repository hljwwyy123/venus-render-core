import PolylineGraphicInterface from "../general/polyline";
import { Polyline } from "@/graphic/types/shape";
import CanvasGraphicInterface from "@/graphic/interface/canvas/shape";

export default interface CanvasPolylineGraphicInterface extends PolylineGraphicInterface, CanvasGraphicInterface {
  /**
   * 在canvas中绘制线段组
   *
   * @param polyline 线段组对象
   * @param context canvas上下文
   *
   * @returns void
   */
  draw(polyline: Polyline, context: CanvasRenderingContext2D): void;
  /**
   * 在canvas中擦除线段组
   *
   * @param polyline 线段组对象
   * @param context canvas上下文
   *
   * @returns void
   */
  clear(polyline: Polyline, context: CanvasRenderingContext2D): void;
}
