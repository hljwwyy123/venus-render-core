import SVGLineGraphicInterface from "../../interface/svg/line";
import { ItemType } from "@/item/index";
import { Line } from "@/graphic/types/shape";
import { getBBoxByRef } from "@/graphic/utils/box";

const SVGLineGraphic: SVGLineGraphicInterface = {
  type: ItemType.LINE,
  /**
   * 在svg中绘制直线
   *
   * @param line 直线对象
   * @param dom SVG的dom节点
   * @param zIndex 希望插入的节点顺序
   *
   * @returns void
   */
  draw: function (line: Line, dom: SVGSVGElement, zIndex?: number): void {
    const { x1 = 0, x2 = 0, y1 = 10, y2 = 10, fill = "#FFFFFF", strokeWidth = 1, stroke = "#000000", ref } = line;
    const tag = ref || document.createElementNS("http://www.w3.org/2000/svg", "line");
    tag.setAttribute("x1", `${x1}`);
    tag.setAttribute("x2", `${x2}`);
    tag.setAttribute("y1", `${y1}`);
    tag.setAttribute("y2", `${y2}`);
    tag.setStyle("fill", fill);
    tag.setStyle("stroke", stroke);
    tag.setStyle("strokeWidth", `${strokeWidth}`);
    if (!ref) {
      line.ref = tag;
      if (zIndex === undefined) {
        dom.appendChild(tag);
      } else {
        const { children } = dom;
        dom.insertBefore(tag, children[zIndex]);
      }
    }
  },
  /**
   * 在svg中擦除直线
   *
   * @param line 直线对象
   * @param dom SVG的dom节点
   *
   * @returns void
   */
  clear: function (line: Line, dom: SVGSVGElement): void {
    line.ref && dom.removeChild(line.ref);
  },
  getBBox: getBBoxByRef,
};

export default SVGLineGraphic;
