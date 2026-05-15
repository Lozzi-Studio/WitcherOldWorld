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
        static UpdateUI() {
            return {topic: 'player.updateUI'};
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
         * @returns {object}
         */
        static SelectCard(card_slot, card) {
            return {topic: 'card.select', card_slot: card_slot, card:card}
        }

        /**
         * @param {string} deck - Options: "Player", "Shop"
         * @returns {object}
        */
        static LoadCarddeck(deck) {
            return {topic: 'card.loadDeck', deck: deck}
        }

        /**
         * @param {card.Card} card
         * @param {string} destination - Options: "Hand", "Deck", "Discard"
         * @returns {object}
        */
        static AddCard(card, destination) {
            return {topic: 'card.addCard', card: card, destination: destination}
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
         * @returns {object}
         */
        static ShuffleDeck(includeDiscard) {
            return {topic: 'card.shuffle', includeDiscard: includeDiscard}
        }

        /**
         * 
         * @param {int} card_slot 
         * @param {string} mode - Options: "Select", "Deselect" 
         * @returns 
         */
        static UpdateCardSelectionUI(card_slot, mode) {
            return {topic: 'card.updateSelectionUI', card_slot: card_slot, mode: mode};
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
        static UpdateUI() {
            return {topic: 'skill.updateUI'};
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
         * @param {player_entity.Player} nextPlayer
         * @returns {object}
         */
        static NextTurn(nextPlayer) {
            return {topic: 'game.nextTurn', nextPlayer: nextPlayer};
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
            console.log("broadcast cursor change", cursor);
            return {topic: 'game.changeMouseCursor', cursor:cursor}
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

    return {
        BroadcastTemplatePlayer : BroadcastTemplatePlayer,
        BroadcastTemplateSkills : BroadcastTemplateSkills,
        BroadcastTemplateCards : BroadcastTemplateCards,
        BroadcastTemplateGame : BroadcastTemplateGame,
        BroadcastTemplateTown : BroadcastTemplateTown,
        BroadcastTemplateCamera : BroadcastTemplateCamera,
        BroadcastTemplateMusic: BroadcastTemplateMusic
    }
})();