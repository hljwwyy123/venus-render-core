/*
 * @Author: xiaobo
 * @Date: 2019-11-20
 */
import Render from "./Render";
import { RootNodeData, IRenderData } from "../declarations/IRender";
import { isArray, isObject, raf } from "../util/index";
import Item, { ItemType, Arc, Circle, Image, Cache, Line, Path, Polygon, Polyline, Rect, Shape, Text } from "@/item/index";
import { CanvasGraphic } from "../graphic/index";

// function getPixelRatio(context) {
//   var backingStore = context.backingStorePixelRatio ||
//         context.webkitBackingStorePixelRatio ||
//         context.mozBackingStorePixelRatio ||
//         context.msBackingStorePixelRatio ||
//         context.oBackingStorePixelRatio ||
//         context.backingStorePixelRatio || 1;
//   return (window.devicePixelRatio || 1) / backingStore;
// };

function createCanvasElement(options: RootNodeData = { x: 0, y: 0, width: 0, height: 0 }) {
  const el = document.createElement("canvas");
  const ctx = el.getContext("2d");
  // const backingStorePixelRatio = getPixelRatio(ctx);
  el.width = options.width;
  el.height = options.height;
  el.style.position = "absolute";
  el.style.width = options.width + "px";
  el.style.height = options.height + "px";
  el.style.left = options.x + "px";
  el.style.top = options.y + "px";
  el.style.background = "rgba(0, 0, 0, 0)";
  el.style.margin = "0";
  el.setAttribute("data-grid-name", options.name);
  return el;
}

export default class CanvasRender extends Render {
  private context: CanvasRenderingContext2D;
  private contextWidth: number;
  private contextHeight: number;

  constructor(items: Array<Item>, rootNodeData?: RootNodeData) {
    super(items, rootNodeData);
    this._renderByFrame = this._renderByFrame.bind(this);
  }

  /**
   * 重写父类 创建画布 功能
   *
   * @param rootNodeData 渲染数据
   * @returns 无
   *
   */
  public createRootNode(rootNodeData?: RootNodeData) {
    let tmpData: RootNodeData = {
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      row: 0,
      col: 0,
    };
    if (rootNodeData && isObject(rootNodeData)) {
      tmpData = {
        ...tmpData,
        ...rootNodeData,
      };
    }

    this.contextWidth = tmpData.width;
    this.contextHeight = tmpData.height;
    this.rootNode = createCanvasElement(tmpData);
    this.setRootNodeData(tmpData);
    this.context = this.rootNode.getContext("2d");
  }

  public resize(width: number, height: number) {
    this.contextWidth = width;
    this.contextHeight = height;

    this.rootNode.setAttribute("width", `${width}`);
    this.rootNode.setAttribute("height", `${height}`);
    this.rootNode.style.width = width + "px";
    this.rootNode.style.height = height + "px";
  }

  /**
   * 获取上下文
   *
   * @param 无
   * @returns canvas画布上下文
   *
   */
  public getContext(): CanvasRenderingContext2D {
    return this.context;
  }

  /**
   * 获取与元素相交的元素
   *
   * @param item
   * @returns 相交的元素
   *
   */
  public getIntersectItems(item: Item): Array<Item> {
    const boxRect: object = item._bounding; // CanvasGraphic.getClearBox(item);

    const tmpItems: Array<Item> = [];
    this.items.map((el: Item) => {
      if (!item.isEquals(el) && el.isIntersect(boxRect.x, boxRect.y, boxRect.width, boxRect.height)) {
        tmpItems.push(el);
      }
    });
    return tmpItems;
  }

  /**
   * 渲染元素到容器中
   *
   * @param item 渲染元素
   * @returns 无
   *
   */
  public renderItem(item: Shape | Item): void {
    if (item.type > ItemType.GraphicsElement) {
      if (item._renderable) {
        this.itemConvertPositionInGrid(item);
        CanvasGraphic.draw(item, this.context);
        this.itemRevertPositionInGrid(item);
        item.clearDifference();
      }
    } else {
      if (!item.render) return;
      const itemRender: Shape | Item | Array<Shape | Item> = item.render();
      if (isArray(itemRender)) {
        itemRender.map((r: Shape | Item) => {
          this.renderItem(r);
        });
        // item.updateBBox();
        item.clearDifference();
      } else {
        this.renderItem(itemRender);
      }
    }
  }

