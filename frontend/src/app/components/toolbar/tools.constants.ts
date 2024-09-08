import { DrawingTool } from '@components/tools/drawing-tool';
import { RectangleTool } from '@components/tools/rectangle';
import { PenTool } from '@components/tools/pen';

export interface Tool {
  name: string;
  icon: string;
  toolFactory: new (ctx: CanvasRenderingContext2D) => DrawingTool;
}

export const Tools: Tool[] = [
  {
    name: 'pen',
    icon: 'pencil.svg',
    toolFactory: PenTool,
    // TODO
    // custom cursor using cursor: url()
  },
  {
    name: 'rectangle',
    icon: 'draw-square.svg',
    toolFactory: RectangleTool,
  },
];

/*
export enum Tool {
  PenTool
}
*/
