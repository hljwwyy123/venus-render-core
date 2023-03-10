/**
 * 获取一个点顺时针绕另一点旋转后的坐标
 *
 * @returns 点集数组
 * @param x 被旋转点x轴坐标
 * @param y 被旋转点y轴坐标
 * @param rx 旋转轴x轴坐标
 * @param ry 旋转轴y轴坐标
 * @param angle 顺时针旋转角度
 */
export function rotateAroundAPoint(x, y, rx, ry, angle) {
  const arc = (angle / 180) * Math.PI;
  return {
    x: (x - rx) * Math.cos(arc) - (y - ry) * Math.sin(arc) + rx,
    y: (x - rx) * Math.sin(arc) + (y - ry) * Math.cos(arc) + ry,
  };
}
