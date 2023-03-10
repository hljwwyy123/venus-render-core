import CanvasPathGraphicInterface from "../../interface/canvas/path";
import { ItemType } from "@/item/index";
import { Path } from "@/graphic/types/shape";
import { qrDecompose } from "@/graphic/utils/matrix";
import { getBBoxWithoutTransform, getClearBox } from "@/graphic/utils/box";
import { movePath } from "@/graphic/utils/path";

const CanvasPathGraphic: CanvasPathGraphicInterface = {
  type: ItemType.PATH,
  /**
   * 在canvas中绘制路径
   *
   * @param path 路径对象
   * @param context canvas上下文
   *
   * @returns void
   */
  draw: function (path: Path, context: CanvasRenderingContext2D): void {
    const { d, fill = "#FFFFFF", strokeWidth = 1, stroke = "#000000", matrix = { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 } } = path;
    if (!d) {
      return console.error("无法绘制d属性为空的路径！");
    }
    const { angle, scaleX, scaleY, translateX, translateY } = qrDecompose(matrix);
    const originalBBox = getBBoxWithoutTransform(path);
    const newD = movePath(path, 0, 0);
    const pathInCanvas = new Path2D(newD);
    context.save();
    context.beginPath();
    context.translate(originalBBox.x + translateX, originalBBox.y + translateY);
    context.rotate((angle * Math.PI) / 180);
    context.scale(scaleX, scaleY);
    context.beginPath();
    context.fillStyle = fill;
    context.lineWidth = strokeWidth;
    context.strokeStyle = stroke;
    context.stroke(pathInCanvas);
    context.fill(pathInCanvas);
    context.restore();
  },
  /**
   * 在canvas中擦除路径
   *
   * @param path 路径对象
   * @param context canvas上下文
   *
   * @returns void
   */
  clear: function (path: Path, context: CanvasRenderingContext2D): void {
    const clearBox = getClearBox(path);
    context.clearRect(clearBox.x, clearBox.y, clearBox.width, clearBox.height);
  },
  getClearBox,
};

export default CanvasPathGraphic;
