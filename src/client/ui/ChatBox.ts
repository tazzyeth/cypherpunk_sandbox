export interface ChatMessage {
  text: string;
  type: "system" | "npc" | "player";
  timestamp: number;
}

export class ChatBox {
  private root: HTMLDivElement;
  private messagesContainer: HTMLDivElement;
  private messages: ChatMessage[] = [];
  private maxMessages = 100;
  
  constructor() {
    this.root = document.createElement("div");
    this.root.style.cssText = `
      position: absolute;
      bottom: 130px;
      left: 10px;
      width: 400px;
      height: 150px;
      background: rgba(0, 0, 0, 0.7);
      border: 2px solid #444;
      border-radius: 8px;
      padding: 8px;
      overflow: hidden;
      pointer-events: auto;
      font-family: monospace;
      font-size: 13px;
    `;
    
    this.messagesContainer = document.createElement("div");
    this.messagesContainer.style.cssText = `
      height: 100%;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
    `;
    
    this.root.appendChild(this.messagesContainer);
    document.getElementById("ui-root")!.appendChild(this.root);
    
    // Welcome message
    this.addSystemMessage("Welcome to Cypherpunk Sandbox!");
  }
  
  addMessage(text: string, type: "system" | "npc" | "player" = "system") {
    const message: ChatMessage = {
      text,
      type,
      timestamp: Date.now()
    };
    
    this.messages.push(message);
    
    // Limit message history
    if (this.messages.length > this.maxMessages) {
      this.messages.shift();
    }
    
    // Create message element
    const msgElement = document.createElement("div");
    msgElement.style.cssText = `
      padding: 2px 0;
      word-wrap: break-word;
    `;
    
    // Color based on type
    let color = "#fff";
    let prefix = "";
    
    switch (type) {
      case "system":
        color = "#ffff00"; // Yellow
        prefix = "[System] ";
        break;
      case "npc":
        color = "#00ffff"; // Cyan
        prefix = "";
        break;
      case "player":
        color = "#ffffff"; // White
        prefix = "";
        break;
    }
    
    msgElement.style.color = color;
    msgElement.textContent = prefix + text;
    
    this.messagesContainer.appendChild(msgElement);
    
    // Auto-scroll to bottom
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }
  
  addSystemMessage(text: string) {
    this.addMessage(text, "system");
  }
  
  addNPCMessage(npcName: string, text: string) {
    this.addMessage(`[${npcName}] ${text}`, "npc");
  }
  
  addPlayerMessage(text: string) {
    this.addMessage(text, "player");
  }
  
  clear() {
    this.messages = [];
    this.messagesContainer.innerHTML = "";
  }
}
