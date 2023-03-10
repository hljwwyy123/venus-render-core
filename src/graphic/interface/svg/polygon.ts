import PolygonGraphicInterface from "../general/polygon";
import { Polygon } from "@/graphic/types/shape";
import SVGGraphicInterface from "@/graphic/interface/svg/shape";

export default interface SVGPolygonGraphicInterface extends PolygonGraphicInterface, SVGGraphicInterface {
  /**
   * 在svg中绘制多边形
   *
   * @param polygon 多边形对象
   * @param dom SVG的dom节点
   * @param zIndex 希望插入的节点顺序
   *
   * @returns void
   */
  draw(polygon: Polygon, dom: SVGSVGElement, zIndex?: number): void;
  /**
   * 在svg中擦除多边形
   *
   * @param polygon 多边形对象
   * @param dom SVG的dom节点
   *
   * @returns void
   */
  clear(polygon: Polygon, dom: SVGSVGElement): void;
}
