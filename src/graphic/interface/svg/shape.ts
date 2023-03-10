import { Shape } from "@/graphic/types/shape";

export default interface SVGGraphicInterface {
  /**
   * 利用ref中的dom对象获取图形的bounding box对象
   *
   *
   * @returns bounding box对象
   * @param shape 图形对象
   */
  getBBox(shape: Shape): SVGRect;
}
