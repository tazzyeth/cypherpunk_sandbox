import { UIManager } from "./UIManager";

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  icon?: string;
}

export class InventoryUI {
  private content: HTMLElement;
  private gridContainer: HTMLElement;
  private equipmentContainer: HTMLElement;
  private slots: HTMLElement[] = [];
  private equipmentSlots: { [key: string]: HTMLElement } = {};
  private contextMenu: HTMLElement | null = null;
  private contextMenuSlotIndex: number = -1;
  private resizeHandle: HTMLElement;
  private isResizing = false;
  private startWidth = 0;
  private startHeight = 0;
  private startX = 0;
  private startY = 0;
  
  constructor(private ui: UIManager) {
    // Load saved size or use defaults
    const savedWidth = localStorage.getItem('inventoryWidth') || '600';
    const savedHeight = localStorage.getItem('inventoryHeight') || '500';
    
    this.content = ui.createPanel("inventory", {
      x: window.innerWidth - parseInt(savedWidth) - 50,
      y: 100,
      width: parseInt(savedWidth),
      height: parseInt(savedHeight),
      title: "Inventory & Equipment",
      closeable: true,
      draggable: true
    });
    
    // Get the actual panel element
    const panel = this.content.parentElement!;
    panel.style.minWidth = '400px';
    panel.style.minHeight = '300px';
    panel.style.maxWidth = '900px';
    panel.style.maxHeight = '700px';
    
    // Main container with two columns
    const mainContainer = document.createElement("div");
    mainContainer.style.cssText = `
      display: flex;
      gap: 15px;
      height: 100%;
    `;
    
    // Equipment panel (left side)
    this.equipmentContainer = this.createEquipmentPanel();
    
    // Inventory grid (right side)
    this.gridContainer = document.createElement("div");
    this.gridContainer.style.cssText = `
      display: grid;
      grid-template-columns: repeat(8, 50px);
      grid-auto-rows: 50px;
      gap: 4px;
      flex: 1;
    `;
    
    // Create 32 inventory slots (4 rows x 8 cols)
    for (let i = 0; i < 32; i++) {
      const slot = this.createSlot(i);
      this.slots.push(slot);
      this.gridContainer.appendChild(slot);
    }
    
    mainContainer.appendChild(this.equipmentContainer);
    mainContainer.appendChild(this.gridContainer);
    this.content.appendChild(mainContainer);
    
    // Add resize handle
    this.resizeHandle = document.createElement("div");
    this.resizeHandle.style.cssText = `
      position: absolute;
      right: 0;
      bottom: 0;
      width: 20px;
      height: 20px;
      cursor: nwse-resize;
      background: linear-gradient(135deg, transparent 50%, rgba(255, 136, 0, 0.5) 50%);
    `;
    
    this.resizeHandle.onmousedown = (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.isResizing = true;
      this.startWidth = panel.offsetWidth;
      this.startHeight = panel.offsetHeight;
      this.startX = e.clientX;
      this.startY = e.clientY;
      document.body.style.cursor = 'nwse-resize';
    };
    
    document.addEventListener('mousemove', (e) => {
      if (!this.isResizing) return;
      
      const deltaX = e.clientX - this.startX;
      const deltaY = e.clientY - this.startY;
      const newWidth = Math.max(400, Math.min(900, this.startWidth + deltaX));
      const newHeight = Math.max(300, Math.min(700, this.startHeight + deltaY));
      
      panel.style.width = `${newWidth}px`;
      panel.style.height = `${newHeight}px`;
    });
    
    document.addEventListener('mouseup', () => {
      if (this.isResizing) {
        this.isResizing = false;
        document.body.style.cursor = '';
        
        // Save size to localStorage
        localStorage.setItem('inventoryWidth', panel.offsetWidth.toString());
        localStorage.setItem('inventoryHeight', panel.offsetHeight.toString());
      }
    });
    
    panel.appendChild(this.resizeHandle);
    
    // Hide by default
    ui.hidePanel("inventory");
  }
  
  private createEquipmentPanel(): HTMLElement {
    const panel = document.createElement("div");
    panel.style.cssText = `
      width: 150px;
      background: rgba(20, 20, 30, 0.5);
      border: 2px solid #555;
      border-radius: 8px;
      padding: 8px;
      display: flex;
      flex-direction: column;
      gap: 5px;
    `;
    
    const title = document.createElement("div");
    title.textContent = "⚔️ Equipment";
    title.style.cssText = "color: #f80; font-weight: bold; text-align: center; margin-bottom: 3px; font-size: 12px;";
    panel.appendChild(title);
    
    const slots = ['helm', 'chest', 'legs', 'gloves', 'boots', 'weapon', 'offhand'];
    const icons = { helm: '🪖', chest: '🛡️', legs: '👖', gloves: '🧤', boots: '👢', weapon: '⚔️', offhand: '🛡️' };
    
    slots.forEach(slotName => {
      const slotDiv = document.createElement("div");
      slotDiv.style.cssText = `
        height: 35px;
        background: rgba(40, 40, 50, 0.8);
        border: 2px solid #666;
        display: flex;
        align-items: center;
        padding: 4px;
        cursor: pointer;
        border-radius: 4px;
      `;
      
      const label = document.createElement("span");
      label.textContent = `${icons[slotName as keyof typeof icons]} ${slotName.charAt(0).toUpperCase() + slotName.slice(1)}`;
      label.style.cssText = "font-size: 11px; color: #aaa;";
      slotDiv.appendChild(label);
      
      slotDiv.onclick = () => this.onEquipmentClick(slotName);
      slotDiv.onmouseenter = () => slotDiv.style.borderColor = "#aaa";
      slotDiv.onmouseleave = () => slotDiv.style.borderColor = "#666";
      
      this.equipmentSlots[slotName] = slotDiv;
      panel.appendChild(slotDiv);
    });
    
    return panel;
  }
  
