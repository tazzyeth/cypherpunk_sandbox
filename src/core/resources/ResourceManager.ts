import { ResourceNode, ResourceType } from "./ResourceNode";
import { TileType } from "../world/BiomeGenerator";
import { Player } from "../player/Player";

export class ResourceManager {
  private nodes: Map<string, ResourceNode> = new Map();
  
  // Get unique key for tile position
  private getKey(x: number, y: number): string {
    return `${x},${y}`;
  }
  
  // Register a resource node at a tile
  registerNode(x: number, y: number, type: ResourceType, tileType: TileType) {
    const key = this.getKey(x, y);
    if (!this.nodes.has(key)) {
      const node = new ResourceNode(x, y, type, tileType);
      this.nodes.set(key, node);
    }
  }
  
  // Get node at position
  getNode(x: number, y: number): ResourceNode | undefined {
    return this.nodes.get(this.getKey(x, y));
  }
  
  // Attempt to gather from a node
  gatherFrom(x: number, y: number, player: Player, chatBox: any) {
    const node = this.getNode(x, y);
    if (!node) return false;
    
    const check = node.canGather(player);
    if (!check.success) {
      if (check.reason) {
        chatBox.addSystemMessage(check.reason);
      }
      return false;
    }
    
    const drop = node.gather(player);
    if (drop) {
      chatBox.addSystemMessage(
        `You gathered ${drop.itemName} and gained ${drop.xp} ${drop.skill} XP!`
      );
      
      // Check if leveled up
      const skill = player.skills.getSkill(drop.skill);
      if (skill) {
        chatBox.addSystemMessage(
          `${drop.skill}: Level ${skill.level} (${skill.getXPToNextLevel()} XP to next level)`
        );
      }
      return true;
    } else {
      chatBox.addSystemMessage("You failed to gather the resource.");
      return false;
    }
  }
  
  // Update all nodes (for respawning)
  update(dt: number) {
    this.nodes.forEach(node => node.update(dt));
  }
  
  // Get all nodes
  getAllNodes(): ResourceNode[] {
    return Array.from(this.nodes.values());
  }
}
