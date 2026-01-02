import { Entity } from "./Entity";

export type Direction = "up" | "down" | "left" | "right";

export class PlayerEntity extends Entity {
  facing: Direction = "down";
  color: string = "#00f";
  width: number = 1;
  height: number = 1;
  
  // Combat state
  inCombat: boolean = false;
  target: Entity | null = null;
  lastAttackTime: number = 0;
  attackSpeed: number = 2400; // 2.4 seconds (4 game ticks)
  attack: number = 10;
  defense: number = 5;
  health: number = 100;
  maxHealth: number = 100;
  
  constructor(x: number, y: number) {
    super(x, y);
  }
  
  takeDamage(amount: number): boolean {
    this.health -= amount;
    if (this.health <= 0) {
      this.health = 0;
      this.stopCombat();
      return true; // Player died
    }
    return false;
  }
  
  startCombat(target: Entity) {
    this.inCombat = true;
    this.target = target;
    this.lastAttackTime = Date.now() - this.attackSpeed; // Allow immediate first attack
  }
  
  stopCombat() {
    this.inCombat = false;
    this.target = null;
  }
  
  performAttack(): { hit: boolean; damage: number } {
    if (!this.target) return { hit: false, damage: 0 };
    
    // Random damage between 1-3
    const damage = Math.floor(Math.random() * 3) + 1;
    
    // Apply damage to target
    if ((this.target as any).takeDamage) {
      const killed = (this.target as any).takeDamage(damage);
      if (killed) {
        this.stopCombat();
      }
      return { hit: true, damage };
    }
    
    return { hit: false, damage: 0 };
  }
  
  move(dx: number, dy: number) {
    this.x += dx;
    this.y += dy;
    
    // Update facing direction based on movement
    if (Math.abs(dx) > Math.abs(dy)) {
      this.facing = dx > 0 ? "right" : "left";
    } else if (dy !== 0) {
      this.facing = dy > 0 ? "down" : "up";
    }
  }
  
  render(ctx: CanvasRenderingContext2D, size: number, x: number, y: number) {
    // Player glows cyan when in combat
    ctx.fillStyle = this.inCombat ? "#0ff" : "#00f";
    ctx.fillRect(x, y, size, size);
  }
}
