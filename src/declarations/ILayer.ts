
/**
 * 图层初始化数据对象
 */
export interface ILayerOptions {
  /** 图层名称 **/
  name?: string;
  /** 图层层级 **/
  zIndex?: number;
  /** 图层透明度 **/
  opacity?: number;
  /** event whiteList */
  ignoreEvents?: any[];
  /** Layer 是否fix 不跟随scrollView滚动 */
  fixed?: boolean;
  /** 透传给render的options*/
  renderOptions?: object;
  /** className */
  className?: string;
  /** 指定layer width,默认取stage width */
  width?: number;
  /** 指定layer height,默认取stage height */
  height?: number;
}

export interface ILayerFillOptions {
  /** layer名称 */
  name?: string;
  /** layer 层级 */
  zIndex?: number;
}

export interface IGridLayerOptions extends ILayerOptions {
  /** 网格尺寸 **/
  size?: number;
}