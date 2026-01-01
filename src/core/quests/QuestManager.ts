import { Quest, QuestObjective } from "./Quest";
import { Player } from "../player/Player";

export class QuestManager {
  private quests: Map<string, Quest> = new Map();
  private activeQuests: Quest[] = [];
  private completedQuests: Quest[] = [];
  
  // Register a quest
  registerQuest(quest: Quest) {
    this.quests.set(quest.id, quest);
  }
  
  // Start a quest
  startQuest(questId: string): boolean {
    const quest = this.quests.get(questId);
    if (!quest || quest.active || quest.completed) return false;
    
    quest.active = true;
    this.activeQuests.push(quest);
    return true;
  }
  
  // Update quest objective
  updateObjective(questId: string, objectiveId: string, amount: number = 1): boolean {
    const quest = this.quests.get(questId);
    if (!quest || !quest.active) return false;
    
    return quest.updateObjective(objectiveId, amount);
  }
  
  // Complete a quest and give rewards
  completeQuest(questId: string, player: Player, chatBox: any): boolean {
    const quest = this.quests.get(questId);
    if (!quest || !quest.active || !quest.isComplete()) return false;
    
    quest.completed = true;
    quest.active = false;
    
    // Remove from active quests
    this.activeQuests = this.activeQuests.filter(q => q.id !== questId);
    this.completedQuests.push(quest);
    
    // Give rewards
    if (quest.rewards.xp) {
      quest.rewards.xp.forEach(xpReward => {
        const skill = player.skills.getSkill(xpReward.skill);
        if (skill) {
          const leveledUp = skill.addXP(xpReward.amount);
          chatBox.addSystemMessage(
            `Quest Complete! Gained ${xpReward.amount} ${xpReward.skill} XP!`
          );
          if (leveledUp) {
            chatBox.addSystemMessage(
              `${xpReward.skill} leveled up to ${skill.level}!`
            );
          }
        }
      });
    }
    
    if (quest.rewards.items) {
      quest.rewards.items.forEach(item => {
        player.addItem({
          id: item.id,
          name: item.name,
          icon: item.icon,
          quantity: item.quantity
        });
        chatBox.addSystemMessage(`Received ${item.quantity}x ${item.name}!`);
      });
    }
    
    if (quest.rewards.gold) {
      player.addGold(quest.rewards.gold);
      chatBox.addSystemMessage(`Received ${quest.rewards.gold} gold!`);
    }
    
    return true;
  }
  
  // Get active quests
  getActiveQuests(): Quest[] {
    return this.activeQuests;
  }
  
  // Get completed quests
  getCompletedQuests(): Quest[] {
    return this.completedQuests;
  }
  
  // Check if quest is complete
  isQuestComplete(questId: string): boolean {
    const quest = this.quests.get(questId);
    return quest ? quest.isComplete() : false;
  }
  
  // Serialize for saving
  toJSON() {
    return {
      activeQuests: this.activeQuests.map(q => q.toJSON()),
      completedQuests: this.completedQuests.map(q => q.id)
    };
  }
  
  // Deserialize from save
  fromJSON(data: any) {
    // Restore active quests
    if (data.activeQuests) {
      data.activeQuests.forEach((questData: any) => {
        const quest = this.quests.get(questData.id);
        if (quest) {
          quest.fromJSON(questData);
          if (quest.active) {
            this.activeQuests.push(quest);
          }
        }
      });
    }
    
    // Restore completed quests
    if (data.completedQuests) {
      data.completedQuests.forEach((questId: string) => {
        const quest = this.quests.get(questId);
        if (quest) {
          quest.completed = true;
          this.completedQuests.push(quest);
        }
      });
    }
  }
}
