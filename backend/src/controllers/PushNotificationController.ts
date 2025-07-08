import { Request, Response } from "express";

import AppError from "../errors/AppError";

import { verify } from "jsonwebtoken";
import UserPushSubscription from "../models/UserPushSubscription"; // ajuste o caminho conforme seu projeto

export const saveSubscription = async (req: Request, res: Response): Promise<Response> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    const decoded: any = verify(token, process.env.JWT_SECRET);
    const { id: userId, companyId } = decoded;

    const subscriptionData = JSON.parse(req.body.data);
    const { p256dh, auth } = subscriptionData.keys;

    const [subscription, created] = await UserPushSubscription.findOrCreate({
      where: {
        userId,
        companyId,
        endpoint: subscriptionData.endpoint
      },
      defaults: {
        expirationTime: subscriptionData.expirationTime,
        keys_p256dh: p256dh,
        keys_auth: auth
      }
    });

    if (!created) {
      // já existia — podemos atualizar
      await subscription.update({
        keys: subscriptionData.keys,
        expirationTime: subscriptionData.expirationTime
      });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Erro ao salvar subscription:", error);
    return res.status(500).json({ error: "Erro ao salvar subscription" });
  }
};



