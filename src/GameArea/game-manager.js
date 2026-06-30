import { broadcasts } from "../Interfaces/broadcasts";
import { component } from "../Interfaces/component";
import { cards } from "../Cards/card-templates";
import { card_options } from "../Cards/card-options";
import { card } from "../Cards/card";
import { region } from "./region";
import { monster_entity } from "../Monster/monster-entity";
import { player_status } from "../Players/player-status";
import { status_templates } from "../Players/status-templates";
import { status_options } from "../Players/status-options";
import { player_entity } from "../Players/player-entity";
import { rewards } from "../GameObjects/rewards";

export const game_manager = (() => {

    class GameManager extends component.Component {
        #currentRound;
        #currentPlayerId;
        #currentPlayer;
        #selection;
        #selectedTown;
        #currentShopSelection;
        #currentMonster;
        #isPlayerBattleTurn;
        #selectedPlayer;
        #isHuntMusic;
        
        /**
         * Manages game stages and game behaviour
         */

        constructor() {
            super();
            this.#currentRound = Phase.One;
            this.#currentPlayerId = 1;
            this.#currentPlayer = null;
            this.#selection = [];
            this.#selectedTown = null;
            this.#currentShopSelection = null;
            this.#currentMonster = new Map();
            this.#isPlayerBattleTurn = false;
            this.#selectedPlayer = null;
            this.#isHuntMusic = false;
        }

        /**
         * Used to intialize and add any default components/events
         */
        InitComponent() {
            this._RegisterHandler('card.select', (msg) => {this.OnCardSelect(msg);});
            this._RegisterHandler('town.selection', (msg) => {this.#OnTownSelection(msg);});
            this._RegisterHandler('player.selection', (msg) => {this.#OnPlayerSelection(msg);});
            this._RegisterHandler('game.nextPhase', (msg) => {this.#NextTurnPhase(msg);});
            this._RegisterHandler('game.startPoker', (msg) => {this.#StartWuerfelpoker(msg);});
            this._RegisterHandler('game.removeShop', (msg) => {this.#RemoveShopCard(msg);});
            this._RegisterHandler('game.swapoutCard', (msg) => {this.#SwapoutCard(msg);});
            this._RegisterHandler('game.start', (msg) => {this.#OnGameStart(msg)});
            this._RegisterHandler('game.meditate', (msg) => {this.#OnMeditate(msg)});
            this._RegisterHandler('cardshop.buy', (msg) => {this.#OnCardshopBuy(msg)});
            this._RegisterHandler('game.discardSelectedCards',(msg) => {this.DiscardSelectedCards(msg)});
            this._RegisterHandler('battle.playerTurn', (msg) => {this.#isBattleTurn(msg)});
            this._RegisterHandler('battle.playCombo', (msg) => {this.#OnComboPlay(msg)});
            this._RegisterHandler('game.newMonster', (msg) => {this.#CreateNewMonster(msg)});
            this._RegisterHandler('game.drawUntilFull',()=> {this.#DrawCardsUntilHandFull()});
            this._RegisterHandler('game.chooseRegion', (msg) => {this.#GetRandomRumor(msg)})
            this.#currentPlayer = this.FindEntity(this.#GetPlayer(this.#currentPlayerId));
        }

        #OnMeditate(msg) {
            if (this.#currentRound.toIdentifier() == 2) {
                this.#currentPlayer.Broadcast(msg);
            }
        }

        /**
         * Trigger selection to remove cards from shop
         * @param {object} msg 
         */
        #RemoveShopCard(msg){
            console.log("Remove Shop Card");
            //TODO
        }

        /**
         * Trigger selection to remove card from hand to get a shopcard
         * @param {object} msg 
         */
        #SwapoutCard(msg){
            console.log("Swapout Card");
            //TODO
        }

        /**
         * Swaps to the next phase
         * @param {object} msg 
         */
        #NextTurnPhase(msg){
            const nextPlayer = this.#currentRound.next();
            this.Broadcast(broadcasts.BroadcastTemplateGame.EnableRaycasting())

            if ( this.#currentRound.toIdentifier() == 2) {
                this.Broadcast(broadcasts.BroadcastTemplateGame.loadPhaseTwoUi());
                this.Broadcast(broadcasts.BroadcastTemplateGame.DisableRaycasting())
            }
            
            if (nextPlayer) {
                for (let card_slot of this.#selection) {
                    this.Broadcast(broadcasts.BroadcastTemplateCards.UpdateHandCardSelectionUI(card_slot, "Deselect", this.#currentRound.toIdentifier()));
                }
                this.#selection = [];
                this.#currentPlayerId += 1;
                this.#currentPlayer = this.FindEntity(this.#GetPlayer(this.#currentPlayerId));
                if (this.#currentPlayer == undefined) {
                    this.#currentPlayerId = 1;
                    this.#currentPlayer = this.FindEntity(this.#GetPlayer(this.#currentPlayerId));
                    this.Broadcast(broadcasts.BroadcastTemplateGame.NextRound(this.#currentPlayer));
                }
                if (this.#isHuntMusic) {
                    this.FindEntity("Camera").Broadcast(broadcasts.BroadcastTemplateMusic.PlayMainTheme());
                    this.#isHuntMusic = false;
                } else if (this.#currentPlayer.GetInChase()){
                    this.FindEntity("Camera").Broadcast(broadcasts.BroadcastTemplateMusic.PlayChaseTheme());
                    this.#isHuntMusic = true;
                }
                this.Broadcast(broadcasts.BroadcastTemplateGame.NextPlayer(this.#currentPlayer));
                this.FindEntity("Camera").Broadcast(broadcasts.BroadcastTemplateCamera.FocusOn(this.#currentPlayer));
            }
        }

        /**
         * Add card to selection
         * @param {object} msg 
         */
        OnCardSelect(msg){
            if (this.#isPlayerBattleTurn && this.#currentRound.toIdentifier() == 2) {
                if (this.#selection.length == 0) {
                    this.#selection.push(msg.card_slot);
                    this.Broadcast(broadcasts.BroadcastTemplateCards.UpdateHandCardSelectionUI(msg.card_slot, "Select", this.#currentRound.toIdentifier()));
                } else if (this.#selection.includes(msg.card_slot)){
                    let deselection = this.#selection.splice(this.#selection.indexOf(msg.card_slot),this.#selection.length - this.#selection.indexOf(msg.card_slot));
                    for (let cardSlot of deselection) {
                        this.Broadcast(broadcasts.BroadcastTemplateCards.UpdateHandCardSelectionUI(cardSlot, "Deselect", this.#currentRound.toIdentifier()));
                    }
                } else {
                    if (this.#currentPlayer.GetHandCard(this.#selection[this.#selection.length - 1]).CanCombo(this.#currentPlayer.GetHandCard(msg.card_slot).color)) {
                        this.#selection.push(msg.card_slot);
                        this.Broadcast(broadcasts.BroadcastTemplateCards.UpdateHandCardSelectionUI(msg.card_slot, "Select", this.#currentRound.toIdentifier()));
                    }
                }
            }else if (!(this.#isPlayerBattleTurn) && this.#currentRound.toIdentifier() != 2){
                if (this.#selection.includes(msg.card_slot)){
                    this.#selection.splice(this.#selection.indexOf(msg.card_slot),1);
                    switch (msg.mode) {
                    case "Hand":
                        this.Broadcast(broadcasts.BroadcastTemplateCards.UpdateHandCardSelectionUI(msg.card_slot, "Deselect", this.#currentRound.toIdentifier()));
                            break;
                    case "CardSelect":
                        this.Broadcast(broadcasts.BroadcastTemplateCards.UpdateCardSelectionUI(msg.card_slot, "Deselect", this.#selection));
                        break;
                }
                if (this.#selection.length === 0){
                        this.Broadcast(broadcasts.BroadcastTemplateGame.UpdateDiscardButtonActive(false));
                    }
                } else {
                    switch (msg.mode) {
                    case "Hand":
                        this.#selection.push(msg.card_slot);
                        this.Broadcast(broadcasts.BroadcastTemplateCards.UpdateHandCardSelectionUI(msg.card_slot, "Select", this.#currentRound.toIdentifier()));
                        break;
                    case "CardSelect":
                        if (this.#selection.length < msg.selectableCards) {
                            this.#selection.push(msg.card_slot);
                                this.Broadcast(broadcasts.BroadcastTemplateCards.UpdateCardSelectionUI(msg.card_slot, "Select", this.#selection));
                            }
                        break;
                    }
                    this.Broadcast(broadcasts.BroadcastTemplateGame.UpdateDiscardButtonActive(true));
                }
            }
        }

        /**
         * Discards selected card to move to selected town
         */
        DiscardCardToMove(msg){
            if (this.#selection.length === 1 && this.#selectedTown || this.#selection.length == 2) {
                let moveAllowed = this.ValidateMove().moveAllowed;
                let allowedCards = this.ValidateMove().allowedCards;
                if (moveAllowed){
                    this.#currentPlayer.Broadcast(broadcasts.BroadcastTemplatePlayer.PlayerMove(this.#selectedTown, this.#selectedTown.position));
                    this.FindEntity("GameArea").Broadcast(broadcasts.BroadcastTemplatePlayer.PlayerMove(this.#selectedTown, this.#selectedTown.position));
                    this.#selectedTown.Broadcast(broadcasts.BroadcastTemplateTown.ResetTownAction());
                    for (let card of allowedCards) {
                        this.#currentPlayer.Broadcast(broadcasts.BroadcastTemplateCards.DiscardCard(card, "Discard"));
                    }
                    this.#selection = [];
                    this.Broadcast(broadcasts.BroadcastTemplateCards.UpdateHandCardSelectionUI());
                }
            }
        }

        DiscardSelectedCards(){
            let discardedCards = []
            if (!(this.#selection.length == 0 || this.#currentRound.toIdentifier() != 3)){
                for (let card_slot of this.#selection) {
                    discardedCards.push(card_slot)
                    this.#currentPlayer.Broadcast(broadcasts.BroadcastTemplateCards.DiscardCard(this.#currentPlayer.FindComponent("Carddeck").hand[card_slot], "Discard"));
                }

                this.#selection = [];
                let discardMessage = this.#currentPlayer.playerName + " hat " + discardedCards.length + " Karte/n abgeworfen";
                this.Broadcast(broadcasts.BroadcastTemplateNotification.CustomNotification(discardMessage));
                this.Broadcast(broadcasts.BroadcastTemplateCards.UpdateHandCardSelectionUI());
                this.Broadcast(broadcasts.BroadcastTemplateGame.UpdateDiscardButtonActive(false));
            }
        }

        /**
         * Buys card from shop and discards hand cards
         * @param {object} msg 
         */
        #OnCardshopBuy(msg){
            if (this.#selection.length >= msg.cost) {
                for (let i = 0; i < msg.cost; i++){
                    this.#currentPlayer.Broadcast(broadcasts.BroadcastTemplateCards.DiscardCard(this.#currentPlayer.FindComponent("Carddeck").hand[this.#selection[0]], "Discard"));
                    this.#selection.splice(0, 1);
                }
                this.#currentPlayer.Broadcast(broadcasts.BroadcastTemplateCards.AddCard(this.FindEntity("Cardshop").FindComponent("CardshopSlot_" + msg.slot).card,"Hand"));
                this.FindEntity("Cardshop").Broadcast(broadcasts.BroadcastTemplateCards.DiscardCard(this.FindEntity("Cardshop").FindComponent("CardshopSlot_" + msg.slot).card, "Discard"))
                this.FindEntity("Cardshop").Broadcast(broadcasts.BroadcastTemplateCards.DrawCard("Deck", 1));
                this.Broadcast(broadcasts.BroadcastTemplateGame.NextPhase());
            }

        }

        GetLocalMonster() {
            for (let monster of this.#currentMonster.values()) {
                if (monster.town == this.#currentPlayer.town) {
                    return monster
                }
            }
            return null;
        }

        ValidateCardSelected() {
            return this.#selection.length > 0;
        }

        /**
         * Checks if enough cards are selected to satisfy the cost of a new card
         * @returns {bool}
         */
        ValidateBuyCard() {
            return this.#selection.length >= this.FindEntity("Cardshop").FindComponent("CardshopManager").cost;
        }

        /**
         * Checks if moving to selected town is valid (one of selected cards must be the right region + town must be neighbor of current town)
         * @returns {object}
         */
        ValidateMove(){
            if (this.#selection.length < 1 || this.#selection.length > 2) {
                return { moveAllowed: false, allowedCards: null };
            }

            if (this.#selectedTown != null) {
                var town = this.#selectedTown;
                for (let card_slot of this.#selection) {
                    var card = this.#currentPlayer.FindComponent("Carddeck").hand[card_slot]
                    if (this.#currentPlayer.town.neighboringTowns.includes(town.id) && town != this.#currentPlayer.town && town.FindComponent("TownProperties").canEnter(card)) {
                        return { moveAllowed: true, allowedCards: [card] };
                    }
                }
                if (this.#currentPlayer.town.neighboringTowns.includes(town.id) && this.#selection.length == 2 && town != this.#currentPlayer.town){
                    let cards = []
                    for (let card_slot of this.#selection) {
                        cards.push(this.#currentPlayer.FindComponent("Carddeck").hand[card_slot])
                    }
                    return { moveAllowed: true, allowedCards: cards };
                }
            }
            return { moveAllowed: false, allowedCards: null };

        }

        /**
         * Calculates how many cards should be drawn at the end of the round and adds them to the hand deck
         * @returns
         */
        #DrawCardsUntilHandFull(){
            const deckLength = this.#currentPlayer.FindComponent("Carddeck").hand.length;

            const drawLessStatus = status_templates.StatusTemplates.drawLessCards(status_options.Timing.EndOfTurn());
            const drawMoreStatus = status_templates.StatusTemplates.drawMoreCards(status_options.Timing.EndOfTurn());
            const drawLess = this.#currentPlayer.FindComponent("PlayerStatus").GetStatusAmount(drawLessStatus);
            const drawMore = this.#currentPlayer.FindComponent("PlayerStatus").GetStatusAmount(drawMoreStatus);

            let amountToDraw = 3-deckLength-drawLess+drawMore;
            if(amountToDraw > 0){ 
                this.#currentPlayer.Broadcast(broadcasts.BroadcastTemplateCards.DrawCard("Deck", amountToDraw));
            } 
        }

        /**
         * Triggers town UI on click on town
         * @param {object} msg 
         */
        #OnTownSelection(msg){
            this.#selectedTown = msg.town;
        }

        /**
         * Triggers player UI on click on town
         * @param {object} msg 
         */
        #OnPlayerSelection(msg) {
            this.#selectedPlayer = msg.player;
        }

        /**
         * Triggers start of a wuerfelpoker game
         * @param {object} msg 
         */
        #StartWuerfelpoker(msg) {
            //TODO Implement Wuerfelpoker
            switch (Math.floor(Math.random() * 2)) {
                case 0:
                    this.#currentPlayer.Broadcast(broadcasts.BroadcastTemplatePlayer.ChangeMoney(-1));
                    break;
                case 1:
                    this.#currentPlayer.Broadcast(broadcasts.BroadcastTemplatePlayer.ChangeMoney(3));
                    break;
            }
        }

        /**
         * Get string of player entity
         * @param {int} id 
         * @returns {string}
         */
        #GetPlayer(id) {
            return "Player_" + id;
        }

        /**
         * Gives default card deck to players on game start
         */
        #OnGameStart() {
            // give start deck to players
            const players = this._parent._parent.Filter(x => x.name.includes("Player"));
            let playerTownPositions = [];
            for (let player of players) {
                player.Broadcast(broadcasts.BroadcastTemplateCards.LoadCarddeck("Player", player.witcherSchool.name));
                player.Broadcast(broadcasts.BroadcastTemplateCards.DrawCard("Deck", 3))
                playerTownPositions.push(player.town);
            }
            let regions = [region.Region.Forest(), region.Region.Mountain(), region.Region.River()];
            let i = 0;
   
            for (let region of regions) {

                const newMonster = new monster_entity.MonsterEntity("Monster", this.FindComponent("TownManager").GetRandomTownFromRegionPool(region, playerTownPositions, false), 12, 1);
                this.#currentMonster.set(region.toIdentifier(), newMonster);
                playerTownPositions.push(newMonster.town);
                i += 1;
                this._parent._parent.AddEntity(newMonster, "Monster_" + region.toIdentifier());
            }
            this.FindEntity("Camera").Broadcast(broadcasts.BroadcastTemplateCamera.FocusOn(this.#currentPlayer));
        }

        #CreateNewMonster(msg) {
            let hpPool = [12,15,19];
            const players = this._parent._parent.Filter(x => x.name.includes("Player"));
            let playerTownPositions = [];
            for (let player of players) {
                player.Broadcast(broadcasts.BroadcastTemplateCards.LoadCarddeck("Player"));
                playerTownPositions.push(player.town);
            }
            for (let monster of this.#currentMonster.values()) {
                playerTownPositions.push(monster.town);
            }
            let newRegion = null;
            let tracker = null;
            switch(msg.region) {
                case "Forest":
                    newRegion = region.Region.Forest();
                    tracker = status_templates.StatusTemplates.forestTracker();
                    break;
                case "Mountain":
                    newRegion = region.Region.Mountain();
                    tracker = status_templates.StatusTemplates.mountainTracker();
                    break;
                case "River":
                    newRegion= region.Region.River();
                    tracker = status_templates.StatusTemplates.riverTracker();
                    break;
            }
            if (msg.newMonster) {
                for (let player of players) {
                    let amount = player.FindComponent("PlayerStatus").GetStatusAmount(tracker);
                    while (amount > 0) {
                        player.FindComponent("PlayerStatus").RemovePermanentStatus(tracker);
                        amount = player.FindComponent("PlayerStatus").GetStatusAmount(tracker);
                    }
                }
            }
            this._parent._parent.scene.remove(this.#currentMonster.get(msg.region).FindComponent("MonsterFigure").mesh);
            const newMonster = new monster_entity.MonsterEntity("Monster", this.FindComponent("TownManager").GetRandomTownFromRegionPool(newRegion, playerTownPositions, false), hpPool[(msg.rank - 1)], msg.rank);
            this.#currentMonster.set(newRegion.toIdentifier(), newMonster);
            this._parent._parent.AddEntity(newMonster, "Monster_" + newRegion.toIdentifier());
        }

        #isBattleTurn(msg) {
            this.Broadcast(broadcasts.BroadcastTemplateCards.UpdateHandCardSelectionUI());
            this.#selection = [];
            this.#isPlayerBattleTurn = true;
        }

        #OnComboPlay(msg) {
            this.#isPlayerBattleTurn = false;
            if (this.selection.length == 0) {
                this.FindEntity("BattleEntity").Broadcast(broadcasts.BroadcastTemplateBattle.PlayCombo());
            }else{
                for (let [i , card] of this.#selection.entries()) {
                    this.Broadcast(broadcasts.BroadcastTemplateCards.UpdateHandCardSelectionUI(card, "Deselect", this.#currentRound.toIdentifier()));
                    if (i == (this.#selection.length - 1)) {
                        this.FindEntity("BattleEntity").Broadcast(broadcasts.BroadcastTemplateBattle.PlayCombo(this.#currentPlayer.GetHandCard(this.#selection[0])));
                    } else {
                        this.#currentPlayer.GetHandCard(this.#selection[i]).AddNextComboCard(this.#currentPlayer.GetHandCard(this.#selection[i + 1]));
                    }
                }
            }
            this.#selection = [];
        }

        #GetRandomRumor(msg) {
            let randomRegion = [region.Region.River(), region.Region.Forest(), region.Region.Mountain()][Math.floor(Math.random() * 3)]
            this.#currentPlayer.Broadcast(broadcasts.BroadcastTemplatePlayer.GetRumor(rewards.Reward.GetOneGold(), this.FindComponent('TownManager').GetRandomTownFromRegionPool(randomRegion),  randomRegion));
        }

        /**
         * @returns {array}
         */
        get selection() {
            return this.#selection;
        }

        get currentPlayer() {
            return this.#currentPlayer;
        }

        /**
         * @returns {int}
         */
        get currentPlayerId() {
            return this.#currentPlayerId;
        }

        /**
         * @returns {Phase}
         */
        get phase() {
            return this.#currentRound;
        }

        /**
         * @returns {town.Town}
         */
        get selectedTown() {
            return this.#selectedTown;
        }

        get isPlayerBattleTurn() {
            return this.#isPlayerBattleTurn;
        }


        /**
         * @returns {player_entity.Player}
         */
        get selectedPlayer() {
            return this.#selectedPlayer;
        }
    };

    class Phase {
        static One = new Phase(1);
        static Two = new Phase(2);
        static Three =  new Phase(3);

        static Start = new Phase(1);
        static End = new Phase(-1);
        #number;

        /**
         * An enum class to determine phase
         * Use static function constructor instead of default constructor!
         * @param {int} number 
         */
        constructor(number) {
            this.#number = number;
        }

        /**
         * Set state to next phase
         * @returns {bool}
         */
        next() {
            this.#number += 1;
            if (this.#number > 3) {
                this.#number = 1;
                return true;
            }
            return false;
        }

        /**
         * Get identifier of enum
         * @returns {int}
         */
        toIdentifier() {
            return this.#number;
        }
    }


    return {
        GameManager : GameManager,
        Phase : Phase,
    }

})();