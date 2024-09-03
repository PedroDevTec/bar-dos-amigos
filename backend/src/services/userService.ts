// src/services/userService.ts

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Função para registrar um novo usuário
export const registerUser = async (name: string, email: string, password: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  return user;
};

// Função para autenticar um usuário
export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign(
    { userId: user.id, isAdmin: user.adminPermission },
    process.env.JWT_SECRET as string,
    { expiresIn: '1h' }
  );

  return { user, token };
};

// Função para obter todos os usuários
export const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      name: true,
      email: true,
      createdAt: true,
      accessRoot: true,
      adminPermission: true,
    },
  });

  return users;
};
