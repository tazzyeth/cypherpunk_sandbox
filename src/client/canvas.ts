import { TILE_SIZE, RENDER_SCALE } from "../core/constants";

// Try to find existing game-page container, otherwise create one
let gamePageContainer = document.getElementById("game-page");
if (!gamePageContainer) {
  gamePageContainer = document.createElement("div");
  gamePageContainer.id = "game-page";
  document.body.appendChild(gamePageContainer);
}

export const container = document.createElement("div");
container.id = "game-container";
container.style.cssText = `
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
`;

export const canvas = document.createElement("canvas");
canvas.id = "game-canvas";
export const ctx = canvas.getContext("2d")!;
ctx.imageSmoothingEnabled = false;

container.appendChild(canvas);
gamePageContainer.appendChild(container);

let targetWidth = 800;
let targetHeight = 600;

export function setCanvasSize(width: number, height: number) {
  targetWidth = width;
  targetHeight = height;
  resize();
}

function resize() {
  // Calculate the game's internal resolution (tile-based)
  const tilesX = Math.floor(targetWidth / (TILE_SIZE * RENDER_SCALE));
  const tilesY = Math.floor(targetHeight / (TILE_SIZE * RENDER_SCALE));
  
  canvas.width = tilesX * TILE_SIZE;
  canvas.height = tilesY * TILE_SIZE;
  
  // Scale canvas to fit window while maintaining aspect ratio
  const windowAspect = window.innerWidth / window.innerHeight;
  const canvasAspect = canvas.width / canvas.height;
  
  let displayWidth, displayHeight;
  
  if (windowAspect > canvasAspect) {
    // Window is wider - fit to height
    displayHeight = Math.min(window.innerHeight * 0.9, targetHeight);
    displayWidth = displayHeight * canvasAspect;
  } else {
    // Window is taller - fit to width
    displayWidth = Math.min(window.innerWidth * 0.9, targetWidth);
    displayHeight = displayWidth / canvasAspect;
  }
  
  canvas.style.width = displayWidth + "px";
  canvas.style.height = displayHeight + "px";
  canvas.style.imageRendering = "pixelated";
}

addEventListener("resize", resize);
resize();

export function getCanvasBounds() {
  const rect = canvas.getBoundingClientRect();
  return {
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
    tilesX: canvas.width / TILE_SIZE,
    tilesY: canvas.height / TILE_SIZE
  };
}
