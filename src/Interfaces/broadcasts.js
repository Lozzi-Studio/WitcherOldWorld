import { card } from "../Cards/card";
import { town_component } from "../Town/town-component";
import * as THREE from 'three';
import { region } from "../GameArea/region";

export const broadcasts = (() => {

    //returns a template for specific broadcasts to ensure data cohesion

    class BroadcastTemplatePlayer {
        /**
         * @param {int} amount 
         * @returns {object}
         */
        static PayMoney(amount) {
            return {topic: 'player.pay', amount: amount}
        }

        /**
         * @param {string} mode - Options: "Increase", "Decrease"
         * @param {int} amount 
         * @returns {object}
         */
        static ChangeShield(mode, amount) {
            return {topic: 'player.pay', mode: mode, amount: amount}
        }

        /**
         * @param {town_component.town} town 
         * @param {THREE.Vector3} position 
         * @returns {object}
         */
        static PlayerMove(town, position) {
            return {topic: 'player.move', town: town, position: position}
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
        static SelectCard(card_slot){
            return {topic: 'card.select', card_slot: card_slot}
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
         * @param {int} amount 
         * @param {string} mode - Options: "Deck", "Discard", "Potion"
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
    }

    class BroadcastTemplateSkills {
        /**
         * @param {player_skills.Skill} skill 
         * @param {string} mode - Options: "Increase", "Decrease" 
         * @param {bool} payMoney
         * @returns {object}
         */
        static ChangeSkillLevel(skill, mode, payMoney) {
            return {topic: 'skill.change_level', skill: skill, mode: mode, payMoney: payMoney}
        }

        /**
         * @param {string} mode - Options: "Increase", "Decrease" 
         * @param {int} level 
         * @param {int} amount 
         * @returns {object}
         */
        static ChangeShield(mode, level, amount) {
            return {topic: 'skill.change_shield', mode: mode, level: level, amount: amount}
        }

        /**
         * @param {string} mode - Options: "Increase", "Decrease" 
         * @param {int} amount 
         * @returns {object}
         */
        static ChangeCurrentShield(mode, amount) {
            return {topic: 'skill.change_currentshield', mode: mode, amount: amount}
        }
    }

    class BroadcastTemplateTown {
        /**
         * 
         * @param {town_component.Town} town 
         * @returns {object} 
         */
        static SelectTown(town) {
            return {topic: 'town.selection', town : town}
        }

        /**
         * @param {town_component.Town} town
         * @returns {object}
         */
        static TownAction(town) {
            return {topic: 'town.action', town: town}
        }
    }


    class BroadcastTemplateGame {
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
        static StartWuerfelpoker(player1, player2) {
            return {topic: 'game.startPoker'};
        }

        /**
         * 
         * @param {region.Region} region 
         * @returns {object}
         */
        static GetGeruecht(region) {
            return {topic: 'game.geruecht', region: region};
        }

        /**
         * 
         * @returns {object}
         */
        static RemoveShopCards() {
            return {topic: 'game.removeShop'}
        }

        static SwapoutCard() {
            return {topic: 'game.swapoutCard'}
        }
    }

    class BroadcastTemplateCamera {

        static MoveTo(position, target) {
            return {topic: 'camera.moveTo', position: position, target: target}
        }

        static FocusOn(target) {
            return {topic: 'camera.focusOn', target: target}
        }

        static StopFocus() {
            return {topic: 'camera.stopFocus'}
        }
    }

    return {
        BroadcastTemplatePlayer : BroadcastTemplatePlayer,
        BroadcastTemplateSkills : BroadcastTemplateSkills,
        BroadcastTemplateCards : BroadcastTemplateCards,
        BroadcastTemplateGame : BroadcastTemplateGame,
        BroadcastTemplateTown : BroadcastTemplateTown,
        BroadcastTemplateCamera : BroadcastTemplateCamera,
    }
})();