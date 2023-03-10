/**
 * Stage初始化对象
 */
export default interface IStageOptions {
  /** 最外层Dom容器 可以是Dom对象，也可以是queryselector **/
  container: any;
  /** mouse move dom container */
  mouseMoveContainer?: HTMLElement;
  /** 滚动区域宽度 **/
  contentWidth: number;
  /** 滚动区域高度 **/
  contentHeight: number;
  /** viewPort 容器宽度 **/
  viewportWidth?: number;
  /** viewPort 容器高度 **/
  viewportHeight?: number;
  /** 最小缩放比例 **/
  minZoom?: number;
  /** 最大缩放比例 **/
  maxZoom?: number;
  /** 当前缩放比例 */
  zoom?: number;
  /** 弹性滚动 */
  bouncing?: boolean;
  /** 锁定滚动 */
  scrollable?: boolean | true;
  /** 滚动区域宽度 */
  dimensionWidth?: number;
  /** 滚动区域高度 */
  dimensionHeight?: number;
  /** 滚轮默认缩放 */
  enableMouseWheelAble?: boolean | true;
  /** 开启滚轮反向缩放，默认国际化正向，开启后为国内正向（国际化反向） */
  zoomOpposite?: boolean | false;
}