import { TILE_SIZE } from "../core/constants";
import { World } from "../core/world/world";
import { canvas, ctx } from "./canvas";
import { Camera } from "./camera";
import { Entity } from "../core/entities/Entity";
import { PlayerEntity } from "../core/entities/PlayerEntity";
import { NPCEntity } from "../core/entities/NPCEntity";
import { TimeSystem } from "../core/time/TimeSystem";
import { LightingRenderer } from "./lighting/LightingRenderer";

const img = new Image();
img.src = "/tiles.png";

export function render(
  w: World,
  c: Camera,
  entities: Entity[] = [],
  timeSystem?: TimeSystem,
  lightingRenderer?: LightingRenderer
) {
  const vx = canvas.width / TILE_SIZE;
  const vy = canvas.height / TILE_SIZE;
  
  // Adjust view size based on zoom
  const zoomedVx = vx / c.zoom;
  const zoomedVy = vy / c.zoom;
  
  const sx = Math.floor(c.x - zoomedVx / 2);
  const sy = Math.floor(c.y - zoomedVy / 2);
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Render tiles with zoom
  for (let y = 0; y < Math.ceil(zoomedVy) + 1; y++) {
    for (let x = 0; x < Math.ceil(zoomedVx) + 1; x++) {
      const tileX = sx + x;
      const tileY = sy + y;
      const id = w.tile(tileX, tileY);
      
      const screenX = (x - (c.x - sx - zoomedVx / 2)) * TILE_SIZE * c.zoom;
      const screenY = (y - (c.y - sy - zoomedVy / 2)) * TILE_SIZE * c.zoom;
      
      ctx.drawImage(
        img,
        id * TILE_SIZE,
        0,
        TILE_SIZE,
        TILE_SIZE,
        screenX,
        screenY,
        TILE_SIZE * c.zoom,
        TILE_SIZE * c.zoom
      );
    }
  }
  
  // Find player position for resource highlighting
  const playerEntity = entities.find(e => e instanceof PlayerEntity) as PlayerEntity;
  
  // Render blue glow around nearby resources
  if (playerEntity) {
    ctx.save();
    ctx.globalAlpha = 0.4;
    ctx.strokeStyle = "#00ffff";
    ctx.lineWidth = 3 * c.zoom;
    
    for (let y = 0; y < Math.ceil(zoomedVy) + 1; y++) {
      for (let x = 0; x < Math.ceil(zoomedVx) + 1; x++) {
        const tileX = sx + x;
        const tileY = sy + y;
        const id = w.tile(tileX, tileY);
        
        // Check if it's a resource tile (tree=4, stone=3, water=2) and within range
        if (id === 4 || id === 3 || id === 2) {
          const dx = tileX - playerEntity.x;
          const dy = tileY - playerEntity.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist <= 2 && dist > 0) {
            const screenX = (x - (c.x - sx - zoomedVx / 2)) * TILE_SIZE * c.zoom;
            const screenY = (y - (c.y - sy - zoomedVy / 2)) * TILE_SIZE * c.zoom;
            
            ctx.strokeRect(screenX, screenY, TILE_SIZE * c.zoom, TILE_SIZE * c.zoom);
          }
        }
      }
    }
    ctx.restore();
  }
  
  // Render entities on top of tiles
  for (const entity of entities) {
    // Calculate entity screen position relative to camera
    const entityScreenX = (entity.x - c.x + zoomedVx / 2) * TILE_SIZE * c.zoom;
    const entityScreenY = (entity.y - c.y + zoomedVy / 2) * TILE_SIZE * c.zoom;
    
    entity.render(ctx, TILE_SIZE * c.zoom, entityScreenX, entityScreenY);
    
    // Render quest indicator for NPCs
    if (entity instanceof NPCEntity && entity.hasQuest && !entity.questCompleted) {
      ctx.font = `${Math.floor(20 * c.zoom)}px Arial`;
      ctx.fillText("⭐", entityScreenX, entityScreenY - 10 * c.zoom);
    }
  }
  
  // Apply lighting effects (darkness & flashlight)
  if (timeSystem && lightingRenderer) {
    const player = entities.find(e => e instanceof PlayerEntity) as PlayerEntity;
    if (player) {
      lightingRenderer.render(
        ctx,
        canvas.width,
        canvas.height,
        player,
        timeSystem,
        TILE_SIZE * c.zoom
      );
    }
  }
}
