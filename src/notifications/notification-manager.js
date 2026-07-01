import { ui_manager } from "../GameArea/UI/ui-manager";
import { component } from "../Interfaces/component";

export const notifaction_manager = (() => {

    class NotificationManager extends component.Component {
        #notificationQueue;
        #duration;
        #maxFadeDuration;
        #reverse;
        #showTime;
        #log;
        #countIncomingBanner;
        #selectedTown;

        constructor() {
            super();
            this.#notificationQueue = [];
            this.#log = [];
            this.#duration = 0;
            this.#reverse = false;
            this.#countIncomingBanner = 0;

            //die beiden relevanten werte für finetuning
            this.#maxFadeDuration = 1;
            this.#showTime = 0.5;


            this.#selectedTown = undefined;
        }

        InitComponent() {
            this._RegisterHandler('game.nextPhase', (msg) => {this.#QueueNotification(msg)});
            this._RegisterHandler('game.nextPlayer', (msg) => {this.#QueueNotification(msg)});
            this._RegisterHandler('game.meditate', (msg) => {this.#QueueNotification(msg)});
            this._RegisterHandler('skill.changeLevel', (msg) => {this.#QueueNotification(msg)});
            this._RegisterHandler('player.move', (msg) => {this.#QueueNotification(msg)});
            this._RegisterHandler('player.changeMoney', (msg) => {this.#QueueNotification(msg)});
            this._RegisterHandler('card.drawCard', (msg) => {this.#QueueNotification(msg)});
            this._RegisterHandler('notification.custom', (msg) => {this.#QueueNotification(msg)});
            this._RegisterHandler('card.addCard', (msg) => {this.#QueueNotification(msg)});
            this._RegisterHandler('battle.startBattle', (msg) => {this.#QueueNotification(msg)});
            this._RegisterHandler('battle.playerTurn', (msg) => {this.#QueueNotification(msg)});
            this._RegisterHandler('battle.endBattle', (msg) => {this.#QueueNotification(msg)});
            this._RegisterHandler('town.selection', (msg) => {this.#QueueNotification(msg)});
            this._RegisterHandler('town.action', (msg) => {this.#QueueNotification(msg)});
            this._RegisterHandler('player.addTrophy', (msg) => {this.#QueueNotification(msg)});
            this._RegisterHandler('card.discardCard', (msg) => {this.#QueueNotification(msg)});
            this._RegisterHandler('player.rumor', (msg) => {this.#QueueNotification(msg)});
        }
        /**
         * Get german identifier of enum
         * @returns {string}
         */
        toGermanIdentifier(skill){
            switch(skill){
                case "Combat":
                    return "Kampf";
                    break;
                case "Defense":
                    return "Verteidigung";
                    break;
                case "Alchemy":
                    return "Alchemie";
                    break;
                case "Special":
                    return "Spezialfähigkeit";
                    break;
            } 
        }

        #QueueNotification(msg) {
            var currentPlayer = this.FindEntity("GameArea").FindComponent("GameManager").currentPlayer;
            var currentPhase = this.FindEntity("GameArea").FindComponent("GameManager").phase.toIdentifier();
            let notificationAdded = false;

            switch(msg.topic) {
                case 'game.nextPhase':
                    let phaseText = currentPlayer.playerName + " hat Phase " + currentPhase + " gestartet";
                    currentPhase += 1;
                    if(currentPhase != 4 && this.#notificationQueue[this.#notificationQueue.length - 1] !== phaseText) {
                        this.#notificationQueue.push(phaseText);
                        notificationAdded = true;
                    }
                    break;
                case 'game.nextPlayer':
                    this.#notificationQueue.push(msg.player.playerName + " ist am Zug");
                    notificationAdded = true;
                    break;
                case 'game.meditate':
                    this.#notificationQueue.push(currentPlayer.playerName + " hat für die Fähigkeit " + this.toGermanIdentifier(msg.skill) + " meditiert.");
                    notificationAdded = true;
                    break;
                case 'skill.changeLevel':
                    const current_skill = msg.skill.toIdentifier()
                    this.#notificationQueue.push(currentPlayer.playerName + " hat die Fähigkeit " + this.toGermanIdentifier(current_skill) + " verbessert.");
                    notificationAdded = true;
                    break;
                case 'player.move':
                    let moveText = currentPlayer.playerName + " ist nach " + msg.town.town_name + " gereist.";
                    
                    // Makes sure that notification is only sent once
                    if (this.#notificationQueue[this.#notificationQueue.length - 1] !== moveText) {
                        this.#notificationQueue.push(moveText);
                        notificationAdded = true; 
                    }
                    break;
                case 'player.rumor': 
                    this.#notificationQueue.push(currentPlayer.playerName + " hat ein Gerücht über Spuren in der Stadt " + msg.destination.town_name + " aufgeschnappt."); 
                    notificationAdded = true; 
                    break;
                case 'player.changeMoney':
                    let moneyText = currentPlayer.playerName + " hat " + Math.abs(msg.amount) + " Gold " + (msg.amount > 0 ? "bekommen." : "verloren.");
                    this.#notificationQueue.push(moneyText);
                    notificationAdded = true; 
                    break;
                case 'player.addTrophy':
                    let trophyText = currentPlayer.playerName + " hat eine Trophäe bekommen.";
                    this.#notificationQueue.push(trophyText);
                    notificationAdded = true; 
                    break;
                case 'card.drawCard':
                    let is_shop = this.FindEntity("GameArea").FindComponent("UIManager").phasethreeparttwo
                    if (msg.mode === "Deck" && currentPhase === 3 && !is_shop) {
                        this.#notificationQueue.push(currentPlayer.playerName + " hat " + msg.amount + " Karte/n nachgezogen"); 
                        notificationAdded = true; 
                    }
                    break;
                case 'card.addCard':
                    if (currentPhase > 1) {
                        this.#notificationQueue.push(currentPlayer.playerName + " hat die Karte " + msg.card.name + " bekommen."); 
                        notificationAdded = true; 
                    }
                    break;
                case 'card.discardCard':
                    if (msg.mode == "Delete") {
                        this.#notificationQueue.push(currentPlayer.playerName + " hat die Karte " + msg.card.name + " entfernt."); 
                        notificationAdded = true;
                    }
                    break;
                case 'battle.startBattle':
                    let startBattleText = currentPlayer.playerName + " hat einen Kampf gestartet.";
                    if (this.#notificationQueue[this.#notificationQueue.length - 1] !== startBattleText) {
                        this.#notificationQueue.push(startBattleText);
                        notificationAdded = true;
                    }
                    break;
                case 'battle.playerTurn':
                    this.#notificationQueue.push(currentPlayer.playerName + " ist am Zug.");
                    notificationAdded = true;
                    break;
                case 'battle.endBattle':
                    let endBattleText = "Der Kampf wurde beendet."
                    if (this.#notificationQueue[this.#notificationQueue.length - 1] !== endBattleText) {
                        this.#notificationQueue.push(endBattleText);
                        notificationAdded = true;
                    }
                    break;
                case 'town.selection':
                    this.#selectedTown = msg.town;
                    break;
                case 'town.action':
                    let townActionText = currentPlayer.playerName + " hat in " + this.#selectedTown.town_name + " die Action " + this.#selectedTown.ability.name + " genutzt"
                    this.#notificationQueue.push(townActionText);
                    notificationAdded = true;
                    break;
                case 'player.addStatus':
                    this.#notificationQueue.push(currentPlayer.playerName + " hat den Status ");
                    notificationAdded = true;
                    break;

                case 'notification.custom':
                    let message = msg.message
                    if(this.#notificationQueue[this.#notificationQueue.length - 1] !== message) {
                        this.#notificationQueue.push(msg.message);
                        notificationAdded = true; 
                    }
                    break;    
            }
            if (notificationAdded) {
                this.#changeIncomingBanners(1);
            }
        }

        /**
         * Helper to increase/decrease incoming banners and update html
         * @param {int} amount 
         */
        #changeIncomingBanners(amount) {
            this.#countIncomingBanner += amount;
            document.getElementById("notifications").innerHTML = this.#countIncomingBanner;
        }

        Update(timeElapsed) {
            var htmlBanner = document.getElementById("notification-banner");
            if (this.#notificationQueue.length > 0 && (!htmlBanner.style.display || htmlBanner.style.display == 'none')) {
                htmlBanner.innerHTML = this.#notificationQueue.splice(0, 1)[0];
                htmlBanner.style.display = "flex";
            } else if (htmlBanner.style.display == "flex" && htmlBanner.style.opacity < 1 && !this.#reverse) {
                this.#duration = 1 * (timeElapsed / this.#maxFadeDuration) + this.#duration;
                htmlBanner.style.opacity = this.#duration;
            } else if (htmlBanner.style.display == "flex" && htmlBanner.style.opacity > 0 && this.#reverse) {
                this.#duration -= 1 * (timeElapsed / this.#maxFadeDuration);
                htmlBanner.style.opacity = this.#duration;
            } else if (htmlBanner.style.display == "flex" && this.#duration != 0 && (htmlBanner.style.opacity >= 1 || htmlBanner.style.opacity <= 0)) {
                this.#reverse = !this.#reverse;
                if (htmlBanner.style.opacity <= 0) {
                    this.#log.push(htmlBanner.innerHTML);
                    let li = document.createElement("li");
                    li.innerText = this.#log.length + ": " + htmlBanner.innerHTML;
                    li.className += "log-element";
                    document.getElementById("logger").appendChild(li);
                    this.#duration = 0;
                    htmlBanner.style.display = "none";
                    this.#changeIncomingBanners(-1);
                } else {
                    this.#duration += this.#showTime;
                }
            }
            
            const notificationsBadge = document.getElementById("notifications");
            if (this.#countIncomingBanner > 1) {
                notificationsBadge.style.display = "flex";
            } else {
                notificationsBadge.style.display = "none";
            }

        }
    }

    return {
        NotificationManager : NotificationManager
    }
}) ();