import SVGCircleGraphicInterface from "../../interface/svg/circle";
import { ItemType } from "@/item/index";
import { Circle } from "../../types/shape";
import { qrDecompose } from "@/graphic/utils/matrix";
import { getBBoxByRef } from "@/graphic/utils/box";

const SVGCircleGraphic: SVGCircleGraphicInterface = {
  type: ItemType.CIRCLE,
  /**
   * 在svg中绘制圆形
   *
   * @param circle 圆形对象
   * @param dom SVG的dom节点
   * @param zIndex 希望插入的节点顺序
   *
   * @returns void
   */
  draw: function (circle: Circle, dom: SVGSVGElement, zIndex?: number): void {
    const { r = 100, cx = 200, cy = 200, fill = "#FFFFFF", stroke = "#000000", strokeWidth = 1, matrix = { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 }, ref } = circle;
    const tag = ref || document.createElementNS("http://www.w3.org/2000/svg", "circle");
    tag.setAttribute("cx", `${cx}`);
    tag.setAttribute("cy", `${cy}`);
    tag.setAttribute("r", `${r}`);
    tag.setAttribute("transform", `matrix(${matrix.a} ${matrix.b} ${matrix.c} ${matrix.d} ${matrix.e} ${matrix.f})`);
    tag.setStyle("fill", fill);
    tag.setStyle("stroke", stroke);
    tag.setStyle("strokeWidth", `${strokeWidth}`);
    if (!ref) {
      circle.ref = tag;
      if (zIndex === undefined) {
        dom.appendChild(tag);
      } else {
        const { children } = dom;
        dom.insertBefore(tag, children[zIndex]);
      }
    }
  },
  /**
   * 在svg中擦除圆形
   *
   * @param circle 圆形对象
   * @param dom SVG的dom节点
   *
   * @returns void
   */
  clear: function (circle: Circle, dom: SVGSVGElement): void {
    circle.ref && dom.removeChild(circle.ref);
  },
  getBBox: getBBoxByRef,
};

export default SVGCircleGraphic;
