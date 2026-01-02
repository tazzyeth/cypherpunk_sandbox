import { Entity } from "./Entity";

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  icon?: string;
}

export class CorpseEntity extends Entity {
  items: InventoryItem[];
  spawnTime: number;
  lifetime: number = 300000; // 5 minutes in milliseconds
  
  constructor(x: number, y: number, items: InventoryItem[]) {
    super(x, y);
    this.items = [...items]; // Copy items
    this.spawnTime = Date.now();
  }
  
  isExpired(): boolean {
    return Date.now() - this.spawnTime >= this.lifetime;
  }
  
  loot(): InventoryItem[] {
    const loot = [...this.items];
    this.items = []; // Empty corpse
    return loot;
  }
  
  isEmpty(): boolean {
    return this.items.length === 0;
  }
  
  render(ctx: CanvasRenderingContext2D, size: number, x: number, y: number) {
    ctx.save();
    
    // Draw corpse as dark gray cross/tombstone
    ctx.fillStyle = "#444";
    ctx.fillRect(x + size * 0.3, y, size * 0.4, size);
    ctx.fillRect(x, y + size * 0.2, size, size * 0.3);
    
    // Draw skull icon
    ctx.fillStyle = "#fff";
    ctx.font = `${Math.floor(size * 0.6)}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("💀", x + size / 2, y + size / 2);
    
    ctx.restore();
  }
}
