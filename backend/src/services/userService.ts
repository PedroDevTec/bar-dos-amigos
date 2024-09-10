import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

let adminUser: { id: string, name: string, email: string, password: string, adminPermission: boolean } | null = null;

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

// Função para autenticar um usuário (incluindo admin em memória)
export const loginUser = async (email: string, password: string) => {
  let user;
  
  // Verifica se o email é do admin configurado no .env
  if (email === process.env.ADMIN_EMAIL) {
    // Se o adminUser ainda não foi criado, cria-o em memória
    if (!adminUser) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD as string, 10);
      adminUser = {
        id: 'admin',
        name: process.env.ADMIN_NAME as string,
        email: process.env.ADMIN_EMAIL as string,
        password: hashedPassword,
        adminPermission: true,
      };
    }
    user = adminUser;
  } else {
    // Caso contrário, procura no banco de dados
    user = await prisma.user.findUnique({
      where: { email },
    });
  }

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

// Função para criar o admin em memória na inicialização do servidor
export const initializeAdminUser = async () => {
  if (!adminUser) {
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD as string, 10);
    adminUser = {
      id: 'admin',
      name: process.env.ADMIN_NAME as string,
      email: process.env.ADMIN_EMAIL as string,
      password: hashedPassword,
      adminPermission: true,
    };
    console.log("Admin user initialized in memory");
  }
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
