import { component } from "../Interfaces/component";

export const notifaction_manager = (() => {

    class NotificationManager extends component.Component {
        #notificationQueue;
        #duration;
        #maxFadeDuration;
        #reverse
        #showTime
        #log;
        #countIncomingBanner;

        //TODO: Styling vom logger anpassen und den logger per default verstecken und per knopf erscheinen/verschwinden lassen
        constructor() {
            super();
            this.#notificationQueue = [];
            this.#log = [];
            this.#duration = 0;
            this.#reverse = false;
            this.#countIncomingBanner = 0;

            //die beiden relevanten werte für finetuning (pass gerne noch das html aussehen an xD)
            this.#maxFadeDuration = 1;
            this.#showTime = 1;
        }

        InitComponent() {
            //TODO an Luca: die richtigen events einfügen (das akutelle sollte weg ist nur testweise); 
            // die sollen alle auf diese eine funktion verweisen => {this.#QueueNotification(msg)}
            this._RegisterHandler('game.nextPhase', (msg) => {this.#QueueNotification(msg)});
            this._RegisterHandler('game.nextPlayer', (msg) => {this.#QueueNotification(msg)});
            this._RegisterHandler('game.meditate', (msg) => {this.#QueueNotification(msg)});
            this._RegisterHandler('skill.changeLevel', (msg) => {this.#QueueNotification(msg)});
            this._RegisterHandler('player.move', (msg) => {this.#QueueNotification(msg)});
            this._RegisterHandler('card.drawCard', (msg) => {this.#QueueNotification(msg)});
            this._RegisterHandler('notification.custom', (msg) => {this.#QueueNotification(msg)});
        }

        #QueueNotification(msg) {
            //TODO an Luca: Message anpassen an was passiert ist und welcher spieler (entferne das beispiel 'game.nextPhase' gerne)
            var currentPlayer = this.FindEntity("GameArea").FindComponent("GameManager").currentPlayer;
            var currentPhase = this.FindEntity("GameArea").FindComponent("GameManager").phase.toIdentifier() + 1;
            let notificationAdded = false;

            switch(msg.topic) {
                case 'game.nextPhase':
                    if(currentPhase != 4){
                        this.#notificationQueue.push(`<span style="color: var(--color-selected);">${currentPlayer.playerName}</span> hat Phase ${currentPhase} gestartet.`);
                        notificationAdded = true;
                    }
                    break;
                case 'game.nextPlayer':
                    this.#notificationQueue.push(`<span style="color: var(--color-selected);">${currentPlayer.playerName}</span> ist am Zug.`);
                    notificationAdded = true;
                    break;
                case 'game.meditate':
                    this.#notificationQueue.push(`<span style="color: var(--color-selected);">${currentPlayer.playerName}</span> hat für die Fähigkeit ` + msg.skill + " meditiert.");
                    notificationAdded = true;
                    break;
                case 'skill.changeLevel':
                    this.#notificationQueue.push(`<span style="color: var(--color-selected);">${currentPlayer.playerName}</span> hat die Fähigkeit ` + msg.skill.toGermanIdentifier() + " verbessert.");
                    notificationAdded = true;
                    break;
                case 'player.move':
                    let moveText = `<span style="color: var(--color-selected);">${currentPlayer.playerName}</span> ist nach ` + msg.town.town_name + " gereist.";
                    
                    // Makes sure that notification is only sent once
                    if (this.#notificationQueue[this.#notificationQueue.length - 1] !== moveText) {
                        this.#notificationQueue.push(moveText);
                        notificationAdded = true; 
                    }
                    break;
                case 'card.drawCard':
                    console.log(currentPhase);
                    if (msg.mode === "Deck" && currentPhase > 2) {
                        this.#notificationQueue.push(`<span style="color: var(--color-selected);">${currentPlayer.playerName}</span> hat ` + msg.amount + " Karte/n nachgezogen."); 
                        notificationAdded = true; 
                    }
                    break;
                case 'notification.custom':
                    this.#notificationQueue.push(`<span style="color: var(--color-selected);">${currentPlayer.playerName}</span>` + msg.message);
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