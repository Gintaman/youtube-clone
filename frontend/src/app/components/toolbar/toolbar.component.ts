import { Component, Output, EventEmitter } from '@angular/core';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { Tool, Tools } from './tools.constants';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [CdkDrag, CdkDragHandle],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
})
export class ToolbarComponent {
  public tools = Tools;

  // Should the toolbar take in a ctx instance and update it directly?
  // No, the toolbar is just used to emit what tool is selected.
  // It can emit a function closure that takes a ctx as input, and then
  // the parent canvas component can catch the event and invoke the passed
  // function with its own ctx
  //
  // TODO i think we're trying to be too clever here. lets keep it simple.
  // just emit different types of events: clearEvent, changeShapeEvent,
  // changeColorEvent, etc. Or maybe fuck it, just pass in the ctx from the
  // parent... but that doesn't really make sense for changing the shape. changing
  // the shape would mean setting some variable on the parent setting the current shape,
  // and based on the shape using arcTo, lineTo etc
  @Output()
  public clearCanvas = new EventEmitter();

  @Output()
  public selectedTool = new EventEmitter();

  // Emit a tool enum
  public onChangeTool() {}

  public onClear() {
    this.clearCanvas.emit();
  }

  public selectTool(tool: Tool) {
    this.selectedTool.emit(tool);
  }
}
