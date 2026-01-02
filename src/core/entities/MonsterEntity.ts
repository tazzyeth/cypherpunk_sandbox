import { Entity } from "./Entity";

export class MonsterEntity extends Entity {
  name: string;
  level: number;
  health: number;
  maxHealth: number;
  attack: number;
  defense: number;
  xpReward: number;
  goldReward: number;
  lootTable: { id: string; name: string; icon: string; chance: number }[] = [];
  respawnTime: number = 60000; // 60 seconds
  isDead: boolean = false;
  diedAt: number = 0;
  spawnX: number;
  spawnY: number;
  
  // Combat state
  inCombat: boolean = false;
  target: Entity | null = null;
  lastAttackTime: number = 0;
  attackSpeed: number = 2400; // 2.4 seconds (4 game ticks)
  
  constructor(
    x: number,
    y: number,
    name: string,
    level: number,
    health: number,
    attack: number,
    defense: number,
    xpReward: number,
    goldReward: number,
    lootTable: { id: string; name: string; icon: string; chance: number }[] = []
  ) {
    super(x, y);
    this.name = name;
    this.level = level;
    this.health = health;
    this.maxHealth = health;
    this.attack = attack;
    this.defense = defense;
    this.xpReward = xpReward;
    this.goldReward = goldReward;
    this.lootTable = lootTable;
    this.spawnX = x;
    this.spawnY = y;
  }
  
  // Roll for loot drops
  getLoot(): { id: string; name: string; icon: string; quantity: number }[] {
    const drops: { id: string; name: string; icon: string; quantity: number }[] = [];
    
    for (const item of this.lootTable) {
      if (Math.random() < item.chance) {
        drops.push({ ...item, quantity: 1 });
      }
    }
    
    return drops;
  }
  
  takeDamage(amount: number): boolean {
    if (this.isDead) return false;
    
    this.health -= amount;
    
    if (this.health <= 0) {
      this.health = 0;
      this.isDead = true;
      this.diedAt = Date.now();
      this.inCombat = false;
      this.target = null;
      return true; // Monster died
    }
    
    return false;
  }
  
  update(dt: number, playerEntity?: any) {
    // Check for respawn
    if (this.isDead && Date.now() - this.diedAt >= this.respawnTime) {
      this.respawn();
    }
    
    // Check for aggro (detect player within 3 tiles)
    if (!this.isDead && !this.inCombat && playerEntity) {
      const dx = playerEntity.x - this.x;
      const dy = playerEntity.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance <= 3) {
        // Aggro! Start combat
        this.startCombat(playerEntity);
        if (!playerEntity.inCombat) {
          playerEntity.startCombat(this);
        }
      }
    }
    
    // Move towards player if in combat and not in range
    if (this.inCombat && this.target && !this.isDead) {
      const dx = this.target.x - this.x;
      const dy = this.target.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Move towards if distance > 1.2 (closer attack range)
      if (distance > 1.2) {
        const speed = 2 * dt; // Monster movement speed
        this.x += (dx / distance) * speed;
        this.y += (dy / distance) * speed;
      }
      
      // Auto-attack if in range - tighter range for actual attacks
      if (distance <= 1.5) {
        const now = Date.now();
        if (now - this.lastAttackTime >= this.attackSpeed) {
          this.performAttack();
          this.lastAttackTime = now;
        }
      }
    }
  }
  
  respawn() {
    this.isDead = false;
    this.health = this.maxHealth;
    this.x = this.spawnX;
    this.y = this.spawnY;
    this.inCombat = false;
    this.target = null;
  }
  
  startCombat(target: Entity) {
    this.inCombat = true;
    this.target = target;
    this.lastAttackTime = Date.now() - this.attackSpeed; // Allow immediate first attack
  }
  
  performAttack() {
    if (!this.target || this.isDead) return;
    
    // Random damage between 1-2 for monsters
    const damage = Math.floor(Math.random() * 2) + 1;
    
    // Apply damage to target
    if ((this.target as any).takeDamage) {
      (this.target as any).takeDamage(damage);
      console.log(`${this.name} hit for ${damage} damage!`);
    }
  }
  
  stopCombat() {
    this.inCombat = false;
    this.target = null;
  }
  
  render(ctx: CanvasRenderingContext2D, size: number, x: number, y: number) {
    if (this.isDead) return; // Don't render if dead
    
    ctx.save();
    
    // Draw monster (red square for now)
    ctx.fillStyle = this.inCombat ? "#ff5555" : "#cc0000";
    ctx.fillRect(x, y, size, size);
    
    // Draw level
    ctx.fillStyle = "#fff";
    ctx.font = `${Math.floor(size * 0.4)}px Arial`;
    ctx.textAlign = "center";
    ctx.fillText(`Lv${this.level}`, x + size / 2, y + size / 2);
    
    // Draw health bar
    const barWidth = size;
    const barHeight = size * 0.1;
    const healthPercent = this.health / this.maxHealth;
    
    ctx.fillStyle = "#000";
    ctx.fillRect(x, y - barHeight - 2, barWidth, barHeight);
    
    ctx.fillStyle = "#0f0";
    ctx.fillRect(x, y - barHeight - 2, barWidth * healthPercent, barHeight);
    
    ctx.restore();
  }
}
