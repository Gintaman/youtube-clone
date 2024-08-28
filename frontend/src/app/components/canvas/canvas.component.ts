import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DrawingTool } from '@components/tools/drawing-tool';
import { PenTool } from '@components/tools/pen';
import { ToolbarComponent } from '@components/toolbar/toolbar.component';
import { Drawable } from '@components/tools/drawable';

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [ToolbarComponent],
  templateUrl: './canvas.component.html',
  styleUrl: './canvas.component.scss',
})
export class CanvasComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas', { static: false })
  canvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;

  public width = window.innerWidth;
  public height = window.innerHeight;

  public error = '';

  public tool!: DrawingTool;

  private history: any[] = [];
  // this holds forward history for redo
  private forwardHistory: any[] = [];

  // Undo and redo stacks should be arrays of Drawables. the Drawables have methods to draw themselves
  private undoStack: Drawable[] = [];
  private redoStack: Drawable[] = [];

  public ngOnInit() {}

  public ngAfterViewInit() {
    try {
      this.ctx = this.canvas.nativeElement.getContext(
        '2d'
      ) as CanvasRenderingContext2D;
    } catch (error) {
      console.error('Got an error: ', error);
      // Show error component
    }

    this.tool = new PenTool(this.ctx, this.history);

    this.ctx.fillStyle = 'black';
  }

  public onMouseDown(event: MouseEvent) {
    if (event.button === 2) {
      return;
    }
    let startX = event.offsetX;
    let startY = event.offsetY;

    this.canvas.nativeElement.onmousemove = (mouseEvent: MouseEvent) => {
      const endX = mouseEvent.offsetX;
      const endY = mouseEvent.offsetY;

      this.tool.draw(startX, startY, endX, endY);
      // TODO this works for now, but would really rather have this startX = endX etc logic in the
      // tool itself and not here. This may be due to the fact we're manually setting the onmousemove.
      // An alternative approach might be to set some isDrawing boolean instead
      startX = endX;
      startY = endY;
    };
  }

  public onMouseUp(event: MouseEvent) {
    this.canvas.nativeElement.onmousemove = null;
    const strokes = this.tool.getPath();

    if (strokes.length) {
      const drawable = new Drawable(strokes, this.tool.getPoints(), this.ctx);
      drawable.drawBoundingBox();
      this.undoStack.push(drawable);
      this.tool.reset();

      // After a new draw action, clear the redo stack
      this.redoStack = [];
    }
  }

  // Eh actually this sucks lol. I still don't really like giving the context to the toolbar though...
  public onClear(event: any) {
    this.undoStack.push(
      new Drawable(
        [
          () => {
            this.ctx.clearRect(0, 0, this.width, this.height);
          },
        ],
        [],
        this.ctx
      )
    );
    this.replayHistory();
  }

  public replayHistory() {
    this.undoStack.forEach((drawable: Drawable) => {
      drawable.redraw();
    });
  }

  // To "undo", the last action needs to be popped, and the history needs to be replayed from beginning to end
  public undo() {
    // pop undo stack onto redo stack
    if (this.undoStack.length) {
      // Typescript shenanigans, undoStack is guaranteed not to be empty here but for some reason
      // we get a "argument of type 'Drawable | undefined' is not assignable to parameter of type 'Drawable'"
      this.redoStack.push(this.undoStack.pop()!);
      // clear rect
      this.ctx.clearRect(0, 0, this.width, this.height);
      // redraw entire history so far, minus the last action
      this.undoStack.forEach((drawable: Drawable) => {
        drawable.redraw();
      });
    }
  }

  public redo() {
    if (this.redoStack.length) {
      this.undoStack.push(this.redoStack.pop()!);
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.ctx.beginPath();
      this.undoStack.forEach((drawable: Drawable) => {
        drawable.redraw();
      });
    }
  }
}
