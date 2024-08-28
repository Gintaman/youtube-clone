import { Point } from './pen';

interface BoundingBox {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

const PADDING = 10;

export class Drawable {
  private path: Function[] = [];
  private points: Point[] = [];
  private ctx: CanvasRenderingContext2D;

  private minX = Infinity;
  private minY = Infinity;
  private maxX = -Infinity;
  private maxY = -Infinity;

  constructor(
    path: Function[],
    points: Point[],
    ctx: CanvasRenderingContext2D
  ) {
    this.path = path;
    this.points = points;
    this.ctx = ctx;
  }

  // TODO replace this with 2 Point types, with topLeft and bottomRight
  // protected boundingBox: BoundingBox = { minX: 0, minY: 0, maxX: 0, maxY: 0 };

  public drawBoundingBox() {
    const strokeStyle = this.ctx.strokeStyle;
    this.ctx.strokeStyle = 'blue';
    const box = this.getBoundingBox();
    this.ctx.strokeRect(
      box.startX,
      box.startY,
      box.endX - box.startX,
      box.endY - box.startY
    );
    this.ctx.strokeStyle = strokeStyle;
  }

  public getBoundingBox() {
    this.points.forEach((p: Point) => {
      this.minX = Math.min(this.minX, p.x);
      this.minY = Math.min(this.minY, p.y);
      this.maxX = Math.max(this.maxX, p.x);
      this.maxY = Math.max(this.maxY, p.y);
    });
    return {
      startX: this.minX - PADDING,
      startY: this.minY - PADDING,
      endX: this.maxX + PADDING,
      endY: this.maxY + PADDING,
    };
  }

  public redraw() {
    this.path.forEach((p: Function) => {
      p();
    });
  }
}
