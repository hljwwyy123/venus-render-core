import RectGraphicInterface from "../general/rect";
import { Rect } from "@/graphic/types/shape";
import SVGGraphicInterface from "@/graphic/interface/svg/shape";

export default interface SVGRectGraphicInterface extends RectGraphicInterface, SVGGraphicInterface {
  /**
   * 在svg中绘制矩形
   *
   * @param rect 矩形对象
   * @param dom SVG的dom节点
   * @param zIndex 希望插入的节点顺序
   *
   * @returns void
   */
  draw(rect: Rect, dom: SVGSVGElement, zIndex?: number): void;
  /**
   * 在svg中擦除矩形
   *
   * @param rect 矩形对象
   * @param dom SVG的dom节点
   *
   * @returns void
   */
  clear(rect: Rect, dom: SVGSVGElement): void;
}
