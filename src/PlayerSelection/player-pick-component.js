import * as THREE from 'three';
import { component } from "../Interfaces/component";


export const player_picker = (() => {


    class PlayerPicker extends component.Component {

        /**
         * A picker to choose player count and swap to next scene
         */
        constructor() {
            super();
        }

        /**
         * Used to intialize and add any default components/events
         */
        InitComponent() {
        }

        SwitchScene(){
            document.getElementById('player-selection').style.display = 'none';
            this._parent._parent.SwitchScene("GameScene");
        }
    }

    return {
        PlayerPicker : PlayerPicker
    }
}) ();