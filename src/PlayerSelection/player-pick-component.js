import * as THREE from 'three';
import { component } from "../Interfaces/component";


export const player_picker = (() => {


    class PlayerPicker extends component.Component {

        constructor() {
            super();
        }

        InitComponent() {

            var text = document.createElement('div');
            text.style.position = 'absolute';
            text.style.width = 300;
            text.style.height = 250;
            text.innerHTML = "Player Select Screen (WiP)";
            text.style.color = "red";
            text.style.fontSize = "40px"

            text.style.top = window.innerHeight / 6 + 'px';
            text.style.left = window.innerWidth / 7 + 'px';
            document.getElementById('player-selector').appendChild(text);
        }

        SwitchScene(){
            document.getElementById('player-selector').style.display = 'none';
            this._parent._parent.SwitchScene("GameScene");
        }
    }

    return {
        PlayerPicker : PlayerPicker
    }
}) ();