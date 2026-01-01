import { Skill } from "./Skill";

export class PlayerSkills {
  fishing: Skill;
  woodcutting: Skill;
  mining: Skill;
  combat: Skill;
  cooking: Skill;
  
  constructor() {
    this.fishing = new Skill("Fishing");
    this.woodcutting = new Skill("Woodcutting");
    this.mining = new Skill("Mining");
    this.combat = new Skill("Combat");
    this.cooking = new Skill("Cooking");
  }
  
  // Get skill by name
  getSkill(name: string): Skill | undefined {
    const skillMap: { [key: string]: Skill } = {
      fishing: this.fishing,
      woodcutting: this.woodcutting,
      mining: this.mining,
      combat: this.combat,
      cooking: this.cooking
    };
    return skillMap[name.toLowerCase()];
  }
  
  // Get all skills
  getAllSkills(): Skill[] {
    return [
      this.fishing,
      this.woodcutting,
      this.mining,
      this.combat,
      this.cooking
    ];
  }
  
  // Calculate total level
  getTotalLevel(): number {
    return this.getAllSkills().reduce((sum, skill) => sum + skill.level, 0);
  }
  
  // Serialize for saving
  toJSON() {
    return {
      fishing: this.fishing.toJSON(),
      woodcutting: this.woodcutting.toJSON(),
      mining: this.mining.toJSON(),
      combat: this.combat.toJSON(),
      cooking: this.cooking.toJSON()
    };
  }
  
  // Deserialize from save
  fromJSON(data: any) {
    if (data.fishing) this.fishing.fromJSON(data.fishing);
    if (data.woodcutting) this.woodcutting.fromJSON(data.woodcutting);
    if (data.mining) this.mining.fromJSON(data.mining);
    if (data.combat) this.combat.fromJSON(data.combat);
    if (data.cooking) this.cooking.fromJSON(data.cooking);
  }
}
