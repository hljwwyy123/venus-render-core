import throttle from "lodash.throttle";
import last from "lodash.last";
import Item from "@/item/Item";
import Event from "@/core/Event";

class HoverHandler extends Event {
  options: object;

  private currentItem: Item;

  constructor(options = {}) {
    super(options);
    this.options = options;
  }

  public handleMouseMove(e) {
    throttle(() => {
      const hitTestFunc = this.options.hitTestFunc;
      const item = last(hitTestFunc(e.point.x, e.point.y));
      if (item) {
        // if (this.currentItem !== item) {
        // 避免mousemove丢帧不触发前一次的leave
        this.currentItem && this.emit("mouseleave", { ...e, item: this.currentItem });
        this.currentItem = item;
        item && this.emit("mouseenter", { ...e, item });
        // }
      } else {
        if (this.currentItem) {
          this.emit("mouseleave", { ...e, item: this.currentItem });
          this.currentItem = undefined;
        }
      }
    })(300);
  }
  public destroy() {}
}

export default HoverHandler;
