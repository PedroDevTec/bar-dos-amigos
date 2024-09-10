'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';  // Importando o signIn de NextAuth
import { useRouter } from 'next/navigation'; // Importe o useRouter para redirecionar
import styles from './page.module.css';
import Modal from '../components/modal'; // Certifique-se de que o caminho está correto

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter(); // useRouter hook para redirecionar o usuário

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); 

    const result = await signIn('credentials', {
      email,
      password,
      callbackUrl: '/home'
    });
  };

  // Função para login com Discord
  const handleDiscordLogin = () => {
    signIn('discord',{callbackUrl:'/home'}); // Isso redireciona o usuário para o login do Discord
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Welcome to Our Platform!</h1>
        <p className={styles.subtitle}>Your journey to the future starts here.</p>
        <button className={styles.loginButton} onClick={openModal}>
          Login to Get Started
        </button>
      </div>

      {isModalOpen && (
        <Modal onClose={closeModal}>
          <form className={styles.loginForm} onSubmit={handleLogin}>
            <h2 className={styles.formTitle}>Login</h2>

            {/* Exibe mensagem de erro, se houver */}
            {errorMessage && <p className={styles.error}>{errorMessage}</p>}

            {/* Campos para login com credenciais */}
            <input
              type="text"
              placeholder="Username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              required
            />

            <button type="submit" className={styles.submitButton}>
              Submit
            </button>

            {/* Botão para login com Discord */}
            <button  type="button" formTarget='_blank' onClick={handleDiscordLogin} className={styles.discordButton}>
              Login with Discord
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
