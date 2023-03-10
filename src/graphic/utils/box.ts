import { Circle, Shape } from "@/graphic/types/shape";
import { ItemType } from "@/item/index";
import { movePolyPointsArrayByMatrix, qrDecompose, setMatrixForSVGPathElement, setMatrixForSVGTextElement } from "@/graphic/utils/matrix";
import { getPointsArray } from "@/graphic/utils/poly";
import { rotateAroundAPoint } from "@/graphic/utils/tools";
/**
 * 获取圆形对象的bounding box对象
 *
 * @param circle 圆形对象
 *
 * @returns bounding box对象
 */
function getBBoxFromCircle(circle) {
  const { matrix = { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 }, strokeWidth = 1, r = 100, cx = 200, cy = 200 } = circle;
  const { translateX, translateY, scaleX, scaleY } = qrDecompose(matrix);
  const bbox = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  };
  bbox.x = cx - r - strokeWidth + translateX;
  bbox.y = cy - r - strokeWidth + translateY;
  bbox.width = 2 * r * scaleX + 2 * strokeWidth * scaleX;
  bbox.height = 2 * r * scaleX + 2 * strokeWidth * scaleX;
  return bbox;
}

/**
 * 获取圆形对象的不考虑transform时候的bounding box对象
 *
 * @param circle 圆形对象
 *
 * @returns bounding box对象
 */
function getBBoxFromCircleWithoutTransform(circle) {
  const bbox = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  };
  const { strokeWidth = 1, r = 100, cx = 200, cy = 200 } = <Circle>circle;
  bbox.x = cx - r - strokeWidth;
  bbox.y = cy - r - strokeWidth;
  bbox.width = 2 * r + 2 * strokeWidth;
  bbox.height = 2 * r + 2 * strokeWidth;
  return bbox;
}

/**
 * 获取图片或矩形对象的不考虑transform时候的bounding box对象
 *
 * @param shape 图片或矩形对象
 *
 * @returns bounding box对象
 */
function getBBoxFromImageOrRectWithoutTransform(shape) {
  const { x = 0, y = 0, width = 100, height = 100, strokeWidth = shape.type === ItemType.IMAGE ? 0 : 1 } = shape;
  const bbox = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  };
  bbox.x = x;
  bbox.y = y;
  bbox.width = width + 2 * strokeWidth;
  bbox.height = height + 2 * strokeWidth;
  return bbox;
}

/**
 * 获取图片或矩形对象的bounding box对象
 *
 * @param shape 图片或矩形对象
 *
 * @returns bounding box对象
 */
function getBBoxFromImageOrRect(shape) {
  const { x = 0, y = 0, width = 100, height = 100, strokeWidth = shape.type === ItemType.IMAGE ? 0 : 1, matrix = { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 } } = shape;
  const { angle, scaleX, scaleY, translateX, translateY } = qrDecompose(matrix);
  const bbox = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  };
  const leftTopPoint = { x: x + translateX, y: y + translateY };
  const leftBottomPoint = rotateAroundAPoint(x + translateX, scaleY * (height + 2 * strokeWidth) + y + translateY, x + translateX, y + translateY, angle);
  const rightBottomPoint = rotateAroundAPoint(
    scaleX * (width + 2 * strokeWidth) + x + translateX,
    scaleY * (height + 2 * strokeWidth) + y + translateY,
    x + translateX,
    y + translateY,
    angle
  );
  const rightTopPoint = rotateAroundAPoint(scaleX * (width + 2 * strokeWidth) + x + translateX, y + translateY, x + translateX, y + translateY, angle);
  bbox.x = Math.min(leftTopPoint.x, leftBottomPoint.x, rightBottomPoint.x, rightTopPoint.x);
  bbox.y = Math.min(leftTopPoint.y, leftBottomPoint.y, rightBottomPoint.y, rightTopPoint.y);
  bbox.width = Math.max(leftTopPoint.x, leftBottomPoint.x, rightBottomPoint.x, rightTopPoint.x) - bbox.x;
  bbox.height = Math.max(leftTopPoint.y, leftBottomPoint.y, rightBottomPoint.y, rightTopPoint.y) - bbox.y;
  return bbox;
}

/**
 * 获取直线对象的bounding box对象
 *
 * @param line 直线对象
 *
 * @returns bounding box对象
 */
function getBBoxFromLine(line) {
  const { x1 = 0, x2 = 10, y1 = 0, y2 = 10, strokeWidth = 1 } = line;
  const bbox = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  };
  bbox.x = Math.min(x1, x2) - strokeWidth / 2;
  bbox.y = Math.min(y1, y2) - strokeWidth / 2;
  bbox.width = Math.max(x1, x2) - bbox.x + strokeWidth;
  bbox.height = Math.max(y1, y2) - bbox.y + strokeWidth;
  return bbox;
}

/**
 * 获取路径对象的bounding box对象
 * 降级方案
 * @param path 路径对象
 *
 * @returns bounding box对象
 */
