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

            //die beiden relevanten werte für finetuning (passen gerne noch das html aussehen an xD)
            this.#maxFadeDuration = 1;
            this.#showTime = 2;
        }

        InitComponent() {
            //TODO an Luca: die richtigen events einfügen (das akutelle sollte weg ist nur testweise); 
            // die sollen alle auf diese eine funktion verweisen => {this.#QueueNotification(msg)}
            this._RegisterHandler('game.nextPhase', (msg) => {this.#QueueNotification(msg)});
        }

        #QueueNotification(msg) {
            //TODO an Luca: Message anpassen an was passiert ist und welcher spieler (entferne das beispiel gerne)
            this.#changeIncomingBanners(1);
            var currentPlayer = this.FindEntity("GameArea").FindComponent("GameManager").currentPlayer;
            switch(msg.topic) {
                case 'game.nextPhase':
                    this.#notificationQueue.push(currentPlayer.playerName + " hat die nächste Phase gestartet");
                    break;
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
            if ((!document.getElementById("notifications").style.display || document.getElementById("notifications").style.display == "none") && this.#countIncomingBanner > 1) {
                document.getElementById("notifications").style.display = "flex";
            } else if ( document.getElementById("notifications").style.display == "flex" && this.#countIncomingBanner == 0){
                document.getElementById("notifications").style.display = "none";
            }
        }
    }

    return {
        NotificationManager : NotificationManager
    }
}) ();