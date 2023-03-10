import TextGraphicInterface from "../general/text";
import { Text } from "@/graphic/types/shape";
import CanvasGraphicInterface from "@/graphic/interface/canvas/shape";

export default interface CanvasTextGraphicInterface extends TextGraphicInterface, CanvasGraphicInterface {
  /**
   * 在canvas中绘制文本
   *
   * @param text 文本对象
   * @param context canvas上下文
   *
   * @returns void
   */
  draw(text: Text, context: CanvasRenderingContext2D): void;
  /**
   * 在canvas中擦除文本
   *
   * @param text 文本对象
   * @param context canvas上下文
   *
   * @returns void
   */
  clear(text: Text, context: CanvasRenderingContext2D): void;
}
