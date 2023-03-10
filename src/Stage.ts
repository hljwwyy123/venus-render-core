/*
 * @Author: daren
 * @Date: 2019-11-19
 */
import { Scroller } from "scroller";
import Gesture from "@/core/Gesture";
import debounce from "lodash.debounce";
import invariant from "invariant";
import ScrollView from "@/core/ScrollView";
import Layer from "@/layer/Layer";
import Event from "@/core/Event";
import IStageOptions from "./declarations/IStage";
import { calcContentOffset, calcFitViewPortZoom } from "@/util/index";
import Plugin from "./plugin/Plugin";
import BBox from "./basic/BBox";
import Point from "./basic/Point";

const DimensionWidth = 20000;
const DimensionHeight = 20000;
const defaultMaxZoom = 5;

export default class Stage extends Event {
  public container: HTMLElement | any;
  public mouseMoveContainer: HTMLElement;
  public width: number;
  public height: number;
  public viewPortWidth: number;
  public viewPortHeight: number;
  public maxZoom: number;
  public minZoom: number;
  public scrollContent: HTMLElement | any;
  public layerPanel: HTMLElement | any;
  public layerFixedPanel: HTMLElement | any;
  public scrollLeft: number;
  public scrollTop: number;
  public zoom: number;
  public fitZoom: number;
  public scrollView: Scroller;
  public scrollable: boolean;
  public containerBbox: object;
  public activePlugin: string;
  private plugins: Array<Plugin>;
  private bouncing: boolean;
  private layers: Layer[];
  private gesture: any;
  private offset: object;
  public dimensionWidth: number;
  public dimensionHeight: number;
  public enableMouseWheel: boolean;
  public zoomOpposite: boolean;

  /**
   * 下发事件白名单，stage在下发事件的时候
   * 只会下发name在这个数组里的layer
   */
  private eventWhiteList: Array<string>;

  constructor(options: IStageOptions) {
    super({ pipeline: "stage" });
    this.initStage(options);
    this.layers = [];
    this.plugins = [];
    this.eventWhiteList = [];
  }

  /**
   * @remarks 初始化舞台
   * @param  {IStageOptions} options
   * @returns void
   */
  initStage(options: IStageOptions): void {
    this.dimensionWidth = options.dimensionWidth || DimensionWidth;
    this.dimensionHeight = options.dimensionHeight || DimensionHeight;
    let rootContainer = options.container instanceof HTMLElement ? options.container : document.querySelector(options.container);
    this.bouncing = typeof options.bouncing === "undefined" ? false : options.bouncing;
    this.scrollable = typeof options.scrollable === "undefined" ? true : options.scrollable;
    this.container = rootContainer;
    this.mouseMoveContainer = options.mouseMoveContainer || rootContainer;
    this.containerBbox = rootContainer.getBoundingClientRect(); //resize 之后 重新获取
    this.viewPortWidth = this.container.clientWidth || options.viewportWidth;
    this.viewPortHeight = this.container.clientHeight || options.viewportHeight;
    this.width = options.contentWidth;
    this.height = options.contentHeight;
    this.maxZoom = options.maxZoom || defaultMaxZoom;
    // 计算content居中到viewport 的合适zoom比例
    this.fitZoom = calcFitViewPortZoom(this.viewPortWidth, this.viewPortHeight, this.width, this.height);
    this.minZoom = options.minZoom || this.fitZoom;
    this.zoom = options.zoom || this.fitZoom;
    this.zoomOpposite = !!options.zoomOpposite;
    this.enableMouseWheel = typeof options.enableMouseWheelAble === "undefined" ? true : options.enableMouseWheelAble;
    // 计算content 相对于dimensions 的偏移量，使content 相对居中
    this.offset = calcContentOffset(this.zoom, this.width, this.height, this.dimensionWidth, this.dimensionHeight);
    this.createDomTree();
    this.gesture = new Gesture(rootContainer, this);
    new ScrollView(this);
    this.fitToViewport(this.zoom);
    this.bindEvent();
    // console.warn(this)
  }

