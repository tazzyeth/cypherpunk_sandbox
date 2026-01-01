export class Entity {
  x: number;
  y: number;
  width = 1; // in tiles
  height = 1;
  speed = 3; // movement speed
  
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  
  // Override in subclasses
  update(dt: number) {}
  
  // Override for custom rendering
  render(ctx: CanvasRenderingContext2D, tileSize: number, offsetX: number, offsetY: number) {}
}
