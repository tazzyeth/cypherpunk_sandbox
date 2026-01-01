import { Player } from "../../core/player/Player";

export class KnowledgeMenu {
  private root: HTMLDivElement;
  private visible = false;
  
  constructor() {
    this.root = document.createElement("div");
    this.root.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 700px;
      max-height: 85vh;
      background: rgba(15, 15, 25, 0.98);
      border: 3px solid #0ff;
      border-radius: 12px;
      padding: 20px;
      display: none;
      overflow-y: auto;
      pointer-events: auto;
      box-shadow: 0 0 40px rgba(0, 255, 255, 0.5);
    `;
    
    document.getElementById("ui-root")!.appendChild(this.root);
  }
  
  toggle() {
    this.visible = !this.visible;
    this.root.style.display = this.visible ? "block" : "none";
  }
  
  show() {
    this.visible = true;
    this.root.style.display = "block";
  }
  
  hide() {
    this.visible = false;
    this.root.style.display = "none";
  }
  
  update(player: Player) {
    const skills = player.skills.getAllSkills();
    
    this.root.innerHTML = `
      <h2 style="color: #0ff; margin: 0 0 20px 0; text-align: center; font-size: 28px; text-shadow: 0 0 10px #0ff;">
        📚 Knowledge & Skills
      </h2>
      
      <div style="color: #fff; margin-bottom: 20px; text-align: center; font-size: 14px;">
        Learn what you can do at each skill level!
      </div>
      
      ${skills.map(skill => this.renderSkillGuide(skill)).join('')}
      
      <div style="text-align: center; margin-top: 25px;">
        <button style="
          background: linear-gradient(135deg, #0ff, #08f);
          border: none;
          padding: 12px 30px;
          border-radius: 8px;
          color: #000;
          font-size: 16px;
          cursor: pointer;
          font-weight: bold;
          box-shadow: 0 4px 10px rgba(0, 255, 255, 0.3);
        " onclick="this.parentElement.parentElement.style.display='none'">
          Close (Press K)
        </button>
      </div>
    `;
  }
  
  private renderSkillGuide(skill: any): string {
    const unlocks = this.getSkillUnlocks(skill.name, skill.level);
    const progress = skill.getProgress() * 100;
    
    return `
      <div style="
        background: rgba(0, 0, 0, 0.4);
        border: 2px solid #444;
        border-radius: 10px;
        padding: 15px;
        margin-bottom: 15px;
      ">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <h3 style="color: #0ff; margin: 0; font-size: 20px;">
            ${this.getSkillIcon(skill.name)} ${skill.name}
          </h3>
          <span style="
            background: linear-gradient(135deg, #0f0, #0a0);
            padding: 5px 15px;
            border-radius: 20px;
            font-weight: bold;
            color: #000;
          ">Level ${skill.level}</span>
        </div>
        
        <div style="background: #222; height: 12px; border-radius: 6px; overflow: hidden; margin-bottom: 10px;">
          <div style="
            background: linear-gradient(90deg, #0ff, #08f);
            height: 100%;
            width: ${progress}%;
            transition: width 0.3s;
          "></div>
        </div>
        
        <div style="font-size: 12px; color: #888; margin-bottom: 15px;">
          ${skill.experience} XP
          (${skill.getXPToNextLevel()} XP to level ${skill.level + 1})
        </div>
        
        <div style="border-top: 1px solid #444; padding-top: 10px;">
          <div style="color: #0f0; font-weight: bold; margin-bottom: 8px;">✓ Unlocked:</div>
          ${unlocks.unlocked.map(u => `
            <div style="color: #0f0; margin-left: 15px; font-size: 13px;">• ${u}</div>
          `).join('')}
          
          ${unlocks.locked.length > 0 ? `
            <div style="color: #f80; font-weight: bold; margin-top: 12px; margin-bottom: 8px;">🔒 Coming Soon:</div>
            ${unlocks.locked.map(u => `
              <div style="color: #888; margin-left: 15px; font-size: 13px;">• ${u}</div>
            `).join('')}
          ` : ''}
        </div>
      </div>
    `;
  }
  
  private getSkillIcon(skillName: string): string {
    const icons: Record<string, string> = {
      "Fishing": "🎣",
      "Woodcutting": "🪓",
      "Mining": "⛏️",
      "Combat": "⚔️",
      "Cooking": "🍳"
    };
    return icons[skillName] || "📖";
  }
  
  private getSkillUnlocks(skillName: string, level: number): { unlocked: string[]; locked: string[] } {
    const allUnlocks: Record<string, { level: number; description: string }[]> = {
      "Fishing": [
        { level: 1, description: "Fish raw tuna from water" },
        { level: 5, description: "Increased catch rate" },
        { level: 10, description: "Fish raw lobster" },
        { level: 20, description: "Fish raw swordfish" },
        { level: 40, description: "Master fishing spots" }
      ],
      "Woodcutting": [
        { level: 1, description: "Chop regular trees for timber" },
        { level: 10, description: "Chop faster" },
        { level: 20, description: "Chop oak trees" },
        { level: 40, description: "Chop willow trees" },
        { level: 60, description: "Chop mahogany trees" }
      ],
      "Mining": [
        { level: 1, description: "Mine stone rocks" },
        { level: 10, description: "Mine copper ore" },
        { level: 20, description: "Mine iron ore" },
        { level: 40, description: "Mine coal" },
        { level: 70, description: "Mine adamant ore" }
      ],
      "Combat": [
        { level: 1, description: "Basic melee attacks" },
        { level: 5, description: "Hit more accurately" },
        { level: 10, description: "Increased damage" },
        { level: 20, description: "Special attacks" },
        { level: 40, description: "Master combatant" }
      ],
      "Cooking": [
        { level: 1, description: "Cook raw tuna at campfire" },
        { level: 5, description: "Less chance to burn food" },
        { level: 10, description: "Cook lobster" },
        { level: 20, description: "Cook swordfish" },
        { level: 40, description: "Master chef" }
      ]
    };
    
    const skillUnlocks = allUnlocks[skillName] || [];
    const unlocked = skillUnlocks.filter(u => level >= u.level).map(u => `Lv${u.level}: ${u.description}`);
    const locked = skillUnlocks.filter(u => level < u.level).map(u => `Lv${u.level}: ${u.description}`);
    
    return { unlocked, locked };
  }
}