  /**
   * 关闭单击延时以关闭hammer默认的单双击判断
   */
  closeSingleDoubleTapCheck() {
    this.gesture.closeSingleDoubleTapCheck();
  }

  /**
   * 开启单击延时以开启hammer默认的单双击判断
   */
  openSingleDoubleTapCheck() {
    this.gesture.openSingleDoubleTapCheck();
  }

  /**
   * @remarks 初始化stage接收的事件。包含手势事件、基础事件
   * @return void
   */
  private bindEvent(): void {
    this.on("click dbclick rightclick pan panstart panend press pressup mousemove", e => {
      this.handleEvent(e);
    });
  }

  private offEvent(): void {
    this.off("click dbclick rightclick pan panstart panend press pressup mousemove", e => {
      this.handleEvent(e);
    });
  }

  private handleEvent(e): void {
    this.layers.forEach(layer => {
      if (!this.determineWhetherDispatch(layer)) return;
      if (!layer.ignoreEvents.includes(e.nativeEvent.eventName)) {
        layer.emit(e.nativeEvent.eventName, e);
      }
    });
  }

  /**
   * 根据黑白名单的逻辑
   * 判断这个layer当前
   * 是否应该被stage分发事件
   * @param layer
   */
  private determineWhetherDispatch(layer): boolean {
    return this.eventWhiteList.includes(layer.options.name);
  }

