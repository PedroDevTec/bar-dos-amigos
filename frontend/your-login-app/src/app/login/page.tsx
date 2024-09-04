'use client';

import { useState } from 'react';
import Head from 'next/head';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { data: session } = useSession();

  // Redireciona o usuário se já estiver logado
  if (session) {
    router.push('/home');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    setIsLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      // Redireciona para a página desejada após login
      router.push('/dashboard');
    }
  };

  const handleDiscordLogin = () => {
    signIn('discord');
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Login | Bar dos Amigos Online</title>
        <meta name="description" content="Login no Bar dos Amigos Online" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <h1 className={styles.title}>Bar dos Amigos Online</h1>
          <p className={styles.subtitle}>Entre para o melhor happy hour virtual!</p>
          
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input className={styles.input}
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Digite seu email"
              aria-label="Email"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Senha</label>
            <input className={styles.input}
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Digite sua senha"
              aria-label="Password"
            />
          </div>

          <button type="submit" className={styles.submitButton} disabled={isLoading}>
            {isLoading ? 'Entrando...' : 'Login'}
          </button>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.discordLogin}>
            <button type="button" onClick={handleDiscordLogin} className={styles.discordButton}>
              Entrar com Discord
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
