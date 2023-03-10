import CanvasCircleGraphicInterface from "../../interface/canvas/circle";
import { ItemType } from "@/item/index";
import { Circle } from "../../types/shape";
import { getClearBox } from "@/graphic/utils/box";
import { qrDecompose } from "@/graphic/utils/matrix";

const CanvasCircleGraphic: CanvasCircleGraphicInterface = {
  type: ItemType.CIRCLE,
  /**
   * 在canvas中绘制圆形
   *
   * @param circle 圆形对象
   * @param context canvas上下文
   *
   * @returns void
   */
  draw: function (circle: Circle, context: CanvasRenderingContext2D): void {
    const { r = 100, cx = 200, cy = 200, fill = "#FFFFFF", stroke = "#000000", strokeWidth = 1, matrix = { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 } } = circle;
    const { translateX, translateY, scaleX, scaleY } = qrDecompose(matrix);
    context.save();
    context.beginPath();
    context.fillStyle = fill;
    context.lineWidth = strokeWidth;
    context.strokeStyle = stroke;
    context.arc(cx - r + translateX + r * scaleX, cy - r + translateY + r * scaleX, r * scaleX, 0, Math.PI * 2, true);
    context.stroke();
    context.fill();
    context.restore();
  },
  /**
   * 在canvas中擦除圆形
   *
   * @param circle 圆形对象
   * @param context canvas上下文
   *
   * @returns void
   */
  clear: function (circle: Circle, context: CanvasRenderingContext2D): void {
    const clearBox = getClearBox(circle);
    context.clearRect(clearBox.x, clearBox.y, clearBox.width, clearBox.height);
  },
  getClearBox,
};

export default CanvasCircleGraphic;
