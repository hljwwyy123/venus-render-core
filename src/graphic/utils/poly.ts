import { getBBoxWithoutTransform } from "@/graphic/utils/box";

/**
 * 将多边形或线段组移动至指定坐标
 *
 * @param poly 多边形或线段组对象
 * @param x x坐标
 * @param y y坐标
 */
export function movePolygonOrPolylineWithoutTransform(poly, x, y) {
  const originalBBox = getBBoxWithoutTransform(poly);
  const points = getPointsArray(poly.points);

  if (points >= 1) {
    const moveX = x - originalBBox.x;
    const moveY = y - originalBBox.y;
    for (const point of points) {
      point.x += moveX;
      point.y += moveY;
    }
  }
  return points;
}

/**
 * 将多边形或线段组的点集数组转换为字符串
 *
 * @returns 字符串
 * @param pointsArray 多边形或线段组的点集数组
 */
export function polyPointsArrayToString(pointsArray) {
  return pointsArray.map(point => `${point.x},${point.y}`).join(" ");
}

/**
 * 将多边形或线段组的字符串转换为点集数组
 *
 * @returns 点集数组
 * @param pointsString 多边形或线段组的字符串
 */
export function getPointsArray(pointsString) {
  return pointsString
    .split(" ")
    .map(point => point.split(","))
    .map(point => ({ x: parseFloat(point[0]), y: parseFloat(point[1]) }));
}
