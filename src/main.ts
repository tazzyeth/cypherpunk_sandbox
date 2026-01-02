import "./client/canvas";
import { World } from "./core/world/world";
import { gen, setResourceManager } from "./core/world/gen";
import { Camera } from "./client/camera";
import { render } from "./client/renderer";
import { InputManager } from "./client/input/InputManager";
import { UIManager } from "./client/ui/UIManager";
import { BottomHUD } from "./client/ui/BottomHUD";
import { InventoryUI } from "./client/ui/Inventory";
import { MainMenu } from "./client/ui/MainMenu";
import { TimeDisplay } from "./client/ui/TimeDisplay";
import { RightPanel } from "./client/ui/RightPanel";
import { ChatBox } from "./client/ui/ChatBox";
import { PlayerPanel } from "./client/ui/PlayerPanel";
import { DialogBox } from "./client/ui/DialogBox";
import { KnowledgeMenu } from "./client/ui/KnowledgeMenu";
import { CraftingMenu } from "./client/ui/CraftingMenu";
import { Player } from "./core/player/Player";
import { PlayerEntity } from "./core/entities/PlayerEntity";
import { NPCEntity } from "./core/entities/NPCEntity";
import { MonsterEntity } from "./core/entities/MonsterEntity";
import { CorpseEntity } from "./core/entities/CorpseEntity";
import { TimeSystem } from "./core/time/TimeSystem";
import { LightingRenderer } from "./client/lighting/LightingRenderer";
import { ResourceManager } from "./core/resources/ResourceManager";
import { TileType } from "./core/world/BiomeGenerator";

// Initialize world
const world = new World();
const camera = new Camera();
const seed = 12345;

// Generate initial chunks around spawn
for (let cy = -2; cy <= 2; cy++) {
  for (let cx = -2; cx <= 2; cx++) {
    gen(world, cx, cy, seed);
  }
}

// Create player (stats/inventory) - SPAWN IN STARTING AREA
const player = new Player(5, 5);

// Create player entity (visual representation)
const playerEntity = new PlayerEntity(5, 5);

// Death state tracking
let isDead = false;
let deathTimer = 0;
const RESPAWN_TIME = 3; // 3 seconds

// Movement target system
let moveTarget: { x: number; y: number; type: 'ground' | 'monster' | 'resource'; entity?: any } | null = null;

// Create Guide NPC at spawn
const guideNPC = new NPCEntity(10, 10, "Tutorial Guide", [
  "Welcome to Cypherpunk Sandbox, adventurer!",
  "I'm here to teach you the basics of survival in this world.",
  "You can gather resources by clicking on tiles around you.",
  "Look for dark green trees for Timber, grey stones for Stone, and blue water for Fish!",
  "As you gather, you'll gain experience in your skills. Check your skills by pressing P!",
  "Good luck on your journey! Talk to me anytime for tips."
]);
guideNPC.hasQuest = true;

// Spawn 3 Goblins near cave entrance (18, 18) with cloth drops
const goblinLoot = [
  { id: "cloth", name: "Cloth", icon: "🧵", chance: 0.5 } // 50% chance
];
const goblin1 = new MonsterEntity(16, 17, "Goblin", 1, 10, 2, 1, 10, 2, goblinLoot);
const goblin2 = new MonsterEntity(17, 19, "Goblin", 1, 10, 2, 1, 10, 2, goblinLoot);
const goblin3 = new MonsterEntity(19, 17, "Goblin", 1, 10, 2, 1, 10, 2, goblinLoot);

const entities: (PlayerEntity | NPCEntity | MonsterEntity | CorpseEntity)[] = [playerEntity, guideNPC, goblin1, goblin2, goblin3];
const corpses: CorpseEntity[] = [];

camera.follow(playerEntity.x, playerEntity.y);

// Setup systems
const timeSystem = new TimeSystem(2); // 2 minute day/night cycle
const lightingRenderer = new LightingRenderer();
const resourceManager = new ResourceManager();

// Connect resource manager to world generation
setResourceManager(resourceManager);

// Setup UI
const ui = new UIManager();
const bottomHUD = new BottomHUD(ui);
const inventory = new InventoryUI(ui);
const mainMenu = new MainMenu(ui);
const timeDisplay = new TimeDisplay();
const chatBox = new ChatBox();
const playerPanel = new PlayerPanel();
const knowledgeMenu = new KnowledgeMenu();
const craftingMenu = new CraftingMenu();

