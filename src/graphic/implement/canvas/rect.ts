import CanvasRectGraphicInterface from "../../interface/canvas/rect";
import { ItemType } from "@/item/index";
import { Rect } from "@/graphic/types/shape";
import { qrDecompose } from "@/graphic/utils/matrix";
import { getClearBox } from "@/graphic/utils/box";

const CanvasRectGraphic: CanvasRectGraphicInterface = {
  type: ItemType.RECT,
  /**
   * 在canvas中绘制矩形
   *
   * @param rect 矩形对象
   * @param context canvas上下文
   *
   * @returns void
   */
  draw: function (rect: Rect, context: CanvasRenderingContext2D): void {
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
      matrix = { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 },
    } = rect;
    const { angle, scaleX, scaleY, translateX, translateY } = qrDecompose(matrix);
    context.save();
    context.translate(x + translateX, y + translateY);
    context.rotate((angle * Math.PI) / 180);
    context.scale(scaleX, scaleY);
    context.beginPath();
    context.fillStyle = fill;
    context.lineWidth = strokeWidth;
    context.strokeStyle = stroke;
    context.moveTo(0, rx);
    context.lineTo(0, height - rx);
    rx && context.arcTo(0, height, rx, height, rx);
    context.lineTo(width - rx, height);
    rx && context.arcTo(width, height, width, height - rx, rx);
    context.lineTo(width, rx);
    rx && context.arcTo(width, 0, width - rx, 0, rx);
    context.lineTo(rx, 0);
    rx && context.arcTo(0, 0, 0, rx, rx);
    context.stroke();
    context.fill();
    context.restore();
  },
  /**
   * 在canvas中擦除矩形
   *
   * @param rect 矩形对象
   * @param context canvas上下文
   *
   * @returns void
   */
  clear: function (rect: Rect, context: CanvasRenderingContext2D): void {
    const clearBox = getClearBox(rect);
    context.clearRect(clearBox.x, clearBox.y, clearBox.width, clearBox.height);
  },
  getClearBox,
};

export default CanvasRectGraphic;
