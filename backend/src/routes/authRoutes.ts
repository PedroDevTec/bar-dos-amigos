import { Router } from 'express';
import passport from 'passport';

const router = Router();

// Iniciar a autenticação com o Discord
router.get('/discord', passport.authenticate('discord'));

// Callback após autenticação
router.get(
  '/discord/callback',
  passport.authenticate('discord', {
    failureRedirect: '/login',
    session: true,
  }),
  (req, res) => {
    // Sucesso, redireciona para onde desejar
    res.redirect('/dashboard');
  }
);

export default router;
