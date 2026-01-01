# Cypherpunk Sandbox - Development Roadmap

## 🎮 Project Overview
A Runescape-inspired 2D MMORPG built with TypeScript, featuring combat, crafting, skill progression, and exploration.

---

## ✅ COMPLETED FEATURES

### Core Gameplay
- ✅ **Click-to-Move System** - Right-click ground to walk
- ✅ **Click-to-Attack** - Right-click monsters, auto-walks then attacks
- ✅ **Click-to-Harvest** - Right-click resources, auto-walks then gathers
- ✅ **WASD Movement** - Manual keyboard controls
- ✅ **Camera System** - Follows player with zoom (mouse wheel)
- ✅ **Day/Night Cycle** - 2-minute cycle with lighting effects
- ✅ **Flashlight** - Toggle with F key for night visibility

### World & Environment
- ✅ **Procedural World Generation** - Chunk-based terrain
- ✅ **Starting Area** - Spawn at (5,5) with lake, bridge, cave
- ✅ **Resource Nodes** - Trees (Timber), Stones (Stone), Water (Fish)
- ✅ **Resource Respawn** - Nodes regenerate after depletion
- ✅ **Biome System** - Different terrain types

### Combat System
- ✅ **Runescape-style Combat** - 2.4s attack speed (4 ticks)
- ✅ **Lock-on Targeting** - Right-click monster to engage
- ✅ **Auto-combat** - Continuous attacks while in combat
- ✅ **Hit/Miss Mechanics** - Different sounds for each
- ✅ **Death & Respawn** - 3-second respawn timer
- ✅ **Monster AI** - Counter-attacks when engaged
- ✅ **Loot Drops** - XP, Gold, Items (Cloth 15% from Goblins)
- ✅ **Monster Respawn** - 60-second timer

### Entities
- ✅ **Player Entity** - Visual representation with health
- ✅ **Guide NPC** - Tutorial NPC at spawn (10,10)
- ✅ **Goblins (Level 2)** - 3 monsters near cave (18,18)
- ✅ **NPC Dialogue** - Left-click to talk

### Skills & Progression
- ✅ **5 Skills** - Fishing, Woodcutting, Mining, Combat, Cooking
- ✅ **XP System** - Runescape formula (Level 1-99)
- ✅ **Skill Levels** - Gain XP from activities
- ✅ **Player Stats** - Health, Mana, Strength, Agility, Intelligence
- ✅ **Level Up System** - Stat increases on level-up

### UI Systems
- ✅ **Inventory (I key)** - 30-slot bag system
- ✅ **Player Panel (P key)** - Stats & skills display
- ✅ **Knowledge Menu (K key)** - Skill guide & tips
- ✅ **Crafting Menu (C key)** - Recipe browser
- ✅ **Chat Box** - System messages, NPC dialogue
- ✅ **Bottom HUD** - Health/Mana bars, ability bar
- ✅ **Time Display** - Shows current game time
- ✅ **Main Menu (ESC)** - Pause/settings

### Crafting System
- ✅ **Wooden Sword** - 2x Timber
- ✅ **Bow** - 2x Timber + 1x Cloth
- ✅ **Arrows** - 1x Stone + 1x Timber = 10 arrows
- ✅ **Campfire** - 5x Timber + 2x Stone
- ✅ **Cooked Fish** - 1x Fish + 1x Campfire
- ✅ **Material Tracking** - Shows required vs owned

### Audio
- ✅ **Harvest Sounds** - Different for tree/stone/fish
- ✅ **Combat Sounds** - Hit and miss effects

---

## 🚧 IN PROGRESS / NEEDS FIXING

### Critical Bugs
- ❌ **Craft Button Not Working** - Browser cache issue, needs hard refresh
- ❌ **Cloth Drops Not Dropping** - Code exists but needs verification
- ❌ **Starter Sword in Inventory** - Should be equipped, not in bag

### Equipment System (Partial)
- ✅ Equipment data structure added to Player class
- ✅ equipWeapon(), unequipWeapon() functions created
- ❌ **No Equipment UI** - Need visual equipment slots
- ❌ **No Equip Button** - Can't equip from inventory
- ❌ **No Equipment Display** - Can't see what's equipped

---

## 📋 TODO - HIGH PRIORITY

### 1. Equipment System UI
- [ ] Create equipment panel with slots:
  - Helm 🪖
  - Chest 🛡️
  - Legs 👖
  - Gloves 🧤
  - Boots 👢
  - Weapon ⚔️
  - Offhand 🛡️ (Shield/Arrows)
- [ ] Split inventory UI: Equipment (left) | Bag (right)
- [ ] Visual feedback for equipped items
- [ ] Drag-and-drop to equip/unequip
- [ ] Equipment stat bonuses display

