import Seat from "./Seat";

export default class Label extends Seat {
  constructor(attrs: object) {
    const defaultAttrs = { fontSize: 16, textWidth: 8, textHeight: 16, stroke: "#999999" };
    super({ ...attrs, ...defaultAttrs });
    this._class = "Label";
  }

  public setAttrs(attrs: object, deleted: object = {}) {
    super.setAttrs(attrs, deleted);
    if (this._children.length) this._children[0].setAttrs({ stroke: "transparent", fill: "transparent" });
  }
}
