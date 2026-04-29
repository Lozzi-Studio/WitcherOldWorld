import { component } from "../Interfaces/component";
import { broadcasts } from "../Interfaces/broadcasts";

export const ui_manager = (() => {

    class UIManager extends component.Component {

        constructor() {
            super();
        }

        CardSlot0() {
            this.Broadcast(broadcasts.BroadcastTemplateCards.SelectCard(0));
        }

        CardSlot1() {
            this.Broadcast(broadcasts.BroadcastTemplateCards.SelectCard(1));
        }

        CardSlot2() {
            this.Broadcast(broadcasts.BroadcastTemplateCards.SelectCard(2));
        }

        CardSlot3() {
            this.Broadcast(broadcasts.BroadcastTemplateCards.SelectCard(3));
        }

        CardSlot4() {
            this.Broadcast(broadcasts.BroadcastTemplateCards.SelectCard(4));
        }

        CardSlot5() {
            this.Broadcast(broadcasts.BroadcastTemplateCards.SelectCard(5));
        }

        CardSlot6() {
            this.Broadcast(broadcasts.BroadcastTemplateCards.SelectCard(6));
        }

        EndPhase() {
            this.Broadcast(broadcasts.BroadcastTemplateCards.PlayerNextPhase());
        }

        //TODO remove when raycasting on towns is working - ONLY TEST PURPOSE
        SelectArdModron() {
            this.Broadcast(broadcasts.BroadcastTemplateTown.TownAction(this._parent.FindComponent("Town_18")));
        }


        
        Update(timeElapsed) {
            const player = this.FindComponent("GameManager").currentPlayer;
            document.getElementById("player-name").innerHTML = player.playerName.toUpperCase();
            document.getElementById("player-school").innerHTML = player.witcherSchool.name;
            document.getElementById("player-combat-lvl").innerHTML = player.FindComponent("PlayerSkills").combat.level;
        }
    }

    return {
        UIManager : UIManager
    }
}) (); 