// Handle crafting
craftingMenu.onCraft((recipe) => {
  // Remove required materials by finding them in inventory
  for (const req of recipe.requires) {
    let remaining = req.quantity;
    for (let i = 0; i < player.inventory.length && remaining > 0; i++) {
      const item = player.inventory[i];
      if (item && item.id === req.id) {
        const toRemove = Math.min(remaining, item.quantity);
        player.removeItem(i, toRemove);
        remaining -= toRemove;
      }
    }
  }
  
  // Add crafted item
  player.addItem(recipe.produces);
  
  chatBox.addSystemMessage(`You crafted ${recipe.produces.name}!`);
  updateInventoryUI();
  craftingMenu.update(player);
});

const dialogBox = new DialogBox();
const rightPanel = new RightPanel(
  () => inventory.toggle(),  // Inventory button
  () => mainMenu.toggle()    // Menu button
);

// Add starter abilities to the ability bar (5 slots, using 3)
bottomHUD.setAbility(0, "Attack", "⚔️");
bottomHUD.setAbility(1, "Heal", "❤️");
bottomHUD.setAbility(2, "Fireball", "🔥");

// Load player inventory into UI
function updateInventoryUI() {
  player.inventory.forEach((item, index) => {
    inventory.setItem(index, item);
  });
  // Update equipment display
  Object.keys(player.equipment).forEach(slot => {
    inventory.updateEquipment(slot, player.equipment[slot as keyof typeof player.equipment]);
  });
}
updateInventoryUI();

// Show main menu initially
mainMenu.show();

// Setup input
const input = new InputManager(camera);

// Mouse wheel zoom
input.onWheel((delta) => {
  if (delta > 0) {
    camera.zoomOut(0.1);
  } else {
    camera.zoomIn(0.1);
  }
});

// LEFT-CLICK removed - use E key for NPCs now
input.onClick((worldX, worldY) => {
  // Click handler reserved for future use
});

// RIGHT-CLICK for everything (move, attack, harvest)
input.onRightClick((worldX, worldY) => {
  // Check if clicking on a monster
  for (const entity of entities) {
    if (entity instanceof MonsterEntity && !entity.isDead) {
      const clickDx = Math.abs(entity.x - worldX);
      const clickDy = Math.abs(entity.y - worldY);
      
      if (clickDx < 1 && clickDy < 1) {
        moveTarget = { x: entity.x, y: entity.y, type: 'monster', entity };
        chatBox.addSystemMessage(`Moving to attack ${entity.name}...`);
        return;
      }
    }
  }
  
  // Check if clicking on a resource
  const tileType = world.tile(Math.floor(worldX), Math.floor(worldY));
  if (tileType === 4 || tileType === 3 || tileType === 2) {
    moveTarget = { x: Math.floor(worldX), y: Math.floor(worldY), type: 'resource' };
    chatBox.addSystemMessage("Moving to resource...");
    return;
  }
  
  // Just move to ground
  moveTarget = { x: worldX, y: worldY, type: 'ground' };
});

// Function to find nearest resource node within range
function findNearestResource(range: number = 2): { x: number; y: number } | null {
  let nearestDist = Infinity;
  let nearestPos: { x: number; y: number } | null = null;
  
  // Check tiles in range
  for (let dy = -range; dy <= range; dy++) {
    for (let dx = -range; dx <= range; dx++) {
      const checkX = Math.floor(player.x + dx);
      const checkY = Math.floor(player.y + dy);
      const tileType = world.tile(checkX, checkY);
      
      // Check if it's a resource tile (tree, stone, water)
      if (tileType === 4 || tileType === 3 || tileType === 2) {
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < nearestDist && dist > 0) {
          nearestDist = dist;
          nearestPos = { x: checkX, y: checkY };
        }
      }
    }
  }
  
  return nearestPos;
}

// Play harvest sound
function playHarvestSound(type: string) {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  // Different sounds for different resources
  if (type === "tree") {
    oscillator.frequency.value = 200;
    oscillator.type = "square";
  } else if (type === "stone") {
    oscillator.frequency.value = 150;
    oscillator.type = "triangle";
  } else if (type === "fish") {
    oscillator.frequency.value = 300;
    oscillator.type = "sine";
  }
  
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.3);
}

// Play attack sound
function playAttackSound(hit: boolean) {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  if (hit) {
    // Hit sound - lower thud
    oscillator.frequency.value = 100;
    oscillator.type = "sawtooth";
    gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  } else {
    // Miss sound - high swoosh
    oscillator.frequency.value = 400;
    oscillator.type = "sine";
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.15);
  }
}

