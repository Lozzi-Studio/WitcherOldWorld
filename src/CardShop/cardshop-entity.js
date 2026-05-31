import { Vector3 } from "three";
import { entity } from "../Interfaces/entity";
import { cardshop_slot } from "./carshop-slot";
import { broadcasts } from "../Interfaces/broadcasts";
import { cards } from "../Cards/card-templates";
import { carddeck_component } from "../Cards/carddeck";
import { cardshop_manager } from "./cardshop-manager";


export const cardshop_entity = (() => {

    class Cardshop extends entity.Entity {

        /**
         * a wrapper for cardshop
         */
        constructor() {
            super();
        }

        /**
         * Used to intialize and add any default components/events
         */
        InitComponents() {
            this.AddComponent(new cardshop_slot.CardShopSlot(new Vector3(33, 5.1, -12), 1, 1), "CardshopSlot_1");
            this.AddComponent(new cardshop_slot.CardShopSlot(new Vector3(33, 5.1, -6), 1, 2), "CardshopSlot_2");
            this.AddComponent(new cardshop_slot.CardShopSlot(new Vector3(33, 5.1, 0), 0, 3), "CardshopSlot_3");
            this.AddComponent(new cardshop_slot.CardShopSlot(new Vector3(33, 5.1, 6), 0, 4), "CardshopSlot_4");
            this.AddComponent(new cardshop_slot.CardShopSlot(new Vector3(33, 5.1, 12), -1, 5), "CardshopSlot_5");
            this.AddComponent(new carddeck_component.Carddeck(5));
            this.Broadcast(broadcasts.BroadcastTemplateCards.LoadCarddeck("Shop"));
            this.AddComponent(new cardshop_manager.CardshopManager());
            this.FindEntity("Camera").Broadcast(broadcasts.BroadcastTemplateCamera.FocusOn(this.FindComponent("CardshopSlot_3").hitbox));
        }
    }

    return {
        Cardshop : Cardshop
    }
}) ();