function getBBoxFromPath(path) {
  let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "0");
  svg.setAttribute("height", "0");
  svg.setAttribute("viewBox", "0 0 10000000 10000000");
  document.body.appendChild(svg);

  let tag = document.createElementNS("http://www.w3.org/2000/svg", "path");
  setMatrixForSVGPathElement(path, tag);
  svg.appendChild(tag);
  const bBox = tag.getBBox();
  document.body.removeChild(svg);
  tag = null;
  svg = null;
  return bBox;
}

/**
 * 获取路径对象的不考虑transform时候的bounding box对象
 * 降级方案
 * @param path 路径对象
 *
 * @returns bounding box对象
 */
function getBBoxFromPathWithoutTransform(path) {
  const { d } = path;
  let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "0");
  svg.setAttribute("height", "0");
  svg.setAttribute("viewBox", "0 0 10000000 10000000");
  document.body.appendChild(svg);

  let tag = document.createElementNS("http://www.w3.org/2000/svg", "path");
  tag.setAttribute("d", d);
  svg.appendChild(tag);
  const bBox = tag.getBBox();
  document.body.removeChild(svg);
  tag = null;
  svg = null;
  return bBox;
}
/**
 * 获取多边形或线段组对象的不考虑transform时候的bounding box对象
 *
 * @param poly 多边形或线段组对象
 *
 * @returns bounding box对象
 */
function getBBoxFromPolyWithoutTransform(poly) {
  const { points, strokeWidth = 1 } = poly;
  const pointsArray = getPointsArray(points);
  const bbox = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  };
  bbox.x = Math.min(...pointsArray.map(point => point.x)) - strokeWidth / 2;
  bbox.y = Math.min(...pointsArray.map(point => point.y)) - strokeWidth / 2;
  bbox.width = Math.max(...pointsArray.map(point => point.x)) - bbox.x + strokeWidth;
  bbox.height = Math.max(...pointsArray.map(point => point.y)) - bbox.y + strokeWidth;
  return bbox;
}

/**
 * 获取多边形或线段组对象的bounding box对象
 *
 * @param poly 多边形或线段组对象
 *
 * @returns bounding box对象
 */
function getBBoxFromPoly(poly) {
  const { strokeWidth = 1, matrix } = poly;
  const { scaleX, scaleY } = qrDecompose(matrix);
  const pointsArray = movePolyPointsArrayByMatrix(poly);
  const bbox = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  };
  bbox.x = Math.min(...pointsArray.map(point => point.x)) - (strokeWidth * scaleX) / 2;
  bbox.y = Math.min(...pointsArray.map(point => point.y)) - (strokeWidth * scaleY) / 2;
  bbox.width = Math.max(...pointsArray.map(point => point.x)) - bbox.x + strokeWidth * scaleX;
  bbox.height = Math.max(...pointsArray.map(point => point.y)) - bbox.y + strokeWidth * scaleY;
  return bbox;
}

/**
 * 获取文本对象的不考虑transform时候的bounding box对象
 * 算的不准。。。降级了
 *
 * @param textObject 文本对象
 *
 * @returns bounding box对象
 */
function getBBoxFromTextWithoutTransform(textObject) {
  const { text = "", x = 0, y = 0, strokeWidth = 1, fontSize = 30, lineHeight = 1.16, stroke = "#000000" } = textObject;
  let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "0");
  svg.setAttribute("height", "0");
  svg.setAttribute("viewBox", "0 0 10000000 10000000");
  document.body.appendChild(svg);

  let tag = document.createElementNS("http://www.w3.org/2000/svg", "text");
  tag.textContent = text;
  tag.setAttribute("x", `${x}`);
  tag.setAttribute("y", `${y + fontSize}`);
  // 要随时注意 SVG和CANVAS在画字的时候 x y 代表字的左下角 但用户传进来的x y 希望是左上角
  tag.setStyle("fontSize", `${fontSize}`);
  tag.setStyle("stroke", stroke);
  tag.setStyle("strokeWidth", `${strokeWidth}`);
  tag.setStyle("lineHeight", `${lineHeight}`);
  svg.appendChild(tag);
  const bBox = tag.getBBox();
  document.body.removeChild(svg);
  tag = null;
  svg = null;
  return bBox;

  // let {text = '', x = 0, y = 0, strokeWidth = 1, fontSize = 30, lineHeight = 1.16} = textObject;
  // const bbox = {
  //   x: 0,
  //   y: 0,
  //   width: 0,
  //   height: 0,
  // };
  // bbox.x = x;
  // bbox.y = y;
  // bbox.width = text.length * fontSize;
  // bbox.height = fontSize;
  // return bbox;
}

/**
 * 获取文本对象的bounding box对象
 * 算的不准。。。降级了
 *
 * @param textObject 文本对象
 *
 * @returns bounding box对象
 */
