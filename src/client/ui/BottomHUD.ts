import { UIManager } from "./UIManager";

export class BottomHUD {
  private root: HTMLDivElement;
  private hpOrb: HTMLDivElement;
  private hpText: HTMLDivElement;
  private manaOrb: HTMLDivElement;
  private manaText: HTMLDivElement;
  private abilitySlots: HTMLDivElement[] = [];
  
  constructor(private ui: UIManager) {
    this.root = document.createElement("div");
    this.root.id = "bottom-hud";
    this.root.style.cssText = `
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 120px;
      background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.8) 30%);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 40px;
      pointer-events: none;
    `;
    
    // Left side - HP Orb
    const leftSection = document.createElement("div");
    leftSection.style.cssText = "display: flex; flex-direction: column; align-items: center; pointer-events: auto;";
    
    this.hpOrb = this.createOrb("#c00", "#f00");
    this.hpText = document.createElement("div");
    this.hpText.style.cssText = "margin-top: 5px; font-size: 14px; font-weight: bold;";
    this.hpText.textContent = "100/100";
    
    leftSection.appendChild(this.hpOrb);
    leftSection.appendChild(this.hpText);
    
    // Center - Ability Bar
    const centerSection = document.createElement("div");
    centerSection.style.cssText = `
      display: flex;
      gap: 8px;
      pointer-events: auto;
    `;
    
    for (let i = 0; i < 5; i++) {
      const slot = this.createAbilitySlot(i);
      this.abilitySlots.push(slot);
      centerSection.appendChild(slot);
    }
    
    // Right side - Mana Orb
    const rightSection = document.createElement("div");
    rightSection.style.cssText = "display: flex; flex-direction: column; align-items: center; pointer-events: auto;";
    
    this.manaOrb = this.createOrb("#00c", "#00f");
    this.manaText = document.createElement("div");
    this.manaText.style.cssText = "margin-top: 5px; font-size: 14px; font-weight: bold;";
    this.manaText.textContent = "50/50";
    
    rightSection.appendChild(this.manaOrb);
    rightSection.appendChild(this.manaText);
    
    // Assemble
    this.root.appendChild(leftSection);
    this.root.appendChild(centerSection);
    this.root.appendChild(rightSection);
    
    document.getElementById("ui-root")!.appendChild(this.root);
  }
  
  private createOrb(darkColor: string, lightColor: string): HTMLDivElement {
    const orb = document.createElement("div");
    orb.style.cssText = `
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: radial-gradient(circle at 30% 30%, ${lightColor}, ${darkColor});
      border: 3px solid #444;
      box-shadow: 0 0 15px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      font-weight: bold;
      color: white;
      text-shadow: 2px 2px 4px #000;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    `;
    
    // Inner orb glow effect
    const glow = document.createElement("div");
    glow.style.cssText = `
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.3), transparent 60%);
    `;
    orb.appendChild(glow);
    
    return orb;
  }
  
  private createAbilitySlot(index: number): HTMLDivElement {
    const slot = document.createElement("div");
    slot.style.cssText = `
      width: 50px;
      height: 50px;
      background: rgba(30, 30, 40, 0.9);
      border: 2px solid #555;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      position: relative;
      transition: all 0.2s;
    `;
    
    // Keybind number
    const keybind = document.createElement("div");
    keybind.textContent = (index + 1).toString();
    keybind.style.cssText = `
      position: absolute;
      top: 2px;
      right: 4px;
      font-size: 10px;
      color: #888;
    `;
    
    // Empty slot indicator
    const emptyText = document.createElement("div");
    emptyText.textContent = "—";
    emptyText.style.cssText = "color: #666; font-size: 24px;";
    
    slot.appendChild(keybind);
    slot.appendChild(emptyText);
    
    // Hover effect
    slot.onmouseenter = () => {
      slot.style.borderColor = "#aaa";
      slot.style.background = "rgba(40, 40, 50, 0.95)";
    };
    slot.onmouseleave = () => {
      slot.style.borderColor = "#555";
      slot.style.background = "rgba(30, 30, 40, 0.9)";
    };
    
    return slot;
  }
  
  updateHealth(current: number, max: number) {
    const percent = (current / max) * 100;
    this.hpText.textContent = `${Math.floor(current)}/${max}`;
    
    // Update orb fill (visual)
    const fillHeight = 80 * (percent / 100);
    // Could add a fill div here for more visual feedback
  }
  
  updateMana(current: number, max: number) {
    const percent = (current / max) * 100;
    this.manaText.textContent = `${Math.floor(current)}/${max}`;
  }
  
  setAbility(slotIndex: number, name: string, icon: string = "⚡") {
    if (slotIndex < 0 || slotIndex >= this.abilitySlots.length) return;
    
    const slot = this.abilitySlots[slotIndex];
    if (!slot) return;
    
    const emptyText = slot.querySelector("div:last-child") as HTMLDivElement;
    if (emptyText) {
      emptyText.textContent = icon;
      emptyText.style.color = "#fff";
      emptyText.style.fontSize = "24px";
    }
    
    slot.title = name;
  }
  
  clearAbility(slotIndex: number) {
    if (slotIndex < 0 || slotIndex >= this.abilitySlots.length) return;
    
    const slot = this.abilitySlots[slotIndex];
    if (!slot) return;
    
    const emptyText = slot.querySelector("div:last-child") as HTMLDivElement;
    if (emptyText) {
      emptyText.textContent = "—";
      emptyText.style.color = "#666";
    }
  }
}
