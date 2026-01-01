import { CHUNK_SIZE } from "../constants";

export class Chunk {
  tiles = new Uint16Array(CHUNK_SIZE * CHUNK_SIZE);

  get(x: number, y: number) {
    return this.tiles[y * CHUNK_SIZE + x] || 0;
  }

  set(x: number, y: number, v: number) {
    this.tiles[y * CHUNK_SIZE + x] = v;
  }
}
