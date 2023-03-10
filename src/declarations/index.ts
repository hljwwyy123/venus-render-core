
export interface IZoomBy {
  zoom: number;
  isAnimated: boolean | false;
  originLeft?: number;
  originTop?: number;
  callback?: Function;
}

export interface IBBox {
  x: number;
  y: number;
  width: number;
  height: number;
}