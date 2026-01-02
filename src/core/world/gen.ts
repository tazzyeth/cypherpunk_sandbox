import { World } from "./world";
import { CHUNK_SIZE } from "../constants";
import { BiomeGenerator, BiomeType, TileType } from "./BiomeGenerator";
import { ResourceManager } from "../resources/ResourceManager";

// Create global biome generator
let biomeGen: BiomeGenerator | null = null;
let resourceMgr: ResourceManager | null = null;

export function initBiomeGenerator(seed: number) {
  biomeGen = new BiomeGenerator(seed);
}

export function setResourceManager(manager: ResourceManager) {
  resourceMgr = manager;
}

// Handcrafted starting area layout
function generateStartingArea(world: World) {
  // Starting area: 0-20 x, 0-20 y
  for (let y = 0; y < 20; y++) {
    for (let x = 0; x < 20; x++) {
      let tile = TileType.GRASS;
      
      // Create lake in center-right (x: 12-18, y: 8-15)
      if (x >= 12 && x <= 18 && y >= 8 && y <= 15) {
        tile = TileType.WATER;
      }
      
      // Bridge across middle of lake (x: 15, y: 7-16) - extends from land to land
      if (x === 15 && y >= 7 && y <= 16) {
        tile = TileType.BRIDGE;
      }
      
      // Trees near spawn (scattered)
      if ((x === 3 && y === 3) || (x === 5 && y === 2) || 
          (x === 2 && y === 6) || (x === 7 && y === 4)) {
        tile = TileType.TREE;
      }
      
      // Stone outcrops
      if ((x === 8 && y === 8) || (x === 9 && y === 9) || 
          (x === 10 && y === 7)) {
        tile = TileType.STONE;
      }
      
      // Dirt paths connecting key areas (ROUTES AROUND WATER!)
      // 1. Spawn to Guide NPC (10, 10)
      if ((x >= 0 && x <= 10 && y === 0) || 
          (x === 10 && y >= 0 && y <= 10)) {
        if (tile === TileType.GRASS) {
          tile = TileType.DIRT;
        }
      }
      
      // 2. Guide to Bridge entrance - NORTH route around water
      // From Guide (10,10) → go right to x=11 → north to y=6 → east to bridge (15,6)
      if ((x === 10 && y >= 10 && y <= 11) ||  // Down from guide
          (x >= 10 && x <= 11 && y === 11) ||   // Right to x=11
          (x === 11 && y >= 6 && y <= 11) ||    // North along x=11
          (x >= 11 && x <= 15 && y === 6)) {    // East to bridge entrance
        if (tile === TileType.GRASS) {
          tile = TileType.DIRT;
        }
      }
      
      // 3. Bridge exit to Cave - SOUTH route
      // From bridge exit (15,16) → south to y=17 → east to cave (18,18)
      if ((x === 15 && y >= 16 && y <= 17) ||   // South from bridge
          (x >= 15 && x <= 18 && y === 17) ||   // East along y=17
          (x === 18 && y >= 17 && y <= 18)) {   // To cave entrance
        if (tile === TileType.GRASS) {
          tile = TileType.DIRT;
        }
      }
      
      // Cave entrance in southeast (18, 18)
      if (x === 18 && y === 18) {
        tile = TileType.STONE; // Dark stone cave entrance
      }
      
      world.set(x, y, tile);
      
      // Register ONLY resource nodes (NOT DIRT - dirt is just a path)
      if (resourceMgr) {
        if (tile === TileType.TREE) {
          resourceMgr.registerNode(x, y, "tree", tile);
        } else if (tile === TileType.STONE) {
          resourceMgr.registerNode(x, y, "rock", tile);
        } else if (tile === TileType.WATER || tile === TileType.BRIDGE) {
          resourceMgr.registerNode(x, y, "fishing", tile);
        }
        // DIRT is NOT registered - it's just a walkable path
      }
    }
  }
}

export function gen(world: World, cx: number, cy: number, seed: number) {
  // Initialize biome generator if needed
  if (!biomeGen) {
    initBiomeGenerator(seed);
  }
  
  // Generate tiles using biome system
  for (let y = 0; y < CHUNK_SIZE; y++) {
    for (let x = 0; x < CHUNK_SIZE; x++) {
      const worldX = cx * CHUNK_SIZE + x;
      const worldY = cy * CHUNK_SIZE + y;
      
      // Use handcrafted starting area for spawn zone
      if (worldX >= 0 && worldX < 20 && worldY >= 0 && worldY < 20) {
        if (cx === 0 && cy === 0) {
          generateStartingArea(world);
        }
        continue; // Skip random generation in starting area
      }
      
      // For everything else, use random generation
      const tileType = biomeGen!.generateTile(worldX, worldY, BiomeType.GRASSLAND);
      
      world.set(worldX, worldY, tileType);
      
      // Register resource nodes
      if (resourceMgr) {
        if (tileType === TileType.TREE) {
          resourceMgr.registerNode(worldX, worldY, "tree", tileType);
        } else if (tileType === TileType.STONE) {
          resourceMgr.registerNode(worldX, worldY, "rock", tileType);
        } else if (tileType === TileType.WATER) {
          resourceMgr.registerNode(worldX, worldY, "fishing", tileType);
        }
      }
    }
  }
}
