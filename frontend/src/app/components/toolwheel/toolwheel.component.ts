import { NgClass, NgStyle } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-toolwheel',
  standalone: true,
  imports: [NgStyle, NgClass],
  templateUrl: './toolwheel.component.html',
  styleUrl: './toolwheel.component.scss',
})
export class ToolwheelComponent {
  // TODO Actually this should be made generic since we will have a color wheel as well.
  // should probably name it WheelSelectComponent

  // TODO:
  // - Should be a presentational component that displays a wheel of tools
  // - The different tools can be configured, but the currently selected tool should be highlighted
  //   and match the currently selected tool in the editor/toolbar
  // - Current tool should be highlighted with an outline
  // - Mouseing over a slice of the wheel should set fill color of the slice
  // TODO do we actually need to use overlay here? seems like we can just use position absolute
  // and pass the coordinates of the mouse cursor

  // Takes numbers as input but converts to a signal
  posX = input<number>(0);
  posY = input<number>(0);

  // TODO should put this in an overlay after all so we can darken the background?
  // or just use a CSS rule on the canvas that darkens the background if toowheel is shown

  radius = 200;

  tools = [
    'pen',
    'eraser',
    'fill',
    'line',
    'rectangle',
    'circle',
    'text',
    'whatever',
  ];

  size = 50;
  gap = 0;
  anglePerSlice = 360 / this.tools.length;
}

// 704977044
for (let i = 0; i < 10; i++) {
  console.log('test');
}
