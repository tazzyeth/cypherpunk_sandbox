import { Player } from "../../core/player/Player";

export class PlayerPanel {
  private root: HTMLDivElement;
  private visible = false;
  
  constructor() {
    this.root = document.createElement("div");
    this.root.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 600px;
      max-height: 80vh;
      background: rgba(20, 20, 30, 0.95);
      border: 3px solid #555;
      border-radius: 12px;
      padding: 20px;
      display: none;
      overflow-y: auto;
      pointer-events: auto;
      box-shadow: 0 0 30px rgba(0, 0, 0, 0.8);
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
    this.root.innerHTML = `
      <h2 style="color: #0ff; margin: 0 0 20px 0; text-align: center; font-size: 24px;">
        Character Stats
      </h2>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
        <!-- Left Column: Stats -->
        <div>
          <h3 style="color: #ff0; margin: 0 0 10px 0;">Combat Stats</h3>
          <div style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 8px;">
            <div style="margin: 5px 0;">Level: <span style="color: #0f0;">${player.level}</span></div>
            <div style="margin: 5px 0;">XP: <span style="color: #0f0;">${player.experience}/${player.experienceToLevel}</span></div>
            <div style="margin: 5px 0;">Health: <span style="color: #f00;">${player.health}/${player.maxHealth}</span></div>
            <div style="margin: 5px 0;">Mana: <span style="color: #00f;">${player.mana}/${player.maxMana}</span></div>
            <div style="margin: 5px 0;">Strength: <span style="color: #f80;">${player.strength}</span></div>
            <div style="margin: 5px 0;">Agility: <span style="color: #0f8;">${player.agility}</span></div>
            <div style="margin: 5px 0;">Intelligence: <span style="color: #08f;">${player.intelligence}</span></div>
          </div>
          
          <h3 style="color: #ff0; margin: 20px 0 10px 0;">Currency</h3>
          <div style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 8px;">
            <div style="margin: 5px 0;">Gold: <span style="color: #fd0;">💰 ${player.gold}</span></div>
          </div>
        </div>
        
        <!-- Right Column: Skills -->
        <div>
          <h3 style="color: #ff0; margin: 0 0 10px 0;">Skills (1-99)</h3>
          <div style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 8px;">
            ${this.renderSkills(player)}
          </div>
          
          <div style="margin-top: 10px; font-size: 12px; color: #888;">
            Total Level: ${player.skills.getTotalLevel()}
          </div>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 20px;">
        <button style="
          background: #f00;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          color: #fff;
          font-size: 16px;
          cursor: pointer;
          font-weight: bold;
        " onclick="this.parentElement.parentElement.style.display='none'">
          Close (Press P)
        </button>
      </div>
    `;
  }
  
  private renderSkills(player: Player): string {
    const skills = player.skills.getAllSkills();
    return skills.map(skill => {
      const progress = skill.getProgress() * 100;
      return `
        <div style="margin: 8px 0;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
            <span style="color: #0ff;">${skill.name}</span>
            <span style="color: #0f0;">Lv ${skill.level}</span>
          </div>
          <div style="background: #333; height: 8px; border-radius: 4px; overflow: hidden;">
            <div style="
              background: linear-gradient(90deg, #0f0, #0a0);
              height: 100%;
              width: ${progress}%;
              transition: width 0.3s;
            "></div>
          </div>
          <div style="font-size: 11px; color: #888; margin-top: 2px;">
            ${skill.getXPToNextLevel()} XP to next level
          </div>
        </div>
      `;
    }).join('');
  }
}
