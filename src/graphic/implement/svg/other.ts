import { ItemType } from "@/item/index";
import SVGOtherGraphicInterface from "@/graphic/interface/svg/other";
import { Other } from "@/graphic/types/shape";
import { getBBoxByRef } from "@/graphic/utils/box";

const SVGOtherGraphic: SVGOtherGraphicInterface = {
  type: ItemType.OTHER,
  /**
   * 在svg中绘制未知节点
   *
   * @param otherObject 未知图形对象
   * @param dom SVG的dom节点
   * @param zIndex 希望插入的节点顺序
   *
   * @returns void
   */
  draw: function (otherObject: Other, dom: SVGSVGElement, zIndex?: number): void {
    const { tagName, ref } = otherObject;
    const tag = ref || document.createElementNS("http://www.w3.org/2000/svg", tagName);
    for (let key in otherObject) {
      if (otherObject.hasOwnProperty(key)) tag.setAttribute(key, otherObject[key]);
    }
    if (!ref) {
      otherObject.ref = tag;
      if (zIndex === undefined) {
        dom.appendChild(tag);
      } else {
        const { children } = dom;
        dom.insertBefore(tag, children[zIndex]);
      }
    }
  },
  /**
   * 在svg中擦除未知图形
   *
   * @param otherObject 未知图形对象
   * @param dom SVG的dom节点
   *
   * @returns void
   */
  clear: function (otherObject: Other, dom: SVGSVGElement): void {
    otherObject.ref && dom.removeChild(otherObject.ref);
  },
  getBBox: getBBoxByRef,
};

export default SVGOtherGraphic;
