import LineGraphicInterface from "../general/line";
import { Line } from "@/graphic/types/shape";
import CanvasGraphicInterface from "@/graphic/interface/canvas/shape";

export default interface CanvasLineGraphicInterface extends LineGraphicInterface, CanvasGraphicInterface {
  /**
   * 在canvas中绘制直线
   *
   * @param line 直线对象
   * @param context canvas上下文
   *
   * @returns void
   */
  draw(line: Line, context: CanvasRenderingContext2D): void;
  /**
   * 在canvas中擦除直线
   *
   * @param line 直线对象
   * @param context canvas上下文
   *
   * @returns void
   */
  clear(line: Line, context: CanvasRenderingContext2D): void;
}
