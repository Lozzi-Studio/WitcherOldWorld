import { entity } from "../Interfaces/entity";
import { notifaction_manager} from "./notification-manager"


export const notification_entity = (() => {

    class NotificationEntity extends entity.Entity{

        /**
         * A wrapper for notifications; has global access to broadcasts
         */
        constructor(){
            super();
        }

         /**
         * Used to intialize and add any default components/events
         */
        InitComponents() {
            this.AddComponent(new notifaction_manager.NotificationManager());
        }
    }

    return {
        NotificationEntity : NotificationEntity
    }
})();