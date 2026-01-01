import { NPCEntity } from "../../core/entities/NPCEntity";

export class DialogBox {
  private root: HTMLDivElement;
  private visible = false;
  private currentNPC: NPCEntity | null = null;
  private onClose: (() => void) | null = null;
  
  constructor() {
    this.root = document.createElement("div");
    this.root.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 500px;
      background: rgba(20, 20, 30, 0.98);
      border: 3px solid #888;
      border-radius: 12px;
      padding: 20px;
      display: none;
      pointer-events: auto;
      box-shadow: 0 0 40px rgba(0, 0, 0, 0.9);
    `;
    
    document.getElementById("ui-root")!.appendChild(this.root);
  }
  
  show(npc: NPCEntity, onCloseCallback?: () => void) {
    this.currentNPC = npc;
    this.visible = true;
    this.onClose = onCloseCallback || null;
    npc.resetDialog();
    this.render();
    this.root.style.display = "block";
  }
  
  hide() {
    this.visible = false;
    this.root.style.display = "none";
    if (this.onClose) {
      this.onClose();
      this.onClose = null;
    }
  }
  
  private render() {
    if (!this.currentNPC) return;
    
    const dialog = this.currentNPC.getCurrentDialog();
    const hasMore = this.currentNPC.currentDialogIndex < this.currentNPC.dialog.length - 1;
    const questIndicator = this.currentNPC.hasQuest && !this.currentNPC.questCompleted ? "❗" : "";
    
    this.root.innerHTML = `
      <div style="margin-bottom: 15px;">
        <h3 style="color: #0ff; margin: 0; font-size: 20px;">
          ${questIndicator} ${this.currentNPC.name}
        </h3>
      </div>
      
      <div style="
        background: rgba(0, 0, 0, 0.4);
        padding: 15px;
        border-radius: 8px;
        min-height: 100px;
        margin-bottom: 15px;
        color: #fff;
        font-size: 16px;
        line-height: 1.6;
      ">
        ${dialog}
      </div>
      
      <div style="display: flex; justify-content: center; gap: 10px;">
        ${hasMore ? `
          <button id="dialog-next" style="
            background: #0a0;
            border: none;
            padding: 10px 30px;
            border-radius: 8px;
            color: #fff;
            font-size: 16px;
            cursor: pointer;
            font-weight: bold;
          ">Continue ▶</button>
        ` : ''}
        
        <button id="dialog-close" style="
          background: #a00;
          border: none;
          padding: 10px 30px;
          border-radius: 8px;
          color: #fff;
          font-size: 16px;
          cursor: pointer;
          font-weight: bold;
        ">${hasMore ? 'Cancel' : 'Close'}</button>
      </div>
    `;
    
    // Add event listeners
    const nextBtn = document.getElementById("dialog-next");
    const closeBtn = document.getElementById("dialog-close");
    
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        if (this.currentNPC) {
          this.currentNPC.nextDialog();
          this.render();
        }
      });
    }
    
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        this.hide();
      });
    }
  }
}
