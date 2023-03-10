import SVGRectGraphicInterface from "../../interface/svg/rect";
import { ItemType } from "@/item/index";
import { Rect } from "@/graphic/types/shape";
import { setMatrixForSVGGraphicElementLikeRect } from "@/graphic/utils/matrix";
import { getBBoxByRef } from "@/graphic/utils/box";

const SVGRectGraphic: SVGRectGraphicInterface = {
  type: ItemType.RECT,
  /**
   * 在svg中绘制矩形
   *
   * @param rect 矩形对象
   * @param dom SVG的dom节点
   * @param zIndex 希望插入的节点顺序
   *
   * @returns void
   */
  draw: function (rect: Rect, dom: SVGSVGElement, zIndex?: number): void {
    const {
      x = 0,
      y = 0,
      width = 100,
      height = 100,
      rx = 0,
      ry = 0,
      fill = "#FFFFFF",
      strokeWidth = 1,
      stroke = "#000000",
      ref,
      matrix = { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 },
    } = rect;
    const tag = ref || document.createElementNS("http://www.w3.org/2000/svg", "rect");
    tag.setAttribute("x", `${x}`);
    tag.setAttribute("y", `${y}`);
    tag.setAttribute("rx", `${rx}`);
    tag.setAttribute("ry", `${ry}`);
    tag.setAttribute("width", `${width}`);
    tag.setAttribute("height", `${height}`);
    tag.setAttribute("transform", `matrix(${matrix.a} ${matrix.b} ${matrix.c} ${matrix.d} ${matrix.e} ${matrix.f})`);
    tag.setStyle("fill", fill);
    tag.setStyle("stroke", stroke);
    tag.setStyle("strokeWidth", `${strokeWidth}`);
    // item扩展属性
    if (rect.extendsAttr && rect.extendsAttr.length) {
      rect.extendsAttr.forEach((attr: string) => {
        if (rect[attr]) {
          tag.setAttribute(`data-${attr}`, rect[attr]);
        }
      });
    }

    if (!ref) {
      rect.ref = tag;
      if (zIndex === undefined) {
        dom.appendChild(tag);
      } else {
        const { children } = dom;
        dom.insertBefore(tag, children[zIndex]);
      }
    }
  },
  /**
   * 在svg中擦除矩形
   *
   * @param rect 矩形对象
   * @param dom SVG的dom节点
   *
   * @returns void
   */
  clear: function (rect: Rect, dom: SVGSVGElement): void {
    rect.ref && dom.removeChild(rect.ref);
  },
  getBBox: getBBoxByRef,
};

export default SVGRectGraphic;
