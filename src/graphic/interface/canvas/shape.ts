import { Box } from "@/graphic/types/util";
import { Shape } from "@/graphic/types/shape";

export default interface CanvasGraphicInterface {
  /**
   * 获取在canvas中图形的擦除矩形对象
   *
   *
   * @returns 擦除矩形对象
   * @param shape 擦除图形对象
   */
  getClearBox(shape: Shape): Box;
}
