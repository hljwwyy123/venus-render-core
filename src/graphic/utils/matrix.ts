import { movePath } from "@/graphic/utils/path";
import { getBBoxWithoutTransform } from "@/graphic/utils/box";
import { getPointsArray } from "@/graphic/utils/poly";
import { rotateAroundAPoint } from "./tools";

/**
 * 为类似于矩形的图形对象设置在svg环境下的矩阵变换属性
 *
 * @param shape 图形对象
 * @param tag dom对象
 */
export function setMatrixForSVGGraphicElementLikeRect(shape, tag) {
  const { matrix = { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 }, x = 0, y = 0 } = shape;
  const { angle, scaleX, scaleY, translateX, translateY } = qrDecompose(matrix);
  tag.setAttribute(
    "transform",
    `translate(${x + translateX} ${y + translateY})
                                  rotate(${angle})
                                  scale(${scaleX} ${scaleY})`
  );
}

/**
 * 为文本图形对象设置在svg环境下的矩阵变换属性
 *
 * @param text 文本对象
 * @param tag dom对象
 */
export function setMatrixForSVGTextElement(text, tag) {
  let { matrix = { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 }, x = 0, y = 0 } = text;
  const { angle, scaleX, scaleY, translateX, translateY } = qrDecompose(matrix);
  tag.setAttribute(
    "transform",
    `translate(${x + translateX} ${y + translateY})
                                  rotate(${angle})
                                  scale(${scaleX} ${scaleY})`
  );
}

/**
 * 将矩阵对象解构为多种操作对象的集合
 *
 * @returns 多种操作对象集合
 * @param matrixObject 矩阵对象
 */
export function qrDecompose(matrixObject) {
  const matrix = [matrixObject.a, matrixObject.b, matrixObject.c, matrixObject.d, matrixObject.e, matrixObject.f];
  const sqrt = Math.sqrt,
    atan2 = Math.atan2,
    pow = Math.pow,
    PiBy180 = Math.PI / 180,
    PiBy2 = Math.PI / 2;

  const angle = atan2(matrix[1], matrix[0]),
    denom = pow(matrix[0], 2) + pow(matrix[1], 2),
    scaleX = sqrt(denom),
    scaleY = (matrix[0] * matrix[3] - matrix[2] * matrix[1]) / scaleX,
    skewX = atan2(matrix[0] * matrix[2] + matrix[1] * matrix[3], denom);

  return {
    angle: angle / PiBy180,
    scaleX: scaleX,
    scaleY: scaleY,
    skewX: skewX / PiBy180,
    skewY: 0,
    translateX: matrix[4],
    translateY: matrix[5],
  };
}

/**
 * 将多边形或线段组依照其矩阵属性进行点坐标的变换
 *
 * @param poly
 */
export function movePolyPointsArrayByMatrix(poly) {
  const { points = [], matrix = { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 } } = poly;
  const { angle, scaleX, scaleY, translateX, translateY } = qrDecompose(matrix);
  const originalBBox = getBBoxWithoutTransform(poly);
  return getPointsArray(points)
    .map(point => ({
      x: point.x + translateX,
      y: point.y + translateY,
    }))
    .map(point => {
      const newPoint = rotateAroundAPoint(point.x, point.y, originalBBox.x + translateX, originalBBox.y + translateY, angle);
      point.x = newPoint.x;
      point.y = newPoint.y;
      return point;
    })
    .map(point => {
      point.x = originalBBox.x + translateX - (originalBBox.x + translateX - point.x) * scaleX;
      point.y = originalBBox.y + translateY - (originalBBox.y + translateY - point.y) * scaleY;
      return point;
    });
}

/**
 * 为路径图形对象设置在svg环境下的矩阵变换属性
 *
 * @param path 路径对象
 * @param tag dom对象
 */
export function setMatrixForSVGPathElement(path, tag) {
  const { matrix = { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 } } = path;
  const { angle, scaleX, scaleY, translateX, translateY } = qrDecompose(matrix);
  const originalBBox = getBBoxWithoutTransform(path);
  const newD = movePath(path, 0, 0);
  tag.setAttribute("d", newD);
  tag.setAttribute(
    "transform",
    `translate(${originalBBox.x + translateX} ${originalBBox.y + translateY})
                rotate(${angle})
                scale(${scaleX} ${scaleY})`
  );
}
