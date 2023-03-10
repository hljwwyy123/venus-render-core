import PathGraphicInterface from "../general/path";
import { Path } from "@/graphic/types/shape";
import CanvasGraphicInterface from "@/graphic/interface/canvas/shape";

export default interface CanvasPathGraphicInterface extends PathGraphicInterface, CanvasGraphicInterface {
  /**
   * 在canvas中绘制路径
   *
   * @param path 路径对象
   * @param context canvas上下文
   *
   * @returns void
   */
  draw(path: Path, context: CanvasRenderingContext2D): void;
  /**
   * 在canvas中擦除路径
   *
   * @param path 路径对象
   * @param context canvas上下文
   *
   * @returns void
   */
  clear(path: Path, context: CanvasRenderingContext2D): void;
}