### 2. Right-Click Context Menu
- [ ] Create context menu component
- [ ] **Equip** option for weapons/armor
- [ ] **Use** option for consumables (food/potions)
- [ ] **Delete** option with confirmation dialog
- [ ] **Drop** option to remove from inventory
- [ ] Context-aware options (only show valid actions)

### 3. Resizable Chat Window
- [ ] Add drag handle on right edge
- [ ] Min/max width constraints (200px - 600px)
- [ ] Save size to localStorage
- [ ] Visual indicator for resize

### 4. Fix Starter Inventory
- [ ] Remove sword from starting items
- [ ] Auto-equip wooden sword on spawn
- [ ] Show equipped weapon in equipment panel

### 5. Ranged Combat (Bow System)
- [ ] Check if bow is equipped before attack
- [ ] Check arrow count before shooting
- [ ] Consume 1 arrow per attack
- [ ] Different attack range for bow (5-10 tiles)
- [ ] Arrow projectile animation
- [ ] "Out of arrows!" message

---

## 📋 TODO - MEDIUM PRIORITY

### Combat Enhancements
- [ ] Combat levels calculated from attack/defense
- [ ] Display combat level above player/monsters
- [ ] Weapon damage bonuses
- [ ] Armor defense bonuses
- [ ] Special attacks for weapons
- [ ] Monster varieties (different levels)

### Crafting Additions
- [ ] More recipes (armor, tools, potions)
- [ ] Crafting XP rewards
- [ ] Recipe unlocks by skill level
- [ ] Batch crafting (Make X)
- [ ] Crafting animations/sounds

### Consumables
- [ ] Food healing system
- [ ] Cooked fish heals more than raw
- [ ] Potion effects
- [ ] Buff/debuff system
- [ ] Food eating animation

### Quests
- [ ] Tutorial quest from Guide NPC
- [ ] Kill 3 Goblins quest
- [ ] Quest log UI
- [ ] Quest rewards (XP, Gold, Items)
- [ ] Quest tracking system

---

## 📋 TODO - LOW PRIORITY

### Polish & QoL
- [ ] Minimap
- [ ] World map
- [ ] Hotbar keybinds (1-5 keys)
- [ ] Auto-retaliate toggle
- [ ] Run/walk toggle
- [ ] Mouse cursor changes (sword for attack, axe for tree, etc.)
- [ ] Screen shake on hit
- [ ] Particle effects

### Multiplayer (Future)
- [ ] Server infrastructure
- [ ] Player synchronization
- [ ] Chat system (multiplayer)
- [ ] Trading system
- [ ] Guilds/clans

### Content
- [ ] More biomes (desert, snow, swamp)
- [ ] More monsters (dragons, demons, etc.)
- [ ] Dungeons
- [ ] Boss fights
- [ ] Rare drops/treasure
- [ ] Pet system

---

## 🐛 KNOWN ISSUES

1. **TypeScript Error Line 99** - String/number type mismatch (minor, doesn't affect gameplay)
2. **Craft button unresponsive** - Hard refresh needed (Ctrl+Shift+R)
3. **Cloth drops not visible** - Loot system needs verification
4. **No death penalty** - Player just respawns with full health
5. **No inventory full warning** - Items disappear if bag full
6. **Movement can get stuck** - Collision detection needs improvement

---

## 🎯 CURRENT SPRINT GOALS

### Sprint 1: Equipment & Polish (Current)
1. ✅ Create .gitignore
2. ✅ Create ROADMAP.md
3. [ ] Push to GitHub
4. [ ] Fix craft button issue
5. [ ] Implement equipment UI
6. [ ] Add right-click context menu
7. [ ] Make chat resizable
8. [ ] Test bow + arrow system

---

## 💡 DESIGN DECISIONS

### Why Runescape-style?
- Familiar mechanics for players
- Proven progression systems
- Simple yet deep combat
- Nostalgic appeal

### Why TypeScript?
- Type safety prevents bugs
- Better IDE support
- Scales well for large projects
- Easy refactoring

### Why Click-to-X?
- More intuitive than keybinds
- Reduces keyboard clutter
- Familiar to MMORPG players
- Works well with pathfinding

---

## 📊 TECHNICAL DEBT

- [ ] Refactor main.ts (too large, split into modules)
- [ ] Add proper error handling
- [ ] Add unit tests
- [ ] Optimize rendering (only draw visible tiles)
- [ ] Implement entity pooling
- [ ] Add proper state management
- [ ] Documentation for all systems

---

## 🚀 DEPLOYMENT

- [ ] Build production bundle
- [ ] Set up CI/CD
- [ ] Deploy to hosting (Vercel/Netlify)
- [ ] Custom domain
- [ ] Analytics

---

*Last Updated: 2026-01-01*
*Version: 0.2.0-alpha*
