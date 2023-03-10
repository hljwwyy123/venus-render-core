import CanvasTextGraphicInterface from "../../interface/canvas/text";
import { ItemType } from "@/item/index";
import { Text } from "@/graphic/types/shape";
import { qrDecompose } from "@/graphic/utils/matrix";
import { getClearBox } from "@/graphic/utils/box";

const CanvasTextGraphic: CanvasTextGraphicInterface = {
  type: ItemType.TEXT,
  /**
   * 在canvas中绘制文本
   *
   * @param textObject 文本对象
   * @param context canvas上下文
   *
   * @returns void
   */
  draw: function (textObject: Text, context: CanvasRenderingContext2D): void {
    let {
      text = "",
      x = 0,
      y = 0,
      strokeWidth = 1,
      stroke = "#000000",
      fontSize = 30,
      fontFamily = "Arial",
      lineHeight,
      matrix = { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 },
    } = textObject;
    const { angle, scaleX, scaleY, translateX, translateY } = qrDecompose(matrix);
    context.save();
    context.translate(x + translateX, y + translateY);
    context.rotate((angle * Math.PI) / 180);
    context.scale(scaleX, scaleY);
    context.font = textObject.font || `normal ${strokeWidth * 100} ${lineHeight || fontSize}px ${fontFamily}`;
    context.fillStyle = stroke;
    // 要随时注意 SVG和CANVAS在画字的时候 x y 代表字的左下角 但用户传进来的x y 希望是左上角
    context.fillText(text, 0, fontSize);
    context.restore();
  },
  /**
   * 在canvas中擦除文本
   *
   * @param text 文本对象
   * @param context canvas上下文
   *
   * @returns void
   */
  clear: function (text: Text, context: CanvasRenderingContext2D): void {
    const clearBox = getClearBox(text);
    context.clearRect(clearBox.x, clearBox.y, clearBox.width, clearBox.height);
  },
  getClearBox,
};

export default CanvasTextGraphic;
