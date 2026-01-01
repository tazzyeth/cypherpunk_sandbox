import { UIManager } from "./UIManager";

export class HUD {
  private healthBar: HTMLElement;
  private manaBar: HTMLElement;
  private coords: HTMLElement;
  private hotbar: HTMLElement;
  
  constructor(private ui: UIManager) {
    this.createHUD();
    this.healthBar = document.getElementById("health-bar")!;
    this.manaBar = document.getElementById("mana-bar")!;
    this.coords = document.getElementById("coords")!;
    this.hotbar = document.getElementById("hotbar")!;
  }
  
  private createHUD() {
    const hud = document.createElement("div");
    hud.id = "hud";
    hud.style.cssText = `
      position: absolute;
      top: 10px;
      left: 10px;
      pointer-events: none;
    `;
    
    // Health bar
    const healthContainer = document.createElement("div");
    healthContainer.style.cssText = `
      width: 200px;
      height: 25px;
      background: rgba(50, 0, 0, 0.8);
      border: 2px solid #666;
      margin-bottom: 5px;
    `;
    const healthBar = document.createElement("div");
    healthBar.id = "health-bar";
    healthBar.style.cssText = `
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, #c00, #f00);
    `;
    healthContainer.appendChild(healthBar);
    hud.appendChild(healthContainer);
    
    // Mana bar
    const manaContainer = document.createElement("div");
    manaContainer.style.cssText = `
      width: 200px;
      height: 20px;
      background: rgba(0, 0, 50, 0.8);
      border: 2px solid #666;
      margin-bottom: 10px;
    `;
    const manaBar = document.createElement("div");
    manaBar.id = "mana-bar";
    manaBar.style.cssText = `
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, #00c, #00f);
    `;
    manaContainer.appendChild(manaBar);
    hud.appendChild(manaContainer);
    
    // Coordinates display
    const coords = document.createElement("div");
    coords.id = "coords";
    coords.style.cssText = `
      font-size: 12px;
      text-shadow: 2px 2px 4px #000;
    `;
    coords.textContent = "X: 0, Y: 0";
    hud.appendChild(coords);
    
    document.getElementById("ui-root")!.appendChild(hud);
    
    // Hotbar (bottom center)
    const hotbar = document.createElement("div");
    hotbar.id = "hotbar";
    hotbar.style.cssText = `
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 5px;
      pointer-events: auto;
    `;
    
    for (let i = 0; i < 10; i++) {
      const slot = document.createElement("div");
      slot.style.cssText = `
        width: 50px;
        height: 50px;
        background: rgba(30, 30, 40, 0.9);
        border: 2px solid #666;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        color: #888;
      `;
      slot.textContent = `${(i + 1) % 10}`;
      hotbar.appendChild(slot);
    }
    
    document.getElementById("ui-root")!.appendChild(hotbar);
  }
  
  updateHealth(current: number, max: number) {
    const percent = (current / max) * 100;
    this.healthBar.style.width = percent + "%";
  }
  
  updateMana(current: number, max: number) {
    const percent = (current / max) * 100;
    this.manaBar.style.width = percent + "%";
  }
  
  updateCoords(x: number, y: number) {
    this.coords.textContent = `X: ${Math.floor(x)}, Y: ${Math.floor(y)}`;
  }
}
