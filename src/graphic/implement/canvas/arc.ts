import CanvasArcGraphicInterface from "../../interface/canvas/arc";
import { ItemType } from "@/item/index";
import { Arc } from "../../types/shape";
import { getClearBox } from "@/graphic/utils/box";
import { qrDecompose } from "@/graphic/utils/matrix";

const CanvasArcGraphic: CanvasArcGraphicInterface = {
  type: ItemType.ARC,
  /**
   * 在canvas中绘制圆形
   *
   * @param arc 圆形对象
   * @param context canvas上下文
   *
   * @returns void
   */
  draw: function (arc: Arc, context: CanvasRenderingContext2D): void {
    const {
      r = 100,
      cx = 200,
      cy = 200,
      fill = "#FFFFFF",
      stroke = "#000000",
      strokeWidth = 1,
      matrix = { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 },
      startAngle = 0,
      endAngle = -Math.PI / 2,
    } = arc;
    const { translateX, translateY, scaleX, scaleY } = qrDecompose(matrix);
    const ccx = cx - r + translateX + r * scaleX;
    const ccy = cy - r + translateY + r * scaleX;
    context.save();
    context.beginPath();
    context.lineCap = "square";
    context.lineWidth = strokeWidth;
    context.fillStyle = fill;
    context.strokeStyle = stroke;
    context.arc(ccx, ccy, r * scaleX, startAngle, endAngle);
    context.lineTo(ccx, ccy);
    context.closePath();
    context.stroke();
    context.fill();
    context.restore();
  },
  /**
   * 在canvas中擦除圆形
   *
   * @param arc 圆形对象
   * @param context canvas上下文
   *
   * @returns void
   */
  clear: function (arc: Arc, context: CanvasRenderingContext2D): void {
    const clearBox = getClearBox(arc);
    context.clearRect(clearBox.x, clearBox.y, clearBox.width, clearBox.height);
  },
  getClearBox,
};

export default CanvasArcGraphic;
