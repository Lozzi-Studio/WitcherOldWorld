import { texture } from "three/tsl";
import { component } from "../Interfaces/component";
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import GwentFont from '../../resources/fonts/GWENT_ExtraBold.json';
import * as THREE from 'three';


export const cardshop_slot = (() => {

    class CardShopSlot extends component.Component{
        #modifier;
        #costBox;
        #card;
        #cardBox;
        #position;
        #hitbox;
        #slot;

        /**
         * A wrapper for slots in the cardshop
         * @param {int} modifier 
         * @param {THREE.Vector3} position
         * @param {int} slot
         */
        constructor(position, modifier, slot) {
            super();
            this.#modifier = modifier;
            this.#card = null;
            this.#cardBox = null;
            this.#position = position;
            this.#hitbox = null;
            this.#costBox = null;
            this.#slot = slot;
        }

        /**
         * Used to intialize and add any default components/events
         */
        InitComponent() {
            this.#InitModel();
            this._RegisterHandler('cardshop.select', (msg) => {this.#SelectSlot(msg)});
        }

        /**
         * Initialize THREEjs Model
         */
        #InitModel() {
            const displayCard = new THREE.Mesh(new THREE.PlaneGeometry(5.7,9.6), new THREE.MeshBasicMaterial({color: 'black', transparent: true, opacity: 0.2}));
            displayCard.rotation.setFromVector3(new THREE.Vector3( -Math.PI / 2 , -Math.PI / 5, -Math.PI / 2));
            displayCard.position.set(this.#position.x, this.#position.y, this.#position.z);
            displayCard.name = "ShopCardDisplay_" + this.#slot.toString();
            this.#hitbox = displayCard;
            this._parent._parent.scene.add(displayCard);

            const displayedCard = new THREE.Mesh(new THREE.PlaneGeometry(5,8.5));
            displayedCard.rotation.setFromVector3(new THREE.Vector3( -Math.PI / 2 , -Math.PI / 5, -Math.PI / 2));
            displayedCard.position.set(this.#position.x-0.2, this.#position.y, this.#position.z);
            displayedCard.name = "ShopCard_" + this.#slot.toString();
            this.#cardBox = displayedCard;
            this._parent._parent.scene.add(displayedCard);

            let font = new FontLoader().parse(GwentFont);

            if (this.#modifier != 0) {
                const textModifierGeometry = new TextGeometry(
                    this.#modifier > 0 ? "+" + this.#modifier.toString() : this.#modifier.toString(),
                    {
                        font:font,
                        size:2,
                        height:0.1,
                        depth: 0.1,
                    }
                )
                const textModifierMaterial = new THREE.MeshBasicMaterial()
                const textModifier = new THREE.Mesh(textModifierGeometry, textModifierMaterial)
                textModifier.position.set(this.#position.x+5, this.#position.y+2.85, this.#position.z-1);
                textModifier.rotation.setFromVector3(new THREE.Vector3( -Math.PI / 2 , 0, -Math.PI / 2));
                this._parent._parent.scene.add(textModifier);
            }

            const textCostGeometry = new TextGeometry(
                "-",
                {
                    font:font,
                    size:2,
                    height:0.1,
                    depth: 0.1,
                }
            )
            const textCostMaterial = new THREE.MeshBasicMaterial()
            const textCost = new THREE.Mesh(textCostGeometry, textCostMaterial)
            textCost.position.set(this.#position.x-4, this.#position.y-5, this.#position.z-0.5);
            textCost.rotation.setFromVector3(new THREE.Vector3( -Math.PI / 2 , -Math.PI / 2, -Math.PI / 2));
            this.#costBox = textCost;
            this._parent._parent.scene.add(textCost);
        }

        /**
         * Update the card in the slot
         * @param {card.Card} newCard 
         */
        UpdateSlot(newCard) {
            this.#card = newCard;
            try {
                let texture = new THREE.TextureLoader().load(newCard.imagePath);
                this.#cardBox.material = new THREE.MeshBasicMaterial( { map: texture});
            } catch(error) {
                this.#cardBox.material = new THREE.MeshBasicMaterial();
                this.#cardBox.material.color = new THREE.Color('black');
            }
            let font = new FontLoader().parse(GwentFont);
            this.#costBox.geometry = new TextGeometry(
                Math.max(0, this.#card.cost + this.#modifier).toString(),
                {
                    font:font,
                    size:2,
                    height:0.1,
                    depth: 0.1,
                }
            )
            this.#cardBox.name = this.#cardBox.name + "_" + Math.max(0, this.#card.cost + this.#modifier).toString()
            this.#hitbox.name = this.#hitbox.name + "_" + Math.max(0, this.#card.cost + this.#modifier).toString()
        }

        #SelectSlot(msg) {
            if (msg.slot == this.#slot) {
                this.#hitbox.material = new THREE.MeshBasicMaterial({color: 'black', transparent: true, opacity: 0.8});
            } else {
                this.#hitbox.material = new THREE.MeshBasicMaterial({color: 'black', transparent: true, opacity: 0.2});
            }
        }

        get position() {
            return this.#position;
        }

        get hitbox() {
            return this.#hitbox;
        }

        get card() {
            return this.#card;
        }
    }

    return {
        CardShopSlot : CardShopSlot
    }
})();