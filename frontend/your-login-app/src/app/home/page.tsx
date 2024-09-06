"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import styles from './page.module.css';
import React from 'react';
import { User, Beer, Activity, MessageSquare, ChevronDown, LogOut, Menu, Settings } from 'lucide-react';


export default function Home() {
  const { data: session } = useSession();

  return (
    <div className={styles.container}>
    <header className={styles.header}>
      <h1 className={styles.headerTitle}>Bar Online</h1>
      <nav className={styles.navBar}>
        <a href="#" className={styles.navItem}><Beer size={20} /></a>
        <a href="#" className={styles.navItem}><Activity size={20} /></a>
        <div className={styles.dropdown}>
          <a href="#" className={styles.navItem}><Menu size={20} /></a>
          <div className={styles.dropdownContent}>
            <a href="#" className={styles.dropdownItem}><Settings size={16} /> Configurações</a>
            <a href="#" className={styles.dropdownItem}><LogOut size={16} /> Sair</a>
          </div>
        </div>
      </nav>
    </header>
    
    <main className={styles.main}>
      <div className={styles.grid}>
        {/* Perfil */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Perfil</h2>
          <div className={styles.profileInfo}>
            <Image
            src={session.user.image}
            width={150}
            height={150}
            alt="Foto do usuário"
            className={styles.profilePic}
          />
            <div>
              <p className={styles.username}>{session.user.name}</p>
              <p className={styles.userHandle}>@{session.user.name}</p>
            </div>
          </div>
        </div>
        
        {/* Lista de Servidores */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Servidores</h2>
          <ul className={styles.list}>
            {[1, 2, 3].map((server) => (
              <li key={server} className={styles.listItem}>
                <Beer size={24} />
                <span>Servidor {server}</span>
              </li>
            ))}
          </ul>
          <button className={styles.button}>
            Ver mais <ChevronDown size={16} />
          </button>
        </div>
        
        {/* Área de Atividade */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Atividade</h2>
          <ul className={styles.list}>
            {[1, 2, 3].map((activity) => (
              <li key={activity} className={styles.listItem}>
                <Activity size={24} />
                <span>Atividade {activity}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Área de Posts e Usuários Online */}
      <div className={styles.contentSection}>
        {/* Área de Posts */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Posts</h2>
          <div>
            {[1, 2, 3].map((post) => (
              <div key={post} className={styles.post}>
                <div className={styles.postHeader}>
                  <User size={24} />
                  <span className={styles.username}>Usuário {post}</span>
                </div>
                <p className={styles.postContent}>Conteúdo do post {post}...</p>
                <div className={styles.postFooter}>
                  <MessageSquare size={16} />
                  <span>5 comentários</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Área de Usuários Online */}
        <div className={styles.onlineUsers}>
          <h2 className={styles.cardTitle}>Usuários Online</h2>
          <ul className={styles.list}>
            {[1, 2, 3, 4, 5].map((user) => (
              <li key={user} className={styles.onlineUser}>
                <div className={styles.onlineIndicator}></div>
                <User size={24} />
                <span>Usuário {user}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  </div>
  );
}
