import Render from "./Render";
import { RootNodeData } from "../declarations/IRender";
import { isObject } from "../util/index";
import Item, { HtmlItem } from "@/item";

export default class HtmlRender extends Render {
  constructor(items: Array<Item>, rootNodeData?: RootNodeData) {
    super(items, rootNodeData);
  }
  /**
   * 重写父类 创建画布 功能
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
    this.rootNode = document.createElement("div");
    this.rootNode.style.position = "absolute";
    if (tmpData.width) this.rootNode.style.width = tmpData.width + "px";
    if (tmpData.height) this.rootNode.style.height = tmpData.height + "px";
    if (tmpData.x) this.rootNode.style.left = tmpData.x + "px";
    if (tmpData.y) this.rootNode.style.top = tmpData.y + "px";
    this.rootNode.style.margin = "0px";
    this.setRootNodeData(tmpData);
  }

  /**
   * 获取上下文
   */
  public getRootNode(): any {
    return this.rootNode;
  }

  /**
   * 渲染元素到容器中
   */
  public renderItem(htmlItem: HtmlItem): void {
    super.renderItem(htmlItem);
    let item = document.createElement(htmlItem.tagName);
    if (htmlItem.props) {
      for (let key in htmlItem.props) {
        item.setAttribute(key, htmlItem.props[key]);
      }
    }
    this.rootNode.appendChild(item);
  }

  /**
   * 擦除容器中的元素
   */
  public clearItem(item: Item): void {
    // console.log('@', item, this.context);
    // CanvasGraphic.clear(item, this.context);
  }
}
