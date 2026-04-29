import { component } from "../Interfaces/component";
import { broadcasts } from "../Interfaces/broadcasts";

export const ui_manager = (() => {

    class UIManager extends component.Component {

        constructor() {
            super();
            this.InitPlayerStats();
        }

        InitComponent() {
            this._RegisterHandler("game.nextTurn", (msg) => (this.#updatePlayerUI(msg)));
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

        SetPlayerInfo(player) {
            let name = player.playerName.toUpperCase();
            let school = player.witcherSchool.name;
            let combat_lvl = player.FindComponent("PlayerSkills").combat.level;

            document.getElementById("player-name").innerHTML = this.ReplaceUmlaute(name);
            //document.getElementById("player-school").innerHTML = this.ReplaceUmlaute(school);
            //document.getElementById("player-combat-lvl").innerHTML = combat_lvl;
        }

        SetPlayerPic(player) {
            let path = ""
            switch(player.witcherSchool.name){
                case "Baerenschule":
                    path = "./resources/assets/school-icons/geralt2.jpg";
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

        CreateStatBoxes(skillName) {
            let containerName = `${skillName}-lvl`
            const container = document.getElementById(containerName);

            for (let i = 0; i < 5; i++) {
                const box = document.createElement("div");
                box.className = "stat-box-empty";
                box.id = `${skillName}-stat-box-${i}`;
                container.appendChild(box);
            }
        }

        InitPlayerStats() {
            let skills = ["combat", "defense", "alchemy", "special"];
            for (const skill of skills) {
                this.CreateStatBoxes(skill);
            }
        }

        SetPlayerStats(player) {
            for (const skill of [player.FindComponent("PlayerSkills").combat, player.FindComponent("PlayerSkills").defense, player.FindComponent("PlayerSkills").alchemy, player.FindComponent("PlayerSkills").special]) {
                for (let i = 0; i < skill.level; i++) {
                    let skillName = skill.toIdentifier().toLowerCase();
                    let id = `${skillName}-stat-box-${i}`;
                    document.getElementById(id).className = "stat-box-fill";
                }
            }
            
        }
        
        #updatePlayerUI(msg) {
            this.SetPlayerInfo(msg.nextPlayer);
            this.SetPlayerPic(msg.nextPlayer);
        }

        Update(timeElapsed) {
            const player = this.FindComponent("GameManager").currentPlayer;
            this.SetPlayerStats(player);
        }
  
    }

    return {
        UIManager : UIManager
    }
}) (); 