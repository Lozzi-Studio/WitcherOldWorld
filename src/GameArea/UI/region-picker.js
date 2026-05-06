import { component } from "../../Interfaces/component";
import { region } from "../region";
import { rewards } from "../../GameObjects/rewards";

export const region_picker = (() => {

    class RegionPicker extends component.Component{
        #resolver;
        #mode;
        #pickedRegion;

        constructor() {
            super();
            this.#resolver = null;
            this.#pickedRegion = null;
        }

        InitComponent() {
            this._RegisterHandler('game.chooseRegion', (msg) => {this.#init(msg)});
        }

        #init(msg) {
            this.#resolver = msg.resolver;
            this.#mode = msg.mode;
            this.#pickedRegion = region.Region.Forest();
            this.#resolve();
        }

        #resolve(){
            switch (this.#mode) {
                case "Rumor":
                    let broadcast = this.#resolver.bind('player.rumor' ,rewards.Reward.GetOneGold(), this.FindComponent('TownManager').GetRandomTownFromRegionPool(this.#pickedRegion),  this.#pickedRegion);
                    this.FindComponent('GameManager').currentPlayer.Broadcast(broadcast())
                    break;
            }
        }
    }

    return {
        RegionPicker : RegionPicker
    }
}) ();