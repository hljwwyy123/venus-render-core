/*
 * @Author: xiaobo
 * @Date: 2019-11-20
 */
import Render from "./Render";
import { RootNodeData } from "../declarations/IRender";
import { isArray, isObject } from "../util/index";
import Item, { ItemType, Shape } from "@/item/index";
import { SVGGraphic } from "../graphic/index";

function transformObjToString(transformObj: object) {
  if (!transformObj) return "none";
  let str = "";
  const { scale = 1 } = transformObj;
  if (scale) {
    str += `scale(${scale})`;
  }
  return str;
}

export default class SvgRender extends Render {
  constructor(items: Array<Item>, rootNodeData?: RootNodeData) {
    super(items, rootNodeData);
  }

  /**
   * 重写父类 创建画布 功能
   *
   * @param rotoNodeData 渲染数据
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
      ...rootNodeData,
    };
    if (rootNodeData && isObject(rootNodeData)) {
      tmpData = {
        ...tmpData,
        ...rootNodeData,
      };
    }

    let scale = 1;
    this.rootNode = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    if (rootNodeData && rootNodeData.transform) {
      this.rootNode.style.transform = transformObjToString(rootNodeData.transform);
      scale = rootNodeData.transform.scale;
      this.rootNode.style.transformOrigin = "0 0";
    }
    this.rootNode.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
    this.rootNode.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    this.rootNode.setAttribute("width", "" + tmpData.width / scale);
    this.rootNode.setAttribute("height", "" + tmpData.height / scale);
    this.rootNode.setAttributeNS("http://www.w3.org/2000/svg", "viewBox", "0,0," + tmpData.width / scale + "," + tmpData.height / scale);
    this.rootNode.setAttributeNS("http://www.w3.org/2000/svg", "preserveAspectRatio", "xMinYMin meet");

    this.rootNode.style.position = "absolute";
    this.rootNode.style.width = tmpData.width / scale + "px";
    this.rootNode.style.height = tmpData.height / scale + "px";
    this.rootNode.style.left = tmpData.x + "px";
    this.rootNode.style.top = tmpData.y + "px";
    this.rootNode.style.background = "rgba(0, 0, 0, 0)";
    this.rootNode.style.margin = "0";

    // this.rootNode.style.cssText = `position:absolute; width: ${tmpData.width/scale}px; height: ${tmpData.height/scale}px; left: ${tmpData.x}px; top: ${tmpData.y}px; background: rgba(0, 0, 0, 0); margin: 0`;
    this.setRootNodeData(tmpData);
  }

  /**
   * 获取SVG
   *
   * @param 无
   * @returns svg节点
   *
   */
  public getSvg(): any {
    return this.rootNode;
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
      SVGGraphic.draw(item, this.rootNode);
      item.clearDifference();
    } else {
      if (!item.render) return;
      const itemRender: Shape | Item | Array<Shape | Item> = item.render();
      if (isArray(itemRender)) {
        itemRender.map((r: Item) => {
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
   * 擦除容器中的元素
   *
   * @param item 擦除数据
   * @returns 无
   *
   */
  public clearItem(item: Item): void {
    if (item instanceof Shape) {
      SVGGraphic.clear(item, this.rootNode);
    } else {
      const itemRender: Shape | Item | Array<Shape | Item> = item.render();
      if (isArray(itemRender)) {
        itemRender.forEach(r => this.clearItem(r));
      } else {
        this.clearItem(itemRender);
      }
    }
  }

  /**
   * resize 根Dom 大小
   * @param width
   * @param height
   */
  public resize(width: number, height: number) {
    const scale = (this.rootNodeData.transform && this.rootNodeData.transform.scale) || 1;
    this.rootNode.setAttribute("width", width / scale);
    this.rootNode.setAttribute("height", height / scale);
    this.rootNode.style.width = width / scale + "px";
    this.rootNode.style.height = height / scale + "px";
  }
}
