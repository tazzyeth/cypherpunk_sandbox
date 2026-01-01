export interface QuestObjective {
  id: string;
  description: string;
  type: "gather" | "talk" | "craft" | "cook" | "kill";
  target: string;
  current: number;
  required: number;
  completed: boolean;
}

export interface QuestReward {
  xp?: { skill: string; amount: number }[];
  items?: { id: string; name: string; icon: string; quantity: number }[];
  gold?: number;
}

export class Quest {
  id: string;
  name: string;
  description: string;
  objectives: QuestObjective[];
  rewards: QuestReward;
  completed: boolean = false;
  active: boolean = false;
  
  constructor(
    id: string,
    name: string,
    description: string,
    objectives: QuestObjective[],
    rewards: QuestReward
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.objectives = objectives;
    this.rewards = rewards;
  }
  
  // Check if all objectives are complete
  isComplete(): boolean {
    return this.objectives.every(obj => obj.completed);
  }
  
  // Update objective progress
  updateObjective(objectiveId: string, amount: number = 1): boolean {
    const objective = this.objectives.find(obj => obj.id === objectiveId);
    if (!objective || objective.completed) return false;
    
    objective.current = Math.min(objective.current + amount, objective.required);
    
    if (objective.current >= objective.required) {
      objective.completed = true;
      return true; // Objective completed
    }
    
    return false;
  }
  
  // Get progress percentage
  getProgress(): number {
    const totalObjectives = this.objectives.length;
    const completedObjectives = this.objectives.filter(obj => obj.completed).length;
    return (completedObjectives / totalObjectives) * 100;
  }
  
  // Serialize for saving
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      objectives: this.objectives,
      rewards: this.rewards,
      completed: this.completed,
      active: this.active
    };
  }
  
  // Deserialize from save
  fromJSON(data: any) {
    this.objectives = data.objectives;
    this.completed = data.completed;
    this.active = data.active;
  }
}
