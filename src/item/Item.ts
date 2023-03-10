import BBox from "@/basic/BBox";
import Matrix from "@/basic/Matrix";
import ItemType from "@/item/ItemType";
import Layer from "@/layer/Layer";

let guid = 0;

export default abstract class Item {
  public readonly _guid: number;
  public readonly type: ItemType;
  private dirty: boolean;
  public readonly _bounding: BBox;
  public _layer: Layer; // 挂载点
  public _ref: any;
  public _renderable: boolean;
  // for grid todo 应该放到 GridCanvas 里面
  public relatedGridNames: Array<string>;

  constructor(attrs: object, type: ItemType) {
    this.type = type;
    this._guid = guid++;
    this._bounding = new BBox();
    this._renderable = true;
    this.dirty = true;
  }

  public abstract updateBBox();

  public abstract applyMatrix(m: Matrix): void;

  public isEquals(item: Item): boolean {
    return this === item || this._guid === item._guid;
  }

  public clone(attrs: object = undefined): Item {
    // @ts-ignore
    return new this.constructor(attrs || this.getAttrs(), this.type);
  }

  // -- attrs --
  public getAttrs(): object {
    return this;
  }

  public setAttrs(attrs: object = {}, deleted: object = {}) {
    const keys = Object.keys(attrs).filter(key => !(key.startsWith("_") || key === "ref"));
    keys.forEach(key => (this[key] = attrs[key]));

    this.dirty = true;
    // if (this._layer) this._layer.updateItem(this);
  }

  public setRenderable(drawable: boolean) {
    this._renderable = drawable;
  }

  public getDifference(): object {
    return { different: this.dirty };
  }

  public clearDifference(): void {
    this.dirty = false;
  }

  // -- bounding --
  public isPointInside(x: number, y: number): boolean {
    return this._bounding.isPointInside({ x, y });
  }

  public isIntersect(x: number, y: number, width: number, height: number): number {
    const box = new BBox(x, y, width, height);
    return this._bounding.isIntersect(box) || box.isIntersect(this._bounding);
  }

  // -- matrix --
  public translate(tx: number = 0, ty: number = 0) {
    const matrix = new Matrix().translate(tx, ty);
    this.applyMatrix(matrix);
    this.updateBBox();
  }

  public remove() {
    if (this._layer) this._layer.remove(this);
  }

  public destroy(): void {
    this._layer = undefined;
  }

  public setLayer(layer) {
    this._layer = layer;
  }

  public getRef() {
    return this._ref;
  }

  public setRef(ref: any) {
    this._ref = ref;
  }
}
