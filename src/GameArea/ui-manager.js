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

        ReplaceUmlaute(string) {
            if (string.includes("ae")) {
                string = string.replace("ae", "&auml;");
            }
            if (string.includes("oe")) {
                string = string.replace("oe", "&ouml;");
            }
            if (string.includes("ue")) {
                string = string.replace("ue", "&uuml;");
            }

            return string;
        }

        PlayerInfo(player) {
            let name = player.playerName.toUpperCase();
            let school = player.witcherSchool.name;
            let combat_lvl = player.FindComponent("PlayerSkills").combat.level;

            document.getElementById("player-name").innerHTML = this.ReplaceUmlaute(name);
            document.getElementById("player-school").innerHTML = this.ReplaceUmlaute(school);
            document.getElementById("player-combat-lvl").innerHTML = combat_lvl;
        }

        PlayerPic(player) {
            let path = ""
            switch(player.witcherSchool.name){
                case "Baerenschule":
                    path = "./resources/assets/school-icons/bear.png";
                    break;
                case "Katzenschule":
                    path = "./resources/assets/school-icons/cat.png";
                    break;
                case "Greifenschule":
                    path = "./resources/assets/school-icons/griffin.png";
                    break;
                case "Vipernschule":
                    path = "./resources/assets/school-icons/viper.png";
                    break;
                case "Wolfschule":
                    path = "./resources/assets/school-icons/wolf.png";
                    break;
            }
            document.getElementById("player-pic").src = path;
        }
        
        Update(timeElapsed) {
            const player = this.FindComponent("GameManager").currentPlayer;
            this.PlayerInfo(player);
            this.PlayerPic(player);
        }
  
    }

    return {
        UIManager : UIManager
    }
}) (); 