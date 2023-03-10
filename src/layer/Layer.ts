/*
 * @Author: xiaobo
 * @Date: 2019-11-19
 */
import Event, { EventList } from "@/core/Event";
import Stage from "@/Stage";
import Item from "@/item/index";
import Render from "@/render/Render";
import { ILayerOptions, ILayerFillOptions} from "@/declarations/ILayer"; 
import { IRenderOptions } from "@/declarations/IRender";
import { pathBBox, pointInSvgPathBox } from "@/util/pointInSvgPath";
import HoverHandler from "@/core/HoverHandler";

let _guid = 1000;

export default abstract class Layer extends Event {
  public options: ILayerOptions;
  public ignoreEvents: Array<string>;
  public hidden: boolean;
  private stage: Stage;
  private zIndex: number;
  private items: Array<Item>;
  protected addedList: Array<Item>;
  protected updatedList: Array<Item>;
  protected deletedList: Array<Item>;
  private view: HTMLElement;
  private hoverHandler: HoverHandler;
  protected renderEngine: Render | Array<Render>;

  /**
   * 构造函数
   *
   * @param options 图层初始化参数
   * @returns
   *
   */
  constructor(options?: ILayerOptions) {
    super({ pipeline: "layer" });
    this.options = this.fillOptions(options);
    this.items = [];
    this.addedList = [];
    this.updatedList = [];
    this.deletedList = [];
    this.createView();
    this.initEvent();
  }

  /**
   * 创建画布视图承载器
   *
   * @param 无
   * @returns 无
   *
   */
  public createView(): void {
    if (!this.options.fixed) {
      this.view = document.createElement("div");
      this.view.classList.add("aseat-layer");
    } else {
      this.view = document.createElement("div");
    }
    if (this.options.className) {
      this.view.classList.add(this.options.className);
    }
    this.view.style.position = "absolute";
    if (this.options.zIndex) {
      this.setZIndex(this.options.zIndex);
    }
  }

  /**
   * 创建渲染器
   *
   * @param 无
   * @returns 无
   *
   */
  public createRender(): void {}

  /**
   * 添加画布节点到图层中
   * 多画布场景可以重写
   *
   * @param 无
   * @returns 无
   *
   */
  public appendRootNode(): void {
    this.view.appendChild(this.renderEngine.getRootNode());
  }

  /**
   * 获取舞台
   *
   * @param 无
   * @returns 返回舞台实例
   *
   */
  public getStage(): Stage {
    return this.stage;
  }

  /**
   * 设置舞台引用
   *
   * @param stage 舞台实例
   * @returns 无
   *
   */
  public setStage(stage: Stage): void {
    this.stage = stage;
  }

  /**
   * 获取数据
   *
   * @param 无
   * @returns 图层初始化参数
   *
   */
  public getOptions(): ILayerOptions {
    return this.options;
  }

  /**
   * 获取元素
   *
   * @param 无
   * @returns Item数组
   *
   */
  public getItems(): Array<Item> {
    return this.items;
  }

  /**
   * 图层需要添加到舞台的dom元素div
   *
   * @param 无
   * @returns 图层dom节点
   *
   */
  public getView(): HTMLElement {
    return this.view;
  }

  /**
   * 获取图层添加到舞台的画布
   *
   * @param 无
   * @returns 图层渲染器根节点
   *
   */
  public getRootNode(): HTMLElement {
    return this.renderEngine.getRootNode();
  }

  /**
   * 重新设置Layer content size
   */
  public resize(width: number, height: number): void {
    if (this.renderEngine) {
      if (!Array.isArray(this.renderEngine)) {
        this.renderEngine.resize(width, height);
      }
    }
  }

  /**
   * 获取layer示例元素的父级元素
   *
   * @param 无
   * @returns panel节点
   *
   */
  public getPanel(): HTMLElement {
    return this.stage.layerPanel;
  }

  /**
   * 获取移动变化的容器元素
   *
   * @param 无
   * @returns 容器节点
   *
   */
  public getContainer(): HTMLElement {
    return this.stage.container;
  }

  /**
   * 获取layer示例元素的父级元素
   *
   * @param 无
   * @returns 舞台宽度
   *
   */
  public getWidth(): number {
    return this.stage.width;
  }

