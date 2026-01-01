import { InventoryItem } from "../../client/ui/Inventory";
import { PlayerSkills } from "../skills/PlayerSkills";

export class Player {
  x = 0;
  y = 0;
  
  // Stats
  health = 100;
  maxHealth = 100;
  mana = 50;
  maxMana = 50;
  
  level = 1;
  experience = 0;
  experienceToLevel = 100;
  
  // Attributes
  strength = 10;
  agility = 10;
  intelligence = 10;
  
  // Skills (Runescape-style)
  skills: PlayerSkills;
  
  // Currency
  gold = 0;
  
  // Equipment
  equippedWeapon: InventoryItem | null = null;
  
  // Inventory
  inventory: (InventoryItem | null)[] = new Array(30).fill(null);
  
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.skills = new PlayerSkills();
    
    // Add some starter items
    this.addItem({ id: "wood", name: "Wood", quantity: 10, icon: "🪵" });
    this.addItem({ id: "stone", name: "Stone", quantity: 5, icon: "🪨" });
    this.addItem({ id: "sword", name: "Sword", quantity: 1, icon: "⚔️" });
  }
  
  move(dx: number, dy: number) {
    this.x += dx;
    this.y += dy;
  }
  
  takeDamage(amount: number) {
    this.health = Math.max(0, this.health - amount);
  }
  
  heal(amount: number) {
    this.health = Math.min(this.maxHealth, this.health + amount);
  }
  
  useMana(amount: number): boolean {
    if (this.mana >= amount) {
      this.mana -= amount;
      return true;
    }
    return false;
  }
  
  restoreMana(amount: number) {
    this.mana = Math.min(this.maxMana, this.mana + amount);
  }
  
  gainExperience(amount: number) {
    this.experience += amount;
    while (this.experience >= this.experienceToLevel) {
      this.levelUp();
    }
  }
  
  private levelUp() {
    this.level++;
    this.experience -= this.experienceToLevel;
    this.experienceToLevel = Math.floor(this.experienceToLevel * 1.5);
    
    // Stat increases
    this.maxHealth += 10;
    this.maxMana += 5;
    this.health = this.maxHealth;
    this.mana = this.maxMana;
    this.strength += 2;
    this.agility += 2;
    this.intelligence += 2;
    
    console.log(`Level Up! Now level ${this.level}`);
  }
  
  addItem(item: InventoryItem): boolean {
    // Try to stack with existing item
    for (let i = 0; i < this.inventory.length; i++) {
      const slot = this.inventory[i];
      if (slot && slot.id === item.id) {
        slot.quantity += item.quantity;
        return true;
      }
    }
    
    // Find empty slot
    for (let i = 0; i < this.inventory.length; i++) {
      if (!this.inventory[i]) {
        this.inventory[i] = item;
        return true;
      }
    }
    
    return false; // Inventory full
  }
  
  removeItem(slotIndex: number, quantity = 1): boolean {
    const item = this.inventory[slotIndex];
    if (!item) return false;
    
    item.quantity -= quantity;
    if (item.quantity <= 0) {
      this.inventory[slotIndex] = null;
    }
    return true;
  }
  
  equipWeapon(slotIndex: number): boolean {
    const item = this.inventory[slotIndex];
    if (!item) return false;
    
    // Only bows and swords can be equipped
    if (item.id === "bow" || item.id === "wooden_sword") {
      // Unequip current weapon first
      if (this.equippedWeapon) {
        this.addItem({...this.equippedWeapon});
      }
      
      // Equip new weapon (remove from inventory)
      this.equippedWeapon = {...item};
      this.removeItem(slotIndex, 1);
      return true;
    }
    
    return false;
  }
  
  unequipWeapon(): boolean {
    if (!this.equippedWeapon) return false;
    
    // Put weapon back in inventory
    this.addItem({...this.equippedWeapon});
    this.equippedWeapon = null;
    return true;
  }
  
  getArrowCount(): number {
    const arrows = this.inventory.find(i => i && i.id === "arrows");
    return arrows ? arrows.quantity : 0;
  }
  
  consumeArrow(): boolean {
    for (let i = 0; i < this.inventory.length; i++) {
      const item = this.inventory[i];
      if (item && item.id === "arrows") {
        return this.removeItem(i, 1);
      }
    }
    return false;
  }
  
  addGold(amount: number) {
    this.gold += amount;
  }
  
  removeGold(amount: number): boolean {
    if (this.gold >= amount) {
      this.gold -= amount;
      return true;
    }
    return false;
  }
  
  save(): string {
    return JSON.stringify({
      x: this.x,
      y: this.y,
      health: this.health,
      maxHealth: this.maxHealth,
      mana: this.mana,
      maxMana: this.maxMana,
      level: this.level,
      experience: this.experience,
      strength: this.strength,
      agility: this.agility,
      intelligence: this.intelligence,
      skills: this.skills.toJSON(),
      gold: this.gold,
      inventory: this.inventory
    });
  }
  
  load(data: string) {
    const obj = JSON.parse(data);
    Object.assign(this, obj);
    
    // Reconstruct skills
    if (obj.skills) {
      this.skills = new PlayerSkills();
      this.skills.fromJSON(obj.skills);
    }
  }
}
