export class Camera {
  x = 0;
  y = 0;
  zoom = 1; // 1 = normal, 2 = 2x zoom in, 0.5 = 2x zoom out

  follow(tx: number, ty: number) {
    this.x = tx;
    this.y = ty;
  }

  setZoom(z: number) {
    this.zoom = Math.max(0.25, Math.min(4, z)); // Clamp between 0.25x and 4x
  }

  zoomIn(amount = 0.1) {
    this.setZoom(this.zoom + amount);
  }

  zoomOut(amount = 0.1) {
    this.setZoom(this.zoom - amount);
  }

  screenToWorld(screenX: number, screenY: number, viewWidth: number, viewHeight: number) {
    const worldX = this.x + (screenX - viewWidth / 2) / this.zoom;
    const worldY = this.y + (screenY - viewHeight / 2) / this.zoom;
    return { x: Math.floor(worldX), y: Math.floor(worldY) };
  }
}