  /**
   * 获取移动变化的容器元素
   *
   * @param 无
   * @returns 舞台高度
   *
   */
  public getHeight(): number {
    return this.stage.height;
  }

  /**
   * 显示
   *
   * @param 无
   * @returns 无
   *
   */
  public show(): void {
    this.hidden = false;
    this.view.style.display = "block";
  }

  /**
   * 隐藏
   *
   * @param 无
   * @returns 无
   *
   */
  public hide(): void {
    this.hidden = true;
    this.view.style.display = "none";
  }

  /**
   * 将图层移到最上层
   *
   * @param 无
   * @returns 无
   *
   */
  public bringToFront(): void {
    const allLayers: Array<Layer> = this.stage.getLayers();
    const leng: number = allLayers.length;
    let maxIndex: number = 0;
    for (let i: number = 0; i < leng; i++) {
      const tmpZIndex: number = allLayers[i].getZIndex();
      if (tmpZIndex > maxIndex) {
        maxIndex = tmpZIndex;
      }
    }
    this.setZIndex(maxIndex + 1);
  }

  /**
   * 将图层移到最下层
   *
   * @param 无
   * @returns 无
   *
   */
  public bringToBack(): void {
    const allLayers: Array<Layer> = this.stage.getLayers();
    const leng: number = allLayers.length;
    let minIndex: number = 0;
    for (let i: number = 0; i < leng; i++) {
      const tmpZIndex: number = allLayers[i].getZIndex();
      if (tmpZIndex < minIndex) {
        minIndex = tmpZIndex;
      }
    }
    this.setZIndex(minIndex - 1);
  }

  /**
   * 设置图层的层级
   *
   * @param 无
   * @returns 图层层级
   *
   */
  public getZIndex(): number {
    return this.zIndex;
  }

  /**
   * 设置图层的层级
   *
   * @param index 图层的新层级
   * @returns 无
   *
   */
  public setZIndex(index: number): void {
    this.zIndex = index;
    this.view.style.zIndex = "" + index;
  }

  /**
   * 设置图层透明度
   *
   * @param opacity 图层透明度
   * @returns 无
   *
   */
  public setOpacity(opacity: number): void {
    this.view.style.opacity = "" + opacity;
  }

  public add(item: Item): void {
    this.addItem(item);
  }

  /**
   * 添加元素到图层
   *
   * @param item 元素
   * @returns 无
   *
   */
  public addItem(item: Item): void {
    item.setLayer(this);
    this.items.push(item);
    this.addedList.push(item);
  }

  /**
   * 头部添加元素
   * @param item
   */
  public insertItem(item: Item): void {
    item.setLayer(this);
    this.items.unshift(item);
    this.addedList.unshift(item);
  }

  /**
   * 添加元素到图层
   * @param items 元素集合
   */
  public addItems(items: Array<Item>, param = { unshift: false }): void {
    items.forEach((el: Item) => {
      this.addItem(el);
    });
  }

  /**
   * 添加元素到图层
   * @param items 元素集合
   */
  public insertItems(items: Array<Item>): void {
    items.forEach((el: Item) => {
      this.insertItem(el);
    });
  }

  public remove(item: Item): void {
    this.removeItem(item);
  }

  /**
   * 移除元素
   *
   * @param item 元素
   * @returns 无
   *
   */
  public removeItem(item: Item): void {
    let res: object = this.itemContrast(item);
    if (res.index > -1) {
      item.destroy();
      this.items.splice(res.index, 1);
      this.deletedList.push(item);
    }
  }

  public removeAllItem(): void {
    this.items.forEach(item => item.destroy());
    this.deletedList.push(...this.items);
    this.items.length = 0;
  }

  /**
   * 移除元素
   *
   * @param items 元素
   * @returns 无
   *
   */
  public removeItems(items: Array<Item>): void {
    items.map((el: Item) => {
      this.removeItem(el);
    });
  }

  /**
   * 更新图层内的元素
   *
   * @param item 更新的元素
   * @returns 无
   *
   */
  public updateItem(item: Item): void {
    // attr ? item.setAttrs(attr) : null;
    this.updatedList.push(item);
  }

  /**
   * 更新图层内的元素
   *
   * @param item 更新的元素
   * @returns 无
   *
   */
  public updateItems(items: Array<Item>): void {
    items.map((el: Item) => {
      this.updateItem(el);
    });
  }

