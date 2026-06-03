import { component } from "../../Interfaces/component";
import { broadcasts } from "../../Interfaces/broadcasts";
import { shiftLeft } from "three/tsl";

export const ui_manager = (() => {

    class UIManager extends component.Component {
        #maxSkillLevel;
        #numberOfPhaseOptions;

        /**
         * Manages API between UI and Backend
         */
        constructor() {
            super();
            this.#maxSkillLevel = 5;
            this.#numberOfPhaseOptions = 3;

            let button = document.getElementById("town-button");
            this.handleMoveClick = () => {
                if (button.classList.contains("button--inactive") == false) {
                    this.FindEntity("GameArea")
                        .FindComponent("GameManager")
                        .DiscardCardToMove();
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

            this.handleDiscardClick = () => {
                const btn = document.getElementById("button-discard");
                if (btn && btn.classList.contains("button--inactive")) {
                    return; 
                }
                this.FindEntity("GameArea")
                    .FindComponent("GameManager")
                    .Broadcast(broadcasts.BroadcastTemplateGame.DiscardSelectedCards());
                }

            let skipButton = document.getElementById("debug-next-phase-button");
            this.HandleNextPhaseClick = () => {
                if (skipButton.classList.contains("button--inactive") == false) {
                    this.Broadcast(broadcasts.BroadcastTemplateGame.NextPhase());
                }
            };
        }


        /**
         * Used to intialize and add any default components/events
         */        
        InitComponent() {
            this._RegisterHandler('game.start', (msg) => {this.#OnGameStart(msg)});
            this._RegisterHandler("game.nextPlayer", (msg) => {this.#OnNextPlayer(msg)});
            this._RegisterHandler("player.move", (msg) => {this.#UpdateButtonState("end-phase-button", true)});

            this._RegisterHandler('skill.updateUI', (msg) => {this.#UpdatePlayerStats(msg)});
            this._RegisterHandler('player.updateUI', (msg) => {this.#UpdatePlayerStats(msg)});
            this._RegisterHandler('player.updateHandCardsUI', (msg) => {this.#UpdateHandCards(msg)});
            this._RegisterHandler('card.updateSelectionUI', (msg) => {this.#UpdateHandCardSelection(msg)});
            
            this._RegisterHandler("skill.chooseSkill", (msg) => {this.#LoadSkillDecider(msg)});

            this._RegisterHandler('town.selection', (msg) => {this.#ShowTownInfo(msg)});
            this._RegisterHandler('town.updateButton', (msg) => {this.#UpdateButtonState("town-button", msg.active)});
            this._RegisterHandler('game.updateDiscardButton', (msg) => {this.#UpdateButtonState("button-discard", msg.active)});
            this._RegisterHandler('game.changeMouseCursor', (msg) => {this.#ChangeMouseCursor(msg)});
            this._RegisterHandler("game.nextPhase", (msg) => {this.#OnNextPhase(msg)});

            document.getElementById("close-town-window-button").addEventListener("click", this.#HideTownInfo);
            document.getElementById("debug-next-phase-button").addEventListener("click", this.HandleNextPhaseClick);
        }

        /**
         * Triggers Cardslot Selection
         */
        SelectCard(card_slot, card) {
            this.Broadcast(broadcasts.BroadcastTemplateCards.SelectCard(card_slot, card));
        }

        /**
         * End current turn phase
         */
        #EndPhaseOne(button) {
            if (!button.classList.contains("button--inactive")) {
                this.Broadcast(broadcasts.BroadcastTemplateGame.NextPhase());
            }
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

        OnNextPhase(msg) {
        this.#SetPhaseOptions(msg);
        this.#setDiscardButtonState();
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

        /**
         * Create UI Boxes for skill points
         * @param {string} skillName 
         */
        #CreateSkillBoxes(skillName) {
            let containerName = `${skillName}-lvl`
            const container = document.getElementById(containerName);

            for (let i = 0; i < this.#maxSkillLevel; i++) {
                const box = document.createElement("div");
                box.classList.add("level-box", "level-box--neutral", "level-box--empty");
                box.id = `${skillName}-level-box-${i}`;
                container.appendChild(box);
            }
        }

        /**
         * Initialize skillboxes in UI
         */
        #InitPlayerSkills() {
            let skills = ["combat", "defense", "alchemy", "special"];
            for (const skill of skills) {
                this.#CreateSkillBoxes(skill);
            }
        }

        /**
         * Get skill level from player and set values in UI
         * @param {player_entity.Player} player 
         */
        #SetPlayerSkills(player) {
            for (const skill of [
                player.FindComponent("PlayerSkills").combat,
                player.FindComponent("PlayerSkills").defense,
                player.FindComponent("PlayerSkills").alchemy,
                player.FindComponent("PlayerSkills").special
            ]) {
                for (let i = 0; i < this.#maxSkillLevel; i++) {
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
            avatarContainer.classList.add("avatar-container", "avatar-container--small");
            return avatarContainer
        }

        /**
         * Initialize player avatar
         * @param {int} playerId 
         * @param {array} playerList 
         */
        #InitPlayerAvatars(playerList) {
            for (const [i, player] of playerList.entries()) {
                var avatarContainer = this.#CreateAvatarContainer(i+1);
                avatarContainer.classList.add(`theme--player${i+1}`)
                document.getElementById("avatars-container").appendChild(avatarContainer);

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
        #setDiscardButtonState(){
            const phase = this.FindComponent("GameManager").phase.toIdentifier();

            const discardPanel = document.getElementById("discard-button-area");
            const discardButton = document.getElementById("button-discard");

            switch (phase) {
                case 1:
                    if (discardPanel) discardPanel.style.display = "none";
                    if (discardButton) discardButton.removeEventListener("click", this.handleDiscardClick);
                    this.ShowPhaseThreeButtons(false);
                    break;
                case 2:
                    if (discardPanel) discardPanel.style.display = "none";
                    if (discardButton) discardButton.removeEventListener("click", this.handleDiscardClick);
                    this.ShowPhaseThreeButtons(false);
                    break;
                case 3:
                    if (discardPanel) discardPanel.style.display = "flex";
                    if (discardButton) {
                        discardButton.style.display = "flex";
                        discardButton.classList.add("button--inactive");
                        discardButton.addEventListener("click", this.handleDiscardClick);
                    }
                    this.ShowPhaseThreeButtons(true);
                    break;
            }
        }

        
        #UpdateNextPhaseButton(msg) {
            let button = document.getElementById("end-phase-button");
            if (this.FindEntity("GameArea").FindComponent("GameManager").phase.toIdentifier() == 1) {
                button.style.display = "flex";
                button.classList.add("button--inactive");
                button.addEventListener("click", () => this.#EndPhaseOne(button));
            }
            else {
                button.style.display = "none";
                button.removeEventListener("click", () => this.#EndPhaseOne(button));
            }
        }

        ShowPhaseThreeButtons(active){
            const discardButtons = document.getElementById("discard-buttons");
            const handWindow = document.getElementById("hand-window");
            const discardModal = document.getElementById("discard-modal");
            if(active){
                if (discardButtons) discardButtons.style.display = "flex";
                if (handWindow) handWindow.style.position = "relative";
            }
            else{
                if (discardButtons) discardButtons.style.display = "none";
                if (handWindow) handWindow.style.position = "absolute";
            }
        }

        ShowPhaseThreeButtons(active){
            const discardButtons = document.getElementById("discard-buttons");
            const handWindow = document.getElementById("hand-window");
            const discardModal = document.getElementById("discard-modal");
            if(active){
                if (discardButtons) discardButtons.style.display = "flex";
                if (handWindow) handWindow.style.position = "relative";
            }
            else{
                if (discardButtons) discardButtons.style.display = "none";
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
                emptyShield.id = `shield-${maxShield-i}`
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
        #UpdateButtonState(buttonID, buttonActive) {
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
            let player = this.FindComponent("GameManager").currentPlayer;
            let selectedTown = this.FindComponent("GameManager").selectedTown;
            let buttonActive = true;
            let buttonMode = "";

            if (selectedTown == player.town) {
                buttonMode = "action";
                if (selectedTown.FindComponent("TownProperties").abilityExecuted) {
                    buttonActive = false;
                }
                else {
                    buttonActive = true;
                }
            }
            else {
                buttonMode = "move";
                if (this.FindEntity("GameArea").FindComponent("GameManager").CheckIfCanMoveToTown()) {
                    buttonActive = true;
                }
                else {
                    buttonActive = false;
                }
            }

            this.#UpdateButtonState("town-button", buttonActive);
            this.#UpdateTownButtonMode(buttonMode, buttonActive);
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
        #UpdateCardContent(card, cardDIV) {
            const img = new Image();
            img.onload = () => {
                cardDIV.style.backgroundImage = `url(${card.imagePath})`;
                cardDIV.innerHTML = "";
            };
            img.onerror = () => {
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
                    this.#UpdateCardContent(card, cardDIV);
                }
                else {
                    let newCardDIV = document.createElement("div");
                    newCardDIV.id = `card-image-${i}`;
                    newCardDIV.classList.add("container", "container--col", "card");
                    handWindow.appendChild(newCardDIV);
                    newCardDIV.addEventListener("click", () => this.SelectCard(i, card));
                    this.#UpdateCardContent(card, newCardDIV);
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
                let player = this.FindComponent("GameManager").currentPlayer;
                let playerHand = player.FindComponent("Carddeck").hand;
                let handWindow = document.getElementById("hand-window");
                for (let [i, child] of Array.from(handWindow.children).entries()) {
                    document.getElementById(`card-image-${i}`).classList.remove("card--selected");
                }
            }
            this.#UpdateTownButton(msg);
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
            this.#setDiscardButtonState();
            this.#ExcludeUIFromRaycasting();

            const playerList = this._parent._parent.Filter(x => x.name.includes("Player"));
            this.#InitPlayerAvatars(playerList);
            this.#OnNextPlayer(broadcasts.BroadcastTemplateGame.NextPlayer(playerList[0]));
        }

        /**
         * Update UI on player switch
         * @param {object} msg 
         */
        #OnNextPlayer(msg) {
            this.#SetPlayerInfo(msg);
            this.#SetPlayerAvatar(msg);
            this.#UpdatePlayerStats(msg.player);
            this.#OnNextPhase();
            this.#UpdateHandCards(msg);
        
            const playerList = this._parent._parent.Filter(x => x.name.includes("Player"));
            const currentPlayerId = this.FindComponent("GameManager").currentPlayerId;
            this.#SetPlayerAvatarsStatus(playerList, currentPlayerId);
        }

        /**
         * Update UI on next phase
         * @param {object} msg 
         */
        #OnNextPhase() {
            this.#SetPhaseOptions();
            this.#UpdateNextPhaseButton();

            const currentPhase = this.FindComponent("GameManager").phase.toIdentifier();
            if (currentPhase == 3) {
                document.getElementById("debug-next-phase-button").innerHTML = "Next Player";
            }
            else {
                document.getElementById("debug-next-phase-button").innerHTML = "Next Phase";
            }
        }

        /**
         * Update skill points, level, money and trophies of player
         * @param {object} msg 
         */
        #UpdatePlayerStats(msg) {
            let player = this.FindComponent("GameManager").currentPlayer;
            this.#SetPlayerSkills(player);
            this.#SetPlayerShieldStatus(player);
            this.#SetWitcherLevel(player);
            this.#SetPlayerMoney(player);
            this.#SetPlayerTrophies(player);
        }

        /**
         * Checks if mouse cursor is on any UI element and handles raycasting accordingly
         */
        #ExcludeUIFromRaycasting () {
            const UI = document.getElementById("game-ui");
            UI.addEventListener("mouseenter", () => {
                this.Broadcast(broadcasts.BroadcastTemplateGame.DisableRaycasting());
            });
            UI.addEventListener("mouseleave", () => {
                this.Broadcast(broadcasts.BroadcastTemplateGame.EnableRaycasting());
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
            const x = (coordinates.x *  .5 + .5) * canvas.clientWidth;
            const y = (coordinates.y * -.5 + .5) * canvas.clientHeight;

            document.getElementById(elementID).style.transform = `translate(-${percentOffsetX}%, -${percentOffsetY}%) translate(${x}px,${y}px)`;
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
        }

        /**
         * 
         * @param {object} msg 
         */
        #LoadSkillDecider(msg) {
            //TODO as seperate component
            console.log("Choose A Skill!")
        }
  
    }

    return {
        UIManager : UIManager
    }
}) (); 