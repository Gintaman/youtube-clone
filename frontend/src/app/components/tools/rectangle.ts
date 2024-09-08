import { DrawingTool } from './drawing-tool';

export interface Point {
  x: number;
  y: number;
}

export interface Stroke {
  path: Point[];
}

export class RectangleTool extends DrawingTool {
  private minX: number = Infinity;
  private minY: number = Infinity;
  private maxX: number = -Infinity;
  private maxY: number = -Infinity;

  private startX!: number;
  private startY!: number;
  private endX!: number;
  private endY!: number;

  private path: any[] = [];
  // store the actual coords as well
  private points: { x: number; y: number }[] = [];

  protected drawAndSaveAction(
    startX: number,
    startY: number,
    endX: number,
    endY: number
  ) {
    if (!this.startX) {
      this.startX = startX;
    } else {
      this.endX = endX - this.startX;
    }
    if (!this.startY) {
      this.startY = startY;
    } else {
      this.endY = endY - this.startY;
    }
    this.path.push(() => {
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      this.ctx.beginPath();
      this.ctx.rect(this.startX, this.startY, this.endX, this.endY);
      // this.ctx.rect(startX, startY, endX - startX, endY - startY);
      this.ctx.stroke();
      this.ctx.closePath();
    });

    /*
    this.points.push({ x: endX, y: endY });
    this.path[this.path.length - 1]();
    */
    this.path[this.path.length - 1]();
  }

  public getPath() {
    return this.path;
  }

  public getPoints() {
    return this.points;
  }

  // Need to be careful here... not reseting points, for example, causes subtle issues with bounding box
  reset(): void {
    this.path = [];
    this.points = [];
  }
}
