import { component } from "../../Interfaces/component";

export const region_picker = (() => {

    class RegionPicker extends component.Component{
        #resolver
        #pickedRegion

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
        }

        #resolve(){
            switch (mode) {
                case "Rumor":
                    broadcast = this.#resolver.bind(this.#pickedRegion, this.FindComponent('TownManager').GetRandomTownFromRegionPool(this.#pickedRegion));
                    this.FindComponent('GameArea').getCurrentPlayer.Broadcast(broadcast())
                    break;
            }
        }
    }
}) ();