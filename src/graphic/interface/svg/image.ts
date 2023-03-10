import ImageGraphicInterface from "../general/image";
import { Image } from "@/graphic/types/shape";
import SVGGraphicInterface from "@/graphic/interface/svg/shape";

export default interface SVGImageGraphicInterface extends ImageGraphicInterface, SVGGraphicInterface {
  /**
   * 在svg中绘制图片
   *
   * @param image 图片对象
   * @param dom SVG的dom节点
   * @param zIndex 希望插入的节点顺序
   *
   * @returns void
   */
  draw(image: Image, dom: SVGSVGElement, zIndex?: number): void;
  /**
   * 在svg中擦除图片
   *
   * @param image 图片对象
   * @param dom SVG的dom节点
   *
   * @returns void
   */
  clear(image: Image, dom: SVGSVGElement): void;
}
