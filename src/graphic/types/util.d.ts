import { Shape } from "@/graphic/types/shape";

declare interface Graphic {
  draw(shape: Shape, container: object, zIndex?: number): void;
  clear(shape: Shape, container: object): void;
  getClearBox(shape: Shape): Box;
  getBBox(shape: Shape): SVGRect;
  clearContext(context: CanvasRenderingContext2D, width: number, height: number): void;
}

declare interface Point {
  x: number;
  y: number;
}

declare interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}