  /**
   * 设置viewport、scrollContent 大小
   * @param viewPortWidth
   * @param viewPortHeight
   * @param contentWidth
   * @param contentHeight
   * @param autoFit
   * @return void
   */
  public resize(viewPortWidth: number, viewPortHeight: number, contentWidth: number, contentHeight: number, autoFit = true): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        this.resizeContent(contentWidth, contentHeight);
        this.resizeViewPort(viewPortWidth, viewPortHeight);
        this.fitZoom = calcFitViewPortZoom(viewPortWidth, viewPortHeight, contentWidth, contentHeight);
        this.zoom = this.fitZoom; // 默认最小zoom
        this.minZoom = this.fitZoom; // 默认最小zoom
        this.scrollView.options.minZoom = this.fitZoom;
        // 计算content 相对于dimensions 的偏移量，使content 相对居中
        this.offset = calcContentOffset(this.fitZoom, contentWidth, contentHeight, this.dimensionWidth, this.dimensionHeight);
        this.layerPanel.style.marginLeft = this.offset.x + "px";
        this.layerPanel.style.marginTop = this.offset.y + "px";
        if (autoFit) {
          this.fitToViewport(this.zoom).then(() => {
            resolve(true);
          });
        }
      } catch (error) {
        reject(false);
      }
    });
  }

  /**
   * 修改滚动区大小
   * @param contentWidth
   * @param contentHeight
   */
  private resizeContent(contentWidth: number, contentHeight: number) {
    //修改scrollContent 宽高
    this.width = contentWidth;
    this.height = contentHeight;
    // 更新所有layer 大小
    this.getLayers().forEach(layer => {
      layer.resize(contentWidth, contentHeight);
    });
  }

  /**
   * 修改视口尺寸
   * @param  {number} viewPortWidth
   * @param  {number} viewPortHeight
   */
  private resizeViewPort(viewPortWidth: number, viewPortHeight: number) {
    if (viewPortHeight !== this.viewPortHeight || viewPortWidth !== this.viewPortWidth) {
      // 修改视口宽高，重新获取 bbox
      this.container.style.width = viewPortWidth + "px";
      this.container.style.height = viewPortHeight + "px";
      this.viewPortWidth = viewPortWidth;
      this.viewPortHeight = viewPortHeight;
      this.containerBbox = this.container.getBoundingClientRect(); // resize 之后 重新获取
      this.scrollView.setDimensions(viewPortWidth, viewPortHeight, this.dimensionWidth, this.dimensionHeight);
    }
  }

  /**
   * @remarks 适配到窗口区域，滚动到视口中央
   * @param _zoom - 缩放等级
   * @param animate - 开启滚动动画
   */
  public fitToViewport(_zoom?: number, animate = false): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        // 移动到 dimension 中心
        let zoom = this.fitZoom;
        if (_zoom) {
          zoom = Number(_zoom.toFixed(5));
        }
        const scrollLeft = this.offset.x * zoom - this.viewPortWidth / 2 + (this.width / 2) * zoom;
        const scrollTop = this.offset.y * zoom - this.viewPortHeight / 2 + (this.height / 2) * zoom;
        this.scrollView.zoomTo(zoom, false, 0, 0);
        this.zoom = this.fitZoom;
        this.scrollTo(scrollLeft, scrollTop, animate);
        resolve(true);
      } catch (error) {
        console.log(error);
        reject(false);
      }
    }).then(e => this.emit("fittoviewport", e));
  }
  /**
   * 指定BBox 适配到窗口中心
   * @param  pathBBox
   * @param  svgScale - SVG底图 transform: scale, 默认为 1
   * @param  buffer - 完全适配窗口预留padding buffer 默认值：0.8
   */
  public fitBoxToViewport(pathBBox: BBox, svgScale = 1, buffer = 0.8): Promise<any> {
    return new Promise((resolve, reject) => {
      let fitBoxZoom = calcFitViewPortZoom(this.viewPortWidth, this.viewPortHeight, pathBBox.width * svgScale, pathBBox.height * svgScale) * buffer;
      if (fitBoxZoom < this.minZoom) {
        this.zoom = this.minZoom;
      } else if (fitBoxZoom > this.maxZoom) {
        this.zoom = this.maxZoom;
      } else {
        this.zoom = fitBoxZoom;
      }
      const scrollLeft = this.offset.x * this.zoom - this.viewPortWidth / 2 + (pathBBox.x + pathBBox.width / 2) * svgScale * this.zoom;
      const scrollTop = this.offset.y * this.zoom - this.viewPortHeight / 2 + (pathBBox.y + pathBBox.height / 2) * svgScale * this.zoom;

      if (fitBoxZoom < this.minZoom) {
        this.scrollTo(scrollLeft, scrollTop, false);
        resolve({
          zoom: this.zoom,
          scrollLeft,
          scrollTop,
          originScrollLeft: this.scrollLeft,
          originScrollTop: this.scrollTop,
        });
      } else {
        const fixPoint: Point | any = {};
        // 把相对于demision的坐标，转换为相对于viewport坐标;
        // 但是以Stationary point zoomTo 之后，这个区域并不在舞台中央；
        // 无法根据click point的pageX,pageX 计算出Box相对于视口的pageX pageY. 所以先zoom 再滚动
        this.scrollView.zoomTo(
          this.zoom,
          false,
          fixPoint.x,
          fixPoint.y,
          debounce(() => {
            // 相对一个远距离的点zoomTo, 防止先把舞台正中心zoomTo到视口中间产生闪烁；
            // originScrollLeft/Top 为改zoom下居中的scrollTop/Left
            resolve({
              zoom: this.zoom,
              scrollLeft,
              scrollTop,
              originScrollLeft: this.scrollLeft,
              originScrollTop: this.scrollTop,
            });
            this.scrollTo(scrollLeft, scrollTop, false);
          }),
          100
        );
      }
    }).then(e => {
      this.emit("fitboxtoviewport", e);
    });
  }

  /**
   * @param  {number} _x - Gesture point.x
   * @param  {number} _y - Gesture point.y
   * @returns {x,y} 转换为scrollContent内真实坐标 (0,0)
   */
  public convertPointerPosition(_x: number, _y: number): Point {
    let scrollValues = this.scrollView.getValues();
    let x = _x + scrollValues.left - this.offset.x * scrollValues.zoom;
    let y = _y + scrollValues.top - this.offset.y * scrollValues.zoom;
    return { x: x / scrollValues.zoom, y: y / scrollValues.zoom };
  }

  /**
   * 放大/缩小舞台
   * @param zoom - 缩放比例。当小于/大于 stage设置的 minZoom/maxZoom时，默认使用 minZoom/maxZoom
   * @param animate
   * @param pageX
   * @param pageY
   * @param callback?
   * * @return void
   */
  public zoomTo(zoom: number, animate = true, pageX: number, pageY: number, callback?: Function): void {
    let point = {};
    if (pageX && pageY) {
      point = this.convertPointerPosition(pageX, pageY);
    }
    this.scrollView.zoomTo(zoom, animate, point.x, point.y, () => {
      this.zoom = zoom;
      this.emit("stage:zoom", { zoom: zoom, zoomType: "zoomTo" });
      if (callback) {
        callback();
      }
    });
  }

  /**
   * Zooms the content by the given factor.
   * emit event stage:zoom after zoom
   * @param  factor zoomStep
   * @param animate 是否开启缩放动画
   * @param callback
   * @returns void
   */
  public zoomBy(factor: number, animate = true, callback?: Function): void {
    this.scrollView.zoomBy(factor, animate, this.viewPortWidth / 2, this.viewPortHeight / 2, () => {
      this.emit("stage:zoom", { zoom: this.zoom, zoomType: "zoomBy" });
    });
    const newZoom = this.zoom * factor;
    this.zoom = newZoom > this.maxZoom ? this.maxZoom : newZoom < this.minZoom ? this.minZoom : newZoom;
  }
  /**
   * 滚动舞台到指定位置
   * @param left {Number?null} Horizontal scroll position, keeps current if value is <code>null</code>
   * @param top {Number?null} Vertical scroll position, keeps current if value is <code>null</code>
   * @param animate {Boolean?false} Whether the scrolling should happen using an animation
   * @param zoom
   */
  public scrollTo(left: number, top: number, animate = true, zoom?: number): void {
    this.scrollView.scrollTo(left, top, animate, zoom);
    this.emit("stage:scrollto", { left, top });
  }

  public add(layer: Layer): void {
    this.addLayer(layer);
  }

  /**
   * 添加Layer
   * 添加完成后emit layer:add 事件
   * @param layer
   */
  public addLayer(layer: Layer): void {
    invariant(!this.getLayers().find(l => l.options.name === layer.options.name), "Duplicate Layer name");
    if (layer.getOptions().fixed) {
      this.addFixLayer(layer);
    } else {
      layer.getView().style.width = this.width + "px";
      layer.getView().style.height = this.height + "px";
      this.layerPanel.appendChild(layer.getView());
    }
    Object.assign(layer, { stage: this });
    this.layers.push(layer);
    this.pushEventWhiteList(layer.options.name);
    layer.emit("layer:add", layer);
  }

  public remove(layer: Layer): boolean {
    return this.removeLayer(layer);
  }

  /**
   * 删除Layer
   * @param layer - Layer实例
   * @return boolean - 删除状态
   */
  public removeLayer(layer: Layer): boolean {
    if (!layer || !(layer instanceof Layer)) return false;
    let bgLayerIndex = null;
    let layerName = layer.options.name;
    bgLayerIndex = this.getLayers().findIndex((l: Layer) => {
      return l.options.name && l.options.name === layerName;
    });
    if (bgLayerIndex < 0) return false;
    layer.destroy();
    this.layers.splice(bgLayerIndex, 1);
    this.removeFromEventWhiteList(layerName);
    return true;
  }

  /**
   * 清楚所有图层
   */
  public removeAllLayer(): void {
    this.layers.forEach(layer => {
      // layer.removeAllItem();
      layer.destroy();
    });
    this.layers.length = 0;
    this.layerPanel.innerHTML = "";
    this.clearEventWhiteList();
  }

  /**
   * 获取Layer 实例
   * @param layerName - Layer 名称
   */
  public getLayer(layerName: string): Layer {
    const layerIndex = this.getLayers().findIndex((l: Layer) => {
      return l.options.name && l.options.name === layerName;
    });
    return this.layers[layerIndex];
  }

  /**
   * 获取Stage所有Layer
   * @returns Array 舞台下所有Layer
   */
  public getLayers(): Array<Layer> {
    return this.layers;
  }

  /**
   * 获取当前缩放比例
   * @returns number 当前舞台缩放比例
   */
  public getZoom(): number {
    return this.zoom;
  }

  public setGesture(el: object): void {
    this.gesture = el;
  }

  /**
   * @remarks 挂载插件
   *
   * @param {Plugin} plugin - 插件实例
   * @return {pluginId} - 插件id
   */
  public plug(plugin: Plugin): string {
    this.plugins.push(plugin);
    Object.assign(plugin, { stage: this });
    return plugin.pluginId;
  }

  /**
   * @remarks 卸载插件
   * @param pluginId
   */
  public unPlug(pluginId: string): void {
    const pluginIndex = this.plugins.findIndex(p => p.pluginId === pluginId);
    this.getPlugin(pluginId).revoke();
    this.plugins.splice(pluginIndex, 1);
  }

  /**
   * @remarks 获取插件
   *
   * @param {string} pluginId - 插件id
   * @return {Plugin} - 插件实例
   */
  public getPlugin(pluginId: string): Plugin {
    return this.plugins.find(plugin => plugin.pluginId === pluginId);
  }

  /**
   * 获取挂载到stage 的所有插件
   */
  public getAllPlugins(): Array<Plugin> {
    return this.plugins;
  }

  /**
   * 设置stage 是否可滚动
   * @param  {boolean} scrollable - true 可滚动；false 禁止滚动
   * @returns boolean
   */
  public setScrollable(scrollable: boolean): boolean {
    this.scrollView.options.scrollingX = scrollable;
    this.scrollView.options.scrollingY = scrollable;
    this.scrollable = scrollable;
    return scrollable;
  }

  /**
   * @remarks 初始化 Dom 结构
   * @returns void
   */
  private createDomTree(): void {
    let scrollContent = document.createElement("div");
    let layerPanel = document.createElement("div");

    scrollContent.className = "aseat-scroll-content";
    scrollContent.style.position = "absolute";
    scrollContent.style.width = this.dimensionWidth + "px";
    scrollContent.style.height = this.dimensionHeight + "px";
    scrollContent.style.transformOrigin = "0 0";
    layerPanel.className = "aseat-layer-panel";
    layerPanel.style.position = "absolute";
    // 设置scroll-content offset偏移量
    layerPanel.style.marginLeft = this.offset.x + "px";
    layerPanel.style.marginTop = this.offset.y + "px";
    scrollContent.appendChild(layerPanel);
    this.container.appendChild(scrollContent);
    this.scrollContent = scrollContent;
    this.layerPanel = layerPanel;
  }

  /**
   * @param layer
   * @remarks 添加fixed layer dom
   */
  private addFixLayer(layer: Layer): void {
    // 判断有没有 fixed panel
    if (!this.layerFixedPanel) {
      let layerFixedPanel = document.createElement("div");
      layerFixedPanel.className = "aseat-layer-panel-fixed";
      layerFixedPanel.style.position = "absolute";
      layerFixedPanel.style.width = "100%";
      layerFixedPanel.style.height = "100%";
      this.container.appendChild(layerFixedPanel);
      this.layerFixedPanel = layerFixedPanel;
      this.layerFixedPanel.appendChild(layer.getView());
    } else {
      this.layerFixedPanel.appendChild(layer.getView());
    }
    layer.getView().style.width = this.viewPortWidth + "px";
    layer.getView().style.height = this.viewPortHeight + "px";
  }

  /**
   * 向事件分发白名单内添加layer的name
   * @param name layer的name
   */
  public pushEventWhiteList(name) {
    if (!this.eventWhiteList.includes(name)) {
      this.eventWhiteList.push(name);
    }
  }

  /**
   * 从事件分发白名单内删除layer的name
   * @param name layer的name
   */
  public removeFromEventWhiteList(name) {
    if (this.eventWhiteList.includes(name)) {
      this.eventWhiteList.splice(
        this.eventWhiteList.findIndex(item => item === name),
        1
      );
    }
  }

  /**
   * 清空事件分发白名单
   */
  public clearEventWhiteList() {
    this.eventWhiteList = [];
  }

  public getOffset() {
    return this.offset;
  }

  public destroy() {
    this.removeAllLayer();
    this.plugins.forEach(plugin => plugin.revoke());
    this.plugins.length = 0;
    this.offEvent();
    this.container.innerHTML = null;
    this.gesture = null;
    this.scrollView = null;
  }
}
