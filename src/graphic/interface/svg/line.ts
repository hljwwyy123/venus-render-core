import LineGraphicInterface from "../general/line";
import { Line } from "@/graphic/types/shape";
import SVGGraphicInterface from "@/graphic/interface/svg/shape";

export default interface SVGLineGraphicInterface extends LineGraphicInterface, SVGGraphicInterface {
  /**
   * 在svg中绘制直线
   *
   * @param line 直线对象
   * @param dom SVG的dom节点
   * @param zIndex 希望插入的节点顺序
   *
   * @returns void
   */
  draw(line: Line, dom: SVGSVGElement, zIndex?: number): void;
  /**
   * 在svg中擦除直线
   *
   * @param line 直线对象
   * @param dom SVG的dom节点
   *
   * @returns void
   */
  clear(line: Line, dom: SVGSVGElement): void;
}
