import { card } from "../Cards/card";
import { town_properties } from "../Town/town-properties";
import * as THREE from 'three';
import { region } from "../GameArea/region";

export const broadcasts = (() => {

    //returns a template for specific broadcasts to ensure data cohesion

    class BroadcastTemplatePlayer {
        /**
         * @param {int} amount 
         * @returns {object}
         */
        static ChangeMoney(amount) {
            return {topic: 'player.changeMoney', amount: amount}
        }

        /**
         * @param {town_entity.TownEntity} town 
         * @param {THREE.Vector3} position 
         * @returns {object}
         */
        static PlayerMove(town, position) {
            return {topic: 'player.move', town: town, position: position}
        }

        
        /**
         * @param {rewards.Reward} reward 
         * @param {town_entity.TownEntity} destination
         * @param {region.Region} region 
         * 
         * @returns {object}
         */
        static GetRumor(reward, destination, region) {
            return {topic: 'player.rumor',  reward: reward, destination: destination, region: region};
        }

        /**
         * @returns {object}
         */
        static AddTrophy() {
            return {topic: 'player.addTrophy'}
        }

        /**
         * @returns {object}
         */
        static UpdateUI(player) {
            return {topic: 'player.updateUI', player: player};
        }

        /**
         * 
         * @param {string} mode - Options: "add", "discard", "draw"
         * @param {*} card 
         * @returns 
         */
        static UpdateHandCardsUI(mode, card) {
            return {topic: 'player.updateHandCardsUI', mode: mode, card: card};
        }

        /**
         * 
         * @param {object} status
         * @param {string} mode – "temporary", "permanent"
         * @returns 
         */
        static AddStatus(status, mode){
            return {topic: 'player.addStatus',status: status, mode:mode}
        }

        static SelectPlayer(player) {
            return {topic: 'player.selection', player: player}
        }

        static DeselectPlayer(currentPlayer) {
            return {topic: 'player.deselection', currentPlayer: currentPlayer}
        }
        
        static ResolveTownLocation(town) {
            return {topic: 'player.resolveLocation', town: town}
        }
    }

    class BroadcastTemplateCards {
        
        /**
         * @param {card.Card} card
         * @param {string} mode - Options: "Discard", "Delete"
         * @returns {object}
         */
        static DiscardCard(card, mode) {
            return {topic: 'card.discardCard', card: card, mode: mode}
        }

        /**
         * 
         * @param {int} card_slot 
         * @param {card.Card} card
         * @param {string} mode - Options: "Hand", "Shop", "CardSelect"
         * @param {string} selectableCards
         * @returns {object}
         */
        static SelectCard(card_slot, card, mode, selectableCards) {
            return {topic: 'card.select', card_slot: card_slot, card: card, mode: mode, selectableCards: selectableCards}
        }

        /**
         * @param {string} deck - Options: "Player", "Shop", "Monster"
         * @param {string} school
         * @returns {object}
        */
        static LoadCarddeck(deck, school = "") {
            return {topic: 'card.loadDeck', deck: deck,school: school}
        }

        /**
         * @param {card.Card} card
         * @param {string} destination - Options: "Hand", "Deck", "BattleDeck","Discard"
         * @param {bool} fromDeck
         * @returns {object}
        */
        static AddCard(card, destination, fromDeck = false, fromDiscard = false) {
            return {topic: 'card.addCard', card: card, destination: destination, fromDeck:fromDeck, fromDiscard: fromDiscard}
        }

        /**
         * @param {string} mode - Options: "Deck", "Discard", "Potion"
         * @param {int} amount 
         * @returns {object}
         */
        static DrawCard(mode, amount) {
            return {topic: 'card.drawCard', mode: mode, amount: amount}
        }

        /**
         * 
         * @param {bool} includeDiscard 
         * @param {bool} includeHand
         * @returns {object}
         */
        static ShuffleDeck(includeDiscard, includeHand) {
            return {topic: 'card.shuffle', includeDiscard: includeDiscard, includeHand: includeHand}
        }

        /**
         * 
         * @param {int} card_slot 
         * @param {string} mode - Options: "Select", "Deselect" 
         * @param {int} phase
         * @returns {object}
         */
        static UpdateHandCardSelectionUI(card_slot, mode, phase) {
            return {topic: 'card.updateHandSelectionUI', card_slot: card_slot, mode: mode, phase: phase};
        }

        /**
         * 
         * @param {int} card_slot 
         * @param {string} mode - Options: "Select", "Deselect"
         * @param {Array} selection
         * @returns 
         */
        static UpdateCardSelectionUI(card_slot, mode, selection) {
            return {topic: 'card.updateCardSelectionUI', card_slot: card_slot, mode: mode, selection: selection};
        }

        /**
         * 
         * @returns {object}
         */
        static DiscardRandomCard() {
            return {topic: 'card.randomDiscard'}
        }


        static DiscardRandomPotion(amount) {
            return {topic: 'card.discardRandomPotion', amount: amount}
        }

    }

    class BroadcastTemplateSkills {
        /**
         * @param {player_skills.Skill} skill 
         * @param {string} mode - Options: "Increase", "Decrease" 
         * @param {bool} payMoney
         * @returns {object}
         */
        static ChangeSkillLevel(skill, mode, payMoney) {
            return {topic: 'skill.changeLevel', skill: skill, mode: mode, payMoney: payMoney}
        }

        /**
         * 
         * @param {bool} payMoney 
         * @returns 
         */
        static ChooseSkillToIncrease(payMoney) {
            return {topic: 'skill.chooseSkill', payMoney: payMoney}
        }

        /**
         * @param {string} mode - Options: "Increase", "Decrease" 
         * @param {int} level 
         * @param {int} amount 
         * @returns {object}
         */
        static ChangeShield(mode, level, amount) {
            return {topic: 'skill.changeShield', mode: mode, level: level, amount: amount}
        }

        /**
         * @param {string} mode - Options: "Increase", "Decrease" 
         * @param {int} amount 
         * @returns {object}
         */
        static ChangeCurrentShield(mode, amount) {
            return {topic: 'skill.changeCurrentShield', mode: mode, amount: amount}
        }

        /**
         * 
         * @returns {object}
         */
        static UpdateUI(player) {
            return {topic: 'skill.updateUI', player: player};
        }
    }

    class BroadcastTemplateTown {
        /**
         * 
         * @param {town_entity.TownEntity} town 
         * @returns {object} 
         */
        static SelectTown(town) {
            return {topic: 'town.selection', town : town}
        }

        /**
         * @returns {object}
         */
        static TownAction() {
            return {topic: 'town.action'}
        }

        /**
         * 
         * @returns {object} 
         */
        static DeselectTown() {
            return {topic: 'town.deselection'}
        }

        /**
         * 
         * @param {bool} active 
         * @returns {object}
         */
        static UpdateButtonActive(active) {
            return {topic: 'town.updateButton', active: active}
        }

        /**
         * 
         * @returns {object} 
         */
        static ResetTownAction() {
            return {topic: 'town.resetAction'}
        }
    }


    class BroadcastTemplateGame {

        /**
         * 
         * @returns {object}
         */
        static StartGame() {
            return {topic: 'game.start'};
        }

        /**
         * 
         * @returns {object}
         */
        static NextPhase() {
            return {topic: 'game.nextPhase'};
        }

        /**
         * 
         * @returns {object}
         */
        static loadPhaseTwoUi(){
            return {topic: 'game.phaseTwo'};
        }

        /**
         * 
         * @param {player_entity.Player} player
         * @returns {object}
        */
       static NextPlayer(player) {
            return {topic: 'game.nextPlayer', player: player};
        }

        /**
         * 
         * @param {string} skill -> options: Combat, Defense or Special
         * @returns {object}
         */
        static Meditate(skill) {
            return {topic: 'game.meditate', skill: skill}
        }

        /**
         * 
         * @param {player_entity.Player} nextPlayer
         * @returns {object}
         */
        static NextRound(nextPlayer) {
            return {topic: 'game.nextRound', nextPlayer: nextPlayer};
        }

        /**
         * 
         * @returns {object}
         */
        static StartWuerfelpoker(player1, player2) {
            return {topic: 'game.startPoker'};
        }

        /**
         * @param {string} - Options: "Rumor"
         * @param {CallableFunction} resolver
         * @returns {object}
         */
        static ChooseRegion(mode, resolver) {
            return {topic: 'game.chooseRegion', mode: mode,resolver : resolver};
        }


        /**
         * 
         * @returns {object}
         */
        static RemoveShopCards() {
            return {topic: 'game.removeShop'}
        }

        /**
         * 
         * @returns {object}
         */
        static SwapoutCard() {
            return {topic: 'game.swapoutCard'}
        }
        
        /**
         * 
         * @returns {object}
         */
        static ButtonPress() {
            return {topic: 'game.buttonPress'}
        }

        /**
         * 
         * @returns {object}
         */
        static EnableRaycasting() {
            return {topic: 'game.enableRaycasting'}
        }

        /**
         * 
         * @returns {object}
         */
        static DisableRaycasting() {
            return {topic: 'game.disableRaycasting'}
        }

        /**
         * 
         * @param {string} cursor - Options: "default", "pointer"
         * @returns 
         */
        static ChangeMouseCursor(cursor) {
            return {topic: 'game.changeMouseCursor', cursor:cursor}
        }

        /**
         * 
         * @returns {object}
         */
        static DiscardSelectedCards() {
            return {topic: 'game.discardSelectedCards'}
        }

        /**
         * 
         * @returns {object}
         */
        static DrawCardsUntilHandFull(){
            return {topic: 'game.drawUntilFull'}
        }

        /**
         * 
         * @param {bool} active 
         * @returns {object}
         */
        static UpdateDiscardButtonActive(active) {
            return {topic: 'game.updateDiscardButton', active: active}
        }

        static ApplyDamage(amount) {
            return {topic: 'game.applyDamage', amount: amount}
        }

        static CreateNewMonster(rank, region, newMonster) {
            return {topic: 'game.newMonster', rank: rank, region: region, newMonster: newMonster}
        }

        /**
         * 
         * @param {Player} winner
         * @returns {object}
         */
        static EndGame(winner){
            return {topic: 'game.endGame', winner: winner}
        }
    }

    class BroadcastTemplateCamera {

        /**
         * 
         * @param {THREE.Vector3} position 
         * @param {THREE.Object3D} target 
         * @returns {object}
         */
        static MoveTo(position, target) {
            return {topic: 'camera.moveTo', position: position, target: target}
        }

        /**
         * 
         * @param {THREE.Object3D} target 
         * @returns {object}
         */
        static FocusOn(target) {
            return {topic: 'camera.focusOn', target: target}
        }

        /**
         * 
         * @returns {object}
         */
        static StopFocus() {
            return {topic: 'camera.stopFocus'}
        }

        /**
         * 
         * @returns {object}
         */
        static FocusOnShop() {
            return {topic: 'camera.focusOnShop'}
        }

        /**
         * 
         * @returns {object}
         */
        static StopFocusShop() {
            return {topic: 'camera.stopFocusShop'}
        }
        
    }

    class BroadcastTemplateMusic {

        /**
         * @returns {object}
         */
        static PlayMainMenuTheme() {
            return {topic: 'music.menu'}
        }

        /**
         * 
         * @returns {object}
         */
        static PlayMainTheme() {
            return {topic: 'music.main'}
        }

        /**
         * 
         * @returns {object}
         */
        static PlayChaseTheme() {
            return {topic: 'music.chase'}
        }

        /**
         * 
         * @returns {object}
         */
        static PlayBattleMonsterTheme() {
            return {topic: 'music.battleMonster'}
        }
    }

    class BroadcastTemplateCardShop {

        /**
         * @param {int} slot
         * @param {int} cost
         * @returns {object}
         */
        static SelectCardFromShop(slot, cost) {
            return {topic: 'cardshop.select', slot: slot, cost: cost}
        }

        /**
         * @param {int} slot
         * @param {int} cost
         * @returns {object}
         */
        static BuyCardFromShop(slot, cost) {
            return {topic: 'cardshop.buy', slot: slot, cost: cost}
        }
    }

    class BroadcastTemplateBattle {

        static StartPlayerTurn(emptyHand, specialUsed) {
            return {topic: 'battle.playerTurn', emptyHand: emptyHand, specialUsed: specialUsed}
        }

        static PlayCombo(card) {
            return {topic: 'battle.playCombo', card: card}
        }

        static StartBattle(player, monster) {
            return {topic: 'battle.startBattle', player: player, monster: monster}
        }

        static EndBattle(){
            return {topic: 'battle.endBattle'}
        }

        static UseSpecial(){
            return {topic: 'battle.special'}
        }
    }

    return {
        BroadcastTemplatePlayer : BroadcastTemplatePlayer,
        BroadcastTemplateSkills : BroadcastTemplateSkills,
        BroadcastTemplateCards : BroadcastTemplateCards,
        BroadcastTemplateGame : BroadcastTemplateGame,
        BroadcastTemplateTown : BroadcastTemplateTown,
        BroadcastTemplateCamera : BroadcastTemplateCamera,
        BroadcastTemplateMusic: BroadcastTemplateMusic,
        BroadcastTemplateCardShop: BroadcastTemplateCardShop,
        BroadcastTemplateBattle: BroadcastTemplateBattle
    }
})();