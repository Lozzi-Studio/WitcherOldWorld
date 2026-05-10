import * as THREE from 'three';
import { component } from "../Interfaces/component";


export const backgrounds = (() => {

    class BackgroundMainMenu extends component.Component{
        #background;

        constructor() {
            super();
            
        }

        InitComponent() {

            const video = document.getElementById( 'background_video' );
            video.playbackRate = 0.35;
            video.play();

            const texture = new THREE.VideoTexture( video );
            
            const material = new THREE.MeshBasicMaterial( { map: texture } );

            const screen = new THREE.PlaneGeometry(2, 2);
            const videoScreen = new THREE.Mesh(screen, material);
            this._parent._parent.scene.add(videoScreen);
            this.#background = videoScreen;

            var logo = new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load("resources/assets/background/the-witcher-old-world-eng-logo.webp")
            });
            logo.fog = false;
            logo.transparent = true;
            var logoMesh = new THREE.Mesh(
                new THREE.PlaneGeometry(0.4,0.6),
                logo
            );
            logoMesh.name = 'Logo'
            logoMesh.position.copy(new THREE.Vector3(-0.5,0.6,0))

            this._parent._parent.scene.add(logoMesh);
            
        }

        get background() {
            return this.#background;
        }
    }

    class BackgroundPlaceholder extends component.Component{

        constructor(){
            super();
        }

        InitComponent() {
            var texture = new THREE.MeshBasicMaterial({
                color: "black"
            });
            texture.fog = false;
            var bg = new THREE.Mesh(
                new THREE.PlaneGeometry(2,2),
                texture
            );
            bg.name = 'Background'

            this._parent._parent.scene.add(bg);

            var text = document.createElement('div');
            text.style.position = 'absolute';
            //text2.style.zIndex = 1;    // if you still don't see the label, try uncommenting this
            text.style.width = 100;
            text.style.height = 100;
            text.style.setProperty = "white";
            text.innerHTML = "click anywhere to start!";
            text.style.top = window.innerHeight / 2 - 100 + 'px';
            text.style.left = window.innerWidth / 2 - 100 + 'px';
            document.getElementById('placeholder').appendChild(text);
        }
    }

    return {
        BackgroundMainMenu : BackgroundMainMenu,
        BackgroundPlaceholder : BackgroundPlaceholder
    }


}) ();