/*
 * @Author: xiaobo
 * @Date: 2019-11-19
 */
import Event from "../core/Event";
import { RootNodeData, IRenderData } from "../declarations/IRender";
import { isArray } from "../util/index";
import Item, { Shape } from "@/item/index";

export default abstract class Render extends Event {
  protected items: Array<Item>;
  protected rootNodeData: RootNodeData;
  protected rootNode: HTMLElement | SVGElement | SVGSVGElement | HTMLCanvasElement;

  constructor(items: Array<Item>, rootNodeData?: RootNodeData) {
    super({ pipeline: "render" });
    this.items = items;
    this.rootNodeData = rootNodeData;

    this.createRootNode(rootNodeData);
  }

  /**
   * 创建画布数据
   *
   * @param rootNodeData 渲染数据
   * @returns 无
   *
   */
  public createRootNode(rootNodeData?: RootNodeData): void {}

  /**
   * 获取需要渲染舞台数据
   *
   * @param 无
   * @returns 返回渲染数据
   *
   */
  public getRootNodeData(): RootNodeData {
    return this.rootNodeData;
  }

  /**
   * 设置需要渲染舞台数据
   *
   * @param rootNodeData 渲染数据
   * @returns 无
   *
   */
  public setRootNodeData(value: RootNodeData): void {
    this.rootNodeData = value;
  }

  /**
   * 获取需要渲染舞台
   *
   * @param 无
   * @returns 返回渲染数据
   *
   */
  public getRootNode(): HTMLElement | SVGElement | SVGSVGElement | HTMLCanvasElement {
    return this.rootNode;
  }

  /**
   * 渲染元素到容器中
   *
   * @param item 渲染元素
   * @returns 无
   *
   */
  public renderItem(item: Shape | Item): void {}

  /**
   * 更新渲染元素
   *
   * @param item 待更新渲染的元素
   * @returns 无
   *
   */
  public updateItem(item: Shape | Item, force: boolean): void {
    this.renderItem(item);
    // this.graphic.update(item, oldItem);
  }

  /**
   * 渲染元素到容器中
   *
   * @param data 渲染数据
   * @returns 无
   *
   */
  public render(data: IRenderData, force: boolean): void {
    const { addedList, updatedList, deletedList } = data;

    this.clear(deletedList);

    if (isArray(addedList)) {
      addedList.map((el: Item) => {
        this.renderItem(el);
      });
    } else {
      this.renderItem(addedList);
    }

    if (isArray(updatedList)) {
      updatedList.map((el: Item) => {
        this.updateItem(el, force);
      });
    } else {
      this.updateItem(updatedList, force);
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
    // this.graphic[0].clear(item);
  }

  /**
   * 擦除容器中的元素
   *
   * @param els 擦除数据
   * @returns 无
   *
   */
  public clear(els?: Item | Array<Item>): void {
    if (els) {
      if (isArray(els)) {
        els.map((el: Item) => {
          this.clearItem(el);
        });
      } else {
        this.clearItem(els);
      }
    } else {
      const tmpItems: Array<Item> = this.items;
      tmpItems.map((el: Item) => {
        this.clearItem(el);
      });
    }
  }

  /**
   * 显示render
   */
  public showRender(): void {
    if (this.rootNode && this.rootNode.style) {
      this.rootNode.style.display = "none";
    }
  }

  /**
   * 隐藏render
   */
  public hideRender(): void {
    if (this.rootNode && this.rootNode.style) {
      this.rootNode.style.display = "block";
    }
  }

  /**
   * resize 根Dom 大小
   * @param width
   * @param height
   */
  public resize(width: number, height: number) {
    this.rootNode.setAttribute("width", width);
    this.rootNode.setAttribute("height", height);
    this.rootNode.style.width = width + "px";
    this.rootNode.style.height = height + "px";
  }
}
