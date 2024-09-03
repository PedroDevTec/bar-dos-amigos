import passport from 'passport';
import { Strategy as DiscordStrategy } from 'passport-discord';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Configuração da estratégia Discord
passport.use(
  new DiscordStrategy(
    {
      clientID: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      callbackURL: process.env.DISCORD_REDIRECT_URI!,
      scope: ['identify', 'email'], // Inclua 'email' para solicitar a permissão
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Verifica se o e-mail está presente
        if (!profile.email) {
          console.warn('O Discord não forneceu um e-mail para este usuário.');
          return done(null, false, { message: 'O Discord não forneceu um e-mail.' });
        }

        let user = await prisma.user.findUnique({
          where: { discordId: profile.id },
        });

        if (!user) {
          // Verifica se o usuário existe no banco de dados pelo email
          const existingUserByEmail = await prisma.user.findUnique({
            where: { email: profile.email },
          });

          if (existingUserByEmail) {
            return done(null, false, { message: 'Um usuário com este e-mail já existe.' });
          }

          // Se o usuário não existe, cria um novo usuário
          user = await prisma.user.create({
            data: {
              name: profile.username,
              email: profile.email,
              password: '',
              discordId: profile.id,
              discordAvatar: profile.avatar,
              accessRoot: false,
              adminPermission: false,
            },
          });
        } else {
          // Atualiza o usuário existente
          user = await prisma.user.update({
            where: { discordId: profile.id },
            data: {
              name: profile.username,
              email: profile.email,
              discordAvatar: profile.avatar,
            },
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Configuração de Serialização e Desserialização do Passport

passport.serializeUser((user, done) => {
  // Serializa o usuário pelo ID do banco de dados
  done(null, (user as any).id);
});

passport.deserializeUser(async (id, done) => {
  try {
    // Encontra o usuário no banco de dados pelo ID serializado
    const user = await prisma.user.findUnique({ where: { id: Number(id) } });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
