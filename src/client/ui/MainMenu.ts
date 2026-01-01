import { UIManager } from "./UIManager";

export class MainMenu {
  private menuPanel: HTMLElement | null = null;
  
  constructor(private ui: UIManager) {}
  
  show() {
    if (this.menuPanel) {
      this.ui.showPanel("main-menu");
      return;
    }
    
    const content = this.ui.createPanel("main-menu", {
      x: window.innerWidth / 2 - 200,
      y: window.innerHeight / 2 - 250,
      width: 400,
      height: 500,
      title: "CYPHERPUNK SANDBOX",
      closeable: false,
      draggable: false
    });
    
    content.style.cssText += `
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 15px;
    `;
    
    const playBtn = this.ui.createButton("PLAY GAME", () => this.hide());
    const accountBtn = this.ui.createButton("ACCOUNT", () => this.showAccount());
    const settingsBtn = this.ui.createButton("SETTINGS", () => this.showSettings());
    const quitBtn = this.ui.createButton("QUIT", () => {
      alert("Thanks for playing!");
    });
    
    content.appendChild(playBtn);
    content.appendChild(accountBtn);
    content.appendChild(settingsBtn);
    content.appendChild(quitBtn);
    
    this.menuPanel = content;
  }
  
  hide() {
    this.ui.hidePanel("main-menu");
  }
  
  showAccount() {
    const content = this.ui.createPanel("account", {
      x: window.innerWidth / 2 - 250,
      y: window.innerHeight / 2 - 200,
      width: 500,
      height: 400,
      title: "Account",
      closeable: true,
      draggable: true
    });
    
    content.innerHTML = `
      <h2 style="margin: 0 0 15px 0;">Player Profile</h2>
      <div style="display: flex; flex-direction: column; gap: 10px;">
        <div><strong>Username:</strong> Player123</div>
        <div><strong>Level:</strong> 15</div>
        <div><strong>Experience:</strong> 3450 / 5000</div>
        <div><strong>Play Time:</strong> 12h 34m</div>
        <div style="margin-top: 20px; padding: 10px; background: rgba(0,0,0,0.3); border-radius: 4px;">
          <strong>Stats:</strong>
          <div style="margin-top: 10px;">Strength: 25</div>
          <div>Agility: 18</div>
          <div>Intelligence: 22</div>
        </div>
      </div>
    `;
    
    this.ui.showPanel("account");
  }
  
  showSettings() {
    const content = this.ui.createPanel("settings", {
      x: window.innerWidth / 2 - 250,
      y: window.innerHeight / 2 - 150,
      width: 500,
      height: 300,
      title: "Settings",
      closeable: true,
      draggable: true
    });
    
    content.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 15px;">
        <div>
          <label>Volume: <input type="range" min="0" max="100" value="50" style="width: 200px;"></label>
        </div>
        <div>
          <label><input type="checkbox" checked> Enable Fullscreen</label>
        </div>
        <div>
          <label><input type="checkbox" checked> Show FPS</label>
        </div>
        <div>
          <label><input type="checkbox"> Enable Particles</label>
        </div>
      </div>
    `;
    
    this.ui.showPanel("settings");
  }
  
  toggle() {
    const panel = (this.ui as any).panels.get("main-menu");
    if (panel && panel.style.display !== "none") {
      this.hide();
    } else {
      this.show();
    }
  }
}
