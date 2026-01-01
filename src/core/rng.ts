export class RNG {
  private s: number;
  constructor(seed: number) {
    this.s = seed >>> 0;
  }
  next() {
    this.s = (this.s * 1664525 + 1013904223) >>> 0;
    return this.s;
  }
  int(n: number) {
    return n <= 0 ? 0 : this.next() % n;
  }
}
