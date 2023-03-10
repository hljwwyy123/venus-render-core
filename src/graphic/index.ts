/**
 *
 * 渲染引擎相关工具库，内含绘制以及与渲染引擎相关的计算方法
 * @author tianjun.wyb
 *
 */
import "./utils/polyfill";
import ItemGraphicInterface from "@/graphic/interface/general/shape";
import { Graphic } from "@/graphic/types/util";
import SVGGraphics from "./implement/svg/index";
import CanvasGraphics from "./implement/canvas/index";

const SVGGraphicsSpace = {};

const CanvasGraphicsSpace = {};

/**
 * 不同环境下的graphic绘图对象生成器
 *
 *
 * @returns graphic绘图对象
 * @param graphics 所有图形的graphic绘图对象
 * @param space 闭包空间 用于存储不同种类图形的方法
 */
function graphicGenerator(graphics: Array<ItemGraphicInterface>, space): Graphic {
  const functions = [];
  const result = <Graphic>{};
  for (const graphic of graphics) {
    space[graphic.type] = graphic;
    for (const functionName in graphic) {
      if (functionName !== "type" && graphic.hasOwnProperty(functionName) && functions.indexOf(functionName) === -1) {
        result[functionName] = graphicFunctionWrapper(space, functionName);
        functions.push(functionName);
      }
    }
  }
  return result;
}

/**
 * 生成一个 根据图形种类 分发绘制指令的方法
 *
 *
 * @returns 上述方法
 * @param space 闭包空间 用于存储不同种类图形的方法
 * @param functionName 指令名 例如draw clear等
 */
function graphicFunctionWrapper(space, functionName: string) {
  return function () {
    const item = arguments[0];
    const { type } = item;
    const typeInSpace = space[type];
    if (!typeInSpace) {
      console.error("暂不兼容该类图形执行此方法");
    } else {
      return space[type][functionName](...arguments);
    }
  };
}

const SVGGraphic: Graphic = graphicGenerator(SVGGraphics, SVGGraphicsSpace);
const CanvasGraphic: Graphic = graphicGenerator(CanvasGraphics, CanvasGraphicsSpace);

CanvasGraphic.clearContext = (context, width, height) => context.clearRect(0, 0, width, height);

export { SVGGraphic, CanvasGraphic };
