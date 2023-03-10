import PolylineGraphicInterface from "../general/polyline";
import { Polyline } from "@/graphic/types/shape";
import SVGGraphicInterface from "@/graphic/interface/svg/shape";

export default interface SVGPolylineGraphicInterface extends PolylineGraphicInterface, SVGGraphicInterface {
  /**
   * 在svg中绘制线段组
   *
   * @param polyline 线段组对象
   * @param dom SVG的dom节点
   * @param zIndex 希望插入的节点顺序
   *
   * @returns void
   */
  draw(polyline: Polyline, dom: SVGSVGElement, zIndex?: number): void;
  /**
   * 在svg中擦除线段组
   *
   * @param polyline 线段组对象
   * @param dom SVG的dom节点
   *
   * @returns void
   */
  clear(polyline: Polyline, dom: SVGSVGElement): void;
}
