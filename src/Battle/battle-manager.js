import { card_options } from "../Cards/card-options";
import { broadcasts } from "../Interfaces/broadcasts";
import { component } from "../Interfaces/component";
import { player_skills } from "../Players/player-skills";
import { status_options } from "../Players/status-options";
import { status_templates } from "../Players/status-templates";


export const battle_manager = (() => {

    class BattleManager extends component.Component {
        #player;
        #monster;
        #playerDrawValues;
        #usedSpecialAbility;
        #choosenSpecialAbility;
        #monsterAttackDelay;
        #poisened;

        constructor() {
            super();
            this.#player = null;
            this.#monster = null;
            
            this.#playerDrawValues = [1, 2, 3, 4, 4];
            this.#usedSpecialAbility = false;
            this.#choosenSpecialAbility = {};
            this.#monsterAttackDelay = 2000;

            this.#poisened = 0;
        }

        InitComponent() {
            this._RegisterHandler('battle.playCombo', (msg) => {this.#PlayCombo(msg)});
            this._RegisterHandler('battle.startBattle', (msg) => {this.#StartBattle(msg)});
            this._RegisterHandler('battle.special', (msg) => {this.#UsedSpecial(msg)})
        }

        #StartBattle(msg) {
            this.#player = msg.player;
            this.#monster = msg.monster;
            this.#player.Broadcast(broadcasts.BroadcastTemplateCards.ShuffleDeck(true, false));
            this.#monster.Broadcast(broadcasts.BroadcastTemplateCards.LoadCarddeck("Monster")); 
            this.#monster.Broadcast(broadcasts.BroadcastTemplateCards.ShuffleDeck(true, false));
            let varDiff = this.#monster.FindComponent("Carddeck").deck.length -this.#monster.health;
            for (let i = 0; i < varDiff; i++) {
                this.#monster.Broadcast(broadcasts.BroadcastTemplateCards.DiscardRandomCard());
            }
            this.FindEntity('Camera').Broadcast(broadcasts.BroadcastTemplateMusic.PlayBattleMonsterTheme());
            this.#GetStartingTurn();
        }

        #GetStartingTurn() {
            let amount = 0;
            switch (this.#monster.name.split("_")[1]) {
                case "River":
                    amount = this.#player.FindComponent("PlayerStatus").GetStatusAmount(status_templates.StatusTemplates.riverTracker());
                    if (amount > 0) {
                        this.#player.FindComponent("PlayerStatus").RemovePermanentStatus(status_templates.StatusTemplates.riverTracker());
                        this.#PlayerTurn();
                    } else {
                        setTimeout(() => { this.#MonsterTurn();}, this.#monsterAttackDelay);
                    }
                    break;
                case "Forest":
                    amount = this.#player.FindComponent("PlayerStatus").GetStatusAmount(status_templates.StatusTemplates.forestTracker());
                    if (amount > 0) {
                        this.#player.FindComponent("PlayerStatus").RemovePermanentStatus(status_templates.StatusTemplates.forestTracker());
                        this.#PlayerTurn();
                    } else {
                        setTimeout(() => { this.#MonsterTurn();}, this.#monsterAttackDelay);
                    }
                    break;
                case "Mountain":
                    amount = this.#player.FindComponent("PlayerStatus").GetStatusAmount(status_templates.StatusTemplates.mountainTracker());
                    if (amount > 0) {
                        this.#player.FindComponent("PlayerStatus").RemovePermanentStatus(status_templates.StatusTemplates.mountainTracker());
                        this.#PlayerTurn();
                    } else {
                        setTimeout(() => { this.#MonsterTurn();}, this.#monsterAttackDelay);
                    }
                    break;
                default:
                    this.#PlayerTurn();
            }
        }

        #MonsterTurn() {
            let nextMove = this.#monster.FindComponent("MonsterAi").ChooseNextMove();
            if (nextMove.damage > 0) {
                this.#player.Broadcast(broadcasts.BroadcastTemplateGame.ApplyDamage(nextMove.damage));
            } else if (nextMove.skill != ""){
                if (nextMove.discard) {
                    if (nextMove.level != undefined){
                        this.#player.Broadcast(broadcasts.BroadcastTemplateGame.ApplyDamage(nextMove.level));
                        switch (nextMove.skill) {
                            case "combat":
                                this.#player.Broadcast(broadcasts.BroadcastTemplateSkills.ChangeSkillLevel(player_skills.Skill.Combat(), "Decrease", false));
                                break;
                            case "defense":
                                this.#player.Broadcast(broadcasts.BroadcastTemplateSkills.ChangeSkillLevel(player_skills.Skill.Defense(), "Decrease", false));
                                break;
                            case "alchemy":
                                this.#player.Broadcast(broadcasts.BroadcastTemplateSkills.ChangeSkillLevel(player_skills.Skill.Alchemy(), "Decrease", false));
                                break;
                        }
                    }
                } else {
                    let dmg = 0;
                    switch (nextMove.skill) {
                        case "combat":
                            dmg = this.#player.FindComponent("PlayerSkills").combat;
                            break;
                        case "defense":
                            dmg = this.#player.FindComponent("PlayerSkills").defense;
                            break;
                        case "alchemy":
                            dmg = this.#player.FindComponent("PlayerSkills").alchemy;
                            break;
                        case "special":
                            dmg = this.#player.FindComponent("PlayerSkills").special;
                            break;
                    }
                    this.#player.Broadcast(broadcasts.BroadcastTemplateGame.ApplyDamage(dmg));
                }
            } else if (nextMove.level != undefined){
                if (nextMove.discard) {
                    for (let i = 0; i < nextMove.level; i++) {
                        this.#player.Broadcast(broadcasts.BroadcastTemplateCards.DiscardRandomCard());
                    }
                } else {
                    this.#player.Broadcast(broadcasts.BroadcastTemplateGame.ApplyDamage(nextMove.level));
                }
            } else {
                this.#player.Broadcast(broadcasts.BroadcastTemplateGame.ApplyDamage(2));
            }

            if (this.#poisened > 0) {
                this.#poisened -= 1;
                this.#monster.Broadcast(broadcasts.BroadcastTemplateGame.ApplyDamage(1));
            }


            console.log("monster next move", nextMove);
            if (this.#player.GetHealth() <= 0 ) {
                if (this.#monster.GetCurrentHealth()  <= 1 ) {
                    this.#ResolveDraw();
                } else {
                    this.#ResolveMonsterWin();
                }
            } else if (this.#monster.GetCurrentHealth() <= 1) {
                this.#ResolvePlayerWin()
            } else{
                this.#PlayerTurn();
            }
        }

        #PlayerTurn() {
            if (this.#player.witcherSpecialAbility.name == "Ruestung" && !(this.#usedSpecialAbility) && this.#player.FindComponent("Shield").amount <= 0) {
                this.#player.Broadcast(broadcasts.BroadcastTemplateSkills.ChangeShield("Increase", this.#player.FindComponent("PlayerSkills").defense, this.#player.witcherSpecialAbility.value[0]));
                this.#player.Broadcast(broadcasts.BroadcastTemplateCards.DrawCard("Deck", this.#player.witcherSpecialAbility.value[1]));
                this.#usedSpecialAbility = true;
            }
            if (this.#player.FindComponent("Carddeck").hand.length <= 0) {
                this.FindEntity("GameArea").Broadcast(broadcasts.BroadcastTemplateBattle.StartPlayerTurn(true, this.GetIsSpecialAbilityUsed()));
            } else {
                this.FindEntity("GameArea").Broadcast(broadcasts.BroadcastTemplateBattle.StartPlayerTurn(false, this.GetIsSpecialAbilityUsed()));
            }
        }

        #ResolveMonsterWin(){
            console.log("MonsterWin");
            this.#player.Broadcast(broadcasts.BroadcastTemplateSkills.ChangeCurrentShield("Increase", 5));
            this.#player.Broadcast(broadcasts.BroadcastTemplateCards.ShuffleDeck(true, true));
            let amount = 0;
            switch (this.#monster.name.split("_")[1]) {
                case "River":
                    amount = this.#player.FindComponent("PlayerStatus").GetStatusAmount(status_templates.StatusTemplates.riverTracker());
                    if (amount <= 0) {
                        this.#player.Broadcast(broadcasts.BroadcastTemplatePlayer.AddStatus(status_templates.StatusTemplates.riverTracker(), "permanent"));
                    } 
                    break;
                case "Forest":
                    amount = this.#player.FindComponent("PlayerStatus").GetStatusAmount(status_templates.StatusTemplates.forestTracker());
                    if (amount <= 0) {
                        this.#player.Broadcast(broadcasts.BroadcastTemplatePlayer.AddStatus(status_templates.StatusTemplates.forestTracker(), "permanent"));
                    }
                    break;
                case "Mountain":
                    amount = this.#player.FindComponent("PlayerStatus").GetStatusAmount(status_templates.StatusTemplates.mountainTracker());
                    if (amount <= 0) {
                        this.#player.Broadcast(broadcasts.BroadcastTemplatePlayer.AddStatus(status_templates.StatusTemplates.mountainTracker(), "permanent"));
                    }
                    break;
            }
            let zeroCostCard = this.FindEntity("Cardshop").FindComponent("Carddeck").GetZeroCard();
            if (zeroCostCard != null) {
                this.#player.Broadcast(broadcasts.BroadcastTemplateCards.AddCard(zeroCostCard,"Discard"));
            }
            this.#player.Broadcast(broadcasts.BroadcastTemplatePlayer.AddStatus(status_templates.StatusTemplates.drawLessCards(status_options.Timing.EndOfTurn(), 1), "temporary"));
            this.#EndBattle();
        }

        #ResolvePlayerWin(){
            console.log("PlayerWin");
            this.#player.Broadcast(broadcasts.BroadcastTemplateSkills.ChangeCurrentShield("Increase", 5));
            this.#player.Broadcast(broadcasts.BroadcastTemplateCards.ShuffleDeck(true, true));
            this.#player.Broadcast(broadcasts.BroadcastTemplatePlayer.AddTrophy());
            this.#player.Broadcast(broadcasts.BroadcastTemplatePlayer.ChangeMoney(2));
            this.FindEntity("GameArea").Broadcast(broadcasts.BroadcastTemplateGame.CreateNewMonster(this.#monster.rank + 1 <= 3 ? this.#monster.rank + 1 : 3, this.#monster.name.split("_")[1], true));
            this.#EndBattle();
        } 
        
        #ResolveDraw(){
            console.log("Draw");
            this.#player.Broadcast(broadcasts.BroadcastTemplateSkills.ChangeCurrentShield("Increase", 5));
            this.#player.Broadcast(broadcasts.BroadcastTemplateCards.ShuffleDeck(true, true));
            this.#player.Broadcast(broadcasts.BroadcastTemplatePlayer.ChangeMoney(2));
            let zeroCostCard = this.FindEntity("Cardshop").FindComponent("Carddeck").GetZeroCard();
            if (zeroCostCard != null) {
                this.#player.Broadcast(broadcasts.BroadcastTemplateCards.AddCard(zeroCostCard,"Discard"));
            }
            this.FindEntity("GameArea").Broadcast(broadcasts.BroadcastTemplateGame.CreateNewMonster(this.#monster.rank, this.#monster.name.split("_")[1], false));
            this.#EndBattle();
        }


        #PlayCombo(msg) {
            console.log("combo msg", msg);
            let comboCount = 0;
            if (msg.card != undefined) {
                let cardsToDiscard = [];
                let result = card_options.CardEffect.createCardEffect(0,0,0,false,false);
                for (let effect of msg.card.getEffect([])) {
                    if (effect.bonus != null) {
                        result.damage += effect.bonus.damage;
                        result.shield += effect.bonus.shield;
                        result.drawModifier += effect.bonus.drawModifier;
                    }
                    result.damage += effect.effects.damage;
                    result.shield += effect.effects.shield;
                    result.drawModifier += effect.effects.drawModifier;
                    if (!(effect.effects.backtohand || effect.bonus ? effect.bonus.backtohand : false)) {
                       cardsToDiscard.push(effect.card);
                    }
                    if (effect.effects.gettopdiscard || effect.bonus ? effect.bonus.gettopdiscard : false) {
                        this.#player.Broadcast(broadcasts.BroadcastTemplateCards.DrawCard("Discard", 1));
                    }
                    comboCount ++;
                }
                for (let card of cardsToDiscard) {
                    this.#player.Broadcast(broadcasts.BroadcastTemplateCards.DiscardCard(card, "Discard"));
                }
                this.FindEntity("GameArea").Broadcast(broadcasts.BroadcastTemplateCards.UpdateCardSelectionUI());
                this.#monster.Broadcast(broadcasts.BroadcastTemplateGame.ApplyDamage(result.damage));
                this.#player.Broadcast(broadcasts.BroadcastTemplateSkills.ChangeShield("Increase", this.#player.FindComponent("PlayerSkills").defense, result.shield));
                console.log("before draw");
                this.#player.Broadcast(broadcasts.BroadcastTemplateCards.DrawCard("BattleDeck", (Math.max(0 ,(this.#playerDrawValues[this.#player.FindComponent("PlayerSkills").combat.level - 1] + result.drawModifier)))));
                console.log("after draw");
            } else {
                this.#player.Broadcast(broadcasts.BroadcastTemplateCards.DrawCard("BattleDeck", (Math.max(0 ,(this.#playerDrawValues[this.#player.FindComponent("PlayerSkills").combat.level - 1])))));
            }
            
            if (this.#player.witcherSpecialAbility.name == "Schnelligkeit") {
                this.#usedSpecialAbility = true;
            }
            if ("info" in this.#choosenSpecialAbility) {
                switch(this.#choosenSpecialAbility.name) {
                    case "Vergiftete Waffe":
                        this.#poisened = this.#choosenSpecialAbility.value[0];
                        break;
                    case "Schwertkunst":
                        if (comboCount >= 3) {
                            this.#monster.Broadcast(broadcasts.BroadcastTemplateGame.ApplyDamage(this.#choosenSpecialAbility.value[0]));
                            this.#player.Broadcast(broadcasts.BroadcastTemplateCards.DrawCard("Deck", this.#choosenSpecialAbility.value[1]));
                        } else {
                            this.#usedSpecialAbility = false;
                        }
                        break;
                }
            }
            this.#choosenSpecialAbility = {};

            if (this.#monster.GetCurrentHealth() <= 0 ) {
                if (this.#player.GetHealth() <= 0 ) {
                    this.#ResolveDraw();
                } else {
                    this.#ResolvePlayerWin();
                }
            } else {
                setTimeout(() => { this.#MonsterTurn();}, this.#monsterAttackDelay);
            }
        }

        #UsedSpecial(msg) {
            this.#usedSpecialAbility = true;
            this.#choosenSpecialAbility = this.#player.witcherSpecialAbility;
            if ("info" in this.#choosenSpecialAbility) {
                switch(this.#choosenSpecialAbility.name) {
                    case "Schnelligkeit":
                        let cardsToChoose = []
                        for (let card of this.#player.FindComponent("Carddeck").deck) {
                            if (cardsToChoose.length < this.#choosenSpecialAbility.value[0]) {
                                cardsToChoose.push(card);
                            } else {
                                break;
                            }
                        }
                        if (cardsToChoose.length > 0) {
                            this.FindEntity("GameArea").FindComponent("CardSelectUI").GetCardSelectionFromPlayerPrompt(cardsToChoose,this.#choosenSpecialAbility.value[1], "Hinzufügen der Hand", false, "Spezialfähigkeit").then(
                                (result) => {   
                                    if (result != null) {
                                        for (let card of result) {
                                            this.#player.Broadcast(broadcasts.BroadcastTemplateCards.AddCard(card, "Hand", true));
                                        }
                                    }
                                }
                            );
                            
                        }
                        break;
                    case "Magie":
                        if (this.#choosenSpecialAbility.value[1] <= this.#player.FindComponent("Carddeck").hand.length) {
                            if (this.#choosenSpecialAbility.value[0] == 1) {
                                let topDiscard = this.#player.FindComponent("Carddeck").discard[0];
                                if (topDiscard) {
                                    this.#player.Broadcast(broadcasts.BroadcastTemplateCards.DrawCard("Discard", 1));
                                    if (this.#choosenSpecialAbility.value[1] != 0) {
                                            this.FindEntity("GameArea").FindComponent("CardSelectUI").GetCardSelectionFromPlayerPrompt(this.#player.FindComponent("Carddeck").hand,this.#choosenSpecialAbility.value[1], "Abwerfen", "Spezialfähigkeit").then(
                                            (result) => {   
                                                if (result != null) {
                                                    for (let card of result) {
                                                        this.#player.Broadcast(broadcasts.BroadcastTemplateCards.DiscardCard(card, "Discard"));
                                                    }
                                                } else {
                                                    this.#usedSpecialAbility = false;
                                                    this.FindEntity("GameArea").FindComponent("UIManager").UpdateButtonState("button-special", true);
                                                    this.#player.Broadcast(broadcasts.BroadcastTemplateCards.DiscardCard(topDiscard, "Discard"));
                                                }
                                            }
                                        );
                                    }
                                } else {
                                    this.#usedSpecialAbility = false;
                                    this.FindEntity("GameArea").FindComponent("UIManager").UpdateButtonState("button-special", true);
                                }
                            } else {
                                this.FindEntity("GameArea").FindComponent("CardSelectUI").GetCardSelectionFromPlayerPrompt(this.#player.FindComponent("Carddeck").discard,1, "Hinzufügen der Hand", "Spezialfähigkeit").then(
                                    (result) => {   
                                        if (result != null) {
                                            for (let card of result) {
                                                for (let card of result) {
                                                    this.#player.Broadcast(broadcasts.BroadcastTemplateCards.AddCard(card, "Hand", false,true));
                                                }    
                                            } 
                                        } else {
                                            this.#usedSpecialAbility = false;
                                            this.FindEntity("GameArea").FindComponent("UIManager").UpdateButtonState("button-special", true);
                                        }
                                    }
                                );
                            }
                        } else {
                            this.#usedSpecialAbility = false;
                            this.FindEntity("GameArea").FindComponent("UIManager").UpdateButtonState("button-special", true);
                        }
                        break;
                }
            }           
        }

        #EndBattle() {
            this.#player = null;
            this.#monster = null;
            this.#usedSpecialAbility = false;
            this.#choosenSpecialAbility = {};
            this.Broadcast(broadcasts.BroadcastTemplateBattle.EndBattle());
            this.FindEntity('Camera').Broadcast(broadcasts.BroadcastTemplateMusic.PlayMainTheme());
            this.FindEntity("GameArea").Broadcast(broadcasts.BroadcastTemplateGame.NextPhase());
        }

        GetIsSpecialAbilityUsed() {
            return this.#player.witcherSpecialAbility.info == "Ruestung" ? true : this.#usedSpecialAbility;
        }

        get player() {
            return this.#player;
        }

    }

    return {
        BattleManager : BattleManager
    }
}) ();