  /**
   * 渲染元素到容器中
   *
   * @param 无
   * @returns 无
   *
   */
  public render(options?: IRenderOptions): void {
    this.renderEngine.render({
      addedList: this.addedList,
      updatedList: this.updatedList,
      deletedList: this.deletedList,
      sync: options && options.sync,
    });

    this.addedList = [];
    this.updatedList = [];
    this.deletedList = [];
  }

  /**
   * 擦除容器中的元素
   *
   * @param els 需要擦除的元素【可选】，不传擦除所有的元素
   * @returns 无
   *
   */
  public clear(els?: Item | Array<Item>): void {
    this.renderEngine.clear && this.renderEngine.clear(els);
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
    let els: Array<Item> = [];
    const leng = this.items.length;
    for (let i = 0; i < leng; i++) {
      const el: Item = this.items[i];
      if (el.isPointInside(x, y)) {
        els.push(el);
      }
    }
    return els;
  }

  /**
   * 判断元素是否已经添加过
   *
   * @param item 需要判断的元素
   * @returns object {item:需要判断的元素, index:存在的序列号}
   *
   */
  public itemContrast(item: Item): object {
    const index: number = this.items.indexOf(item);
    return {
      item,
      index,
    };
  }

  /**
   * 获取与矩形碰撞的元素
   *
   * @param x
   * @param y
   * @param width
   * @param height
   * @returns 相交的元素
   *
   */
  public getIntersectItems(x: number, y: number, width: number, height: number): Array<Item> {
    const tmpItems: Array<Item> = [];
    this.items.map((el: Item) => {
      if (el.isIntersect(x, y, width, height)) {
        tmpItems.push(el);
      }
    });
    return tmpItems;
  }

  /**
   * 获取在矩形内的元素
   *
   * @param x
   * @param y
   * @param width
   * @param height
   * @returns 包含的元素
   *
   */
  public getContainItems(x: number, y: number, width: number, height: number): Array<Item> {
    const tmpItems: Array<Item> = [];
    this.items.map((el: Item) => {
      if (el.isContain(x, y, width, height)) {
        tmpItems.push(el);
      }
    });
    return tmpItems;
  }

  /**
   * 点于path碰撞检测
   *
   * @param path 待检测碰撞的path路径
   * @param bbox 待检测碰撞的盒子
   * @param point 待检测碰撞的点
   * @returns boolean 是否碰撞了path
   *
   */
  private pointInSvgPathBox(path: string, bbox: object, point: object): boolean {
    const { x, y } = point;
    return pointInSvgPathBox(path, bbox, x, y);
  }

  /**
   * 拿Item的BBox和SVG Path 碰撞 （框选、套索）
   *
   * @param path path路径
   * @returns 碰撞的Items
   *
   */
  public getItemsInPath(path: string): Item[] {
    const bbox = pathBBox(path);
    let itemList = [];
    this.items.forEach(el => {
      if (
        this.pointInSvgPathBox(path, bbox, el._bounding.tl()) ||
        this.pointInSvgPathBox(path, bbox, el._bounding.tr()) ||
        this.pointInSvgPathBox(path, bbox, el._bounding.bl()) ||
        this.pointInSvgPathBox(path, bbox, el._bounding.br())
      ) {
        itemList.push(el);
      }
    });
    return itemList;
  }
  /**
   * 点击事件
   *
   * @param e 事件模型
   * @returns 无
   *
   */
  public clickLayer(e: any): void {
    const hitTestItems: Array<Item> = this.hitTest(e.point.x, e.point.y);
    this.emit("item:click", { ...e, layer: this, items: hitTestItems });
  }
  /**
   * 双击击事件
   * @param e 事件模型
   * @returns 无
   */
  public dbClickLayer(e: any): void {
    const hitTestItems: Array<Item> = this.hitTest(e.point.x, e.point.y);
    this.emit("item:dbclick", { ...e, layer: this, items: hitTestItems });
  }
  /**
   * 右键事件
   * @param e 事件模型
   * @returns 无
   */
  public rightClickLayer(e: any): void {
    const hitTestItem = this.hitTest(e.point.x, e.point.y);
    this.emit("item:rightclick", { ...e, layer: this, items: hitTestItem });
  }
  /**
   * 拖动开始 事件
   *
   * @param e 事件模型
   * @returns 无
   *
   */
  public panstartLayer(e: any): void {
    // console.log('===Layer==== panstart ', e);
  }
  /**
   * 拖动 事件
   *
   * @param e 事件模型
   * @returns 无
   *
   */
  public panLayer(e: any): void {
    // console.log('===Layer==== pan  ', e);
  }
  /**
   * 拖动结束 事件
   *
   * @param e 事件模型
   * @returns 无
   *
   */
  public panendLayer(e: any): void {
    // console.log('===Layer==== panend ', e);
  }

