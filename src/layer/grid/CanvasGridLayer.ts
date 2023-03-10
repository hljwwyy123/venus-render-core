import { GridLayer } from "./GridLayer";
import { RootNodeData, IRenderOptions, IRenderData } from "../../declarations/IRender";
import CanvasRender from "@/render/CanvasRender";
import Render from "@/render/Render";
// import RenderType from "@/render/RenderType";
// import {isArray} from "../../util/index";
import Item, { Circle, Rect, Image, Line, Path, Polygon, Polyline, Text, Arc } from "@/item/index";
import { IGridLayerOptions } from "@/declarations/ILayer";

export default class CanvasGridLayer extends GridLayer {
  constructor(options?: IGridLayerOptions) {
    super(options);
  }

  /**
   * 重写父类render
   * @param els 一个或者多个元素（Item）
   */
  public render(param?: IRenderOptions): void {
    this.renderItems({
      addedList: this.addedList,
      updatedList: this.updatedList,
      deletedList: this.deletedList,
      sync: (param && param.sync) || false,
    });

    this.addedList = [];
    this.updatedList = [];
    this.deletedList = [];
  }

  /**
   * 渲染items（可用于添加、删除、更新）
   * @param data
   */
  private renderItems(data: IRenderData): void {
    const { addedList, updatedList, deletedList, sync = false } = data;

    let canvasRenders = [];
    let renders;
    const items = [].concat(addedList, updatedList, deletedList);
    items.forEach(item => {
      renders = this.getGridsByItem(item);
      renders.forEach(render => {
        if (canvasRenders.indexOf(render) === -1) {
          canvasRenders.push(render);
        }
      });
    });

    const gridNames = canvasRenders.map(o => o.rootNodeData.name);
    const removedGridNames = this.removedGridNames;
    const realRemovedGridNames = [];
    removedGridNames.map(name => {
      if (gridNames.indexOf(name) === -1) {
        realRemovedGridNames.push(name);
      }
    });

    realRemovedGridNames
      .map(name => this.gridMap[name])
      .forEach(render => {
        render &&
          render.render({
            addedList,
            updatedList,
            deletedList,
            sync,
          });
      });

    canvasRenders.forEach(render => {
      render.render({
        addedList,
        updatedList,
        deletedList,
        sync,
      });
    });
    // 渲染完毕后需要清空
    this.removedGridNames = [];
  }

  /**
   * 多画布场景重写
   */
  public appendRootNode(): void {}

  /**
   * 创建网格基础
   * @param {*} coord
   * @param {*} cr
   */
  public createGridView(cr: RootNodeData): Render {
    let render = new CanvasRender(cr.items, cr);
    return render;
  }
}

export { Circle, Rect, Arc, Image, Line, Path, Polygon, Polyline, Text };
