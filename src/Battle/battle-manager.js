import { broadcasts } from "../Interfaces/broadcasts";
import { component } from "../Interfaces/component";
import { status_options } from "../Players/status-options";
import { status_templates } from "../Players/status-templates";


export const battle_manager = (() => {

    class BattleManager extends component.Component {
        #player;
        #monster;

        constructor(player, monster) {
            super();
            this.#player = player;
            this.#monster = monster;
        }

        InitComponent() {
            this.#player.Broadcast(broadcasts.BroadcastTemplateCards.ShuffleDeck(true));
            this.#monster.Broadcast(broadcasts.BroadcastTemplateCards.ShuffleDeck(true));
            this.#player.Broadcast(broadcasts.BroadcastTemplatePlayer.AddStatus(status_templates.StatusTemplates.forestTracker(), "permanent"));
            this.#player.Broadcast(broadcasts.BroadcastTemplatePlayer.AddStatus(status_templates.StatusTemplates.forestTracker(), "permanent"));          
            this.#GetStartingTurn();    
        }

        #GetStartingTurn() {
            switch(this.#monster.name.split("_")[1]) {
                case "River":
                    this.#player.FindComponent("PlayerStatus").GetStatusAmount(status_templates.StatusTemplates.riverTracker());
                    this.#player.FindComponent("PlayerStatus").RemovePermanentStatus(status_templates.StatusTemplates.riverTracker());
                case "Forest":
                    this.#player.FindComponent("PlayerStatus").GetStatusAmount(status_templates.StatusTemplates.forestTracker());
                    this.#player.FindComponent("PlayerStatus").RemovePermanentStatus(status_templates.StatusTemplates.forestTracker());
                case "Mountain":
                    this.#player.FindComponent("PlayerStatus").GetStatusAmount(status_templates.StatusTemplates.mountainTracker());
                    this.#player.FindComponent("PlayerStatus").RemovePermanentStatus(status_templates.StatusTemplates.mountainTracker());
            }
           

        }

        MonsterTurn() {
            
        }

        PlayerTurn() {

        }
    }

    return {
        BattleManager : BattleManager
    }
}) ();