import * as Hammer from "hammerjs";
import { IGestureEvent } from "../declarations/IEvent";
// const Hammer = require("imports-loader?window=>this!hammerjs");

import Stage from "../Stage";
import { isMobile, clamp, getOffsetTop, getOffsetLeft } from "../util/index";

/**
 * Stage事件入口
 */
export default class Gesture {
  stage: Stage;
  public manager: Hammer.Manager;
  private singletap: any;
  private doubletap: any;

  constructor(container: HTMLElement, stage: Stage) {
    this.manager = new Hammer.Manager(container);
    this.stage = stage;
    stage.setGesture(this.manager);
    this.initRecognizer();
    this.gestureHandler();
  }
  /**
   * 注册 Hammer RECOGNIZERS
   */
  initRecognizer() {
    this.doubletap = new Hammer.Tap({ event: "doubletap", taps: 2 });
    this.singletap = new Hammer.Tap({ event: "singletap" });
    const pan = new Hammer.Pan({ threshold: 0 });
    const press = new Hammer.Press({ threshold: 9, time: 251 });
    this.manager.add([this.doubletap, this.singletap, pan, press]);
    if (isMobile) {
      const pinch = new Hammer.Pinch();
      this.manager.add(pinch);
      this.manager.get("pinch").set({ enable: true });
    } else {
      this.onMouseWheel();
    }
    // we want to recognize this simulatenous, so a quadrupletap will be detected even while a tap has been recognized.
    this.doubletap.recognizeWith(this.singletap);
    // we only want to trigger a tap, when we don't have detected a doubletap
    this.singletap.requireFailure(this.doubletap);
  }

  /**
   * 关闭单击延时以关闭hammer默认的单双击判断
   */
  closeSingleDoubleTapCheck() {
    this.singletap.options.interval = 0;
  }

  /**
   * 开启单击延时以开启hammer默认的单双击判断
   */
  openSingleDoubleTapCheck() {
    this.singletap.options.interval = 300;
  }

  /**
   * 识别手势事件
   * @param stage
   */
  gestureHandler(): void {
    this.handleClick();
    /** stage 滚动 */
    this.handlePan();
    this.handlePress();
    if (isMobile) {
      this.handlePinch();
    }
    this.handleMouseMove();
  }

  /**
   * @remarks
   * 处理click,dbclick 事件
   */
  handleClick(): void {
    /** 单击 stage */
    this.manager.on("singletap", (ev: IGestureEvent) => {
      const container = this.stage.container;
      const x = ev.srcEvent.pageX - getOffsetLeft(container);
      const y = ev.srcEvent.pageY - getOffsetTop(container);
      const point = this.stage.convertPointerPosition(x, y);
      ev.eventName = "click";
      this.stage.emit("click", { nativeEvent: ev, stage: this.stage, point });
    });

    /** 双击 stage */
    this.manager.on("doubletap", (ev: IGestureEvent) => {
      const container = this.stage.container;
      const x = ev.srcEvent.pageX - getOffsetLeft(container);
      const y = ev.srcEvent.pageY - getOffsetTop(container);
      const point = this.stage.convertPointerPosition(x, y);
      ev.eventName = "dbclick";
      this.stage.emit("dbclick", { nativeEvent: ev, stage: this.stage, point });
    });

    /** 右键 */
    this.stage.container.addEventListener("contextmenu", (ev: IGestureEvent) => {
      ev.preventDefault();
      const container = this.stage.container;
      const x = ev.pageX - getOffsetLeft(container);
      const y = ev.pageY - getOffsetTop(container);
      const point = this.stage.convertPointerPosition(x, y);
      ev.eventName = "rightclick";
      this.stage.emit("rightclick", {
        nativeEvent: ev,
        stage: this.stage,
        point,
      });
    });
  }
  /**
   * 处理拖拽事件
   */
  handlePan(): void {
    this.manager.on("panstart pan panend", (ev: IGestureEvent) => {
      const container = this.stage.container;
      const x = ev.srcEvent.pageX - getOffsetLeft(container);
      const y = ev.srcEvent.pageY - getOffsetTop(container);
      const point = this.stage.convertPointerPosition(x, y);
      switch (ev.type) {
        case "panstart":
          this.stage.scrollable && this.stage.scrollView.doTouchStart(ev.pointers, ev.timeStamp);
          break;
        case "pan":
          this.stage.scrollable && this.stage.scrollView.doTouchMove(ev.pointers, ev.timeStamp);
          break;
        case "panend":
          this.stage.scrollable && this.stage.scrollView.doTouchEnd(ev.timeStamp);
          break;
        default:
          break;
      }
      ev.eventName = ev.type;
      this.stage.emit(ev.type, {
        nativeEvent: ev,
        stage: this.stage,
        point: point,
      });
    });
  }
  /**
   * 处理移动端 双指缩放
   */
  handlePinch(): void {
    /** 缩放 */
    let startScale;
    this.manager.on("pinchstart", e => {
      startScale = e.scale;
    });

    this.manager.on("pinch", e => {
      if (this.stage.scrollable) {
        e.preventDefault();
        this.stage.scrollView.zoomTo(
          clamp(this.stage.zoom + e.scale - startScale, this.stage.minZoom, this.stage.maxZoom),
          false,
          e.pointers[0].pageX / 2 + e.pointers[1].pageX / 2,
          e.pointers[0].pageY / 2 + e.pointers[1].pageY / 2
        );
      }
    });

    this.manager.on("pinchend", e => {
      if (this.stage.scrollable) {
        this.stage.zoom = clamp(this.stage.zoom + e.scale - startScale, this.stage.minZoom, this.stage.maxZoom);
        this.stage.emit("zoom", { zoom: this.stage.zoom });
      }
    });
  }
  /**
   * 长按
   */
  handlePress(): void {
    this.manager.on("press", (ev: any) => {
      ev.eventName = "press";
      this.stage.emit("press", { nativeEvent: ev, stage: this.stage });
    });
    this.manager.on("pressup", (ev: any) => {
      ev.eventName = "pressup";
      this.stage.emit("pressup", { nativeEvent: ev, stage: this.stage });
    });
  }

  /** PC 鼠标滚动scroll */
  onMouseWheel(): void {
    let wheeling;
    if (!this.stage.enableMouseWheel) return;
    this.stage.container.addEventListener(
      "mousewheel",
      (e: any) => {
        e.preventDefault();
        if (this.stage.scrollable) {
          clearTimeout(wheeling);
          wheeling = setTimeout(() => {
            wheeling = undefined;
            // 滚动结束后 再emit事件
            this.stage.zoom = this.stage.scrollView.getValues().zoom;
            this.stage.emit("zoom", { zoom: this.stage.zoom });
          }, 350);
          const baseZoomDirection = this.stage.zoomOpposite ? -1 : 1;
          this.stage.scrollView.doMouseZoom(baseZoomDirection * e.wheelDelta, e.timeStamp, e.pageX - this.stage.containerBbox.left, e.pageY - this.stage.containerBbox.top);
        }
      },
      false
    );
  }

  /** PC 鼠标滑动事件 */
  handleMouseMove(): void {
    let point = {};
    let x;
    let y;
    this.stage.mouseMoveContainer.addEventListener("mousemove", (e: IGestureEvent) => {
      x = e.pageX - getOffsetLeft(this.stage.container);
      y = e.pageY - getOffsetTop(this.stage.container);
      point = this.stage.convertPointerPosition(x, y);
      // 向所有Layers广播
      e.eventName = "mousemove";
      this.stage.emit("mousemove", { nativeEvent: e, point });
    });
  }
}
