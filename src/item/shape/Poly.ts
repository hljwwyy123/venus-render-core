import Shape from "@/item/shape/Shape";
import Point from "@/basic/Point";
import Matrix from "@/basic/Matrix";

export default class Poly extends Shape {
  points: string;

  public updateBBox(): void {
    this._bounding.updateByPoints(toArrayPoints(this.points));
  }

  public applyMatrix(matrix: Matrix): void {
    const array = toArrayPoints(this.points);
    const points = matrix.applyToArray(array);
    this.setAttrs({ points: toStringPoints(points) });
  }
}

export function toArrayPoints(points: string): Array<Point> {
  if (!points) return [];
  const arrayPoints = points.replace(/,/g, " ").trim().split(/\s+/);
  const parsedPoints = [];
  const length = arrayPoints.length;

  for (let i = 0; i < length; i += 2) {
    parsedPoints.push({
      x: parseFloat(arrayPoints[i]),
      y: parseFloat(arrayPoints[i + 1]),
    });
  }

  return parsedPoints;
}

export function toStringPoints(arrayPoints: Array<Point>): string {
  return arrayPoints.map(point => `${point.x},${point.y}`).join(" ");
}
