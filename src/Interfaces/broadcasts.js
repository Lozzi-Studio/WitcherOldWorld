import { card } from "../Cards/card";
import { town_component } from "../Town/town-component";
import * as THREE from 'three';

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
         * @returns 
         */
        static PlayerMove(town, position) {
            return {topic: 'player.move', town: town, position: position}
        }
    }

    class BroadcastTemplateCards {
        
        /**
         * @param {card.Card} card
         * @param {string} mode - Options: "Discard", "Delete"
         */
        static DiscardCard(card, mode) {
            return {topic: 'card.discardCard', card: card, mode: mode}
        }

        /**
         * 
         * @param {int} card_slot 
         */
        static SelectCard(card_slot){
            return {topic: 'card.select', card_slot: card_slot}
        }

        /**
         * @param {string} deck - Options: "Player", "Shop"
        */
        static LoadCarddeck(deck) {
            return {topic: 'card.loadDeck', deck: deck}
        }

        /**
         * @param {card.Card} card
         * @param {string} destination - Options: "Hand", "Deck", "Discard"
        */
        static AddCard(card, destination) {
            return {topic: 'card.addCard', card: card, destination: destination}
        }

        /**
         * @param {int} amount 
         * @param {string} mode - Options: "Deck", "Discard", "Potion"
         */
        static DrawCard(mode, amount) {
            return {topic: 'card.drawCard', mode: mode, amount: amount}
        }

        /**
         * 
         * @param {bool} includeDiscard 
         * @returns 
         */
        static ShuffleDeck(includeDiscard) {
            return {topic: 'card.shuffle', includeDiscard: includeDiscard}
        }
    }

    class BroadcastTemplateSkills {
        /**
         * @param {player_skills.Skill} skill 
         * @param {string} mode - Options: "Increase", "Decrease" 
         * @returns 
         */
        static ChangeSkillLevel(skill, mode) {
            return {topic: 'skill.change_level', skill: skill, mode: mode}
        }

        /**
         * @param {string} mode - Options: "Increase", "Decrease" 
         * @param {int} level 
         * @param {int} amount 
         * @returns 
         */
        static ChangeShield(mode, level, amount) {
            return {topic: 'skill.change_shield', mode: mode, level: level, amount: amount}
        }

        /**
         * @param {string} mode - Options: "Increase", "Decrease" 
         * @param {int} amount 
         * @returns 
         */
        static ChangeCurrentShield(mode, amount) {
            return {topic: 'skill.change_currentshield', mode: mode, amount: amount}
        }
    }

    class BroadcastTemplateAction {
        /**
         * 
         * @param {town_component.Town} town 
         * @returns 
         */
        static SelectTown(town) {
            return {topic: 'town.selection', town : town}
        }

        /**
         * 
         * @param {int} id 
         * @returns 
         */
        static TownAction(id) {
            return {topic: 'town.action', id: id}
        }
    }

    class BroadcastTemplateGame {
        static nextPhase() {
            return {topic: 'game.nextPhase'};
        }
    }

    return {
        BroadcastTemplatePlayer : BroadcastTemplatePlayer,
        BroadcastTemplateSkills : BroadcastTemplateSkills,
        BroadcastTemplateAction : BroadcastTemplateAction,
        BroadcastTemplateCards : BroadcastTemplateCards,
        BroadcastTemplateGame : BroadcastTemplateGame
    }
})();