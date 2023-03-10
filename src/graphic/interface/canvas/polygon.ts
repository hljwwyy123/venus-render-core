import PolygonGraphicInterface from "../general/polygon";
import { Polygon } from "@/graphic/types/shape";
import CanvasGraphicInterface from "@/graphic/interface/canvas/shape";

export default interface CanvasPolygonGraphicInterface extends PolygonGraphicInterface, CanvasGraphicInterface {
  /**
   * 在canvas中绘制多边形
   *
   * @param polygon 多边形对象
   * @param context canvas上下文
   *
   * @returns void
   */
  draw(polygon: Polygon, context: CanvasRenderingContext2D): void;
  /**
   * 在canvas中擦除多边形
   *
   * @param polygon 多边形对象
   * @param context canvas上下文
   *
   * @returns void
   */
  clear(polygon: Polygon, context: CanvasRenderingContext2D): void;
}
