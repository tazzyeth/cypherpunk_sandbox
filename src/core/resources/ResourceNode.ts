import { Player } from "../player/Player";
import { TileType } from "../world/BiomeGenerator";

export type ResourceType = "tree" | "rock" | "fishing";

export interface ResourceDrop {
  itemId: string;
  itemName: string;
  icon: string;
  quantity: number;
  xp: number;
  skill: string;
}

export class ResourceNode {
  x: number;
  y: number;
  type: ResourceType;
  tileType: TileType;
  depleted: boolean = false;
  respawnTime: number = 30000; // 30 seconds
  depletedAt: number = 0;
  levelRequired: number = 1;
  
  constructor(x: number, y: number, type: ResourceType, tileType: TileType) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.tileType = tileType;
  }
  
  canGather(player: Player): { success: boolean; reason?: string } {
    if (this.depleted) {
      return { success: false, reason: "Resource depleted, respawning..." };
    }
    
    // Check skill level requirement
    let skill;
    switch (this.type) {
      case "tree":
        skill = player.skills.woodcutting;
        break;
      case "rock":
        skill = player.skills.mining;
        break;
      case "fishing":
        skill = player.skills.fishing;
        break;
    }
    
    if (skill.level < this.levelRequired) {
      return { success: false, reason: `Requires ${this.type} level ${this.levelRequired}` };
    }
    
    return { success: true };
  }
  
  gather(player: Player): ResourceDrop | null {
    const check = this.canGather(player);
    if (!check.success) {
      return null;
    }
    
    // Success chance based on skill level
    const skillLevel = this.getSkillLevel(player);
    const successChance = Math.min(0.9, 0.3 + (skillLevel / 100) * 0.6);
    
    if (Math.random() > successChance) {
      return null; // Failed to gather
    }
    
    // Determine drop
    const drop = this.getDrop();
    
    // Add to inventory
    player.addItem({
      id: drop.itemId,
      name: drop.itemName,
      quantity: drop.quantity,
      icon: drop.icon
    });
    
    // Grant XP
    const skill = player.skills.getSkill(drop.skill);
    if (skill) {
      const leveledUp = skill.addXP(drop.xp);
      if (leveledUp) {
        return {
          ...drop,
          xp: drop.xp // Include level up info
        };
      }
    }
    
    // Deplete node
    this.depleted = true;
    this.depletedAt = Date.now();
    
    return drop;
  }
  
  private getSkillLevel(player: Player): number {
    switch (this.type) {
      case "tree":
        return player.skills.woodcutting.level;
      case "rock":
        return player.skills.mining.level;
      case "fishing":
        return player.skills.fishing.level;
      default:
        return 1;
    }
  }
  
  private getDrop(): ResourceDrop {
    switch (this.type) {
      case "tree":
        return {
          itemId: "timber",
          itemName: "Timber",
          icon: "🪵",
          quantity: 1,
          xp: 25,
          skill: "woodcutting"
        };
      case "rock":
        return {
          itemId: "stone",
          itemName: "Stone",
          icon: "🪨",
          quantity: 1,
          xp: 30,
          skill: "mining"
        };
      case "fishing":
        return {
          itemId: "raw_tuna",
          itemName: "Raw Tuna",
          icon: "🐟",
          quantity: 1,
          xp: 20,
          skill: "fishing"
        };
      default:
        return {
          itemId: "unknown",
          itemName: "Unknown",
          icon: "❓",
          quantity: 1,
          xp: 10,
          skill: "combat"
        };
    }
  }
  
  update(dt: number) {
    // Check if node should respawn
    if (this.depleted && Date.now() - this.depletedAt >= this.respawnTime) {
      this.depleted = false;
      this.depletedAt = 0;
    }
  }
}
