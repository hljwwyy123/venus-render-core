import TextGraphicInterface from "../general/text";
import { Text } from "@/graphic/types/shape";
import SVGGraphicInterface from "@/graphic/interface/svg/shape";

export default interface SVGTextGraphicInterface extends TextGraphicInterface, SVGGraphicInterface {
  /**
   * 在svg中绘制文本
   *
   * @param text 文本对象
   * @param dom SVG的dom节点
   * @param zIndex 希望插入的节点顺序
   *
   * @returns void
   */
  draw(text: Text, dom: SVGSVGElement, zIndex?: number): void;
  /**
   * 在svg中擦除文本
   *
   * @param text 文本对象
   * @param dom SVG的dom节点
   *
   * @returns void
   */
  clear(text: Text, dom: SVGSVGElement): void;
}
