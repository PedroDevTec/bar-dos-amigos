// src/middlewares/authMiddleware.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
  auth?: any;  // Você pode definir um tipo mais específico se souber a estrutura do usuário
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.cookies?.auth; // Assumindo que o token JWT está armazenado em um cookie chamado 'token'

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded; // Adiciona o usuário decodificado ao objeto de request
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized, invalid token' });
  }
};
