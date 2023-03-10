import { Scroller } from "scroller";
import Stage from "../Stage";

export default class ScrollView {
  private stage: Stage;
  public scrollView: Scroller;
  constructor(stage: Stage) {
    this.stage = stage;
    this.scrollView = new Scroller(this.scrollHandler.bind(this), {
      zooming: true,
      minZoom: stage.minZoom,
      maxZoom: stage.maxZoom,
      bouncing: stage.bouncing,
      scrollable: stage.scrollable,
      locking: false,
      scrollingComplete: this.onScrollingComplete.bind(this),
    });
    this.stage.scrollView = this.scrollView;
    this.scrollView.setDimensions(stage.viewPortWidth, stage.viewPortHeight, stage.dimensionWidth, stage.dimensionHeight);
  }
  /**
   * scrollView滚动回调
   * @param left
   * @param top
   * @param zoom
   */
  scrollHandler(left: number, top: number, zoom: number) {
    this.stage.scrollContent.style.transform = `translate3d(${-left}px,${-top}px,0) scale(${zoom})`;
    this.stage.scrollLeft = left;
    this.stage.scrollTop = top;
    this.stage.emit("scroll", { left, top, zoom });
  }
  /**
   * scroll end 回调
   */
  onScrollingComplete(): void {
    if (this.stage.scrollable) {
      let scrollValues = this.stage.scrollView.getValues();
      this.stage.scrollLeft = scrollValues.left;
      this.stage.scrollTop = scrollValues.top;
    }
  }
  /**
   * 设置实际滚动内容大小
   * @param width
   * @param height
   */
  setDimensions(width: number, height: number) {
    this.scrollView.setDimensions(this.stage.viewPortWidth, this.stage.viewPortHeight, width, height);
  }
}
