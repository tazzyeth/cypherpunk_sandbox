import { TimeSystem } from "../../core/time/TimeSystem";

export class TimeDisplay {
  private root: HTMLDivElement;
  private icon: HTMLDivElement;
  private timeText: HTMLDivElement;
  
  constructor() {
    this.root = document.createElement("div");
    this.root.style.cssText = `
      position: absolute;
      top: 10px;
      right: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 5px;
      pointer-events: none;
    `;
    
    // Sun/Moon icon
    this.icon = document.createElement("div");
    this.icon.style.cssText = `
      font-size: 48px;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
      filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.5));
    `;
    this.icon.textContent = "☀️";
    
    // Time text
    this.timeText = document.createElement("div");
    this.timeText.style.cssText = `
      font-size: 14px;
      font-weight: bold;
      color: #fff;
      text-shadow: 2px 2px 4px #000;
      background: rgba(0, 0, 0, 0.5);
      padding: 4px 8px;
      border-radius: 4px;
    `;
    this.timeText.textContent = "6:00 AM";
    
    this.root.appendChild(this.icon);
    this.root.appendChild(this.timeText);
    
    document.getElementById("ui-root")!.appendChild(this.root);
  }
  
  update(timeSystem: TimeSystem) {
    // Update icon based on time of day
    if (timeSystem.isNight()) {
      this.icon.textContent = "🌙";
      this.icon.style.filter = "drop-shadow(0 0 10px rgba(200, 200, 255, 0.8))";
    } else if (timeSystem.isDawn()) {
      this.icon.textContent = "🌅";
      this.icon.style.filter = "drop-shadow(0 0 10px rgba(255, 150, 200, 0.6))";
    } else if (timeSystem.isDusk()) {
      this.icon.textContent = "🌇";
      this.icon.style.filter = "drop-shadow(0 0 10px rgba(255, 150, 50, 0.6))";
    } else {
      this.icon.textContent = "☀️";
      this.icon.style.filter = "drop-shadow(0 0 10px rgba(255, 255, 100, 0.8))";
    }
    
    // Update time text
    this.timeText.textContent = timeSystem.getTimeString();
  }
}
