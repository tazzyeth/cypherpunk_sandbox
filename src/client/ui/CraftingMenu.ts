import { Player } from "../../core/player/Player";

interface Recipe {
  id: string;
  name: string;
  icon: string;
  requires: { id: string; name: string; quantity: number }[];
  produces: { id: string; name: string; icon: string; quantity: number };
}

const RECIPES: Recipe[] = [
  {
    id: "wooden_sword",
    name: "Wooden Sword",
    icon: "🗡️",
    requires: [
      { id: "timber", name: "Timber", quantity: 2 }
    ],
    produces: { id: "wooden_sword", name: "Wooden Sword", icon: "🗡️", quantity: 1 }
  },
  {
    id: "bow",
    name: "Bow",
    icon: "🏹",
    requires: [
      { id: "timber", name: "Timber", quantity: 2 },
      { id: "cloth", name: "Cloth", quantity: 1 }
    ],
    produces: { id: "bow", name: "Bow", icon: "🏹", quantity: 1 }
  },
  {
    id: "arrows",
    name: "Arrows",
    icon: "➶",
    requires: [
      { id: "stone", name: "Stone", quantity: 1 },
      { id: "timber", name: "Timber", quantity: 1 }
    ],
    produces: { id: "arrows", name: "Arrows", icon: "➶", quantity: 10 }
  },
  {
    id: "campfire",
    name: "Campfire",
    icon: "🔥",
    requires: [
      { id: "timber", name: "Timber", quantity: 5 },
      { id: "stone", name: "Stone", quantity: 2 }
    ],
    produces: { id: "campfire", name: "Campfire", icon: "🔥", quantity: 1 }
  },
  {
    id: "cooked_fish",
    name: "Cooked Fish",
    icon: "🍖",
    requires: [
      { id: "fish", name: "Fish", quantity: 1 },
      { id: "campfire", name: "Campfire", quantity: 1 }
    ],
    produces: { id: "cooked_fish", name: "Cooked Fish", icon: "🍖", quantity: 1 }
  }
];

export class CraftingMenu {
  private root: HTMLDivElement;
  private visible = false;
  private onCraftCallback?: (recipe: Recipe) => void;
  
  constructor() {
    this.root = document.createElement("div");
    this.root.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 600px;
      max-height: 80vh;
      background: rgba(20, 20, 30, 0.98);
      border: 3px solid #f80;
      border-radius: 12px;
      padding: 20px;
      display: none;
      overflow-y: auto;
      pointer-events: auto;
      box-shadow: 0 0 40px rgba(255, 136, 0, 0.5);
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
  
  onCraft(callback: (recipe: Recipe) => void) {
    this.onCraftCallback = callback;
  }
  
  update(player: Player) {
    this.root.innerHTML = `
      <h2 style="color: #f80; margin: 0 0 20px 0; text-align: center; font-size: 28px; text-shadow: 0 0 10px #f80;">
        🔨 Crafting
      </h2>
      
      <div style="color: #fff; margin-bottom: 20px; text-align: center; font-size: 14px;">
        Craft weapons and tools from materials you've gathered!
      </div>
      
      ${RECIPES.map(recipe => this.renderRecipe(recipe, player)).join('')}
      
      <div style="text-align: center; margin-top: 25px;">
        <button style="
          background: linear-gradient(135deg, #f80, #f60);
          border: none;
          padding: 12px 30px;
          border-radius: 8px;
          color: #000;
          font-size: 16px;
          cursor: pointer;
          font-weight: bold;
          box-shadow: 0 4px 10px rgba(255, 136, 0, 0.3);
        " onclick="this.parentElement.parentElement.style.display='none'">
          Close (Press C)
        </button>
      </div>
    `;
    
    // Add click handlers for craft buttons
    const craftButtons = this.root.querySelectorAll('.craft-btn');
    craftButtons.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        const recipe = RECIPES[index];
        if (recipe && this.canCraft(recipe, player)) {
          this.onCraftCallback?.(recipe);
        }
      });
    });
  }
  
  private canCraft(recipe: Recipe, player: Player): boolean {
    return recipe.requires.every(req => {
      const item = player.inventory.find(i => i && i.id === req.id);
      return item && item.quantity >= req.quantity;
    });
  }
  
  private renderRecipe(recipe: Recipe, player: Player): string {
    const canCraft = this.canCraft(recipe, player);
    
    return `
      <div style="
        background: rgba(0, 0, 0, 0.4);
        border: 2px solid ${canCraft ? '#0f0' : '#666'};
        border-radius: 10px;
        padding: 15px;
        margin-bottom: 15px;
      ">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <h3 style="color: ${canCraft ? '#0f0' : '#888'}; margin: 0; font-size: 20px;">
            ${recipe.icon} ${recipe.name}
          </h3>
        </div>
        
        <div style="margin-bottom: 15px;">
          <div style="color: #888; font-size: 12px; margin-bottom: 5px;">Required Materials:</div>
          ${recipe.requires.map(req => {
            const item = player.inventory.find(i => i && i.id === req.id);
            const hasQuantity = item ? item.quantity : 0;
            const hasEnough = hasQuantity >= req.quantity;
            
            return `
              <div style="color: ${hasEnough ? '#0f0' : '#f00'}; margin-left: 15px; font-size: 14px;">
                • ${req.name}: ${hasQuantity}/${req.quantity}
              </div>
            `;
          }).join('')}
        </div>
        
        <button 
          class="craft-btn"
          style="
            background: ${canCraft ? 'linear-gradient(135deg, #0f0, #0a0)' : '#333'};
            border: none;
            padding: 8px 20px;
            border-radius: 6px;
            color: ${canCraft ? '#000' : '#666'};
            font-size: 14px;
            cursor: ${canCraft ? 'pointer' : 'not-allowed'};
            font-weight: bold;
            width: 100%;
          "
          ${!canCraft ? 'disabled' : ''}
        >
          ${canCraft ? 'Craft' : 'Not Enough Materials'}
        </button>
      </div>
    `;
  }
}
