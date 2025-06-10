'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Loader2, AlertCircle, ArrowLeft, Plus } from 'lucide-react';

export default function ListaLivros() {
  const [books, setBooks] = useState<Livro[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const data = await api.listarLivros();
        setBooks(data as Livro[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        className="text-blue-600"
      >
        <Loader2 size={48} className="animate-spin" />
      </motion.div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="max-w-md p-6 bg-red-50 rounded-xl shadow-lg border border-red-100"
      >
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="text-red-600" size={32} />
          <h2 className="text-xl font-bold text-red-800">Erro ao carregar</h2>
        </div>
        <p className="text-red-700">{error}</p>
        <Link href="/" className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors">
          <ArrowLeft className="mr-1" size={16} />
          Voltar para o início
        </Link>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <motion.div 
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
            >
              <BookOpen className="text-indigo-600" size={32} />
            </motion.div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Biblioteca Digital
            </h1>
          </div>
          <Link
            href="/"
            className="flex items-center gap-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Plus size={16} />
            Novo Livro
          </Link>
        </div>

        <AnimatePresence>
          {books.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-8 text-center bg-white rounded-xl shadow-sm border border-gray-200"
            >
              <p className="text-gray-500 text-lg">Nenhum livro cadastrado ainda.</p>
              <Link 
                href="/" 
                className="mt-4 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                <Plus className="mr-2" size={16} />
                Cadastrar primeiro livro
              </Link>
            </motion.div>
          ) : (
            <motion.ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {books.map((book, index) => (
                <motion.li
                  key={book.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg"
                >
                  <Link href={`/livros/${book.id}`} className="block h-full p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-gray-800 truncate">{book.title}</h3>
                      <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                        {book.year}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-gray-600">
                      <p className="flex items-center gap-2">
                        <span className="font-medium">Autor:</span>
                        <span className="text-gray-800">{book.author}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="font-medium">Gênero:</span>
                        <span className="text-gray-800">{book.genre}</span>
                      </p>
                    </div>
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Adicione isso no mesmo arquivo ou em um arquivo de tipos
interface Livro {
  id: number;
  title: string;
  author: string;
  year: string;
  genre: string;
}