function getBBoxFromText(textObject) {
  const { text = "", x = 0, y = 0, strokeWidth = 1, fontSize = 30, lineHeight = 1.16, stroke = "#000000" } = textObject;
  let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "0");
  svg.setAttribute("height", "0");
  svg.setAttribute("viewBox", "0 0 10000000 10000000");
  document.body.appendChild(svg);

  let tag = document.createElementNS("http://www.w3.org/2000/svg", "text");
  setMatrixForSVGTextElement(textObject, tag);
  tag.textContent = text;
  tag.setAttribute("x", `0`);
  tag.setAttribute("y", `${fontSize}`);
  // 要随时注意 SVG和CANVAS在画字的时候 x y 代表字的左下角 但用户传进来的x y 希望是左上角
  tag.setStyle("fontSize", `${fontSize}`);
  tag.setStyle("stroke", stroke);
  tag.setStyle("strokeWidth", `${strokeWidth}`);
  tag.setStyle("lineHeight", `${lineHeight}`);
  svg.appendChild(tag);
  const bBox = tag.getBBox();
  document.body.removeChild(svg);
  tag = null;
  svg = null;
  return bBox;

  // let {text = '', x = 0, y = 0, strokeWidth = 1, fontSize = 30, lineHeight = 1.16, matrix = {a: 1, b: 0, c: 0, d: 1, e: 0, f: 0}} = textObject;
  // const width = text.length * fontSize;
  // const height = fontSize;
  // const {angle, scaleX, scaleY, translateX, translateY} = qrDecompose(matrix);
  // const bbox = {
  //   x: 0,
  //   y: 0,
  //   width: 0,
  //   height: 0,
  // };
  // const leftTopPoint = {x: x + translateX, y: y + translateY};
  // const leftBottomPoint = rotateAroundAPoint(x + translateX, scaleY * height + y + translateY, x + translateX, y + translateY, angle);
  // const rightBottomPoint = rotateAroundAPoint(scaleX * width + x + translateX, scaleY * height + y + translateY, x + translateX, y + translateY, angle);
  // const rightTopPoint = rotateAroundAPoint(scaleX * width + x + translateX, y + translateY, x + translateX, y + translateY, angle);
  //
  // bbox.x = Math.min(leftTopPoint.x, leftBottomPoint.x, rightBottomPoint.x, rightTopPoint.x);
  // bbox.y = Math.min(leftTopPoint.y, leftBottomPoint.y, rightBottomPoint.y, rightTopPoint.y);
  // bbox.width = Math.max(leftTopPoint.x, leftBottomPoint.x, rightBottomPoint.x, rightTopPoint.x) - bbox.x;
  // bbox.height = Math.max(leftTopPoint.y, leftBottomPoint.y, rightBottomPoint.y, rightTopPoint.y) - bbox.y;
  // return bbox;
}

/**
 * 获取图形对象的不考虑transform时候的bounding box对象
 *
 * @param shape 图形对象
 *
 * @returns bounding box对象
 */
export function getBBoxWithoutTransform(shape: Shape) {
  const { type } = shape;
  switch (type) {
    case ItemType.RECT:
    case ItemType.IMAGE:
      return getBBoxFromImageOrRectWithoutTransform(shape);
    case ItemType.TEXT:
      return getBBoxFromTextWithoutTransform(shape);
    case ItemType.PATH:
      return getBBoxFromPathWithoutTransform(shape);
    case ItemType.POLYLINE:
    case ItemType.POLYGON:
      return getBBoxFromPolyWithoutTransform(shape);
    case ItemType.LINE:
      return getBBoxFromLine(shape);
    case ItemType.CIRCLE:
      return getBBoxFromCircleWithoutTransform(shape);
    case ItemType.OTHER:
      break;
  }
}

/**
 * 获取图形对象的bounding box对象
 *
 * @param shape 图形对象
 *
 * @returns bounding box对象
 */
function getBBox(shape: Shape) {
  const { type } = shape;
  switch (type) {
    case ItemType.RECT:
    case ItemType.IMAGE:
      return getBBoxFromImageOrRect(shape);
    case ItemType.TEXT:
      return getBBoxFromText(shape);
    case ItemType.PATH:
      return getBBoxFromPath(shape);
    case ItemType.POLYLINE:
    case ItemType.POLYGON:
      return getBBoxFromPoly(shape);
    case ItemType.LINE:
      return getBBoxFromLine(shape);
    case ItemType.CIRCLE:
      return getBBoxFromCircle(shape);
    case ItemType.OTHER:
      break;
  }
}

/**
 * 获取图形对象在canvas环境下的擦除矩形对象
 *
 * @param shape 图形对象
 *
 * @returns 在canvas环境下的擦除矩形对象
 */
export function getClearBox(shape: Shape) {
  const bbox = getBBox(shape);
  return {
    x: bbox.x - 1,
    y: bbox.y - 1,
    width: bbox.width + 2,
    height: bbox.height + 2,
  };
}

/**
 * 本来是通过ref值获取图形对象在svg环境下的bounding box对象
 * 但由于我在graphic层对svg环境下的图形绘制进行实现的时候
 * 为了实现矩阵变换而修改了其主属性，所以用dom进行原生getbbox就不准确了
 * 所以切换为数值版本计算
 *
 * @param shape 图形对象
 *
 * @returns bounding box对象
 */
export function getBBoxByRef(shape: Shape): SVGRect {
  return <SVGRect>getBBox(shape);
  // return shape.ref && shape.ref.getBBox();
}
