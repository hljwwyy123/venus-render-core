/*
 * @Author: xiaobo
 * @Date: 2019-11-20
 */
// import throttle from 'lodash.throttle';
// import last from 'lodash.last';
import Layer from "./Layer";
import CanvasRender from "../render/CanvasRender";
import { ILayerOptions } from "../declarations/ILayer";
import Item, { Circle, Arc, Rect, Cache, Image, Line, Path, Polygon, Polyline, Text, Group } from "@/item/index";

export default class CanvasLayer extends Layer {
  constructor(data?: ILayerOptions) {
    super(data);
  }

  /**
   * 重写父类 创建渲染器 功能
   *
   * @param 无
   * @returns 无
   *
   */
  public createRender() {
    this.renderEngine = new CanvasRender(this.getItems(), {
      width: this.getStage().width,
      height: this.getStage().height,
    });
  }

  /**
   * 点击事件
   *
   * @param e 事件模型
   * @returns 无
   *
   */
  // public clickLayer(e: any): void {
  //   const hitTestItems: Array<Item> = this.hitTest(e.point.x, e.point.y);
  //   if (hitTestItems && hitTestItems.length>0) {
  //     this.emit('item:click', {nativeEvent: e, layer: this, items: hitTestItems});
  //   }
  //   this.getStage().emit('item:click', {nativeEvent: e, layer: this, items: hitTestItems});
  // }

  /**
   * 划过事件
   *
   * @param e 事件模型
   * @returns 无
   */
  // public hoverLayer(e: any): void {
  //   throttle(() => {
  //     const items: Array<Item> = this.hitTest(e.point.x, e.point.y);
  //     const lastItem = last(items);
  //     if(lastItem) {
  //       this.getStage().emit('item:hover', {nativeEvent: e, layer: this, items});
  //       this.emit('item:hover', {nativeEvent: e, layer: this, items});
  //     }
  //   }, 200)();
  // }
}

export { Circle, Arc, Rect, Image, Cache, Line, Path, Polygon, Polyline, Text, Group };
