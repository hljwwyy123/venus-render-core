/*
 * @Author: xiaobo
 * @Date: 2019-11-20
 */
import Layer from "./Layer";
import SvgRender from "../render/SvgRender";
import { ILayerOptions } from "../declarations/ILayer";
import Item, { Circle, Rect, Image, Line, Path, Polygon, Polyline, Text, Group } from "@/item/index";

//todo resolve transformOrigin and other transform properties
function transformPoint(point: object, transform: object) {
  if (transform && transform.scale) {
    point.x = point.x / transform.scale;
    point.y = point.y / transform.scale;
  }
  return point;
}

export default class SvgLayer extends Layer {
  constructor(options?: ILayerOptions) {
    super(options);
  }

  /**
   * 重写父类 创建渲染器 功能
   *
   * @param 无
   * @returns 无
   *
   */
  public createRender() {
    const { renderOptions = {} } = this.options;
    this.renderEngine = new SvgRender(this.getItems(), {
      width: this.options.fixed ? this.getStage().viewPortWidth : this.getStage().width,
      height: this.options.fixed ? this.getStage().viewPortHeight : this.getStage().height,
      ...renderOptions,
    });
  }

  /**
   * 更新 renderOption - transform: scale
   * SVGLayer - 专有方法 主要解决<svg> 标签本身的transform attribute
   */
  public setRenderOption(options) {
    this.getOptions().renderOptions = options;

    // 同步到render下面
    const renderEngineRootNodeData = this.renderEngine.getRootNodeData();
    this.renderEngine.setRootNodeData(Object.assign({}, renderEngineRootNodeData, options));
  }
  /**
   * 元素碰撞
   *
   * @param x 碰撞点 X 坐标
   * @param y 碰撞点 Y 坐标
   * @returns 碰撞的item
   *
   */
  public hitTest(x: number, y: number): Array<Item> {
    const { renderOptions = {} } = this.options;
    let point = { x, y };
    if (renderOptions && renderOptions.transform) {
      point = transformPoint(point, renderOptions.transform);
    }
    return super.hitTest(point.x, point.y);
  }
}

export { Circle, Rect, Image, Line, Path, Polygon, Polyline, Text, Group };
