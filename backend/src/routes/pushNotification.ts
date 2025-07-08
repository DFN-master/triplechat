import { Router } from "express";
import isAuth from "../middleware/isAuth";

import * as PushNotificationControllerController from "../controllers/PushNotificationController";

const pushNotificationRoutes =  Router();

// Rota para inscrição no push notifcation.
pushNotificationRoutes.post("/pushnotification/save-subscription", isAuth, PushNotificationControllerController.saveSubscription);

export default pushNotificationRoutes;
