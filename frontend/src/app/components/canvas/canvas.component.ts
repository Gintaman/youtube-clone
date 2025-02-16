import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { DrawingTool } from '@components/tools/drawing-tool';
import { PenTool } from '@components/tools/pen';
import { ToolbarComponent } from '@components/toolbar/toolbar.component';
import { Drawable } from '@components/tools/drawable';
import { Tool } from '@components/toolbar/tools.constants';
import { KeyManagerService } from '@services/key-manager/key-manager.service';
import { ToolwheelComponent } from '@components/toolwheel/toolwheel.component';

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [ToolbarComponent, ToolwheelComponent],
  templateUrl: './canvas.component.html',
  styleUrl: './canvas.component.scss',
})
export class CanvasComponent implements AfterViewInit {
  @ViewChild('canvas', { static: false })
  canvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;

  private readonly keyManager = inject(KeyManagerService);

  public width = window.innerWidth;
  public height = window.innerHeight;

  public mouseCoords = {
    x: 0,
    y: 0,
  };

  public toolWheelPosition = signal({
    x: 0,
    y: 0,
  });

  public showToolwheel = signal(false);

  public error = '';

  public tool!: DrawingTool;

  private history: any[] = [];
  // this holds forward history for redo
  private forwardHistory: any[] = [];

  // Undo and redo stacks should be arrays of Drawables. the Drawables have methods to draw themselves
  private undoStack: Drawable[] = [];
  // TODO for supporting send to back and bring to front, we should be able to just look for Drawable objects
  // in the undo stack and move them around. For example, if we have 2 Drawables in the undo stack, we can
  // we can reverse their order and just call redraw and they should be drawn in the correct visual order
  private redoStack: Drawable[] = [];

  public onSelectedTool(tool: Tool) {
    this.tool = new tool.toolFactory(this.ctx);
  }

  public ngAfterViewInit() {
    try {
      this.ctx = this.canvas.nativeElement.getContext(
        '2d',
      ) as CanvasRenderingContext2D;
    } catch (error) {
      console.error('Got an error: ', error);
      // Show error component
    }

    this.ctx.fillStyle = 'black';
  }

  // TODO we should move the mousedown and mouseup to methods of the abstract DrawingTool classes
  // also split DrawingTool into PenTool and ShapeTool
  public onMouseDown(event: MouseEvent) {
    if (!this.tool) {
      return;
    }
    if (event.button === 0) {
      let startX = event.offsetX;
      let startY = event.offsetY;

      this.canvas.nativeElement.onmousemove = (mouseEvent: MouseEvent) => {
        const endX = mouseEvent.offsetX;
        const endY = mouseEvent.offsetY;

        // this.ctx.clearRect(0, 0, this.width, this.height);
        // this.replayHistory();
        this.tool.draw(startX, startY, endX, endY);
        // TODO this works for now, but would really rather have this startX = endX etc logic in the
        // tool itself and not here. This may be due to the fact we're manually setting the onmousemove.
        // An alternative approach might be to set some isDrawing boolean instead
        startX = endX;
        startY = endY;
      };
    }
  }

  public onMouseUp(event: MouseEvent) {
    if (!this.tool) {
      return;
    }
    this.canvas.nativeElement.onmousemove = null;
    const strokes = this.tool.getPath();

    if (strokes.length) {
      const drawable = new Drawable(strokes, this.tool.getPoints(), this.ctx);
      // for testing
      // drawable.drawBoundingBox();
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
        this.ctx,
      ),
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
      this.replayHistory();
    }
  }

  public onKeyDown(event: KeyboardEvent) {
    console.log('event: ', event);
    if (event.key === 'z' && (event.ctrlKey || event.metaKey)) {
      this.undo();
    } else if (event.key === 'Z' && (event.ctrlKey || event.metaKey)) {
      this.redo();
    }

    if (event.key === 't') {
      // TODO how do we handle showing toolwheel on tablet or mobile?
      // Maybe do double tap? long press wouldn't work probably? how often do users long press in 1
      // spot when drawing something on a tablet? actually long press might work. for mobile users would also
      // need to configure which toolwheel gets shown, assuming we have one for colors as well.
      if (!this.showToolwheel()) {
        this.toolWheelPosition.set({
          x: this.mouseCoords.x,
          y: this.mouseCoords.y,
        });
      }
      this.showToolwheel.set(true);
    }
  }

  public onMouseMove(event: MouseEvent) {
    this.mouseCoords = {
      x: event.clientX,
      y: event.clientY,
    };
  }

  public onKeyUp(event: KeyboardEvent) {
    if (event.key === 't') {
      this.toolWheelPosition.set({
        x: this.mouseCoords.x,
        y: this.mouseCoords.y,
      });
      this.showToolwheel.set(false);
    }
  }

  // TODO do we really need something like a key event listener?
  // its just for setting and using hotkeys
}
