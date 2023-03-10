import OtherGraphicInterface from "@/graphic/interface/general/other";
import { Other } from "@/graphic/types/shape";
import SVGGraphicInterface from "@/graphic/interface/svg/shape";

export default interface SVGOtherGraphicInterface extends OtherGraphicInterface, SVGGraphicInterface {
  /**
   * 在svg中绘制未知节点
   *
   * @param otherObject 未知图形对象
   * @param dom SVG的dom节点
   * @param zIndex 希望插入的节点顺序
   *
   * @returns void
   */
  draw(otherObject: Other, dom: SVGSVGElement, zIndex?: number): void;
  /**
   * 在svg中擦除未知图形
   *
   * @param otherObject 未知图形对象
   * @param dom SVG的dom节点
   *
   * @returns void
   */
  clear(otherObject: Other, dom: SVGSVGElement): void;
}
