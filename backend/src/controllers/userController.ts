// src/controllers/userController.ts

import { Request, Response } from 'express';
import { registerUser, loginUser, getAllUsers } from '../services/userService';

// Handler para registro de usuário
export const registerUserHandler = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    const user = await registerUser(name, email, password);
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'User already exists' });
  }
};

// Handler para login de usuário
export const loginUserHandler = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const { user, token } = await loginUser(email, password);
    res.status(200).json({ token });
  } catch (error) {
    res.status(401).json({ error: 'Invalid credentials' });
  }
};

// Handler para obter todos os usuários
export const getAllUsersHandler = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};
