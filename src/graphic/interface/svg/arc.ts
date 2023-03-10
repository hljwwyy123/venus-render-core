import ArcGraphicInterface from "../general/arc";
import { Arc } from "@/graphic/types/shape";
import SVGGraphicInterface from "@/graphic/interface/svg/shape";

export default interface SVGArcGraphicInterface extends ArcGraphicInterface, SVGGraphicInterface {
  /**
   * 在svg中绘制圆形
   *
   * @param arc 圆形对象
   * @param dom SVG的dom节点
   * @param zIndex 希望插入的节点顺序
   *
   * @returns void
   */
  draw(arc: Arc, dom: SVGSVGElement, zIndex?: number): void;
  /**
   * 在svg中擦除圆形
   *
   * @param arc 圆形对象
   * @param dom SVG的dom节点
   *
   * @returns void
   */
  clear(arc: Arc, dom: SVGSVGElement): void;
}
