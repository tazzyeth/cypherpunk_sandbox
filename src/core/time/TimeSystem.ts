export type TimeOfDay = "dawn" | "day" | "dusk" | "night";

export class TimeSystem {
  private currentTime = 6; // Start at 6 AM (dawn)
  private dayLengthMs = 300000; // 5 minutes = 1 full day
  private timeSpeed = 24 / (this.dayLengthMs / 1000); // hours per second
  
  constructor(dayLengthMinutes = 5) {
    this.dayLengthMs = dayLengthMinutes * 60 * 1000;
    this.timeSpeed = 24 / (this.dayLengthMs / 1000);
  }
  
  update(dt: number) {
    this.currentTime += this.timeSpeed * dt;
    if (this.currentTime >= 24) {
      this.currentTime -= 24;
    }
  }
  
  getCurrentTime(): number {
    return this.currentTime;
  }
  
  getTimeOfDay(): TimeOfDay {
    if (this.currentTime >= 5 && this.currentTime < 7) return "dawn";
    if (this.currentTime >= 7 && this.currentTime < 18) return "day";
    if (this.currentTime >= 18 && this.currentTime < 20) return "dusk";
    return "night"; // 20-5
  }
  
  isNight(): boolean {
    return this.currentTime >= 20 || this.currentTime < 5;
  }
  
  isDusk(): boolean {
    return this.currentTime >= 18 && this.currentTime < 20;
  }
  
  isDawn(): boolean {
    return this.currentTime >= 5 && this.currentTime < 7;
  }
  
  isDay(): boolean {
    return this.currentTime >= 7 && this.currentTime < 18;
  }
  
  // Get darkness level (0 = full light, 1 = full dark)
  getDarknessLevel(): number {
    const tod = this.getTimeOfDay();
    
    if (tod === "day") return 0;
    if (tod === "night") return 0.75;
    
    if (tod === "dawn") {
      // Fade from dark to light (5-7)
      const progress = (this.currentTime - 5) / 2;
      return 0.75 * (1 - progress);
    }
    
    if (tod === "dusk") {
      // Fade from light to dark (18-20)
      const progress = (this.currentTime - 18) / 2;
      return 0.75 * progress;
    }
    
    return 0;
  }
  
  // Get tint color for time of day
  getTintColor(): { r: number, g: number, b: number, a: number } {
    const tod = this.getTimeOfDay();
    
    if (tod === "day") {
      return { r: 255, g: 255, b: 255, a: 0 }; // No tint
    }
    
    if (tod === "night") {
      return { r: 20, g: 30, b: 60, a: 0.6 }; // Dark blue
    }
    
    if (tod === "dawn") {
      // Purple/pink tint
      return { r: 150, g: 100, b: 180, a: 0.3 };
    }
    
    if (tod === "dusk") {
      // Orange/red tint
      return { r: 200, g: 100, b: 50, a: 0.4 };
    }
    
    return { r: 255, g: 255, b: 255, a: 0 };
  }
  
  // Get formatted time string
  getTimeString(): string {
    const hours = Math.floor(this.currentTime);
    const minutes = Math.floor((this.currentTime % 1) * 60);
    const ampm = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
  }
}
