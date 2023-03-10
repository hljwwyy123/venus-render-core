import CanvasPolylineGraphicInterface from "../../interface/canvas/polyline";
import { ItemType } from "@/item/index";
import { Polyline } from "@/graphic/types/shape";
import { movePolyPointsArrayByMatrix } from "@/graphic/utils/matrix";
import { getClearBox } from "@/graphic/utils/box";

const CanvasPolylineGraphic: CanvasPolylineGraphicInterface = {
  type: ItemType.POLYLINE,
  /**
   * 在canvas中绘制线段组
   *
   * @param polyline 线段组对象
   * @param context canvas上下文
   *
   * @returns void
   */
  draw: function (polyline: Polyline, context: CanvasRenderingContext2D): void {
    const { fill = "#FFFFFF", strokeWidth = 1, stroke = "#000000" } = polyline;
    const formatPoints = movePolyPointsArrayByMatrix(polyline);
    if (formatPoints.length < 2) {
      return console.error("无法绘制点少于2个的线段组！");
    }
    const firstPoint = formatPoints[0];
    context.save();
    context.beginPath();
    context.fillStyle = fill;
    context.lineWidth = strokeWidth;
    context.strokeStyle = stroke;
    context.moveTo(firstPoint.x, firstPoint.y);
    for (let i = 1; i < formatPoints.length; i++) {
      const point = formatPoints[i];
      context.lineTo(point.x, point.y);
    }
    // context.closePath();
    context.stroke();
    context.fill();
    context.restore();
  },
  /**
   * 在canvas中擦除线段组
   *
   * @param polyline 线段组对象
   * @param context canvas上下文
   *
   * @returns void
   */
  clear: function (polyline: Polyline, context: CanvasRenderingContext2D): void {
    const clearBox = getClearBox(polyline);
    context.clearRect(clearBox.x, clearBox.y, clearBox.width, clearBox.height);
  },
  getClearBox,
};

export default CanvasPolylineGraphic;
