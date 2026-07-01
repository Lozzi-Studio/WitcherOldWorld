import { component } from "../../Interfaces/component";
import { broadcasts } from "../../Interfaces/broadcasts";
import { shiftLeft } from "three/tsl";
import { player_skills } from "../../Players/player-skills";

export const ui_manager = (() => {

    class UIManager extends component.Component {
        #maxSkillLevel;
        #numberOfPhaseOptions;
        #phaseThreePartTwo;
        #isLevelupPossible;
        #hasEnoughMoneyForLevelup;
        #hasSkillLeftForLevelup;

        /**
         * Manages API between UI and Backend
         */
        constructor() {
            super();
            this.#maxSkillLevel = 5;
            this.#numberOfPhaseOptions = 3;
            this.#phaseThreePartTwo = false;

            let button = document.getElementById("town-button");
            this.handleMoveClick = () => {
                if (button.classList.contains("button--inactive") == false) {
                    this.FindEntity("GameArea")
                        .FindComponent("GameManager")
                        .DiscardCardToMove();
                    this.#UpdateTownButton();
                }
            };

            this.handleActionClick = () => {
                if (button.classList.contains("button--inactive") == false) {
                    this.FindEntity("GameArea")
                        .FindComponent("GameManager")
                        .currentPlayer.town
                        .Broadcast(broadcasts.BroadcastTemplateTown.TownAction());
                }
            };
            
            this.handleBuyClick = () => {
                if (document.getElementById("shop-button").classList.contains("button--inactive") == false) {
                    this.FindEntity("Cardshop")
                        .FindComponent("CardshopManager")
                        .Broadcast(broadcasts.BroadcastTemplateCardShop.BuyCardFromShop());
                        this.#phaseThreePartTwo = false;
                        this.FindEntity('Camera').Broadcast(broadcasts.BroadcastTemplateCamera.StopFocusShop());
                }
            }

            this.handleDiscardClick = () => {
                const btn = document.getElementById("button-discard");
                if (!(btn && btn.classList.contains("button--inactive"))) {
                    this.FindEntity("GameArea")
                    .FindComponent("GameManager")
                    .Broadcast(broadcasts.BroadcastTemplateGame.DiscardSelectedCards());
                    this.FindEntity("GameArea").FindComponent("GameManager").Broadcast(broadcasts.BroadcastTemplateGame.DrawCardsUntilHandFull());
                    this.#DisableDiscardButtons();
                    this.#phaseThreePartTwo = true;
                    this.FindEntity('Camera').Broadcast(broadcasts.BroadcastTemplateCamera.FocusOnShop());
                }
            }    

            this.handleSkipClick = () => {
                let button = document.getElementById("button-skip");
                if (!(button.classList.contains("button--inactive"))){
                    this.FindEntity("GameArea").FindComponent("GameManager").Broadcast(broadcasts.BroadcastTemplateGame.DrawCardsUntilHandFull());
                    this.#DisableDiscardButtons();
                    this.#phaseThreePartTwo = true;
                    this.FindEntity('Camera').Broadcast(broadcasts.BroadcastTemplateCamera.FocusOnShop());
                }
            }

            let skipButton = document.getElementById("end-phase-button");
            this.HandleEndPhaseClick = () => {
                if (skipButton.classList.contains("button--inactive") == false) {
                    this.Broadcast(broadcasts.BroadcastTemplateGame.NextPhase());
                }
            };

            this.handleLogToggleClick = () => {
                const logWindow = document.getElementById("log-window");
                const logToggleIcon = document.getElementById("log-toggle-icon");
                const logger = document.getElementById("logger");

                logWindow.classList.toggle("log-window--open");
                
                if (logWindow.classList.contains("log-window--open")) {
                    logToggleIcon.innerText = "arrow_back_ios"; 
                    logger.scrollTop = logger.scrollHeight;
                } else {
                    logToggleIcon.innerText = "arrow_forward_ios"; 
                }
            }

            this.handlePlayClick = () => {
                const btn = document.getElementById("button-play");
                if (!(btn.classList.contains("button--inactive"))) {
                    document.getElementById("battle-player-window").style.display = "none";
                    this.Broadcast(broadcasts.BroadcastTemplateBattle.PlayCombo());
                }
            }

            let debugButton = document.getElementById("debug-next-phase-button");
            this.HandleSkipPhaseClick = () => {
                if (debugButton.classList.contains("button--inactive") == false) {
                    this.Broadcast(broadcasts.BroadcastTemplateGame.NextPhase());
                }
                if (this.FindEntity("GameArea").FindComponent("GameManager").phase.toIdentifier() == 3) {
                    document.getElementById("phase-two-options-menu").style.display = "none";
                }
            };

            let upgradeSkillButton = document.getElementById("debug-upgrade-skill-button");
            this.HandleUpgradeSkillClick = () => {
                if (upgradeSkillButton.classList.contains("button--inactive") == false) {
                    this.#LoadSkillDecider();
                }
            };

            let addMoneyButton = document.getElementById("debug-add-money-button");
            this.HandleAddMoneyClick = () => {
                if (addMoneyButton.classList.contains("button--inactive") == false) {
                    this.FindComponent("GameManager").currentPlayer.Broadcast(broadcasts.BroadcastTemplatePlayer.ChangeMoney(+1));
                }
            };

            let addTrophyButton = document.getElementById("debug-add-trophy-button");
            this.HandleAddTrophyClick = () => {
                if (addTrophyButton.classList.contains("button--inactive") == false) {
                    this.FindComponent("GameManager").currentPlayer.Broadcast(broadcasts.BroadcastTemplatePlayer.AddTrophy());
                }
            };

            let cancelButton = document.getElementById("skill-levelup-cancel-button");
            this.HandleCancelLevelupClick = () => {
                if (cancelButton.classList.contains("button--inactive") == false) {
                    this.#SetSkillWindowMode("default");
                }
            }

            let continueButton = document.getElementById("skill-levelup-continue-button");
            this.HandleContinueLevelupClick = () => {
                if (continueButton.classList.contains("button--inactive") == false) {
                    this.#SetSkillWindowMode("default");
                }
            }
            
            let playerInfoButton = document.getElementById("player-info-button");
            this.HandlePlayerInfoClick = () => {
                if (!playerInfoButton.classList.contains("filled")) {
                    this.#ShowSchoolInfo();
                    this.#ShowSkillInfo();
                    playerInfoButton.classList.add("filled");
                }
                else {
                    this.#HideSchoolInfo();
                    this.#HideSkillInfo();
                    playerInfoButton.classList.remove("filled");
                }
            }

            this.HandleClosePlayerClick = () => {
                let msg = {player: this.FindComponent("GameManager").currentPlayer}
                this.#UpdatePlayerInfoWindow(msg);
            }

            this.handleSpecialClick = () => {
                const btn = document.getElementById("button-special");
                if (!(btn.classList.contains("button--inactive"))) {
                    this.UpdateButtonState("button-special", false);
                    this.FindEntity("BattleEntity").Broadcast(broadcasts.BroadcastTemplateBattle.UseSpecial());
                }
            }
        }


        /**
         * Used to intialize and add any default components/events
         */        
        InitComponent() {
            this._RegisterHandler('game.start', (msg) => {this.#OnGameStart(msg)});
            this._RegisterHandler("game.nextPlayer", (msg) => {this.#OnNextPlayer(msg)});
            this._RegisterHandler("player.move", (msg) => {this.UpdateButtonState("end-phase-button", true)});

            this._RegisterHandler('skill.updateUI', (msg) => {this.#UpdatePlayerStats(msg)});
            this._RegisterHandler('player.updateUI', (msg) => {this.#UpdatePlayerStats(msg)});
            this._RegisterHandler('player.updateHandCardsUI', (msg) => {this.#UpdateHandCards(msg)});
            this._RegisterHandler('card.updateHandSelectionUI', (msg) => {this.#UpdateHandCardSelection(msg)});
            this._RegisterHandler('player.selection', (msg) => {this.#UpdatePlayerInfoWindow(msg)});
            
            this._RegisterHandler("skill.chooseSkill", (msg) => {this.#LoadSkillDecider(msg)});

            this._RegisterHandler('town.selection', (msg) => {this.#ShowTownInfo(msg)});
            this._RegisterHandler('town.updateButton', (msg) => {this.#UpdateTownButton(msg)});
            this._RegisterHandler('game.updateDiscardButton', (msg) => {this.UpdateButtonState("button-discard", msg.active);});
            this._RegisterHandler('game.changeMouseCursor', (msg) => {this.#ChangeMouseCursor(msg)});
            this._RegisterHandler("game.nextPhase", (msg) => {this.#OnNextPhase(msg)});
            
            this._RegisterHandler("game.endGame", (msg) => {this.#OnEndGame(msg)});
            let newGameButton = document.getElementById("back-to-menu-btn");
            newGameButton.addEventListener("click", () => {
                document.getElementById("end-game-overlay").classList.add("overlay--hidden");
                location.reload();
            });

            this._RegisterHandler('cardshop.select', (msg) => {this.#ShowShopConfirm(msg)});

            this._RegisterHandler('battle.playerTurn', (msg) => {this.#OnBattlePlayerTurn(msg)});

            document.getElementById("close-town-window-button").addEventListener("click", this.#HideTownInfo);
            document.getElementById("debug-next-phase-button").addEventListener("click", this.HandleSkipPhaseClick);
            document.getElementById("end-phase-button").addEventListener("click", this.HandleEndPhaseClick);
            document.getElementById("debug-upgrade-skill-button").addEventListener("click", this.HandleUpgradeSkillClick);
            document.getElementById("debug-add-money-button").addEventListener("click", this.HandleAddMoneyClick);
            document.getElementById("debug-add-trophy-button").addEventListener("click", this.HandleAddTrophyClick);
            
            document.getElementById("skill-levelup-cancel-button").addEventListener("click", this.HandleCancelLevelupClick);
            document.getElementById("skill-levelup-continue-button").addEventListener("click", this.HandleContinueLevelupClick);
            document.getElementById("player-info-button").addEventListener("click", this.HandlePlayerInfoClick);
            
            document.getElementById("turn-change-continue-btn").addEventListener("click", () => {
                document.getElementById("turn-change-overlay").classList.add("overlay--hidden");
            });

            document.getElementById("close-player-window-button").addEventListener("click", this.HandleClosePlayerClick);

            document.getElementById("log-toggle-btn").addEventListener("click", this.handleLogToggleClick);
        }

        get phasethreeparttwo() {
            return this.#phaseThreePartTwo;
        }

        /**
         * Triggers Cardslot Selection
         */
        SelectCard(card_slot, card, mode, selectableCards) {
            this.Broadcast(broadcasts.BroadcastTemplateCards.SelectCard(card_slot, card, mode, selectableCards));
        }

        /**
         * Replace with german specific vowel
         * @param {string} string 
         * @returns {string}
         */
        #ReplaceUmlaute(string) {
            if (string.includes("ae")) {
                string = string.replace("ae", "&auml;");
            }
            if (string.includes("oe")) {
                string = string.replace("oe", "&ouml;");
            }
            if (string.includes("ue")) {
                string = string.replace("ue", "&uuml;");
            }
            if (string.includes("Ae")) {
                string = string.replace("Ae", "&Auml;");
            }
            if (string.includes("Oe")) {
                string = string.replace("Oe", "&Ouml;");
            }
            if (string.includes("Ue")) {
                string = string.replace("Ue", "&Uuml;");
            }

            return string;
        }

        /**
         * Set UI Info of player
         * @param {player_entity.Player} player 
         */
        #SetPlayerInfo(msg) {
            let name = msg.player.playerName.toUpperCase();
            let school = msg.player.witcherSchool.name;
            let combat_lvl = msg.player.FindComponent("PlayerSkills").combat.level;

            document.getElementById("player-name").innerHTML = this.#ReplaceUmlaute(name);
        }

        /**
         * Get avatar path as string for specific player
         * @param {player_entity.Player} player 
         * @returns {string}
         */
        #GetAvatarPathFromPlayer(player) {
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

        /**
         * Change avatar picture for player
         * @param {player_entity.Player} player 
         */
        #SetPlayerAvatar(msg) {
            document.getElementById("player-avatar").src = this.#GetAvatarPathFromPlayer(msg.player);
        }

        #ShowLevelBonuses(skill) {
            // CURRENTLY NOT IN USE - USING NUMBERS INSTEAD
            // TODO: Glyphen Farbe einstellbar machen, evtl als Font nutzen?
            let path = "./resources/assets/glyphs/"
            let skillName = skill.toIdentifier().toLowerCase();

            const container = document.getElementById(`${skillName}-lvl-bonus-glyph`);

            for (let i = 0; i < this.#maxSkillLevel; i++) {
                const box = document.createElement("img");
                box.classList.add("level-bonus");
                box.id = `${skillName}-level-bonus-${this.#maxSkillLevel - i}`;
                box.src = path + skillName + (this.#maxSkillLevel - i) + ".svg";
                container.appendChild(box);
            }
        }

        /**
         * Create UI Boxes for skill points
         * @param {string} skillName 
         */
        #CreateSkillBoxes(skillName) {
            const container = document.getElementById(`${skillName}-lvl`);

            for (let i = 0; i < this.#maxSkillLevel; i++) {
                const box = document.createElement("div");
                box.classList.add("level-box", "level-box--neutral", "level-box--empty");
                box.id = `${skillName}-level-box-${this.#maxSkillLevel - i}`;
                container.appendChild(box);
            }
        }

        /**
         * Initialize skillboxes in UI
         */
        #InitPlayerSkills() {
            let skills = this.FindComponent("GameManager").currentPlayer.FindComponent("PlayerSkills").GetAllSkills();
            for (const skill of skills) {
                this.#CreateSkillBoxes(skill.toIdentifier().toLowerCase());
            }
        }

        /**
         * Get skill level from player and set values in UI
         * @param {player_entity.Player} player 
         */
        #SetPlayerSkills(player) {
            let skills = player.FindComponent("PlayerSkills").GetAllSkills();
            for (const skill of skills) {
                for (let i = 0; i < this.#maxSkillLevel; i++) {
                    let skillName = skill.toIdentifier().toLowerCase();
                    let id = `${skillName}-level-box-${i+1}`;
                    let idBonus = `${skillName}-level-bonus-${i+1}`;
                    if (i < skill.level) {
                        document.getElementById(id).classList.remove("level-box--empty");
                        document.getElementById(idBonus).classList.remove("level-bonus-glyph--inactive");
                    }
                    else {
                        document.getElementById(id).classList.add("level-box--empty");
                        document.getElementById(idBonus).classList.add("level-bonus-glyph--inactive");
                    }
                }
            }
        }

        /**
         * Set witcher level in UI
         * @param {player_entity.Player} player 
         */
        #SetWitcherLevel(player) {
            document.getElementById("witcher-level").innerHTML = player.FindComponent("PlayerSkills").witcher.level;
        }
        
        /**
         * Create container for player avatar
         * @param {int} id 
         * @returns 
         */
        #CreateAvatarContainer(id) {
            var avatarContainer = document.createElement("div");
            avatarContainer.id = `avatar-container-${id}`;
            avatarContainer.classList.add("avatar-container", "avatar-container--small", "tooltip-icon");
            return avatarContainer;
        }

        /**
         * creates button in HTML to reset camera to focus current player
         */
        #CreateResetCameraButton() {
            if (!document.getElementById("reset-camera-button")) {
                let resetButton = document.createElement("div");
                resetButton.classList.add("textbox", "textbox--fill", "button", "position-bottom-center");
                resetButton.id = "reset-camera-button";
                resetButton.innerHTML = "Zurück zu meiner Spielfigur";
                document.getElementById("game-ui").appendChild(resetButton);
    
                let currentPlayer = this.FindComponent("GameManager").currentPlayer;
                resetButton.addEventListener("click", () => {
                    this.FindEntity("Camera").Broadcast(broadcasts.BroadcastTemplateCamera.FocusOn(currentPlayer));
                    let msg = {player: currentPlayer}
                    this.#UpdatePlayerInfoWindow(msg);
                    this.#DeleteResetCameraButton();
                })
            }
        }

        /**
         * removes reset camera button from DOM
         */
        #DeleteResetCameraButton() {
            let resetButton = document.getElementById("reset-camera-button");
            resetButton.remove()
        }

        /**
         * Initialize player avatar
         * @param {int} playerId 
         * @param {array} playerList 
         */
        #InitPlayerAvatars(playerList) {
            for (const [i, player] of playerList.entries()) {
                var avatarContainer = this.#CreateAvatarContainer(i+1);
                avatarContainer.classList.add(`theme--${player.witcherSchool.name}`)
                avatarContainer.addEventListener("click", () => {
                    this.Broadcast(broadcasts.BroadcastTemplatePlayer.SelectPlayer(this.FindEntity(player.name)));
                    this.FindEntity("Camera").Broadcast(broadcasts.BroadcastTemplateCamera.FocusOn(player));
                    this.#CreateResetCameraButton();
                    
                    let currentPlayer = this.FindComponent("GameManager").currentPlayer;
                    if (player == currentPlayer) {
                        this.#DeleteResetCameraButton();
                    }
                    
                })
                document.getElementById("avatars-container").appendChild(avatarContainer);
                const tooltip = document.createElement("div");
                tooltip.classList.add("tooltip-text", "tooltip-text--bottom");
                tooltip.innerHTML = player.playerName;
                document.getElementById("avatars-container").appendChild(tooltip);

                var avatar = document.createElement("img");
                avatar.classList.add("avatar", "avatar--small");
                avatar.src = this.#GetAvatarPathFromPlayer(player);
                document.getElementById(`avatar-container-${i+1}`).appendChild(avatar);
            }
        }

        /**
         * Set status of player avatar
         * @param {array} playerList 
         * @param {int} currentPlayerId 
         */
        #SetPlayerAvatarsStatus(playerList, currentPlayerId) {
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

        /**
         * Init phase options in UI
         * @param {object} msg 
         */
        #InitPhaseOptions(msg) {
            for (let i = 0; i < this.#numberOfPhaseOptions; i++) {
                var phaseOptionTextbox = document.createElement("div");
                phaseOptionTextbox.classList.add("textbox");
                phaseOptionTextbox.id = `phase-option-text-${i}`;
                phaseOptionTextbox.innerHTML = `PHASE-OPTION-${i}`;
                document.getElementById("phase-options-container").appendChild(phaseOptionTextbox);
            }
            this.#SetPhaseOptions(msg);
        }

        /**
         * Set phase options based on current phase
         * @param {object} msg 
         */
        #SetPhaseOptions(msg) {
            const phase = this.FindComponent("GameManager").phase.toIdentifier();
            let phaseOptionTexts = [];

            switch (phase) {
                case 1:
                    phaseOptionTexts = [
                        "Bewege deine Figur zu einem Feld",
                        "Führe die Ortsaktion aus (optional)",
                        "Spiele Würfelpoker gegen einen anderen Hexer (optional)"
                    ];
                    break;
                case 2:
                    phaseOptionTexts = [
                        "Kämpfe gegen ein Monster oder einen Hexer",
                        "Meditiere",
                        "Erkunde die Stadt oder die Wildnis"
                    ];
                    break;
                case 3:
                    phaseOptionTexts = [
                        "Lege Karten ab (optional)",
                        "Ziehe Karten, bis du wieder drei Handkarten hast",
                        "Erwerbe eine Karte im Karten-Shop"
                    ];
                    break;
            }
            for (let i = 0; i < this.#numberOfPhaseOptions; i++) {
                document.getElementById(`phase-option-text-${i}`).innerHTML = phaseOptionTexts[i];
            }

            document.getElementById("phase-text").innerHTML = `Phase ${phase}/3`;
        }


        /**
         * Set button state based on current phase
         */
        #DisableDiscardButtons(){
            const discardPanel = document.getElementById("discard-button-area");
            const discardButton = document.getElementById("button-discard");

            if (discardPanel) discardPanel.style.display = "none";
            if (discardButton) discardButton.removeEventListener("click", this.handleDiscardClick);
            this.ShowPhaseThreeButtons(false);
        }

        
        #UpdateNextPhaseButton(msg) {
            let button = document.getElementById("end-phase-button");
            if (this.FindEntity("GameArea").FindComponent("GameManager").phase.toIdentifier() == 1) {
                button.style.display = "block";
            }
            else {
                button.style.display = "none";
            }
        }

        ShowPhaseThreeButtons(active){
            const discardButtons = document.getElementById("discard-buttons");
            const handWindow = document.getElementById("hand-window");
            const discardModal = document.getElementById("discard-modal");
            const skipButton = document.getElementById("button-skip");
            if(active){
                if (discardButtons) discardButtons.style.display = "flex";
                skipButton.style.display = "flex";
                this.UpdateButtonState("button-skip", true);
                if (handWindow) handWindow.style.position = "relative";
            }
            else{
                if (discardButtons) discardButtons.style.display = "none";
                skipButton.style.display = "none";
                if (handWindow) handWindow.style.position = "absolute";
            }
        }

        /**
         * Init player shield in UI
         */
        #InitPlayerShield() {
            let maxShield = 5;
            for (let i = 0; i < maxShield; i++) {
                var emptyShield = document.createElement("span");
                emptyShield.classList.add("material-symbols-outlined", "icon--inactive");
                emptyShield.id = `shield-${i+1}`
                emptyShield.innerHTML = "shield";
                document.getElementById("player-shield-container").appendChild(emptyShield);
            }
        }

        /**
         * Set UI shield value for player
         * @param {player_entity.Player} player 
         */
        #SetPlayerShieldStatus(player) {
            let defenseLevel = player.FindComponent("PlayerSkills").defense.level;
            let shieldPoints = player.FindComponent("Shield").amount;
             for (let i = 0; i < 5; i++) {
                document.getElementById(`shield-${i+1}`).classList.remove("filled");
            }
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
         * Set player money in UI
         * @param {object} msg 
         */
        #SetPlayerMoney(player) {
            let playerMoney = player.FindComponent("MoneyStorage").amount;
            document.getElementById("money-amount").innerHTML = playerMoney;
        }

        /**
         * Set player trophies in UI
         * @param {object} msg 
         */
        #SetPlayerTrophies(player) {
            let playerTrophies = player.FindComponent("TrophyStorage").amount;
            document.getElementById("trophy-amount").innerHTML = playerTrophies;
        }
        
        /**
         * Shows further ability information
         * @param {town_entity.TownEntity.ability} ability 
         */
        #ShowTownAbilityInfoIfNeeded(ability) {
            if (ability.name == "Erhoehe Attribut" && ability.trigger.payMoney == false) {
                document.getElementById("town-ability-info").style.display = "inherit";
                document.getElementById("town-ability-info").classList.add("container", "container--row");
                switch (ability.trigger.skill?.toIdentifier()) {
                    case "Combat":
                        document.getElementById("town-ability-info__icon").innerHTML = "swords";
                        break;
                    case "Defense":
                        document.getElementById("town-ability-info__icon").innerHTML = "shield";
                        break;
                    case "Alchemy":
                        document.getElementById("town-ability-info__icon").innerHTML = "air_freshener";
                        break;
                    case "Special":
                        document.getElementById("town-ability-info__icon").innerHTML = "star_shine";
                }
                document.getElementById("town-ability-info__text").innerHTML = "+1";
            }
            else {
                document.getElementById("town-ability-info").classList.remove("container", "container--row");
                document.getElementById("town-ability-info__icon").innerHTML = "";
                document.getElementById("town-ability-info__text").innerHTML = "";
                document.getElementById("town-ability-info").style.display = "none";
            }
        }

        /**
         * Sets town button's css class to active or inactive
         * @param {string} buttonID
         * @param {bool} buttonActive 
         */
        UpdateButtonState(buttonID, buttonActive) {
            let button = document.getElementById(buttonID);
            if (buttonActive) {
                button.classList.remove("button--inactive");
            }
            else {
                button.classList.add("button--inactive");
            }
        }


        /**
         * Set town button's label and eventListener
         * @param {string} buttonMode - Options: "action", "move"
         */
        #UpdateTownButtonMode(buttonMode) {
            let button = document.getElementById("town-button");
            button.removeEventListener("click", this.handleActionClick);
            button.removeEventListener("click", this.handleMoveClick);

            if (buttonMode == "action") {
                button.innerHTML = "Ortsaktion ausf&uuml;hren";
                button.addEventListener("click", this.handleActionClick);
            }
            else {
                button.innerHTML = "Gehe hierhin";
                button.addEventListener("click", this.handleMoveClick);
            }
        }

        /**
         * Update town button state and mode
         * @param {object} msg 
         */
        #UpdateTownButton(msg) {
            if (this.FindComponent("GameManager").phase.toIdentifier() == 1) {
                let player = this.FindComponent("GameManager").currentPlayer;
                let selectedTown = this.FindComponent("GameManager").selectedTown;
                let buttonActive = true;
                let buttonMode = "";

                if (selectedTown == player.town) {
                    buttonMode = "action";
                    if (selectedTown.FindComponent("TownProperties").abilityExecuted || !(selectedTown.FindComponent("TownProperties").canUseAbility()) ) {
                        buttonActive = false;
                    }
                    else {
                        buttonActive = true;
                    }
                }
                else {
                    buttonMode = "move";
                    if (this.FindEntity("GameArea").FindComponent("GameManager").ValidateMove().moveAllowed) {
                        buttonActive = true;
                    }
                    else {
                        buttonActive = false;
                    }
                }

                this.UpdateButtonState("town-button", buttonActive);
                this.#UpdateTownButtonMode(buttonMode, buttonActive);
            }
        }

        /**
         * Show town info window in UI including Town Button
         * @param {object} msg 
         */
        #ShowTownInfo(msg) {
            document.getElementById("town-window").style.display = "flex";
            document.getElementById("town-name").innerHTML = `${msg.town.town_name}`;
            switch (msg.town.region.toIdentifier()) {
                case "River":
                    document.getElementById("town-symbol").innerHTML = "water";
                    break;
                case "Mountain":
                    document.getElementById("town-symbol").innerHTML = "landscape";
                    break;
                case "Forest":
                    document.getElementById("town-symbol").innerHTML = "forest";
                    break;
            }

            document.getElementById("town-ability").innerHTML = this.#ReplaceUmlaute(msg.town.ability.name);
            document.getElementById("town-tooltip").innerHTML = this.#ReplaceUmlaute(msg.town.ability.tooltip);
            
            this.#ShowTownAbilityInfoIfNeeded(msg.town.ability);
            this.#UpdateTownButton(msg);
        }

        /**
         * Hide town info window inlcuding town button
         * @param {object} msg 
         */
        #HideTownInfo(msg) {
            document.getElementById("town-window").style.display = "none";
        }

        /**
         * Dynamically creates DIV elements for hand cards from card information
         * @param {card.Card} card 
         * @returns 
         */
        #CreateCardDIV(card) {
            let cardDIV = document.createElement("div");
            cardDIV.classList.add("container", "container--col", "card");   
            
            let iconName = "";
            switch (card.region.toIdentifier()) {
                case "River":
                    iconName = "water";
                    break;
                case "Mountain":
                    iconName = "landscape";
                    break;
                case "Forest":
                    iconName = "forest";
                    break;
            }

            let cardColor = "";
            switch (card.color.toIdentifier()) {
                case "Blue":
                    cardColor = "#8F97FF";
                    break;
                case "Red":
                    cardColor = "#FF7D7D";
                    break;
                case "Green":
                    cardColor = "#97FF8F";
                    break;
                case "Purple":
                    cardColor = "#DA8FFF";
                    break;
                case "Yellow":
                    cardColor = "#FFF98F";
                    break;
            }

            cardDIV.innerHTML = `
            <div class="material-symbols-outlined filled" class="card__icon" style="color: ${cardColor}">${iconName}</div>
            <div class="card__text" style="color: ${cardColor}">${card.name}</div>
            `;

            return cardDIV;
        }

        /**
         * 
         * @param {cards.Card} card 
         * @param {HTMLElement} cardDIV 
         */
        UpdateCardContent(card, cardDIV) {
            const img = new Image();
            img.onload = () => {
                cardDIV.style.backgroundImage = `url(${card.imagePath})`;
                cardDIV.innerHTML = "";
            };
            img.onerror = () => {
                cardDIV.style.backgroundImage = "none";
                cardDIV.innerHTML = this.#CreateCardDIV(card).innerHTML;
            };
            img.src = card.imagePath;
        } 

        /**
         * Loads card images for every hand card the player has and deletes the images when a card is played
         * @param {object} msg 
         */
        #UpdateHandCards(msg) {
            let player = this.FindComponent("GameManager").currentPlayer;
            let playerHand = player.FindComponent("Carddeck").hand;
            let handWindow = document.getElementById("hand-window");
            for (let [i, card] of playerHand.entries()) {
                let cardDIV = document.getElementById(`card-image-${i}`);
                if (cardDIV) {
                    this.UpdateCardContent(card, cardDIV);
                }
                else {
                    let newCardDIV = document.createElement("div");
                    newCardDIV.id = `card-image-${i}`;
                    newCardDIV.classList.add("container", "container--col", "card");
                    handWindow.appendChild(newCardDIV);
                    newCardDIV.addEventListener("click", () => this.SelectCard(i, card, "Hand", 1));
                    this.UpdateCardContent(card, newCardDIV);
                }
            }
            for (let [i, child] of Array.from(handWindow.children).entries()) {
                if (!playerHand[i]) {
                    document.getElementById(`card-image-${i}`).remove();
                }
            }
        }

        /**
         * Adds the card--selected class to cards that are selected by the player.
         * @param {object} msg 
         */
        #UpdateHandCardSelection(msg) {
            if (msg.card_slot !== undefined) {
                let cardImage = document.getElementById(`card-image-${msg.card_slot}`);
                if (msg.mode == "Select") {
                    cardImage.classList.add("card--selected");
                }
                else {
                    cardImage.classList.remove("card--selected");
                }
            }
            else {
                let handWindow = document.getElementById("hand-window");
                for (let [i, child] of Array.from(handWindow.children).entries()) {
                    document.getElementById(`card-image-${i}`).classList.remove("card--selected");
                }
            }
            switch(msg.phase) {
                case 1:
                    this.#UpdateTownButton(msg);
                    break;
                case 2:
                    this.#UpdatePlayButton(msg);
                    break;
                case 3:
                    this.#UpdateShopButton(msg);
                    break;
            }   
        }

        /**
         * Change mouse cursor depending on if the hovered element is clickable (not yet in use)
         * @param {object} msg 
         */
        #ChangeMouseCursor(msg) {
            if (msg.cursor == "pointer") {
                document.getElementsByTagName("body")[0].classList.add("--cursor-pointer");
                document.getElementsByTagName("body")[0].classList.remove("--cursor-default");
            }
            else {
                document.getElementsByTagName("body")[0].classList.remove("--cursor-pointer");
                document.getElementsByTagName("body")[0].classList.add("--cursor-default");
            }
        }

        /**
         * Initilaizes UI components
         * @param {object} msg 
         */
        #OnGameStart(msg) {
            this.#InitPlayerShield();
            this.#InitPlayerSkills();
            this.#InitPhaseOptions();
            this.#ExcludeUIFromRaycasting();
            this.#DisableDiscardButtons();

            const playerList = this._parent._parent.Filter(x => x.name.includes("Player"));
            this.#InitPlayerAvatars(playerList);
            this.#OnNextPlayer(broadcasts.BroadcastTemplateGame.NextPlayer(playerList[0]));
        }

        /**
         * Update all stats in player window from input player in msg.player
         * @param {object} msg 
         */
        #UpdatePlayerInfoWindow(msg) {
            let currentPlayer = this.FindComponent("GameManager").currentPlayer;
            let playerWindow = document.getElementById("player-window");
            let closeButton = document.getElementById("close-player-window-button");
            let infoButton = document.getElementById("player-info-button");
            if (msg.player != currentPlayer) {
                playerWindow.classList.add("borders--all");
                playerWindow.classList.add("position-from-three");
                playerWindow.classList.remove("position-top-left");
                playerWindow.classList.remove("borders--bottom-right");
                closeButton.style.display = "block";
                infoButton.style.display = "none";
            }
            else {
                playerWindow.classList.remove("borders--all");
                playerWindow.classList.remove("position-from-three");
                playerWindow.classList.add("borders--bottom-right");
                playerWindow.classList.add("position-top-left");
                playerWindow.style.transform = null;
                closeButton.style.display = "none";
                infoButton.style.display = "block";
            }

            this.#SetPlayerInfo(msg);
            this.#SetPlayerAvatar(msg);
            this.#UpdatePlayerStats(msg);
            this.#UpdatePlayerSchool(msg);
            this.#InitPlayerWindow();

            document.getElementById("player-window").dataset["theme"] = msg.player.witcherSchool.name;
        }

        /**
         * Update UI on player switch
         * @param {object} msg 
         */
        #OnNextPlayer(msg) {
            this.#UpdatePlayerInfoWindow(msg)

            this.#OnNextPhase();
            this.#UpdateHandCards(msg);
            this.UpdateButtonState("end-phase-button", false);

            const playerList = this._parent._parent.Filter(x => x.name.includes("Player"));
            const currentPlayerId = this.FindComponent("GameManager").currentPlayerId;
            this.#SetPlayerAvatarsStatus(playerList, currentPlayerId);

            this.#ShowTurnChangePopup(msg.player);

            document.documentElement.dataset["theme"] = msg.player.witcherSchool.name;
        }

        /**
         * Update UI on next phase
         * @param {object} msg 
         */
        #OnNextPhase() {
            this.#SetPhaseOptions();
            this.#UpdateNextPhaseButton();
    
            const currentPhase = this.FindComponent("GameManager").phase.toIdentifier();
            const discardPanel = document.getElementById("discard-button-area");
            const discardButton = document.getElementById("button-discard");
            const skipButton = document.getElementById("button-skip");

            if (currentPhase != 1) {
                this.UpdateButtonState("town-button", false);
            }
            if (currentPhase == 3) {
                document.getElementById("debug-next-phase-button").innerHTML = "Next Player";
                discardButton.style.display = "flex";
                discardButton.classList.add("button--inactive");
                discardButton.addEventListener("click", this.handleDiscardClick);

                skipButton.style.display = "flex";
                skipButton.classList.add("button--inactive");
                skipButton.addEventListener("click", this.handleSkipClick);
                this.ShowPhaseThreeButtons(true);
            }
            else {
                document.getElementById("shop-window").style.display = "none";
                document.getElementById("debug-next-phase-button").innerHTML = "Next Phase";
            }
        }

        /**
         * Update skill points, level, money and trophies of player
         * @param {object} msg 
         */
        #UpdatePlayerStats(msg) {
            this.#SetPlayerSkills(msg.player);
            this.#SetPlayerShieldStatus(msg.player);
            if (this.FindEntity("BattleEntity") == null) {
                this.#SetWitcherLevel(msg.player);
            } else if ((this.FindEntity("BattleEntity").FindComponent("BattleManager").player) == null) {
                this.#SetWitcherLevel(msg.player);
            }
            this.#SetPlayerMoney(msg.player);
            this.#SetPlayerTrophies(msg.player);
        }

        /**
         * Checks if mouse cursor is on any UI element and handles raycasting accordingly
         */
        #ExcludeUIFromRaycasting () {
            const UI = document.getElementById("game-ui");
            UI.addEventListener("mouseenter", () => {
                if (this.FindComponent("GameManager").phase.toIdentifier() != 2) {
                    this.Broadcast(broadcasts.BroadcastTemplateGame.DisableRaycasting());
                }
            });
            UI.addEventListener("mouseleave", () => {
                if (this.FindComponent("GameManager").phase.toIdentifier() != 2) {
                    this.Broadcast(broadcasts.BroadcastTemplateGame.EnableRaycasting());
                }
            });
        }

        /**
         * 
         * @param {string} elementID 
         * @param {entity.Entity} entity 
         * @param {float} percentOffsetX 
         * @param {float} percentOffsetY 
         */
        #PositionHTMLElementBasedOnEntity(elementID, entity, percentOffsetX, percentOffsetY) {
            let camera = this.FindEntity("Camera").camera;
            camera.updateMatrixWorld(true);
            let coordinates = entity.position.clone().project(camera);
            let canvas = this._parent._parent.renderer.domElement;
            const x = (coordinates.x *  0.5 + 0.5) * canvas.clientWidth;
            const y = (coordinates.y * -0.5 + 0.5) * canvas.clientHeight;

            document.getElementById(elementID).style.transform = `translate(-${percentOffsetX}%, -${percentOffsetY}%) translate(${x}px,${y}px)`;
        }

        /**
         * Show Confirm Button For Shop
         * @param {object} msg 
         */
        #ShowShopConfirm(msg) {
            document.getElementById("shop-window").style.display = "flex";
            this.#UpdateShopButton(msg);
        }
        
        /**
         * Checks Condition For Shop Button
         * @param {object} msg 
         */
        #UpdateShopButton(msg) {
            this.UpdateButtonState("shop-button", this.FindEntity("GameArea").FindComponent("GameManager").ValidateBuyCard());
            let button = document.getElementById("shop-button");
            button.addEventListener("click", this.handleBuyClick);
        }

        #OnBattlePlayerTurn(msg) {
            document.getElementById("battle-player-window").style.display = "flex";
            document.getElementById("button-play").addEventListener("click", this.handlePlayClick);
            document.getElementById("button-special").addEventListener("click", this.handleSpecialClick);
            if (msg.emptyHand) {
                document.getElementById("button-play").innerHTML = "Zug Aussetzen"
                this.UpdateButtonState("button-play", true);
            } else {
                document.getElementById("button-play").innerHTML = "Combo Auspielen"
                this.UpdateButtonState("button-play", false);
            }
            if (msg.specialUsed) {
                this.UpdateButtonState("button-special", false);
            } else {
                this.UpdateButtonState("button-special", true);
            }
            
        }

        #UpdatePlayButton(msg)  {
            this.UpdateButtonState("button-play", this.FindEntity("GameArea").FindComponent("GameManager").ValidateCardSelected());
        }


        /**
         * Triggers after specific time interval
         * @param {float} timeElapsed 
         */
        Update(timeElapsed) {
            if (document.getElementById("town-window").style.display == "flex") {
                let townEntity = this.FindEntity("GameArea").FindComponent("GameManager").selectedTown;
                this.#PositionHTMLElementBasedOnEntity("town-window", townEntity, 50, 120);
            }
            if (document.getElementById("player-window").classList.contains("position-from-three")) {
                let playerEntity = this.FindEntity("GameArea").FindComponent("GameManager").selectedPlayer;
                this.#PositionHTMLElementBasedOnEntity("player-window", playerEntity,  50, 130);
            }
        }

        #HideLevelupButton(skill) {
            let skillName = skill.toIdentifier().toLowerCase();
            let levelupButton = document.getElementById(skillName + "-levelup-button");
            levelupButton.style.display = "none";
        }

        #InitLevelupButton(skill) {
            let skillName = skill.toIdentifier().toLowerCase();
            let levelupButton = document.getElementById(skillName + "-levelup-button");
            let levelupBonus = document.getElementById(skillName + "-levelup-bonus");
            levelupButton.style.display = "block";

            let player = this.FindEntity("GameArea").FindComponent("GameManager").currentPlayer;
            let skillFromPlayer = player.FindComponent("PlayerSkills").GetSkillByName(skill.toIdentifier());
            let costs = skillFromPlayer.level + 1;
            if (player.FindComponent("MoneyStorage").CanPay(costs)) {
                this.#hasEnoughMoneyForLevelup = true;
            }
            if (skillFromPlayer.level < this.#maxSkillLevel) {
                this.#hasSkillLeftForLevelup = true;
            }

            if (this.#hasEnoughMoneyForLevelup && this.#hasSkillLeftForLevelup) {
                this.UpdateButtonState(levelupButton.id, true);
                this.#isLevelupPossible = true;
            }
            else {
                this.UpdateButtonState(levelupButton.id, false);
            }

            levelupButton.addEventListener("click", () => {
                if (!levelupButton.classList.contains("button--inactive")) {
                    player.Broadcast(broadcasts.BroadcastTemplateSkills.ChangeSkillLevel(skill, "Increase", true));

                    for (let buttonID of (["combat-levelup-button", "defense-levelup-button", "alchemy-levelup-button", "special-levelup-button"])) {
                        this.UpdateButtonState(buttonID, false);
                    }

                    this.UpdateButtonState("skill-levelup-continue-button", true);
                    this.UpdateButtonState("skill-levelup-cancel-button", false);
                }
            });
        }

        /**
         * 
         * @param {object} msg 
         */
        #LoadSkillDecider(msg) {
            this.#HideTownInfo(msg);
            this.#SetSkillWindowMode("levelup");
        }

        #InitPlayerWindow() {
            this.#HideSchoolInfo();
            this.#HideSkillInfo();

            let skills = this.FindComponent("GameManager").currentPlayer.FindComponent("PlayerSkills").GetAllSkills();

            for (let skill of skills) {
                let skillName = skill.toIdentifier().toLowerCase();
                document.getElementById(`${skillName}-levelup-button`).style.display = "none";
                document.getElementById(`${skillName}-levelup-bonus`).style.display = "none";
            }

            document.getElementById("player-info-button").classList.remove("filled");
            document.getElementById("skill-levelup-buttons-container").style.display = "none";
            document.getElementById("levelup-impossible-text").style.display = "none";

        }

        #ShowTurnChangePopup(player){
            const overlay = document.getElementById("turn-change-overlay");
            const modal = document.getElementById("turn-change-modal");
            const avatar = document.getElementById("turn-change-avatar");
            const text = document.getElementById("turn-change-text");

            avatar.src = this.#GetAvatarPathFromPlayer(player);
            
            let formattedName = this.#ReplaceUmlaute(player.playerName);
            text.innerHTML = `${formattedName} ist an der Reihe`;

            if (modal) {
                Array.from(modal.classList).forEach(className => {
                    if (className.startsWith("theme--")) {
                        modal.classList.remove(className);
                    }
                });

                const schoolName = player.witcherSchool ? player.witcherSchool.name : "";
                
                if (schoolName) {
                    modal.classList.add(`theme--${schoolName}`);
                }
            }

            overlay.classList.remove("overlay--hidden");
        }

        /**
         * Opens overlay that shows winner and scoreboard
         * @param {object} msg 
         */
        #OnEndGame(msg){
            const overlay = document.getElementById("end-game-overlay");
            const modal = document.getElementById("end-game-modal");
            const avatar = document.getElementById("winner-avatar");
            const text = document.getElementById("end-game-text");
            const scoreboard = document.getElementById("end-game-scoreboard");

            avatar.src = this.#GetAvatarPathFromPlayer(msg.winner);
            
            let formattedName = this.#ReplaceUmlaute(msg.winner.playerName.toUpperCase());
            text.innerHTML = `${formattedName} HAT GEWONNEN`;

            if (scoreboard) {
                scoreboard.innerHTML = "";

                const sortedPlayers = this._parent._parent.Filter(x => x.name.includes("Player")).sort((a, b) => {
                    const trophiesA = a.FindComponent("TrophyStorage").amount;
                    const trophiesB = b.FindComponent("TrophyStorage").amount;
                    return trophiesB - trophiesA;
                });

                sortedPlayers.forEach(player => {
                    const trophies = player.FindComponent("TrophyStorage").amount;
                    const name = this.#ReplaceUmlaute(player.playerName);

                    const row = document.createElement("div");
                    row.className = "container container--row container--justify-between container--no-padding";
                    row.style.width = "100%";
                    row.style.paddingBottom = "4px";

                    row.innerHTML = `
                        <div class="--fancy-font" style="font-size: 16px;">${name}</div>
                        <div class="container container--row container--no-padding" style="gap: 6px;">
                            <div class="material-symbols-outlined filled small">trophy</div>
                            <div class="--fancy-font text-single-number" style="font-size: 16px; margin-bottom: -3px;">${trophies}</div>
                        </div>
                    `;

                    scoreboard.appendChild(row);
                });

            }

            overlay.style.display = "flex";
        }

        #SetSkillWindowMode(mode) {
            let skillWindow = document.getElementById("player-window");
            let heading = document.getElementById("skills-header-text");
            let headingContainer = document.getElementById("skills-header");
            let expandButton = document.getElementById("player-info-button");
            let buttonsContainer = document.getElementById("skill-levelup-buttons-container");
            let cancelButton = document.getElementById("skill-levelup-cancel-button");
            let continueButton = document.getElementById("skill-levelup-continue-button");
            let levelupImpossibleText = document.getElementById("levelup-impossible-text");
            let skills = this.FindComponent("GameManager").currentPlayer.FindComponent("PlayerSkills").GetAllSkills();

            switch(mode) {
                case "default":
                    skillWindow.classList.remove("borders--all", "position-center");
                    skillWindow.classList.add("borders--bottom-right", "position-top-left");

                    heading.innerHTML = "Skills";
                    headingContainer.style.justifyContent = "space-between";

                    expandButton.style.display = "block";

                    buttonsContainer.style.display = "none";
                    levelupImpossibleText.style.display = "none";
                    
                    for (let skill of skills) {
                        this.#HideLevelupButton(skill);
                        let skillName = skill.toIdentifier().toLowerCase();
                        document.getElementById(`${skillName}-levelup-bonus`).style.display = "none";
                    }

                    this.#HideSchoolInfo();
                    this.#HideSkillInfo();
                    break;
                case "levelup":
                    skillWindow.classList.remove("borders--bottom-right", "position-top-left");
                    skillWindow.classList.add("borders--all", "position-center");

                    heading.innerHTML = "Wähle einen Skill";
                    headingContainer.style.justifyContent = "center";

                    expandButton.style.display = "none";

                    buttonsContainer.style.display = "flex";
                    cancelButton.classList.remove("button--inactive");
                    continueButton.classList.add("button--inactive");
                    
                    this.#isLevelupPossible = false;
                    this.#hasEnoughMoneyForLevelup = false;
                    this.#hasSkillLeftForLevelup = false;
                    for (let skill of skills) {
                        this.#InitLevelupButton(skill);
                        // this.#ShowLevelBonuses(skill);
                        let skillName = skill.toIdentifier().toLowerCase();
                        document.getElementById(`${skillName}-levelup-bonus`).style.display = "flex";
                    }

                    if (this.#isLevelupPossible) {
                        levelupImpossibleText.style.display = "none";
                    } else {
                        levelupImpossibleText.style.display = "block";
                        if (!this.#hasSkillLeftForLevelup) {
                            levelupImpossibleText.innerHTML = "Alle Skills bereits auf Max.";
                        }
                        if (!this.#hasEnoughMoneyForLevelup) {
                            levelupImpossibleText.innerHTML = "Du hast nicht genug Geld";
                        }
                    }
                    
                    this.#ShowSchoolInfo();
                    this.#ShowSkillInfo();
                    break;
            }
        }

        #UpdatePlayerSchool(msg) {
            let image = document.getElementById("school-image");
            image.src = msg.player.witcherSchool.imagePath;

            let schoolName = document.getElementById("school-name");
            schoolName.innerHTML = msg.player.witcherSchool.name;

            let abilityName = document.getElementById("school-ability-name");
            abilityName.innerHTML = msg.player.witcherSchool.ability["name"];

            let abilityInfo = document.getElementById("school-ability-info");
            abilityInfo.innerHTML = msg.player.witcherSchool.ability["info"];

            let abilityBonusInfo = document.getElementById("special-info");
            abilityBonusInfo.innerHTML = msg.player.witcherSchool.ability["levelInfo"];
        }

        #ShowSchoolInfo() {
            let schoolInfo = document.getElementById("school-info");
            schoolInfo.style.display = "flex";
        }

        #HideSchoolInfo() {
            let schoolInfo = document.getElementById("school-info");
            schoolInfo.style.display = "none";
        }

        #ShowSkillInfo() {
            let skills = this.FindComponent("GameManager").currentPlayer.FindComponent("PlayerSkills").GetAllSkills();
            for (let skill of skills) {
                    let skillName = skill.toIdentifier().toLowerCase();
                    document.getElementById(`${skillName}-lvl-bonus`).style.display = "flex";
                    document.getElementById(`${skillName}-info`).style.display = "flex";
                    document.getElementById(`${skillName}-name`).style.display = "flex";
                }
        }

        #HideSkillInfo() {
            let skills = this.FindComponent("GameManager").currentPlayer.FindComponent("PlayerSkills").GetAllSkills();
            for (let skill of skills) {
                    let skillName = skill.toIdentifier().toLowerCase();
                    document.getElementById(`${skillName}-lvl-bonus`).style.display = "none";
                    document.getElementById(`${skillName}-info`).style.display = "none";
                    document.getElementById(`${skillName}-name`).style.display = "none";
                }
        }

        /**
         * @returns {bool}
         */
        get phasethreeparttwo() {
            return this.#phaseThreePartTwo;
        }
  
    }

    return {
        UIManager : UIManager
    }
}) ();