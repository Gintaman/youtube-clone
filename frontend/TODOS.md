Notes:

### Must haves

- [ ] Pen tool
- [ ] Eraser tool
- [ ] Simple shapes, Circle, Rectangle

### Nice to haves

- Need to support being able to draw a shape and then selecting it and dragging it to move it around or
  transform it.

  After drawing (mouseup), we need to maintain a bounding box that contains the entire shape. For
  simple shapes like rectangles / circles this is pretty simple. For lines, we have the startX and startY,
  and while drawing the line we need to maintain the maximum/minimum x/y points the line contains, and use that
  to create the boundaries of the bounding box. The final endX, endY on mouseup is the end coordinates of our
  bounding box.

  We may need a Drawable class that maintains the coordinates and bounding box of the current shape/pen stroke.
  How should Drawable objects be created? The parent canvas component could maintain an array of all Drawable's
  on the canvas. When the canvas is clicked, we can detect if the click event was near the coordinates of a Drawable...

  In the case of a line, the user should have to click near the line itself, not just within its bounding box...

- Curve Smoothing for pen tool

- Zoom and move functionalities
  The canvas itself should have static width and height, moving the canvas simply moves the virtual coordinates
