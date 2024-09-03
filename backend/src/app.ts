import express from 'express';
import session from 'express-session';
import passport from './middlewares/passaport';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { authMiddleware } from './middlewares/authenticate';

const app = express();
 app.use(cors({
  origin: 'http://localhost:3000', // Permitir solicitações do domínio da sua aplicação Next.js
  methods: ['GET', 'POST'], // Permitir métodos específicos, conforme necessário
  allowedHeaders: ['Content-Type'], // Permitir cabeçalhos específicos
 }))
app.use(express.json());

app.use(
  session({
    secret: "process.env.DISCORD_SECRET",
    resave: false,
    saveUninitialized: false,
  })
);

app.use('/api/auth', authRoutes);
app.use('/api/users', authMiddleware ,userRoutes);

app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());


export default app;
