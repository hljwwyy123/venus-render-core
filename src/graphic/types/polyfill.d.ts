declare interface SVGPathElement {
  setPathData(pathData: Array<object>): void;
  getPathData(): Array<object>;
}

declare interface SVGGraphicsElement {
  setStyle(key: string, value: string | number): void;
}
