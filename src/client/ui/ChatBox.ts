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
  private resizeHandle: HTMLDivElement;
  private isResizing = false;
  private startWidth = 0;
  private startX = 0;
  
  constructor() {
    // Load saved width or use default
    const savedWidth = localStorage.getItem('chatWidth') || '400';
    
    this.root = document.createElement("div");
    this.root.style.cssText = `
      position: absolute;
      bottom: 130px;
      left: 10px;
      width: ${savedWidth}px;
      height: 150px;
      background: rgba(0, 0, 0, 0.7);
      border: 2px solid #444;
      border-radius: 8px;
      padding: 8px;
      overflow: hidden;
      pointer-events: auto;
      font-family: monospace;
      font-size: 13px;
      min-width: 200px;
      max-width: 600px;
    `;
    
    this.messagesContainer = document.createElement("div");
    this.messagesContainer.style.cssText = `
      height: 100%;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
    `;
    
    // Resize handle
    this.resizeHandle = document.createElement("div");
    this.resizeHandle.style.cssText = `
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      width: 8px;
      cursor: ew-resize;
      background: rgba(255, 136, 0, 0.3);
      transition: background 0.2s;
    `;
    this.resizeHandle.onmouseenter = () => {
      this.resizeHandle.style.background = 'rgba(255, 136, 0, 0.6)';
    };
    this.resizeHandle.onmouseleave = () => {
      if (!this.isResizing) {
        this.resizeHandle.style.background = 'rgba(255, 136, 0, 0.3)';
      }
    };
    
    this.resizeHandle.onmousedown = (e) => {
      e.preventDefault();
      this.isResizing = true;
      this.startWidth = this.root.offsetWidth;
      this.startX = e.clientX;
      
      document.body.style.cursor = 'ew-resize';
    };
    
    document.addEventListener('mousemove', (e) => {
      if (!this.isResizing) return;
      
      const deltaX = e.clientX - this.startX;
      const newWidth = Math.max(200, Math.min(600, this.startWidth + deltaX));
      this.root.style.width = `${newWidth}px`;
    });
    
    document.addEventListener('mouseup', () => {
      if (this.isResizing) {
        this.isResizing = false;
        document.body.style.cursor = '';
        this.resizeHandle.style.background = 'rgba(255, 136, 0, 0.3)';
        
        // Save width to localStorage
        localStorage.setItem('chatWidth', this.root.offsetWidth.toString());
      }
    });
    
    this.root.appendChild(this.messagesContainer);
    this.root.appendChild(this.resizeHandle);
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
