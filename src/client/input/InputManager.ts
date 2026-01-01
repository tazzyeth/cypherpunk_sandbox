import { canvas, getCanvasBounds } from "../canvas";
import { Camera } from "../camera";

export class InputManager {
  // Keyboard state
  private keys = new Set<string>();
  
  // Mouse state
  mouseX = 0;
  mouseY = 0;
  mouseDown = false;
  mouseWorldX = 0;
  mouseWorldY = 0;
  
  // Callbacks
  private onWheelCallbacks: ((delta: number) => void)[] = [];
  private onClickCallbacks: ((worldX: number, worldY: number) => void)[] = [];
  private onRightClickCallbacks: ((worldX: number, worldY: number) => void)[] = [];
  
  constructor(private camera: Camera) {
    this.setupKeyboard();
    this.setupMouse();
  }
  
  private setupKeyboard() {
    window.addEventListener("keydown", (e) => {
      this.keys.add(e.key.toLowerCase());
    });
    
    window.addEventListener("keyup", (e) => {
      this.keys.delete(e.key.toLowerCase());
    });
  }
  
  private setupMouse() {
    canvas.addEventListener("mousemove", (e) => {
      const bounds = getCanvasBounds();
      this.mouseX = ((e.clientX - bounds.left) / bounds.width) * bounds.tilesX;
      this.mouseY = ((e.clientY - bounds.top) / bounds.height) * bounds.tilesY;
      
      const worldPos = this.camera.screenToWorld(
        this.mouseX,
        this.mouseY,
        bounds.tilesX,
        bounds.tilesY
      );
      this.mouseWorldX = worldPos.x;
      this.mouseWorldY = worldPos.y;
    });
    
    canvas.addEventListener("mousedown", () => {
      this.mouseDown = true;
    });
    
    canvas.addEventListener("mouseup", () => {
      this.mouseDown = false;
    });
    
    canvas.addEventListener("click", () => {
      this.onClickCallbacks.forEach(cb => cb(this.mouseWorldX, this.mouseWorldY));
    });
    
    canvas.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      this.onRightClickCallbacks.forEach(cb => cb(this.mouseWorldX, this.mouseWorldY));
    });
    
    canvas.addEventListener("wheel", (e) => {
      e.preventDefault();
      const delta = Math.sign(e.deltaY);
      this.onWheelCallbacks.forEach(cb => cb(delta));
    }, { passive: false });
  }
  
  isKeyDown(key: string): boolean {
    return this.keys.has(key.toLowerCase());
  }
  
  onWheel(callback: (delta: number) => void) {
    this.onWheelCallbacks.push(callback);
  }
  
  onClick(callback: (worldX: number, worldY: number) => void) {
    this.onClickCallbacks.push(callback);
  }
  
  onRightClick(callback: (worldX: number, worldY: number) => void) {
    this.onRightClickCallbacks.push(callback);
  }
  
  update() {
    // Handle movement keys
    let dx = 0;
    let dy = 0;
    
    if (this.isKeyDown("w") || this.isKeyDown("arrowup")) dy -= 1;
    if (this.isKeyDown("s") || this.isKeyDown("arrowdown")) dy += 1;
    if (this.isKeyDown("a") || this.isKeyDown("arrowleft")) dx -= 1;
    if (this.isKeyDown("d") || this.isKeyDown("arrowright")) dx += 1;
    
    if (dx !== 0 || dy !== 0) {
      const speed = 0.2;
      this.camera.follow(
        this.camera.x + dx * speed,
        this.camera.y + dy * speed
      );
    }
  }
}
