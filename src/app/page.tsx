'use client';

import Head from 'next/head';
import Link from 'next/link';
import type { NextPage } from 'next';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

// Predefined positions and sizes for bubbles to avoid hydration mismatch
const BUBBLES = [
  { size: 55, left: 75, top: 97 },
  { size: 46, left: 22, top: 56 },
  { size: 70, left: 17, top: 49 },
  { size: 65, left: 42, top: 85 },
  { size: 50, left: 25, top: 24 },
  { size: 46, left: 37, top: 63 },
  { size: 42, left: 81, top: 26 },
  { size: 56, left: 96, top: 44 },
  { size: 28, left: 77, top: 46 },
  { size: 66, left: 27, top: 65 }
];

const Home: NextPage = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const floatingVariants = {
    initial: { y: 20, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: { 
        duration: 0.6,
        ease: "easeOut"
      }
    },
    hover: {
      y: -5,
      transition: { duration: 0.3 }
    }
  };

  const pulseVariants = {
    initial: { scale: 1 },
    animate: { 
      scale: [1, 1.02, 1],
      transition: { 
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    hover: {
      scale: 1.05,
      boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.4)"
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 flex flex-col items-center justify-center p-4 overflow-hidden relative">
      <Head>
        <title>BookHub - Bem-vindo</title>
        <meta name="description" content="Sistema de cadastro e avaliação de livros" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Bolhas animadas de fundo com posições fixas */}
      <div className="fixed inset-0 w-full h-full pointer-events-none">
        {BUBBLES.map((bubble, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-indigo-200 opacity-20"
            style={{
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              left: `${bubble.left}%`,
              top: `${bubble.top}%`,
            }}
            animate={{
              y: [0, -100, -200],
              x: [0, Math.random() * 100 - 50, 0],
              opacity: [0.2, 0.5, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>

      <main className="text-center max-w-md w-full relative z-10">
        <motion.h1 
          className="text-5xl font-bold text-indigo-900 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Bem-vindo ao <span className="block mt-2">BookHub</span>
        </motion.h1>
        
        <motion.p 
          className="text-xl text-gray-700 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Seu sistema completo para cadastro e avaliação de livros
        </motion.p>

        <motion.div
          className="flex justify-center"
          variants={floatingVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
        >
          <Link
            href="/livros"
            className="relative overflow-hidden"
          >
            <motion.div
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 px-8 rounded-xl transition duration-300 shadow-lg"
              variants={pulseVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
            >
              <span className="relative z-10">Acessar Lista de Livros</span>
              <motion.span 
                className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-purple-700 opacity-0"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          </Link>
        </motion.div>

        {/* Ícones de livros flutuantes - renderizados apenas no client */}
        {isMounted && (
          <div className="mt-16 flex justify-center space-x-8">
            {['📚', '📖', '✨'].map((icon, i) => (
              <motion.div
                key={i}
                className="text-4xl"
                animate={{
                  y: [0, -15, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{
                  duration: 4 + i,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {icon}
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <motion.footer 
        className="mt-16 text-gray-600 text-sm relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        © {new Date().getFullYear()} BookHub - Todos os direitos reservados
      </motion.footer>
    </div>
  );
};

export default Home;