// Keyboard shortcuts
let lastKeyTime = 0;
function handleKeyPress(key: string) {
  const now = Date.now();
  if (now - lastKeyTime < 100) return; // Debounce
  lastKeyTime = now;
  
  if (key === "i") {
    inventory.toggle();
  } else if (key === "p") {
    playerPanel.toggle();
    playerPanel.update(player);
  } else if (key === "k") {
    knowledgeMenu.toggle();
    knowledgeMenu.update(player);
  } else if (key === "c") {
    craftingMenu.toggle();
    craftingMenu.update(player);
  } else if (key === "escape") {
    mainMenu.toggle();
  } else if (key === "f") {
    // Toggle torch
    lightingRenderer.toggle();
    console.log("Torch:", lightingRenderer.torchOn ? "ON" : "OFF");
  } else if (key === "h") {
    // Heal (test)
    player.heal(20);
  } else if (key === "j") {
    // Take damage (test)
    player.takeDamage(10);
  } else if (key === "e") {
    // Check for nearby corpses first
    for (const corpse of corpses) {
      const dx = Math.abs(corpse.x - playerEntity.x);
      const dy = Math.abs(corpse.y - playerEntity.y);
      if (dx < 2 && dy < 2 && !corpse.isEmpty()) {
        // Loot corpse
        const loot = corpse.loot();
        let itemCount = 0;
        for (const item of loot) {
          player.addItem(item);
          itemCount += item.quantity;
        }
        updateInventoryUI();
        chatBox.addSystemMessage(`Looted ${itemCount} items from corpse!`);
        return;
      }
    }
    
    // Talk to nearby NPC
    for (const entity of entities) {
      if (entity instanceof NPCEntity) {
        const dx = Math.abs(entity.x - playerEntity.x);
        const dy = Math.abs(entity.y - playerEntity.y);
        if (dx < 2 && dy < 2) {
          dialogBox.show(entity, () => {
            chatBox.addNPCMessage(entity.name, "Goodbye!");
          });
          return;
        }
      }
    }
    chatBox.addSystemMessage("No NPCs nearby!");
  }
}

// Override input manager to add keyboard shortcuts
const originalUpdate = input.update.bind(input);
(input as any).update = function() {
  originalUpdate();
  
  // Check for key presses
  if (input.isKeyDown("i")) handleKeyPress("i");
  if (input.isKeyDown("p")) handleKeyPress("p");
  if (input.isKeyDown("k")) handleKeyPress("k");
  if (input.isKeyDown("c")) handleKeyPress("c");
  if (input.isKeyDown("escape")) handleKeyPress("escape");
  if (input.isKeyDown("f")) handleKeyPress("f");
  if (input.isKeyDown("h")) handleKeyPress("h");
  if (input.isKeyDown("j")) handleKeyPress("j");
  if (input.isKeyDown("e")) handleKeyPress("e");
};

