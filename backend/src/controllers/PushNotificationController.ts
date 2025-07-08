import { Request, Response } from "express";

import AppError from "../errors/AppError";

import { verify } from "jsonwebtoken";



export const saveSubscription = async (req: Request, res: Response): Promise<Response> => {

  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    const decoded = verify(token, process.env.JWT_SECRET);

    console.log("JWT decodificado");
    console.log(decoded);

    const subscriptionData = JSON.parse(req.body.data);
    console.log(subscriptionData);
  } catch (error) {

  }

  return res.status(200);
};




