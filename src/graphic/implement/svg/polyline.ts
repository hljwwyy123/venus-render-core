import SVGPolylineGraphicInterface from "../../interface/svg/polyline";
import { ItemType } from "@/item/index";
import { Polyline } from "@/graphic/types/shape";
import { polyPointsArrayToString } from "@/graphic/utils/poly";
import { movePolyPointsArrayByMatrix } from "@/graphic/utils/matrix";
import { getBBoxByRef } from "@/graphic/utils/box";

const SVGPolylineGraphic: SVGPolylineGraphicInterface = {
  type: ItemType.POLYLINE,
  /**
   * 在svg中绘制线段组
   *
   * @param polyline 线段组对象
   * @param dom SVG的dom节点
   * @param zIndex 希望插入的节点顺序
   *
   * @returns void
   */
  draw: function (polyline: Polyline, dom: SVGSVGElement, zIndex?: number): void {
    const { points, fill = "#FFFFFF", strokeWidth = 1, stroke = "#000000", ref, matrix = { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 } } = polyline;
    const tag = ref || document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    tag.setAttribute("points", points);
    tag.setAttribute("transform", `matrix(${matrix.a} ${matrix.b} ${matrix.c} ${matrix.d} ${matrix.e} ${matrix.f})`);
    tag.setStyle("fill", fill);
    tag.setStyle("stroke", stroke);
    tag.setStyle("strokeWidth", `${strokeWidth}`);
    if (!ref) {
      polyline.ref = tag;
      if (zIndex === undefined) {
        dom.appendChild(tag);
      } else {
        const { children } = dom;
        dom.insertBefore(tag, children[zIndex]);
      }
    }
  },
  /**
   * 在svg中擦除线段组
   *
   * @param polyline 线段组对象
   * @param dom SVG的dom节点
   *
   * @returns void
   */
  clear: function (polyline: Polyline, dom: SVGSVGElement): void {
    polyline.ref && dom.removeChild(polyline.ref);
  },
  getBBox: getBBoxByRef,
};

export default SVGPolylineGraphic;
