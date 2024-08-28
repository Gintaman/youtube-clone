import { DrawingTool } from './drawing-tool';

export interface Point {
  x: number;
  y: number;
}

export interface Stroke {
  path: Point[];
}

export class PenTool extends DrawingTool {
  // this is working but with no curve smoothing
  private currentX: number | null = null;
  private currentY: number | null = null;

  // FIXME TODO this starting and ending x,y doesn't work. points in the middle might be > or < the startX
  // and ending points. We need to get the min and max left/right and top/bottom deltas.
  // Bounding box is determined by the min and max values. Top left is the minimum x and y values,
  // bottom right is the maximum x and y values
  private minX: number = Infinity;
  private minY: number = Infinity;
  private maxX: number = -Infinity;
  private maxY: number = -Infinity;

  private path: any[] = [];
  // store the actual coords as well
  private points: { x: number; y: number }[] = [];

  protected drawAndSaveAction(
    startX: number,
    startY: number,
    endX: number,
    endY: number
  ) {
    // TODO this is working for now, but would really rather have this startX and startY logic
    // in here, instead of having to set those values in the canvas component. But maybe this is just
    // something we need to have with the way drawing on canvas works, by setting the onmousemove.
    // maybe we can solve this with a "isDrawing" variable instead but this works for now.

    // honestly we should push an object that has x, y, and stroke()
    this.path.push(() => {
      this.ctx.beginPath();
      this.ctx.moveTo(startX, startY);
      this.ctx.lineTo(endX, endY);
      this.ctx.stroke();
      this.ctx.closePath();

      this.currentX = endX;
      this.currentY = endY;
    });

    this.points.push({ x: endX, y: endY });
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
