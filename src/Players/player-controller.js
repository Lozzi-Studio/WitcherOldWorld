import { component } from "../Interfaces/component";

export const player_controller = (() => {

    // Gemini wurde bei der Erstellung dieses Components unterstützend verwendet. Es wurden u.a. einzelne Code-Segmente generiert und das
    // Zusammenspiel mit anderen Komponenten erklärt. 

    class PlayerController extends component.Component {
        #pendingMoveTown = null; 
        
        constructor() {
            super();
        }
    
        InitComponent() {
            this._RegisterHandler('input.click_map', (msg) => { this.#OnTownSelected(msg) });
            this._RegisterHandler('card.select', (msg) => { this.#OnCardSelected(msg.card_slot) });
        }

        #OnTownSelected(targetTown) {
            const hasValidCard = this.#CheckForValidCards(targetTown.region);

            if (hasValidCard) {
                // TODO Button zum reisen aktivieren
            } else {
                // TODO Button zum reisen disablen
            }
        }

        #OnTravelButtonClicked(targetTown) {
            // Stadt abspeichert -> Spieler wird erst hinbewegt wenn er eine Karte discarded hat
            this.#pendingMoveTown = targetTown;
            
            // TODO automatically open the deck
        }

        #OnCardSelected(cardSlot) {
            if (this.#pendingMoveTown === null) return; //Wenn keine Stadt ausgewählt ist/wir gerade nicht reisen

            const cardDeck = this._Parent.FindComponent('Carddeck');
            const selectedCard = cardDeck.getHandCard(cardSlot);

            if (selectedCard.region === this.#pendingMoveTown.region) {
                
                // Karte abwerfen
                const discardMsg = broadcasts.BroadcastTemplateCards.DiscardCard(selectedCard, "Discard");
                this._Parent.Broadcast(discardMsg);

                // Spieler bewegen
                const moveMsg = broadcasts.BroadcastTemplatePlayer.PlayerMove(this.#pendingMoveTown, this.#pendingMoveTown.position);
                this._Parent.Broadcast(moveMsg);

                this.#pendingMoveTown = null;

            } else {
                // TODO Fehlermeldung 
                console.log("Falsche Karte! Diese Karte hat nicht die richtige Region für diese Reise.");
            }
        }
        
        // irgendwie so (um zu schauen ob der spieler überhaupt ne karte in seinem deck hat, mit der er hinreisen kann)
        // bei false button dann augegraut
        #CheckForValidCards(targetRegion) {
            const cardDeck = this._Parent.FindComponent('Carddeck');
            for (let i = 0; i < cardDeck.length; i++) {
                const card = cardDeck.getHandCard(i);
                if (card && card.region === targetRegion) {
                    return true; 
                }
            }
           return false;
        }
    }

    return {
        PlayerController: PlayerController
    }
})();