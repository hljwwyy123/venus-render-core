import SVGPolygonGraphicInterface from "../../interface/svg/polygon";
import { ItemType } from "@/item/index";
import { Polygon } from "@/graphic/types/shape";
import { polyPointsArrayToString } from "@/graphic/utils/poly";
import { movePolyPointsArrayByMatrix } from "@/graphic/utils/matrix";
import { getBBoxByRef } from "@/graphic/utils/box";

const SVGPolygonGraphic: SVGPolygonGraphicInterface = {
  type: ItemType.POLYGON,
  /**
   * 在svg中绘制多边形
   *
   * @param polygon 多边形对象
   * @param dom SVG的dom节点
   * @param zIndex 希望插入的节点顺序
   *
   * @returns void
   */
  draw: function (polygon: Polygon, dom: SVGSVGElement, zIndex?: number): void {
    const { points, fill = "#FFFFFF", strokeWidth = 1, stroke = "#000000", ref, matrix = { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 } } = polygon;
    const tag = ref || document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    tag.setAttribute("points", points);
    tag.setStyle("fill", fill);
    tag.setStyle("stroke", stroke);
    tag.setStyle("strokeWidth", `${strokeWidth}`);
    tag.setAttribute("transform", `matrix(${matrix.a} ${matrix.b} ${matrix.c} ${matrix.d} ${matrix.e} ${matrix.f})`);
    // item扩展属性
    if (polygon.extendsAttr && polygon.extendsAttr.length) {
      polygon.extendsAttr.forEach((attr: string) => {
        if (polygon[attr]) {
          tag.setAttribute(`data-${attr}`, polygon[attr]);
        }
      });
    }

    if (!ref) {
      polygon.ref = tag;
      if (zIndex === undefined) {
        dom.appendChild(tag);
      } else {
        const { children } = dom;
        dom.insertBefore(tag, children[zIndex]);
      }
    }
  },
  /**
   * 在svg中擦除多边形
   *
   * @param polygon 多边形对象
   * @param dom SVG的dom节点
   *
   * @returns void
   */
  clear: function (polygon: Polygon, dom: SVGSVGElement): void {
    polygon.ref && dom.removeChild(polygon.ref);
  },
  getBBox: getBBoxByRef,
};

export default SVGPolygonGraphic;