  private onEquipmentClick(slot: string) {
    console.log(`Clicked equipment slot: ${slot}`);
    // Will be wired up in main.ts
  }
  
  private createSlot(index: number): HTMLElement {
    const slot = document.createElement("div");
    slot.className = "inventory-slot";
    slot.style.cssText = `
      aspect-ratio: 1;
      background: rgba(40, 40, 50, 0.8);
      border: 2px solid #666;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      position: relative;
    `;
    
    slot.onmouseenter = () => slot.style.borderColor = "#aaa";
    slot.onmouseleave = () => slot.style.borderColor = "#666";
    
    // Right-click for context menu
    slot.oncontextmenu = (e) => {
      e.preventDefault();
      this.showContextMenu(e.clientX, e.clientY, index);
    };
    
    return slot;
  }
  
  private showContextMenu(x: number, y: number, slotIndex: number) {
    // Remove existing context menu
    if (this.contextMenu) {
      this.contextMenu.remove();
    }
    
    this.contextMenuSlotIndex = slotIndex;
    
    this.contextMenu = document.createElement("div");
    this.contextMenu.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      background: rgba(20, 20, 30, 0.98);
      border: 2px solid #f80;
      border-radius: 6px;
      padding: 5px;
      z-index: 10000;
      min-width: 120px;
    `;
    
    const options = [
      { text: 'Equip', action: 'equip' },
      { text: 'Use', action: 'use' },
      { text: 'Delete', action: 'delete' }
    ];
    
    options.forEach(opt => {
      const btn = document.createElement("div");
      btn.textContent = opt.text;
      btn.style.cssText = `
        padding: 8px 12px;
        cursor: pointer;
        color: #fff;
        border-radius: 4px;
      `;
      btn.onmouseenter = () => btn.style.background = 'rgba(255, 136, 0, 0.3)';
      btn.onmouseleave = () => btn.style.background = 'transparent';
      btn.onclick = () => this.handleContextAction(opt.action, slotIndex);
      this.contextMenu!.appendChild(btn);
    });
    
    document.body.appendChild(this.contextMenu);
    
    // Close on click outside
    setTimeout(() => {
      document.addEventListener('click', () => {
        if (this.contextMenu) {
          this.contextMenu.remove();
          this.contextMenu = null;
        }
      }, { once: true });
    }, 100);
  }
  
  private handleContextAction(action: string, slotIndex: number) {
    console.log(`Action: ${action} on slot ${slotIndex}`);
    // Emit custom event for main.ts to handle
    window.dispatchEvent(new CustomEvent('inventoryAction', { 
      detail: { action, slotIndex } 
    }));
    if (this.contextMenu) {
      this.contextMenu.remove();
      this.contextMenu = null;
    }
  }
  
  updateEquipment(slot: string, item: InventoryItem | null) {
    const slotDiv = this.equipmentSlots[slot];
    if (!slotDiv) return;
    
    // Clear existing content except label
    const children = Array.from(slotDiv.children);
    children.slice(1).forEach(child => child.remove());
    
    if (item) {
      const itemIcon = document.createElement("span");
      itemIcon.textContent = item.icon || item.name.charAt(0);
      itemIcon.style.cssText = "margin-left: auto; font-size: 20px;";
      itemIcon.title = `${item.name} x${item.quantity}`;
      slotDiv.appendChild(itemIcon);
    }
  }
  
  setItem(slotIndex: number, item: InventoryItem | null) {
    if (slotIndex < 0 || slotIndex >= this.slots.length) return;
    
    const slot = this.slots[slotIndex];
    if (!slot) return;
    
    slot.innerHTML = "";
    
    if (item) {
      const itemDiv = document.createElement("div");
      itemDiv.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
      `;
      
      const name = document.createElement("div");
      name.textContent = item.icon || item.name.charAt(0).toUpperCase();
      name.style.cssText = "font-size: 16px; font-weight: bold;";
      
      const qty = document.createElement("div");
      qty.textContent = item.quantity.toString();
      qty.style.cssText = "font-size: 9px; position: absolute; bottom: 2px; right: 4px; color: #fff; font-weight: bold;";
      
      itemDiv.appendChild(name);
      slot.appendChild(itemDiv);
      slot.appendChild(qty);
      
      slot.title = `${item.name} x${item.quantity}`;
    }
  }
  
  toggle() {
    this.ui.togglePanel("inventory");
  }
}
