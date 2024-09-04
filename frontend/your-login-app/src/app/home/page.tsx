"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import styles from './page.module.css';

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.welcome}>Bem-vindo ao Bar dos Amigos, {session.user.name}!</h1>
        <div className={styles.profileContainer}>
          <Image
            src={session.user.image}
            width={150}
            height={150}
            alt="Foto do usuário"
            className={styles.profileImage}
          />
        </div>
      </div>

      <div className={styles.sections}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Lista de Eventos</h2>
          <ul className={styles.list}>
            <li>Evento 1 - 25/09/2024</li>
            <li>Evento 2 - 30/09/2024</li>
            <li>Evento 3 - 05/10/2024</li>
          </ul>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Usuários Online</h2>
          <ul className={styles.list}>
            <li>Ana</li>
            <li>Carlos</li>
            <li>Beatriz</li>
          </ul>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Ferramentas</h2>
          <ul className={styles.list}>
            <li>Gerenciamento de Grupos</li>
            <li>Configurações de Conta</li>
            <li>Suporte</li>
          </ul>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Área do Perfil</h2>
          <p>Nome: {session.user.name}</p>
          <p>Email: {session.user.email}</p>
          <p>Membro desde: Janeiro de 2024</p>
        </div>
      </div>
    </div>
  );
}
