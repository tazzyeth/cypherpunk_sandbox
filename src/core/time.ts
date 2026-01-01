import { TICK_DT } from "./constants";

let acc = 0;

export function step(dt: number, tick: () => void) {
  acc += dt;
  while (acc >= TICK_DT) {
    tick();
    acc -= TICK_DT;
  }
}
