// import {
//   BBox,
//   CanvasGroup as Group,
//   CanvasLayer as Layer,
//   CanvasPoint as Point,
//   CanvasRect as Rect,
//   Matrix
// } from 'aseat-core';

import { Group, Rect } from "@/item";
import Layer from "@/layer/Layer";
import Point from "@/basic/Point";
import Matrix from "@/basic/Matrix";

export default class Selector extends Group {
  shapeLayer: Layer;
  mountedLayer: Layer;
  point: Point;
  hits: Array<number>;
  options: object;

  constructor(options: object) {
    super({ stroke: "#5584FF", size: 7, ...options });
    this.options = options;
  }

  public applyMatrix(m: Matrix): void {
    throw new Error("Method not implemented.");
  }

  public setAttrs(attrs: object) {
    super.setAttrs(attrs);
    // @ts-ignore
    const { shape, stroke, strokeWidth, size, ...rest } = this.getAttrs();
    const { x, y, width, height } = shape._bounding;
    const [tl, tr, bl, br] = shape._bounding.getPoints();
    const [n, e, s, w] = [
      { x: (tl.x + tr.x) / 2, y: tl.y }, // 北
      { x: tr.x, y: (tr.y + br.y) / 2 }, // 东
      { x: (bl.x + br.x) / 2, y: br.y }, // 南
      { x: tl.x, y: (tl.y + bl.y) / 2 }, // 西
    ];
    const points = [tl, n, tr, e, br, s, bl, w];

    if (this._children.length === 0) {
      const rect = new Rect({ x, y, width, height, stroke, strokeWidth, fill: "transparent" });
      const handlers = points.map(
        (point, index) =>
          new Rect({
            x: point.x - (size - 1) / 2,
            y: point.y - (size - 1) / 2,
            width: size,
            height: size,
            stroke,
            strokeWidth,
            fill: "#fff",
          })
      );
      this._children.push(rect, ...handlers);
    } else {
      const [rect, ...handlers] = this._children;
      rect.setAttrs({ x, y, width, height, stroke, fill: "transparent" });
      points.forEach((point, index) =>
        handlers[index].setAttrs({
          x: point.x - (size - 1) / 2,
          y: point.y - (size - 1) / 2,
          width: size,
          height: size,
          stroke,
          strokeWidth,
          fill: "#fff",
        })
      );
    }
  }

  /**
   * 挂载到layer上
   *
   * @param shapeLayer
   * @param mountedLayer
   */
  public mountLayer(shapeLayer: Layer, mountedLayer: Layer) {
    this.shapeLayer = shapeLayer;
    this.mountedLayer = mountedLayer;
    this.doMount();
  }

  /**
   * 从layer上卸载
   *
   * @param shapeLayer
   * @param mountedLayer
   */
  public unmountLayer(shapeLayer: Layer, mountedLayer: Layer) {
    this.doUnmount();
  }

  private doMount() {
    this.mountedLayer.on("panstart", this.handlePanStart);
    this.mountedLayer.on("pan", this.handlePan);
    this.mountedLayer.on("panend", this.handlePanEnd);

    this.mountedLayer.addItem(this);
    this.mountedLayer.render();
    this.setCursor();
  }

  private doUnmount() {
    this.mountedLayer.off("panstart", this.handlePanStart);
    this.mountedLayer.off("pan", this.handlePan);
    this.mountedLayer.off("panend", this.handlePanEnd);

    this.mountedLayer.removeItem(this);
    this.mountedLayer.render();
  }

  setCursor = () => {
    for (let index = 0; index < this._children.length; index++) {
      const child = this._children[index];
      switch (index) {
        case 0:
          child.ref.style.cursor = "move";
          break;
        case 1:
        case 5:
          child.ref.style.cursor = "nwse-resize";
          break;
        case 2:
        case 6:
          child.ref.style.cursor = "ns-resize";
          break;
        case 3:
        case 7:
          child.ref.style.cursor = "nesw-resize";
          break;
        case 4:
        case 8:
          child.ref.style.cursor = "ew-resize";
          break;
        default:
          break;
      }
    }
  };