  /**
   * cavansGrid时，转换成grid坐标
   * @param item
   */
  private itemConvertPositionInGrid(item: Item): Item {
    if (item.x && item.y) {
      item.x = item.x - this.rootNodeData.x;
      item.y = item.y - this.rootNodeData.y;
    } else if (item.cx && item.cy) {
      item.cx = item.cx - this.rootNodeData.x;
      item.cy = item.cy - this.rootNodeData.y;
    } else if (item.x1 || item.y1 || item.x2 || item.y2) {
      item.x1 = item.x1 - this.rootNodeData.x;
      item.y1 = item.y1 - this.rootNodeData.y;
      item.x2 = item.x2 - this.rootNodeData.x;
      item.y2 = item.y2 - this.rootNodeData.y;
    } else if (item.points) {
      item.points = this.convertPoints(item.points);
    }
    return item;
  }

  private itemRevertPositionInGrid(item: Item): Item {
    if (item.x && item.y) {
      item.x = item.x + this.rootNodeData.x;
      item.y = item.y + this.rootNodeData.y;
    } else if (item.cx && item.cy) {
      item.cx = item.cx + this.rootNodeData.x;
      item.cy = item.cy + this.rootNodeData.y;
    } else if (item.x1 || item.y1 || item.x2 || item.y2) {
      item.x1 = item.x1 + this.rootNodeData.x;
      item.y1 = item.y1 + this.rootNodeData.y;
      item.x2 = item.x2 + this.rootNodeData.x;
      item.y2 = item.y2 + this.rootNodeData.y;
    } else if (item.points) {
      item.points = this.convertPoints(item.points);
    }
    return item;
  }

  /**
   * polyline 坐标转换
   * @param points - [9604,3642 9634,3642 9664,3642 9694,3642]
   */
  private convertPoints(points: string): string {
    const arrayPoints = points.replace(/,/g, " ").trim().split(/\s+/);
    const parsedPoints = [];
    const length = arrayPoints.length;

    for (let i = 0; i < length; i += 2) {
      parsedPoints.push({
        x: parseFloat(arrayPoints[i]) - this.rootNodeData.x,
        y: parseFloat(arrayPoints[i + 1]) - this.rootNodeData.y,
      });
    }
    return parsedPoints.map(point => `${point.x},${point.y}`).join(" ");
  }

  /**
   * 更新渲染元素
   *
   * @param item 待更新渲染的元素
   * @returns 无
   *
   */
  public updateItem(item: Shape | Item, force: boolean): void {
    const { different, origin } = item.getDifference();
    if (force || different) {
      // 有变化需要擦除重绘制
      this.clear();
      this.items.map((el: Item) => {
        if (!item.isEquals(el)) {
          this.renderItem(el);
        }
      });

      this.renderItem(item);
    } else {
      console.log("updateItem", "item.getDifference() work!!!!!!");
    }
  }

  public clear(): void {
    CanvasGraphic.clearContext(this.context, this.contextWidth, this.contextHeight);
  }

  public render(data?: IRenderData): void {
    if (data && data.sync) {
      this._renderByFrame(data);
    } else {
      raf(this._renderByFrame);
    }
  }

  private _renderByFrame(data: IRenderData): void {
    this.clear();
    this.items.forEach(item => this.renderItem(item));
  }

  /**
   * 擦除容器中的元素
   *
   * @param item 擦除数据
   * @returns 无
   *
   */
  public clearItem(item: Item): void {
    // if (item instanceof Shape) {
    //   const { origin } = item.getDifference();
    //   let gridItem = this.itemChangeXYByGrid(origin);
    //   CanvasGraphic.clear(gridItem, this.context);
    // } else {
    //   const itemRender: Shape | Item | Array<Shape | Item> = item.render();
    //   if (isArray(itemRender)) {
    //     itemRender.map((r: Shape | Item) => {
    //       this.clearItem(r);
    //     });
    //   } else {
    //     this.clearItem(itemRender);
    //   }
    // }
  }
}

export { Circle, Arc, Rect, Image, Cache, Line, Path, Polygon, Polyline, Text };
