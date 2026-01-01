export class RightPanel {
  private root: HTMLDivElement;
  
  constructor(
    onInventoryClick: () => void,
    onMenuClick: () => void
  ) {
    this.root = document.createElement("div");
    this.root.style.cssText = `
      position: absolute;
      right: 20px;
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      flex-direction: column;
      gap: 15px;
      pointer-events: auto;
    `;
    
    // Inventory Button
    const inventoryBtn = this.createButton("📦", "Inventory (I)", onInventoryClick);
    
    // Menu Button  
    const menuBtn = this.createButton("⚙️", "Menu (ESC)", onMenuClick);
    
    this.root.appendChild(inventoryBtn);
    this.root.appendChild(menuBtn);
    
    document.getElementById("ui-root")!.appendChild(this.root);
  }
  
  private createButton(
    icon: string,
    tooltip: string,
    onClick: () => void
  ): HTMLButtonElement {
    const button = document.createElement("button");
    button.style.cssText = `
      width: 70px;
      height: 70px;
      background: rgba(30, 30, 40, 0.95);
      border: 3px solid #555;
      border-radius: 12px;
      font-size: 32px;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    `;
    
    button.textContent = icon;
    button.title = tooltip;
    button.onclick = onClick;
    
    // Hover effects
    button.onmouseenter = () => {
      button.style.borderColor = "#0ff";
      button.style.background = "rgba(40, 40, 50, 0.98)";
      button.style.transform = "scale(1.05)";
      button.style.boxShadow = "0 0 20px rgba(0, 255, 255, 0.4)";
    };
    
    button.onmouseleave = () => {
      button.style.borderColor = "#555";
      button.style.background = "rgba(30, 30, 40, 0.95)";
      button.style.transform = "scale(1)";
      button.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.3)";
    };
    
    // Active state (click feedback)
    button.onmousedown = () => {
      button.style.transform = "scale(0.95)";
    };
    
    button.onmouseup = () => {
      button.style.transform = "scale(1.05)";
    };
    
    return button;
  }
}
