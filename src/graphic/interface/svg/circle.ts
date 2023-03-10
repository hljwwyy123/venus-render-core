import CircleGraphicInterface from "../general/circle";
import { Circle } from "@/graphic/types/shape";
import SVGGraphicInterface from "@/graphic/interface/svg/shape";

export default interface SVGCircleGraphicInterface extends CircleGraphicInterface, SVGGraphicInterface {
  /**
   * 在svg中绘制圆形
   *
   * @param circle 圆形对象
   * @param dom SVG的dom节点
   * @param zIndex 希望插入的节点顺序
   *
   * @returns void
   */
  draw(circle: Circle, dom: SVGSVGElement, zIndex?: number): void;
  /**
   * 在svg中擦除圆形
   *
   * @param circle 圆形对象
   * @param dom SVG的dom节点
   *
   * @returns void
   */
  clear(circle: Circle, dom: SVGSVGElement): void;
}
