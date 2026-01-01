import { TILE_SIZE } from "../../core/constants";
import { PlayerEntity } from "../../core/entities/PlayerEntity";
import { TimeSystem } from "../../core/time/TimeSystem";

export class LightingRenderer {
  flashlightOn = false;
  flashlightRadius = 6; // tiles
  flashlightAngle = 100; // degrees
  
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
    
    // Save context state
    ctx.save();
    
    // Draw darkness overlay
    const tint = timeSystem.getTintColor();
    ctx.fillStyle = `rgba(${tint.r}, ${tint.g}, ${tint.b}, ${tint.a})`;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // If night and flashlight is on, cut out flashlight cone
    if (timeSystem.isNight() && this.flashlightOn) {
      this.renderFlashlight(ctx, canvasWidth, canvasHeight, player, tileSize);
    }
    
    ctx.restore();
  }
  
  private renderFlashlight(
    ctx: CanvasRenderingContext2D,
    canvasWidth: number,
    canvasHeight: number,
    player: PlayerEntity,
    tileSize: number
  ) {
    // Player is always centered
    const playerScreenX = canvasWidth / 2;
    const playerScreenY = canvasHeight / 2;
    
    // Calculate flashlight direction based on player facing
    let angle = 0;
    switch (player.facing) {
      case "up": angle = -90; break;
      case "down": angle = 90; break;
      case "left": angle = 180; break;
      case "right": angle = 0; break;
    }
    
    // Convert to radians
    const angleRad = (angle * Math.PI) / 180;
    const halfCone = (this.flashlightAngle / 2 * Math.PI) / 180;
    
    // Create gradient for flashlight
    const maxDistance = this.flashlightRadius * tileSize;
    const gradient = ctx.createRadialGradient(
      playerScreenX, playerScreenY, 0,
      playerScreenX, playerScreenY, maxDistance
    );
    gradient.addColorStop(0, "rgba(255, 255, 200, 0.9)");
    gradient.addColorStop(0.5, "rgba(255, 255, 150, 0.6)");
    gradient.addColorStop(1, "rgba(255, 255, 100, 0)");
    
    // Draw flashlight cone
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(playerScreenX, playerScreenY);
    
    // Draw cone arc
    const startAngle = angleRad - halfCone;
    const endAngle = angleRad + halfCone;
    
    ctx.arc(
      playerScreenX,
      playerScreenY,
      maxDistance,
      startAngle,
      endAngle
    );
    
    ctx.lineTo(playerScreenX, playerScreenY);
    ctx.closePath();
    ctx.fill();
    
    // Reset composite operation
    ctx.globalCompositeOperation = "source-over";
  }
  
  toggle() {
    this.flashlightOn = !this.flashlightOn;
  }
}
