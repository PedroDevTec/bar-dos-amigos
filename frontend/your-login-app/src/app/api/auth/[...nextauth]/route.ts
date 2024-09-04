import NextAuth from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";
import DiscordProvider from "next-auth/providers/discord";
import * as jwt from "jsonwebtoken"
import { resolve } from 'path';
import { redirect } from 'next/dist/server/api-utils';

export const nextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const response = await fetch("http://localhost:3002/api/users/login", {
          method: "POST",
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" }
        });
        const {user} = await response.json();
        console.log(user)
        if (response.ok && user) {
          return user;
        }

        return null;
      }
    }),
      DiscordProvider({
        clientId: process.env.DISCORD_CLIENT_ID,
        clientSecret: process.env.DISCORD_CLIENT_SECRET
      })
    ]
  ,
  pages: {
    signIn: '/login',  // Página customizada de login
    error: '/login',    // Página customizada de erro
  },
  callbacks: {
    async jwt({ token, user }) {
      console.log(token, user, "Passou no jwt")
      // Adiciona o usuário ao token durante a autenticação inicial
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      console.log(session, token, "passou no session")
      // Adiciona informações adicionais à sessão
      session.user.id = token.id;
      return session;
    }
  }

};
const handler = NextAuth(nextAuthOptions)
export { handler as GET, handler as POST }

