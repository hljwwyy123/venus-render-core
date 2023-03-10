import Point from "@/basic/Point";

export default class BBox {
  x: number;
  y: number;
  width: number;
  height: number;

  constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  public setBBox(x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  public empty() {
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
  }

  public isEmpty() {
    return !(this.width && this.height);
  }

  public tl(): Point {
    return { x: this.x, y: this.y };
  }

  public tr(): Point {
    return { x: this.x + this.width, y: this.y };
  }

  public bl(): Point {
    return { x: this.x, y: this.y + this.height };
  }

  public br(): Point {
    return { x: this.x + this.width, y: this.y + this.height };
  }

  public cc(): Point {
    return { x: this.x + this.width / 2, y: this.y + this.height / 2 };
  }

  public tc(): Point {
    return { x: this.x + this.width / 2, y: this.y };
  }

  public bc(): Point {
    return { x: this.x + this.width / 2, y: this.y + this.height };
  }

  public lc(): Point {
    return { x: this.x, y: this.y + this.height / 2 };
  }

  public rc(): Point {
    return { x: this.x + this.width, y: this.y + this.height / 2 };
  }

  public getPoints(): Array<Point> {
    return [this.tl(), this.tr(), this.bl(), this.br()];
  }

  public isPointInside(point: Point): boolean {
    const [lt, tr, bl, br] = this.getPoints();
    return point.x >= lt.x && point.y >= lt.y && point.x <= br.x && point.y <= br.y;
  }

  /**
   * 判断是否intersect
   * @param box
   * @return 碰撞点的数量 大于0 就是intersect 4：就是contain
   */
  public isIntersect(box: BBox): number {
    // https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
    return this.x < box.x + box.width && box.x < this.x + this.width && this.y < box.y + box.height && box.y < this.y + this.height;
  }

  public updateByPoints(points: Array<Point>) {
    if (points && points.length === 0) {
      this.empty();
      return;
    }

    if (points === undefined) points = [this.tl(), this.br()];

    let minX: number = points[0].x;
    let maxX: number = points[0].x;
    let minY: number = points[0].y;
    let maxY: number = points[0].y;

    let p = undefined;
    for (let i = 1; i < points.length; i++) {
      p = points[i];

      if (minX > p.x) minX = p.x;
      else if (maxX < p.x) maxX = p.x;

      if (minY > p.y) minY = p.y;
      else if (maxY < p.y) maxY = p.y;
    }

    this.setBBox(minX, minY, maxX - minX, maxY - minY);
  }
}