// Player movement with WASD or auto-move to target
function updatePlayer(dt: number) {
  let dx = 0;
  let dy = 0;
  const speed = playerEntity.speed * dt;
  
  // Manual WASD movement (cancels auto-move)
  if (input.isKeyDown("w") || input.isKeyDown("arrowup")) {
    dy -= speed;
    moveTarget = null;
  }
  if (input.isKeyDown("s") || input.isKeyDown("arrowdown")) {
    dy += speed;
    moveTarget = null;
  }
  if (input.isKeyDown("a") || input.isKeyDown("arrowleft")) {
    dx -= speed;
    moveTarget = null;
  }
  if (input.isKeyDown("d") || input.isKeyDown("arrowright")) {
    dx += speed;
    moveTarget = null;
  }
  
  // Auto-move to target
  if (moveTarget && dx === 0 && dy === 0) {
    const targetDx = moveTarget.x - playerEntity.x;
    const targetDy = moveTarget.y - playerEntity.y;
    const distance = Math.sqrt(targetDx * targetDx + targetDy * targetDy);
    
    // Determine stop distance based on target type
    const stopDistance = moveTarget.type === 'ground' ? 0.1 : 2;
    
    if (distance > stopDistance) {
      // Move towards target
      dx = (targetDx / distance) * speed;
      dy = (targetDy / distance) * speed;
    } else {
      // Reached target!
      if (moveTarget.type === 'monster' && moveTarget.entity) {
        // Manual attack - ONE attack per right-click
        const monster = moveTarget.entity as MonsterEntity;
        if (!monster.isDead) {
          playerEntity.startCombat(monster);
          monster.startCombat(playerEntity);
          
          // Perform single attack
          const result = playerEntity.performAttack();
          playAttackSound(result.hit);
          
          if (result.hit) {
            chatBox.addSystemMessage(`You hit for ${result.damage} damage!`);
            
            // Check if monster died
            if (monster.isDead) {
              chatBox.addSystemMessage(`You defeated the ${monster.name}! +${monster.xpReward} XP, +${monster.goldReward} gold`);
              player.skills.getSkill("Combat")?.addXP(monster.xpReward);
              player.addGold(monster.goldReward);
              
              // Roll for loot drops
              const loot = monster.getLoot();
              console.log(`Monster ${monster.name} dropped:`, loot);
              if (loot.length === 0) {
                console.log("No loot this time!");
              }
              for (const item of loot) {
                console.log(`Adding ${item.name} to inventory`);
                player.addItem(item);
                chatBox.addSystemMessage(`You received ${item.quantity}x ${item.name}!`);
              }
              
              updateInventoryUI();
              playerEntity.stopCombat();
            }
          } else {
            chatBox.addSystemMessage("You missed!");
          }
          
          playerEntity.lastAttackTime = Date.now();
        }
      } else if (moveTarget.type === 'resource') {
        // Harvest resource
        const gathered = resourceManager.gatherFrom(moveTarget.x, moveTarget.y, player, chatBox);
        if (gathered) {
          const tileType = world.tile(moveTarget.x, moveTarget.y);
          if (tileType === 4) playHarvestSound("tree");
          else if (tileType === 3) playHarvestSound("stone");
          else if (tileType === 2) playHarvestSound("fish");
          updateInventoryUI();
        }
      }
      moveTarget = null;
    }
  }
  
  if (dx !== 0 || dy !== 0) {
    // Check collision BEFORE moving (check the destination tile)
    const newX = playerEntity.x + dx;
    const newY = playerEntity.y + dy;
    const destTileType = world.tile(Math.floor(newX), Math.floor(newY));
    
    // Can walk on bridge (5) but not water (2)
    const canWalk = destTileType !== 2; // Block water only
    
    if (canWalk) {
      // Actually move
      playerEntity.move(dx, dy);
      player.move(dx, dy);
      // Only update camera if player moved
      camera.follow(playerEntity.x, playerEntity.y);
    }
    // If blocked, don't move camera
  }

}

// Game loop
let lastTime = performance.now();
function loop() {
  const now = performance.now();
  const dt = (now - lastTime) / 1000;
  lastTime = now;

  // Update time system
  timeSystem.update(dt);
  
  // Update resource nodes (respawning)
  resourceManager.update(dt);
  
  // Update input
  input.update();
  
  // Update player
  updatePlayer(dt);
  
  // Update monsters
  for (const entity of entities) {
    if (entity instanceof MonsterEntity) {
      entity.update(dt, playerEntity);
    }
  }
  
  // Sync health between Player and PlayerEntity (for HUD display)
  player.health = playerEntity.health;
  player.maxHealth = playerEntity.maxHealth;
  
  // Check if player died
  if (playerEntity.health <= 0 && !isDead) {
    isDead = true;
    deathTimer = RESPAWN_TIME;
    
    // Spawn corpse with player's items
    const deathX = playerEntity.x;
    const deathY = playerEntity.y;
    const playerItems = player.inventory.filter(item => item !== null);
    
    if (playerItems.length > 0) {
      const corpse = new CorpseEntity(deathX, deathY, playerItems);
      corpses.push(corpse);
      entities.push(corpse);
      chatBox.addSystemMessage("Your items remain on your corpse!");
    }
    
    // Clear player inventory
    player.inventory = new Array(30).fill(null);
    updateInventoryUI();
    
    playerEntity.stopCombat();
    // Stop all monsters from attacking
    for (const entity of entities) {
      if (entity instanceof MonsterEntity && entity.target === playerEntity) {
        entity.inCombat = false;
        entity.target = null;
      }
    }
    chatBox.addSystemMessage("You died! Respawning in 3 seconds...");
  }
  
  // Handle respawn timer
  if (isDead) {
    deathTimer -= dt;
    if (deathTimer <= 0) {
      isDead = false;
      
      // Respawn at spawn point
      playerEntity.x = 5;
      playerEntity.y = 5;
      player.x = 5;
      player.y = 5;
      camera.follow(5, 5);
      
      playerEntity.health = playerEntity.maxHealth;
      player.health = player.maxHealth;
      
      // Reset ALL monsters to their spawn points and stop combat
      for (const entity of entities) {
        if (entity instanceof MonsterEntity) {
          entity.x = entity.spawnX;
          entity.y = entity.spawnY;
          entity.inCombat = false;
          entity.target = null;
        }
      }
      
      chatBox.addSystemMessage("You have respawned at spawn!");
    }
  }
  
  // Manual combat only - player must right-click to attack each time
  // No auto-attack for player
  
  // Clean up expired corpses (5 minutes)
  for (let i = corpses.length - 1; i >= 0; i--) {
    const corpse = corpses[i];
    if (corpse && (corpse.isExpired() || corpse.isEmpty())) {
      // Remove from both arrays
      corpses.splice(i, 1);
      const entityIndex = entities.indexOf(corpse);
      if (entityIndex !== -1) {
        entities.splice(entityIndex, 1);
      }
      if (corpse.isExpired()) {
        console.log("Corpse expired and removed");
      }
    }
  }
  
  // Regenerate mana slowly
  player.restoreMana(0.05);

  // Generate chunks as needed (within view distance)
  const cx = Math.floor(player.x / 32);
  const cy = Math.floor(player.y / 32);
  for (let y = -2; y <= 2; y++) {
    for (let x = -2; x <= 2; x++) {
      gen(world, cx + x, cy + y, seed);
    }
  }

  // Render world, entities, and lighting
  render(world, camera, entities, timeSystem, lightingRenderer);
  
  // Update HUD
  bottomHUD.updateHealth(player.health, player.maxHealth);
  bottomHUD.updateMana(player.mana, player.maxMana);
  timeDisplay.update(timeSystem);

  requestAnimationFrame(loop);
}

