import { component } from "../Interfaces/component";
import * as THREE from 'three';

export const music_component = (() => {

    class MusicComponent extends component.Component{
        #camera;
        #listener;
        #loader;
        #musicQueue;
        #maxVolume;
        #currentVolumeTrack1;
        #currentVolumeTrack2;
        #fadeDuration;
        #skipTo

        constructor(camera) {
            super();
            this.#camera = camera;
            this.#listener = new THREE.AudioListener();
            this.#camera.add(this.#listener);
            this.#loader = new THREE.AudioLoader();
            this.#musicQueue = [];
            this.#maxVolume = 0.05;
            this.#currentVolumeTrack1 = this.#maxVolume;
            this.#currentVolumeTrack2 = 0;
            this.#fadeDuration = 4;
            this.#skipTo = -1;
        }

        InitComponent() {
            this._RegisterHandler('music.main', (msg) => {this.#PlayMainTheme(msg);});
            this._RegisterHandler('music.battleMonster', (msg) => {this.#PlayBattleMonsterTheme(msg);})
            this._RegisterHandler('music.chase', (msg) => {this.#PlayChaseTheme(msg);})
            this._RegisterHandler('music.menu', (msg) => {this.#PlayMainMenuTheme(msg);})
        }

        #PlayMainMenuTheme(msg) {
            this.#loader.load( 'resources/sounds/MainMenuTheme.mp3',(buffer) => {
                this.#maxVolume = 0.1;
                this.#loadTrack(buffer);
            });
        }

        #PlayMainTheme(msg) {
            this.#loader.load( 'resources/sounds/MainTheme.mp3',(buffer) => {
                this.#maxVolume = 0.05;
                this.#loadTrack(buffer);
            });
        }

        #PlayBattleMonsterTheme(msg){
            this.#loader.load( 'resources/sounds/Battle_Monster.mp3',(buffer) => {
                this.#maxVolume = 0.05;
                this.#loadTrack(buffer);
            });
        }

        #PlayChaseTheme(msg) {
            this.#loader.load( 'resources/sounds/ChaseTheme.mp3',(buffer) => {
                this.#maxVolume = 0.08;
                this.#loadTrack(buffer);
            });
        }

        #loadTrack(buffer) {
            const newMusic = new THREE.Audio( this.#listener );
            newMusic.setBuffer( buffer );
            newMusic.setLoop( true );
            newMusic.setVolume(this.#musicQueue.length == 0 ? this.#maxVolume : 0);
            newMusic.play();
            this.#musicQueue.push(newMusic);
        }

        Update(timeElapsed) {
 
            if (this.#musicQueue.length > 1 && timeElapsed > 0) {

                if (this.#currentVolumeTrack1 > 0){
                    this.#currentVolumeTrack1 -= this.#maxVolume * ((timeElapsed / this.#fadeDuration ));
                    this.#musicQueue[0].setVolume( this.#currentVolumeTrack1 );
                }
                if (this.#currentVolumeTrack2 < this.#maxVolume) {
                    this.#currentVolumeTrack2 += this.#maxVolume * ((timeElapsed / this.#fadeDuration ));
                    this.#musicQueue[1].setVolume( this.#currentVolumeTrack2 );
                }
                if (this.#currentVolumeTrack1 < 0 && this.#currentVolumeTrack2 > this.#maxVolume) {
                    this.#musicQueue[0].stop();
                    this.#musicQueue.splice(0,1);
                    this.#currentVolumeTrack1 = this.#maxVolume;
                    this.#currentVolumeTrack2 = 0;
                }
            }
        }

        Stop(){
            for (let audio of this.#musicQueue){
                audio.stop();
            }
        }
    }

    return {
        MusicComponent : MusicComponent
    }
}) ();