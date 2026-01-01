import { RNG } from "../rng";

export enum BiomeType {
  GRASSLAND = "GRASSLAND",
  FOREST = "FOREST",
  DESERT = "DESERT"
}

export enum TileType {
  GRASS = 0,
  DIRT = 1,
  WATER = 2,
  STONE = 3,
  TREE = 4,
  BRIDGE = 5
}

export class BiomeGenerator {
  private seed: number;
  
  constructor(seed: number) {
    this.seed = seed;
  }
  
  // Simple noise function (improved from pure random)
  private noise(x: number, y: number): number {
    const rng = new RNG((x * 73856093) ^ (y * 19349663) ^ this.seed);
    return rng.next() / 0xFFFFFFFF; // Return 0-1
  }
  
  // Smooth noise using interpolation
  private smoothNoise(x: number, y: number): number {
    const corners = (this.noise(x - 1, y - 1) + this.noise(x + 1, y - 1) + 
                    this.noise(x - 1, y + 1) + this.noise(x + 1, y + 1)) / 16;
    const sides = (this.noise(x - 1, y) + this.noise(x + 1, y) + 
                   this.noise(x, y - 1) + this.noise(x, y + 1)) / 8;
    const center = this.noise(x, y) / 4;
    return corners + sides + center;
  }
  
  // Perlin-like noise with octaves
  getNoiseValue(x: number, y: number, octaves = 3): number {
    let value = 0;
    let amplitude = 1;
    let frequency = 0.05; // Lower = smoother terrain
    
    for (let i = 0; i < octaves; i++) {
      value += this.smoothNoise(x * frequency, y * frequency) * amplitude;
      amplitude *= 0.5;
      frequency *= 2;
    }
    
    return Math.max(0, Math.min(1, value));
  }
  
  // Generate tile for grassland biome
  generateGrasslandTile(x: number, y: number): TileType {
    const noise = this.getNoiseValue(x, y);
    const detailNoise = this.getNoiseValue(x * 2, y * 2, 1);
    
    // Create lakes/rivers - WATER (30% of tiles)
    if (noise < 0.4) {
      return TileType.WATER;
    }
    
    // Trees (scattered, 15% of tiles)
    if (noise > 0.5 && noise < 0.65 && detailNoise > 0.6) {
      return TileType.TREE;
    }
    
    // Stone outcrops (VERY RARE - 3% of tiles, like starting area)
    if (noise > 0.8 && detailNoise > 0.85) {
      return TileType.STONE;
    }
    
    // Dirt paths (occasional)
    if (detailNoise < 0.2) {
      return TileType.DIRT;
    }
    
    // Default: grass (majority)
    return TileType.GRASS;
  }
  
  // Main generation function
  generateTile(x: number, y: number, biomeType: BiomeType): TileType {
    switch (biomeType) {
      case BiomeType.GRASSLAND:
        return this.generateGrasslandTile(x, y);
      case BiomeType.FOREST:
        // TODO: Implement forest biome
        return this.generateGrasslandTile(x, y);
      case BiomeType.DESERT:
        // TODO: Implement desert biome
        return this.generateGrasslandTile(x, y);
      default:
        return TileType.GRASS;
    }
  }
}