// Save game on page unload
window.addEventListener("beforeunload", () => {
  localStorage.setItem("playerData", player.save());
});

// Load game on start (DISABLED for testing - always start fresh in starting area)
// const savedData = localStorage.getItem("playerData");
// if (savedData) {
//   try {
//     player.load(savedData);
//     playerEntity.x = player.x;
//     playerEntity.y = player.y;
//     camera.follow(playerEntity.x, playerEntity.y);
//     updateInventoryUI();
//   } catch (e) {
//     console.error("Failed to load save data");
//   }
// }

// Always start fresh in starting area
console.log("Starting at spawn point (5, 5) in the starting area");
chatBox.addSystemMessage("Welcome! You're in the starting area. Follow the path to find the Guide!");

// Handle inventory right-click actions
window.addEventListener('inventoryAction', (e: any) => {
  const { action, slotIndex } = e.detail;
  const item = player.inventory[slotIndex];
  
  if (!item) return;
  
  if (action === 'equip') {
    // Determine equipment slot based on item type
    let slot: keyof typeof player.equipment | null = null;
    
    if (item.id === 'bow' || item.id === 'wooden_sword') {
      slot = 'weapon';
    } else if (item.id === 'helm') {
      slot = 'helm';
    } else if (item.id === 'chest') {
      slot = 'chest';
    } else if (item.id === 'legs') {
      slot = 'legs';
    } else if (item.id === 'gloves') {
      slot = 'gloves';
    } else if (item.id === 'boots') {
      slot = 'boots';
    } else if (item.id === 'shield') {
      slot = 'offhand';
    }
    
    if (slot) {
      player.equipItem(slotIndex, slot);
      inventory.updateEquipment(slot, player.equipment[slot]);
      chatBox.addSystemMessage(`Equipped ${item.name}!`);
      updateInventoryUI();
    } else {
      chatBox.addSystemMessage(`Cannot equip ${item.name}!`);
    }
  } else if (action === 'use') {
    // Use consumables
    if (item.id === 'cooked_fish') {
      player.removeItem(slotIndex, 1);
      player.heal(30);
      chatBox.addSystemMessage(`Ate ${item.name}! Restored 30 HP`);
      updateInventoryUI();
    } else {
      chatBox.addSystemMessage(`${item.name} is not usable!`);
    }
  } else if (action === 'delete') {
    if (confirm(`Delete ${item.quantity}x ${item.name}?`)) {
      player.removeItem(slotIndex, item.quantity);
      chatBox.addSystemMessage(`Deleted ${item.name}`);
      updateInventoryUI();
    }
  }
});

// Expose player to window for account page
(window as any).player = player;
(window as any).updateAccountPage?.(player);

// Start game loop
loop();

console.log("Controls:");
console.log("WASD/Arrows - Move");
console.log("Mouse Wheel - Zoom");
console.log("Right-click - Move/Attack/Harvest");
console.log("E - Talk to NPCs");
console.log("I - Toggle Inventory");
console.log("P - Player Stats & Skills");
console.log("K - Knowledge & Skill Guide");
console.log("C - Crafting Menu");
console.log("ESC - Toggle Menu");
console.log("F - Toggle Torch");
