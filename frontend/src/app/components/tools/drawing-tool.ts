// Abstract base class for drawing tools to extend.

import { Point } from './pen';

// Each tool implements
export abstract class DrawingTool {
  protected ctx: CanvasRenderingContext2D;
  protected history: any[];
  // NOTE we don't need ctx options like fillStyle etc here since its set globally

  // should we have manage the "Drawable" objects here? Seems like we'd be coupling them together
  // with the drawing tools themselves which may not be what we want. We can instantiate the drawables
  // onmouseup of the main canvas component. Conceptually, drawing-tools and drawables are separated
  // and don't need to know about each other.
  //
  // But in that case, do we need to add to the history here? Take a pen tool, when we draw a line, we have
  // a large array of coordinates made up of individual points. For the pen tool, this makes sense, but for
  // tools like a Rectangle tool, we really only need the starting and ending x/y coords to redraw it.
  //
  // Maintaining a reference to the global canvas history in each drawing tool seems like a bad idea then.
  // Certain tools can maintain a "path" variable instead, and we can save the entire path array to
  // the global history on mouseup, handled by the main canvas component
  constructor(ctx: CanvasRenderingContext2D, history: any[]) {
    this.ctx = ctx;
    this.history = history;
  }

  draw(startX: number, startY: number, endX: number, endY: number): void {
    this.drawAndSaveAction(startX, startY, endX, endY);
    this.saveDraw(() => this.drawAndSaveAction(startX, startY, endX, endY));
  }

  protected abstract drawAndSaveAction(
    startX: number,
    startY: number,
    endX: number,
    endY: number
  ): void;

  protected saveDraw(action: any): void {
    // this.history.push(action);
  }

  // TODO This might be better named getStrokes or something, but it defines how to redraw the shape from
  // mousedown to mouseup. For a pen tool, this would be an array of draw function closures that redraw the
  // entire line. For a rectangle, it would be just 1 draw function drawing the rectangle from top left to bottom right
  abstract getPath(): any[];

  abstract getPoints(): Point[];

  abstract reset(): void;
}
