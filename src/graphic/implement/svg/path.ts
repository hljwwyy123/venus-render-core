import SVGPathGraphicInterface from "../../interface/svg/path";
import { ItemType } from "@/item/index";
import { Path } from "@/graphic/types/shape";
import { setMatrixForSVGPathElement } from "@/graphic/utils/matrix";
import { getBBoxByRef } from "@/graphic/utils/box";

const SVGPathGraphic: SVGPathGraphicInterface = {
  type: ItemType.PATH,
  /**
   * 在svg中绘制路径
   *
   * @param path 路径对象
   * @param dom SVG的dom节点
   * @param zIndex 希望插入的节点顺序
   *
   * @returns void
   */
  draw: function (path: Path, dom: SVGSVGElement, zIndex?: number): void {
    const { fill = "#FFFFFF", strokeWidth = 1, stroke = "#000000", ref, d, matrix = { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 } } = path;
    if (!d) {
      return console.error("无法绘制d属性为空的路径！");
    }
    const tag = ref || document.createElementNS("http://www.w3.org/2000/svg", "path");
    tag.setAttribute("d", d);
    tag.setStyle("fill", fill);
    tag.setStyle("stroke", stroke);
    tag.setStyle("strokeWidth", `${strokeWidth}`);
    tag.setAttribute("transform", `matrix(${matrix.a} ${matrix.b} ${matrix.c} ${matrix.d} ${matrix.e} ${matrix.f})`);
    // item扩展属性
    if (path.extendsAttr && path.extendsAttr.length) {
      path.extendsAttr.forEach((attr: string) => {
        if (path[attr]) {
          tag.setAttribute(`data-${attr}`, path[attr]);
        }
      });
    }
    if (!ref) {
      path.ref = tag;
      if (zIndex === undefined) {
        dom.appendChild(tag);
      } else {
        const { children } = dom;
        dom.insertBefore(tag, children[zIndex]);
      }
    }
  },
  /**
   * 在svg中擦除路径
   *
   * @param path 路径对象
   * @param dom SVG的dom节点
   *
   * @returns void
   */
  clear: function (path: Path, dom: SVGSVGElement): void {
    path.ref && dom.removeChild(path.ref);
  },
  getBBox: getBBoxByRef,
};

export default SVGPathGraphic;
