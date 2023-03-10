import PathGraphicInterface from "../general/path";
import { Path } from "@/graphic/types/shape";
import SVGGraphicInterface from "@/graphic/interface/svg/shape";

export default interface SVGPathGraphicInterface extends PathGraphicInterface, SVGGraphicInterface {
  /**
   * 在svg中绘制路径
   *
   * @param path 路径对象
   * @param dom SVG的dom节点
   * @param zIndex 希望插入的节点顺序
   *
   * @returns void
   */
  draw(path: Path, dom: SVGSVGElement, zIndex?: number): void;
  /**
   * 在svg中擦除路径
   *
   * @param path 路径对象
   * @param dom SVG的dom节点
   *
   * @returns void
   */
  clear(path: Path, dom: SVGSVGElement): void;
}
