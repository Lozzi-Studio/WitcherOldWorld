import { component } from "../Interfaces/component";
import { broadcasts } from "../Interfaces/broadcasts";

export const ui_manager = (() => {

    const MAX_SKILL_LEVEL = 5;

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

        GetAvatarPathFromPlayer(player) {
            let path = ""
            switch(player.witcherSchool.name){
                case "Baerenschule":
                    path = "./resources/assets/avatars/bear.webp";
                    break;
                case "Katzenschule":
                    path = "./resources/assets/avatars/cat.webp";
                    break;
                case "Greifenschule":
                    path = "./resources/assets/avatars/griffin.webp";
                    break;
                case "Vipernschule":
                    path = "./resources/assets/avatars/viper.webp";
                    break;
                case "Wolfsschule":
                    path = "./resources/assets/avatars/wolf.webp";
                    break;
            }
            return path;
        }

        CreateStatBoxes(skillName) {
            let containerName = `${skillName}-lvl`
            const container = document.getElementById(containerName);

            for (let i = 0; i < MAX_SKILL_LEVEL; i++) {
                const box = document.createElement("div");
                box.classList.add("level-box", "level-box--neutral", "level-box--empty");
                box.id = `${skillName}-level-box-${i}`;
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
                for (let i = 0; i < MAX_SKILL_LEVEL; i++) {
                    let skillName = skill.toIdentifier().toLowerCase();
                    let id = `${skillName}-level-box-${i}`;
                    if (i < skill.level) {
                        document.getElementById(id).classList.remove("level-box--empty");
                    }
                    else {
                        document.getElementById(id).classList.add("level-box--empty");
                    }
                }
            }
            
        }
        
        CreateAvatarContainer(id) {
            var avatarContainer = document.createElement("div");
            avatarContainer.id = `avatar-container-${id}`;
            avatarContainer.classList.add("avatar-container", "avatar-container--small");
            return avatarContainer
        }

        /**
         * 
         * @param {int} playerId 
         * @param {array} playerList 
         */
        InitPlayerAvatars(playerList) {
            for (const [i, player] of playerList.entries()) {
                var avatarContainer = this.CreateAvatarContainer(i+1);
                avatarContainer.classList.add(`theme--player${i+1}`)
                document.getElementById("avatars-container").appendChild(avatarContainer);

                var avatar = document.createElement("img");
                avatar.classList.add("avatar", "avatar--small");
                avatar.src = this.GetAvatarPathFromPlayer(player);
                document.getElementById(`avatar-container-${i+1}`).appendChild(avatar);
            }
        }

        SetPlayerAvatarsStatus(playerList, currentPlayerId) {
            for (const [i, player] of playerList.entries()) {
                let playerId = i+1;
                if (playerId == currentPlayerId) {
                    document.getElementById(`avatar-container-${playerId}`).classList.remove("avatar-container--inactive");
                }
                else {
                    document.getElementById(`avatar-container-${playerId}`).classList.add("avatar-container--inactive");
                }
            }
        }

        InitPhaseOptions(phase) {
            let numberOfOptions;
            let phaseOptionTexts = [];
            switch (phase) {
                case 1:
                    numberOfOptions = 3;
                    phaseOptionTexts = [
                        "Bewege deine Figur zu einem Feld",
                        "Führe die Ortsaktion aus (optional)",
                        "Spiele Würfelpoker gegen einen anderen Hexer (optional)"
                    ];
                    break;
                case 2:
                    numberOfOptions = 3;
                    phaseOptionTexts = [
                        "Kämpfe gegen ein Monster oder einen Hexer",
                        "Meditiere",
                        "Erkunde die Stadt oder die Wildnis"
                    ];
                    break;
                case 3:
                    numberOfOptions = 3;
                    phaseOptionTexts = [
                        "Lege Karten ab (optional)",
                        "Ziehe Karten, bis du wieder drei Handkarten hast",
                        "Erwerbe eine Karte im Karten-Shop"
                    ];
                    break;
            }
            for (let i = 0; i < numberOfOptions; i++) {
                var phaseOptionText = document.createElement("div");
                phaseOptionText.classList.add("textbox", "textbox--fill-neutral");
                phaseOptionText.innerHTML = phaseOptionTexts[i];
                document.getElementById("phase-options-container").appendChild(phaseOptionText);
            }
        }

        InitPlayerShield() {
            let maxShield = 5;
            for (let i = 0; i < maxShield; i++) {
                var emptyShield = document.createElement("span");
                emptyShield.classList.add("material-symbols-outlined", "icon--inactive");
                emptyShield.id = `shield-${maxShield-i}`
                emptyShield.innerHTML = "shield";
                document.getElementById("player-shield-container").appendChild(emptyShield);
            }
        }

        SetPlayerShieldStatus(player) {
            // let shieldLevelArray = [0, 0, 0, 0, 0];
            let defenseLevel = player.FindComponent("PlayerSkills").defense.level;
            let shieldPoints = player.FindComponent("Shield").amount;
            for (let i = 0; i < defenseLevel; i++) {
                document.getElementById(`shield-${i+1}`).classList.remove("icon--inactive");
                document.getElementById(`shield-${i+1}`).classList.add("icon--active");
            }
            for (let i = 0; i < shieldPoints; i++) {
                document.getElementById(`shield-${i+1}`).classList.remove("icon--inactive");
                document.getElementById(`shield-${i+1}`).classList.add("icon--active");
                document.getElementById(`shield-${i+1}`).classList.add("filled");
            }
        }

        /**
         * 
         * @param {int} phase 
         */
        SetPhaseText(phase) {
            document.getElementById("phase-text").innerHTML = `Phase ${phase}/3`;
        }

        #updatePlayerUI(msg) {
            this.SetPlayerInfo(msg.nextPlayer);
            this.InitPlayerShield();
            document.getElementById("player-avatar").src = this.GetAvatarPathFromPlayer(msg.nextPlayer);
            
            const playerList = this.parent.parent.Filter(x => x.name.includes("Player"));
            this.InitPlayerAvatars(playerList);

            const currentPlayerId = this.FindComponent("GameManager").currentPlayerId;
            this.SetPlayerAvatarsStatus(playerList, currentPlayerId);

            const phase = this.FindComponent("GameManager").phase.toIdentifier();
            this.InitPhaseOptions(phase);
        }

        Update(timeElapsed) {
            const player = this.FindComponent("GameManager").currentPlayer;
            this.SetPlayerStats(player);
            this.SetPlayerShieldStatus(player);

            const phase = this.FindComponent("GameManager").phase.toIdentifier();
            this.SetPhaseText(phase);
        }
  
    }

    return {
        UIManager : UIManager
    }
}) (); 