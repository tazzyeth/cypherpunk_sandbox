import { Entity } from "./Entity";

export class NPCEntity extends Entity {
  name: string;
  dialog: string[];
  currentDialogIndex: number = 0;
  hasQuest: boolean = false;
  questCompleted: boolean = false;
  
  constructor(x: number, y: number, name: string, dialog: string[] = []) {
    super(x, y);
    this.name = name;
    this.dialog = dialog;
  }
  
  // Get current dialog text
  getCurrentDialog(): string {
    if (this.dialog.length === 0) return "...";
    return this.dialog[this.currentDialogIndex] || "...";
  }
  
  // Advance to next dialog
  nextDialog(): boolean {
    if (this.currentDialogIndex < this.dialog.length - 1) {
      this.currentDialogIndex++;
      return true;
    }
    return false; // No more dialog
  }
  
  // Reset dialog to beginning
  resetDialog() {
    this.currentDialogIndex = 0;
  }
  
  // Check if player is nearby (within interaction range)
  isNearby(playerX: number, playerY: number, range: number = 2): boolean {
    const dx = this.x - playerX;
    const dy = this.y - playerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance <= range;
  }
}
