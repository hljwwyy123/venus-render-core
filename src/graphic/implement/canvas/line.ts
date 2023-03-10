import CanvasLineGraphicInterface from "../../interface/canvas/line";
import { ItemType } from "@/item/index";
import { Line } from "@/graphic/types/shape";
import { getClearBox } from "@/graphic/utils/box";

const CanvasLineGraphic: CanvasLineGraphicInterface = {
  type: ItemType.LINE,
  /**
   * 在canvas中绘制直线
   *
   * @param line 直线对象
   * @param context canvas上下文
   *
   * @returns void
   */
  draw: function (line: Line, context: CanvasRenderingContext2D): void {
    const { x1 = 0, x2 = 10, y1 = 0, y2 = 10, fill = "#FFFFFF", strokeWidth = 1, stroke = "#000000", lineDash = [], lineDashOffset = 0 } = line;
    context.save();
    context.setLineDash(lineDash);
    context.lineDashOffset = -lineDashOffset;
    context.beginPath();
    context.fillStyle = fill;
    context.lineWidth = strokeWidth;
    context.strokeStyle = stroke;
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
    context.fill();
    context.restore();
  },
  /**
   * 在canvas中擦除直线
   *
   * @param line 直线对象
   * @param context canvas上下文
   *
   * @returns void
   */
  clear: function (line: Line, context: CanvasRenderingContext2D): void {
    const clearBox = getClearBox(line);
    context.clearRect(clearBox.x, clearBox.y, clearBox.width, clearBox.height);
  },
  getClearBox,
};

export default CanvasLineGraphic;
