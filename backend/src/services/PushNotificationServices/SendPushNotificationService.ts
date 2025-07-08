import webpush from "web-push";
import UserPushSubscription from "../../models/UserPushSubscription";

const vapidPublic = "BJZXTIvGada8sUzE0mrLGh09_W8vTqpx_MtmoRcDiTVpW84awh2Fvx1N8OmX1BXDr9X5X3K5rtEKq7EApGsjpHc"
const vapidPrivate= "v6n85CiIysGN_HpW3h73pPaDoPUq6Lq7kzU5b3R2y0k"
webpush.setVapidDetails(
  "mailto:triplechat@tripleplay.network",
  vapidPublic,
  vapidPrivate
);


interface NotificationPayload {
  title: string;
  body: string;
  url?: string;
}

export const sendPushNotification = async (
  userId: number,
  companyId: number,
  payload: NotificationPayload
): Promise<void> => {
  const subscriptions = await UserPushSubscription.findAll({ where: { userId, companyId } });

  for (const sub of subscriptions) {
    const pushSubscription = {
      endpoint: sub.endpoint,
      expirationTime: sub.expirationTime,
      keys: {
        p256dh: sub.keys_p256dh,
        auth: sub.keys_auth,
      },
    };

    try {
      await webpush.sendNotification(
        pushSubscription,
        JSON.stringify(payload)
      );
    } catch (err) {
      console.error("Erro ao enviar push:", err);
    }
  }
};
