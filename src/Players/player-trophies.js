import { component } from "../Interfaces/component";
import { broadcasts } from "../Interfaces/broadcasts";

export const player_trophies = (() => {
    
    class TrophyStorage extends component.Component{
        #amount;

        /**
         * A tracker for player trophies
         */
        constructor() {
            super();
            this.#amount = 0;
        }

        /**
         * Used to intialize and add any default components/events
         */
        InitComponent() {
            this._RegisterHandler('player.addTrophy', (msg) => {this.#AddTrophy(msg)});
        }

        /**
         * Increase trophies by 1
         */
        #AddTrophy() {
            this.#amount += 1;
            this.FindEntity("GameArea").Broadcast(broadcasts.BroadcastTemplatePlayer.UpdateUI(this.parent));
            if (this.#amount >= 4){
                this.FindEntity("GameArea").Broadcast(broadcasts.BroadcastTemplateGame.EndGame(this.parent));
            } else {
                this.FindEntity("GameArea").FindComponent("CardSelectUI").GetCardSelectionFromPlayerPrompt(this.FindComponent("Carddeck").hand.concat(this.FindComponent("Carddeck").deck.concat(this.FindComponent("Carddeck").discard)),this.#amount, "Entfernen aus deinem Deck", false).then(
                    (result) => {   
                        if (result != null) {
                            for (let card of result) {
                                this.Broadcast(broadcasts.BroadcastTemplateCards.DiscardCard(card, "Delete"));
                                this.Broadcast(broadcasts.BroadcastTemplateCards.ShuffleDeck(true,true));
                            }
                        }
                    }
                );
            }
        }

        get amount(){
            return this.#amount;
        }
    }

    return {
        TrophyStorage : TrophyStorage
    }
}) ();