  /**
   * stage 添加layer之后，初始化render
   *
   * @param 无
   * @returns 无
   *
   */
  public handleAddLayer(): void {
    this.createRender();
    this.appendRootNode();
  }

  /**
   * 鼠标移动事件
   *
   * @param e 事件模型
   * @returns 无
   *
   */
  public onMouseMove(e: any): void {
    if (!this.ignoreEvents.includes(EventList.ITEMMOUSEENTER)) {
      const handleMouseMove = this.hoverHandler.handleMouseMove.bind(this.hoverHandler);
      handleMouseMove(e);
    }
  }

  public handleMouseEnter(e: any): void {
    this.getStage().emit("item:mouseenter", e);
    this.emit("item:mouseenter", e);
  }

  public handleMouseLeave(e: any): void {
    this.getStage().emit("item:mouseleave", e);
    this.emit("item:mouseleave", e);
  }

  /**
   * 图层锁定
   *
   * @param e 事件模型
   * @returns 无
   *
   */
  public lockLayer(e: any): void {
    console.log("===Layer==== lock ", e);
  }

  /**
   * 图层解锁
   *
   * @param e 事件模型
   * @returns 无
   *
   */
  public unlockLayer(e: any): void {
    console.log("===Layer==== unlock ", e);
  }

  /**
   * 图层缩放
   *
   * @param e 事件模型
   * @returns 无
   *
   */
  public zoomLayer(e: any): void {
    this.emit("layer:zoom", { zoom: e });
  }

  /**
   * 初始化Layer 接收事件
   * ignoreEvents 事件黑名单
   *
   * @param 无
   * @returns 无
   *
   */
  initEvent(): void {
    const { ignoreEvents } = this.options;
    this.ignoreEvents = ignoreEvents || [];
    this.hoverHandler = new HoverHandler({
      hitTestFunc: this.hitTest.bind(this),
    });

    this.hoverHandler.on("mouseenter", this.handleMouseEnter.bind(this));
    this.hoverHandler.on("mouseleave", this.handleMouseLeave.bind(this));

    this.on("add", this.handleAddLayer);
    this.on("click", this.clickLayer);
    this.on("dbclick", this.dbClickLayer);
    this.on("rightclick", this.rightClickLayer);
    this.on("panstart", this.panstartLayer);
    this.on("mousemove", this.onMouseMove);
    this.on("pan", this.panLayer);
    this.on("panend", this.panendLayer);
    this.on("stage:zoom", this.zoomLayer);
  }

  /**
   * 自动补全Layer name
   * @param ILayerFillOptions
   */
  private fillOptions(options?: ILayerFillOptions) {
    if (options) {
      if (!options.name) {
        if (options.zIndex !== undefined) {
          options.name = `layer_${options.zIndex}`;
        } else {
          options.name = `layer_${_guid++}`;
        }
      }
    } else {
      return { name : `layer_${_guid++}` }
    }
    return options;
  }

  /**
   * 销毁事件
   */
  private offEvent(): void {
    this.off("add", this.handleAddLayer);
    this.off("click", this.clickLayer);
    this.off("dbclick", this.dbClickLayer);
    this.off("rightclick", this.rightClickLayer);
    this.off("panstart", this.panstartLayer);
    this.off("pan", this.panLayer);
    this.off("panend", this.panendLayer);
    this.off("mousemove", this.onMouseMove);
    this.off("stage:zoom", this.zoomLayer);
    this.off("mouseenter", this.handleMouseEnter.bind(this));
    this.off("mouseleave", this.handleMouseLeave.bind(this));
    this.hoverHandler = null;
  }

  /**
   * 销毁Layer - 删除Items,注销事件,删除dom
   */
  public destroy(): void {
    this.removeAllItem();
    this.offEvent();
    this.stage.layerPanel.removeChild(this.view);
  }
}
