import SVGImageGraphicInterface from "../../interface/svg/image";
import { ItemType } from "@/item/index";
import { Image } from "@/graphic/types/shape";
import { getBBoxByRef } from "@/graphic/utils/box";

const SVGImageGraphic: SVGImageGraphicInterface = {
  type: ItemType.IMAGE,
  /**
   * 在svg中绘制图片
   *
   * @param image 图片对象
   * @param dom SVG的dom节点
   * @param zIndex 希望插入的节点顺序
   *
   * @returns void
   */
  draw: function (image: Image, dom: SVGSVGElement, zIndex?: number): void {
    const { x = 0, y = 0, width = 100, height = 100, src, ref, matrix = { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 } } = image;
    if (!src) return console.error("无法绘制src属性为空的图片！");
    const tag = ref || document.createElementNS("http://www.w3.org/2000/svg", "image");
    tag.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", src);
    tag.setAttribute("width", `${width}`);
    tag.setAttribute("height", `${height}`);
    tag.setAttribute("x", `${x}`);
    tag.setAttribute("y", `${y}`);
    tag.setAttribute("transform", `matrix(${matrix.a} ${matrix.b} ${matrix.c} ${matrix.d} ${matrix.e} ${matrix.f})`);
    if (!ref) {
      image.ref = tag;
      if (zIndex === undefined) {
        dom.appendChild(tag);
      } else {
        const { children } = dom;
        dom.insertBefore(tag, children[zIndex]);
      }
    }
  },
  /**
   * 在svg中擦除图片
   *
   * @param image 图片对象
   * @param dom SVG的dom节点
   *
   * @returns void
   */
  clear: function (image: Image, dom: SVGSVGElement): void {
    image.ref && dom.removeChild(image.ref);
  },
  getBBox: getBBoxByRef,
};

export default SVGImageGraphic;
