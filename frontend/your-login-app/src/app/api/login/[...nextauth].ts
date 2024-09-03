// src/app/api/auth/[...nextauth].ts

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "example@example.com" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email }
        });

        if (user && credentials?.password) {
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
          
          if (isPasswordValid) {
            return user; // Retorne o usuário se a autenticação for bem-sucedida
          }
        }

        return null; // Retorne null se a autenticação falhar
      }
    })
  ],
  pages: {
    signIn: "/login",  // Define a rota de login personalizada (opcional)
    signOut: "/auth/signout", // Define a rota de logout (opcional)
    error: "/auth/error", // Define a rota de erro de autenticação (opcional)
  },
  callbacks: {
    async session({ session, token, user }) {
      // Adiciona informações personalizadas ao objeto de sessão
      if (user) {
        session.user.email = user.id;
      }
      return session;
    },
    async jwt({ token, user }) {
      // Adiciona informações personalizadas ao token JWT
      if (user) {
        token.id = user.id;
      }
      return token;
    }
  },
  secret: process.env.e, // Certifique-se de definir isso em suas variáveis de ambiente
});
