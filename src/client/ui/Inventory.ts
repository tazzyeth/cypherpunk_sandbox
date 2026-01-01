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
  private slots: HTMLElement[] = [];
  
  constructor(private ui: UIManager) {
    this.content = ui.createPanel("inventory", {
      x: window.innerWidth - 450,
      y: 100,
      width: 400,
      height: 500,
      title: "Inventory",
      closeable: true,
      draggable: true
    });
    
    this.gridContainer = document.createElement("div");
    this.gridContainer.style.cssText = `
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 5px;
    `;
    
    // Create 30 inventory slots (5 rows x 6 cols)
    for (let i = 0; i < 30; i++) {
      const slot = this.createSlot(i);
      this.slots.push(slot);
      this.gridContainer.appendChild(slot);
    }
    
    this.content.appendChild(this.gridContainer);
    
    // Hide by default
    ui.hidePanel("inventory");
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
    
    return slot;
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
      name.style.cssText = "font-size: 20px; font-weight: bold;";
      
      const qty = document.createElement("div");
      qty.textContent = item.quantity.toString();
      qty.style.cssText = "font-size: 10px; position: absolute; bottom: 2px; right: 4px;";
      
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
