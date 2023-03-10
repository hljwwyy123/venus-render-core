import { ItemType } from "@/item";

declare interface Style {
  fill: string;
  stroke: string;
  strokeWidth: number;
  fontSize: number;
  lineHeight: number;
}

declare interface Business {
  ref: _SVGGraphicsElement;
}

declare interface Shape extends Style, Business {
  matrix: Matrix;
  type: ItemType;
  extendsAttr?: any[];
}

declare interface Matrix {
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  f: number;
}

declare interface Other extends Shape {
  tagName: string;
}

declare interface Circle extends Shape {
  r: number;
  cx: number;
  cy: number;
}

declare interface Arc extends Circle {
  start: number;
  end: number;
}

declare interface Image extends Shape {
  x: number;
  y: number;
  width: number;
  height: number;
  src: string;
}

declare interface Cache extends Shape {
  x: number;
  y: number;
  width: number;
  height: number;
  canvas: object;
}

declare interface Line extends Shape {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
  lineDash: Array<number>;
  lineDashOffset: number;
}

declare interface Path extends Shape {
  d: string;
}

declare interface Polygon extends Shape {
  points: string;
}

declare interface Polyline extends Shape {
  points: string;
}

declare interface Rect extends Shape {
  x: number;
  y: number;
  width: number;
  height: number;
  rx: number;
  ry: number;
}

declare interface Text extends Shape {
  text: string;
  x: number;
  y: number;
}
