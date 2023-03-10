import SVGTextGraphicInterface from "../../interface/svg/text";
import { ItemType } from "@/item/index";
import { Text } from "@/graphic/types/shape";
import { getBBoxByRef } from "@/graphic/utils/box";

const SVGTextGraphic: SVGTextGraphicInterface = {
  type: ItemType.TEXT,
  /**
   * 在svg中绘制文本
   *
   * @param textObject 文本对象
   * @param dom SVG的dom节点
   * @param zIndex 希望插入的节点顺序
   *
   * @returns void
   */
  draw: function (textObject: Text, dom: SVGSVGElement, zIndex?: number): void {
    const {
      x = 0,
      y = 0,
      text = "",
      strokeWidth = 1,
      stroke = "#000000",
      fontSize = 30,
      lineHeight = 1.16,
      ref,
      fill = "#ffffff",
      matrix = { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 },
    } = textObject;
    const tag = ref || document.createElementNS("http://www.w3.org/2000/svg", "text");
    tag.textContent = text;
    tag.setAttribute("x", `${x}`);
    tag.setAttribute("y", `${y}`);
    tag.setAttribute("dominant-baseline", `middle`);
    tag.setAttribute("text-anchor", `middle`);
    tag.setAttribute("transform", `matrix(${matrix.a} ${matrix.b} ${matrix.c} ${matrix.d} ${matrix.e} ${matrix.f})`);
    tag.setStyle("fill", fill);
    // 要随时注意 SVG和CANVAS在画字的时候 x y 代表字的左下角 但用户传进来的x y 希望是左上角
    tag.setStyle("fontSize", `${fontSize}`);
    tag.setStyle("stroke", stroke);
    tag.setStyle("strokeWidth", `${strokeWidth}`);
    tag.setStyle("lineHeight", `${lineHeight}`);
    if (!ref) {
      textObject.ref = tag;
      if (zIndex === undefined) {
        dom.appendChild(tag);
      } else {
        const { children } = dom;
        dom.insertBefore(tag, children[zIndex]);
      }
    }
  },
  /**
   * 在svg中擦除文本
   *
   * @param text 文本对象
   * @param dom SVG的dom节点
   *
   * @returns void
   */
  clear: function (text: Text, dom: SVGSVGElement): void {
    text.ref && dom.removeChild(text.ref);
  },
  getBBox: getBBoxByRef,
};

export default SVGTextGraphic;
