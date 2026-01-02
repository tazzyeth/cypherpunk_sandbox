import { PlayerEntity } from "../../core/entities/PlayerEntity";
import { TimeSystem } from "../../core/time/TimeSystem";

export class LightingRenderer {
  torchOn = false;
  torchRadius = 5; // tiles
  
  render(
    ctx: CanvasRenderingContext2D,
    canvasWidth: number,
    canvasHeight: number,
    player: PlayerEntity,
    timeSystem: TimeSystem,
    tileSize: number
  ) {
    const darknessLevel = timeSystem.getDarknessLevel();
    
    // No darkness during day
    if (darknessLevel === 0) return;
    
    ctx.save();
    
    const playerScreenX = canvasWidth / 2;
    const playerScreenY = canvasHeight / 2;
    const radius = this.torchRadius * tileSize;
    
    // If torch is on, create light circle  
    if (darknessLevel > 0 && this.torchOn) {
      // Draw darkness EXCEPT in torch area
      const tint = timeSystem.getTintColor();
      
      // Create radial gradient from center (no darkness) to edge (full darkness)
      const gradient = ctx.createRadialGradient(
        playerScreenX, playerScreenY, 0,
        playerScreenX, playerScreenY, radius
      );
      
      // Center = transparent (no darkness), edge = full darkness
      gradient.addColorStop(0, `rgba(${tint.r}, ${tint.g}, ${tint.b}, 0)`);
      gradient.addColorStop(0.7, `rgba(${tint.r}, ${tint.g}, ${tint.b}, ${tint.a * 0.5})`);
      gradient.addColorStop(1, `rgba(${tint.r}, ${tint.g}, ${tint.b}, ${tint.a})`);
      
      // Fill with gradient (light in center, dark at edges)
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    } else {
      // No torch - just draw full darkness
      const tint = timeSystem.getTintColor();
      ctx.fillStyle = `rgba(${tint.r}, ${tint.g}, ${tint.b}, ${tint.a})`;
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    }
    
    ctx.restore();
  }
  
  toggle() {
    this.torchOn = !this.torchOn;
  }
}
