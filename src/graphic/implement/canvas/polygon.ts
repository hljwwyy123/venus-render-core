import CanvasPolygonGraphicInterface from "../../interface/canvas/polygon";
import { ItemType } from "@/item/index";
import { Polygon } from "@/graphic/types/shape";
import { movePolyPointsArrayByMatrix } from "@/graphic/utils/matrix";
import { getClearBox } from "@/graphic/utils/box";

const CanvasPolygonGraphic: CanvasPolygonGraphicInterface = {
  type: ItemType.POLYGON,
  /**
   * 在canvas中绘制多边形
   *
   * @param polygon 多边形对象
   * @param context canvas上下文
   *
   * @returns void
   */
  draw: function (polygon: Polygon, context: CanvasRenderingContext2D): void {
    const { fill = "#FFFFFF", strokeWidth = 1, stroke = "#000000" } = polygon;
    const formatPoints = movePolyPointsArrayByMatrix(polygon);
    if (formatPoints.length < 2) {
      return console.error("无法绘制点少于2个的多边形！");
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
    context.closePath();
    context.stroke();
    context.fill();
    context.restore();
  },
  /**
   * 在canvas中擦除多边形
   *
   * @param polygon 多边形对象
   * @param context canvas上下文
   *
   * @returns void
   */
  clear: function (polygon: Polygon, context: CanvasRenderingContext2D): void {
    const clearBox = getClearBox(polygon);
    context.clearRect(clearBox.x, clearBox.y, clearBox.width, clearBox.height);
  },
  getClearBox,
};

export default CanvasPolygonGraphic;
