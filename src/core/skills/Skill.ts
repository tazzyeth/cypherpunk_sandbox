export class Skill {
  name: string;
  level: number = 1;
  experience: number = 0;
  
  constructor(name: string) {
    this.name = name;
  }
  
  // Runescape XP formula: calculates total XP needed for a level
  static getXPForLevel(level: number): number {
    let total = 0;
    for (let i = 1; i < level; i++) {
      total += Math.floor(i + 300 * Math.pow(2, i / 7));
    }
    return Math.floor(total / 4);
  }
  
  // Get XP needed for next level
  getXPToNextLevel(): number {
    if (this.level >= 99) return 0;
    return Skill.getXPForLevel(this.level + 1) - this.experience;
  }
  
  // Add XP and check for level ups
  addXP(amount: number): boolean {
    this.experience += amount;
    
    let leveled = false;
    while (this.level < 99 && this.experience >= Skill.getXPForLevel(this.level + 1)) {
      this.level++;
      leveled = true;
    }
    
    return leveled;
  }
  
  // Get progress to next level (0-1)
  getProgress(): number {
    if (this.level >= 99) return 1;
    
    const currentLevelXP = Skill.getXPForLevel(this.level);
    const nextLevelXP = Skill.getXPForLevel(this.level + 1);
    const xpIntoLevel = this.experience - currentLevelXP;
    const xpNeeded = nextLevelXP - currentLevelXP;
    
    return xpIntoLevel / xpNeeded;
  }
  
  // Serialize for saving
  toJSON() {
    return {
      name: this.name,
      level: this.level,
      experience: this.experience
    };
  }
  
  // Deserialize from save
  fromJSON(data: any) {
    this.name = data.name;
    this.level = data.level;
    this.experience = data.experience;
  }
}
