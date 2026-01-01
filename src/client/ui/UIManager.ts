import { container } from "../canvas";

export class UIManager {
  private root: HTMLDivElement;
  private panels: Map<string, HTMLElement> = new Map();
  
  constructor() {
    this.root = document.createElement("div");
    this.root.id = "ui-root";
    this.root.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      font-family: 'Courier New', monospace;
      color: #fff;
    `;
    container.appendChild(this.root);
  }
  
  createPanel(id: string, options: {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    title?: string;
    closeable?: boolean;
    draggable?: boolean;
  } = {}): HTMLElement {
    const panel = document.createElement("div");
    panel.id = id;
    panel.style.cssText = `
      position: absolute;
      left: ${options.x || 50}px;
      top: ${options.y || 50}px;
      width: ${options.width || 300}px;
      height: ${options.height || 200}px;
      background: rgba(20, 20, 30, 0.95);
      border: 2px solid #666;
      pointer-events: auto;
      display: flex;
      flex-direction: column;
    `;
    
    if (options.title) {
      const header = document.createElement("div");
      header.style.cssText = `
        padding: 8px;
        background: rgba(40, 40, 50, 0.9);
        border-bottom: 1px solid #666;
        cursor: ${options.draggable ? 'move' : 'default'};
        display: flex;
        justify-content: space-between;
        align-items: center;
      `;
      header.textContent = options.title;
      
      if (options.closeable) {
        const closeBtn = document.createElement("button");
        closeBtn.textContent = "×";
        closeBtn.style.cssText = `
          background: none;
          border: none;
          color: #fff;
          font-size: 20px;
          cursor: pointer;
          padding: 0 5px;
        `;
        closeBtn.onclick = () => this.hidePanel(id);
        header.appendChild(closeBtn);
      }
      
      panel.appendChild(header);
      
      if (options.draggable) {
        this.makeDraggable(panel, header);
      }
    }
    
    const content = document.createElement("div");
    content.className = "panel-content";
    content.style.cssText = `
      flex: 1;
      padding: 10px;
      overflow-y: auto;
    `;
    panel.appendChild(content);
    
    this.root.appendChild(panel);
    this.panels.set(id, panel);
    
    return content;
  }
  
  private makeDraggable(panel: HTMLElement, handle: HTMLElement) {
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;
    
    handle.addEventListener("mousedown", (e) => {
      isDragging = true;
      offsetX = e.clientX - panel.offsetLeft;
      offsetY = e.clientY - panel.offsetTop;
    });
    
    document.addEventListener("mousemove", (e) => {
      if (isDragging) {
        panel.style.left = (e.clientX - offsetX) + "px";
        panel.style.top = (e.clientY - offsetY) + "px";
      }
    });
    
    document.addEventListener("mouseup", () => {
      isDragging = false;
    });
  }
  
  showPanel(id: string) {
    const panel = this.panels.get(id);
    if (panel) panel.style.display = "flex";
  }
  
  hidePanel(id: string) {
    const panel = this.panels.get(id);
    if (panel) panel.style.display = "none";
  }
  
  togglePanel(id: string) {
    const panel = this.panels.get(id);
    if (panel) {
      panel.style.display = panel.style.display === "none" ? "flex" : "none";
    }
  }
  
  createButton(text: string, onClick: () => void): HTMLButtonElement {
    const btn = document.createElement("button");
    btn.textContent = text;
    btn.style.cssText = `
      padding: 10px 20px;
      margin: 5px;
      background: #444;
      color: #fff;
      border: 2px solid #666;
      cursor: pointer;
      font-family: 'Courier New', monospace;
      font-size: 14px;
    `;
    btn.onmouseenter = () => btn.style.background = "#555";
    btn.onmouseleave = () => btn.style.background = "#444";
    btn.onclick = onClick;
    return btn;
  }
}