  private handlePanStart = (ev: object) => {
    // @ts-ignore
    const { x, y } = ev.point;

    this.hits = [];
    for (let index = 0; index < this._children.length; index++) {
      const child = this._children[index];
      if (child.isPointInside(x, y)) {
        this.hits.push(index);
      }
    }

    this.point = { x, y };
  };

  private handlePan = (ev: object) => {
    // 碰撞上了
    // @ts-ignore
    if (this.hits && this.hits.length > 0) {
      this.doHandlePan(ev);
    }
    this.point = ev.point;
  };

  private doHandlePan = ev => {
    // @ts-ignore
    const { shape, editType = 1 } = this.getAttrs();
    // @ts-ignore
    const dx = ev.point.x - this.point.x;
    // @ts-ignore
    const dy = ev.point.y - this.point.y;
    const [tl, tr, bl, br] = shape._bounding.getPoints();
    const ratio = shape._bounding.width / shape._bounding.height;
    const [n, e, s, w] = [
      { x: (tl.x + tr.x) / 2, y: tl.y }, // 北
      { x: tr.x, y: (tr.y + br.y) / 2 }, // 东
      { x: (bl.x + br.x) / 2, y: br.y }, // 南
      { x: tl.x, y: (tl.y + bl.y) / 2 }, // 西
    ];
    let points = [];
    const hitTestIndex = this.hits[this.hits.length - 1];
    switch (hitTestIndex) {
      case 0: // rect
        tl.x += dx;
        tl.y += dy;
        br.x += dx;
        br.y += dy;

        points = [tl, br];
        break;
      case 1: // 上左
        if (editType === 1) {
          tl.x += dx;
          tl.y += dx / ratio;
        } else {
          tl.x += dx;
          tl.y += dy;
        }
        points = [tl, br];
        break;
      case 2: // 北
        n.y += dy;
        if (editType === 1) {
          // 等比缩放同步修改
          br.x -= dy * ratio;
        }
        points = [n, bl, br];
        break;
      case 3: // 上右
        if (editType === 1) {
          // 等比缩放同步修改
          tr.x += dx;
          tr.y -= dx / ratio;
        } else {
          tr.x += dx;
          tr.y += dy;
        }
        points = [tr, bl];
        break;
      case 4: // 东
        e.x += dx;
        if (editType === 1) {
          // 等比缩放同步修改
          bl.y += dx / ratio;
        }
        points = [tl, bl, e];
        break;
      case 5: // 下右
        if (editType === 1) {
          br.x += dx;
          br.y += dx / ratio;
        } else {
          br.x += dx;
          br.y += dy;
        }
        points = [tl, br];
        break;
      case 6: // 南
        s.y += dy;
        if (editType === 1) {
          // 等比缩放同步修改
          tr.x += dy * ratio;
        }
        points = [tl, tr, s];
        break;
      case 7: // 下左
        if (editType === 1) {
          bl.x += dx;
          bl.y -= dx / ratio;
        } else {
          bl.x += dx;
          bl.y += dy;
        }
        points = [bl, tr];
        break;
      case 8: // 西
        w.x += dx;
        if (editType === 1) {
          // 等比缩放同步修改
          br.y -= dx / ratio;
        }
        points = [w, tr, br];
        break;

      default:
        break;
    }
    const pointsBounding = new BBox();
    pointsBounding.updateByPoints(points);
    if (pointsBounding.width < 70 || pointsBounding.height < 70) {
      return;
    }
    shape._bounding.updateByPoints(points);
    shape.setAttrs(shape._bounding);
    this.shapeLayer.updateItem(shape);
    this.shapeLayer.render();

    this.setAttrs({ shape });
    this.mountedLayer.updateItem(this);
    this.mountedLayer.render();
  };

  private handlePanEnd = (ev: object) => {
    // this.handlePan(ev);
    if (this.options.onPanEnd && typeof this.options.onPanEnd === "function") {
      this.options.onPanEnd(this.getAttrs().shape);
    }
  };
}
