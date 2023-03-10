//   规范
// 座位大小：24px
// 座位颜色：白底#ffffff，描边1px，描边颜色#333333
// 座号颜色：#333333，字号12
// 排号颜色：#999999，字号16
// 间距：座间距4px，排间距8px，排号与座间距8px
// 报错颜色：FF3000（其它参数不变）
// 置灰颜色：CCCCCC（其它参数不变）
import { Matrix } from "@/index";
import { Arc, Group, Text } from "@/item";
import { decomposeSeat } from "@/item/custom/seat_attrs";

export default class Seat extends Group {
  _class: string;

  constructor(attrs: object) {
    super(attrs);
    this._class = "Seat";
  }

  public applyMatrix(m: Matrix): void {
    const point = m.applyToPoint(this.xCoord, this.yCoord);
    this.setAttrs({ xCoord: point.x, yCoord: point.y });
  }

  public setAttrs(attrs: object, deleted: object = {}) {
    super.setAttrs(attrs, deleted);
    if (this.deleted) {
      this._children.length = 0;
    } else {
      const attrs = decomposeSeat(this);
      if (this._children.length === 0) {
        this._children.push(new Arc(attrs[0]));
        this._children.push(new Arc(attrs[1]));
        this._children.push(new Text(attrs[2]));
      } else {
        if (this.drawable) this._children[0].setAttrs(attrs[0]);
        if (this.arcDrawable) this._children[1].setAttrs(attrs[1]);
        if (this.fontDrawable || this.showLabel) this._children[2].setAttrs(attrs[2]);
      }
      this._children[0].setRenderable(this.drawable);
      this._children[1].setRenderable(this.arcDrawable);
      this._children[2].setRenderable(this.fontDrawable || this.showLabel);
    }

    this.updateBBox();
  }
}
