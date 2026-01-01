import { CHUNK_SIZE } from "../constants";
import { Chunk } from "./chunk";

export class World {
  private m = new Map<string, Chunk>();
  private k(x: number, y: number) {
    return x + "," + y;
  }

  chunk(cx: number, cy: number) {
    const k = this.k(cx, cy);
    if (!this.m.has(k)) this.m.set(k, new Chunk());
    return this.m.get(k)!;
  }

  tile(tx: number, ty: number) {
    const cx = Math.floor(tx / CHUNK_SIZE);
    const cy = Math.floor(ty / CHUNK_SIZE);
    const lx = ((tx % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;
    const ly = ((ty % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;
    return this.chunk(cx, cy).get(lx, ly);
  }

  set(tx: number, ty: number, v: number) {
    const cx = Math.floor(tx / CHUNK_SIZE);
    const cy = Math.floor(ty / CHUNK_SIZE);
    const lx = ((tx % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;
    const ly = ((ty % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;
    this.chunk(cx, cy).set(lx, ly, v);
  }
}
