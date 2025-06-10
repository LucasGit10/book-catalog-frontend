'use client';

import { useState } from 'react';
import { CheckIcon, Cross2Icon } from '@radix-ui/react-icons';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function BookForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    year: '',
    genre: '',
  });
  const [status, setStatus] = useState<{ success: boolean; error: string | null }>({ 
    success: false, 
    error: null 
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (status.error) setStatus({ success: false, error: null });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.criarLivro(formData);
      setStatus({ success: true, error: null });
      setFormData({ title: '', author: '', year: '', genre: '' });
      setTimeout(() => {
        router.push('/livros');
      }, 1500);
    } catch (error) {
      setStatus({ success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' });
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto bg-white/90 backdrop-blur-sm shadow-xl rounded-3xl p-8 space-y-6 relative overflow-hidden"
    >
      <motion.h2 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 pb-2">
        <span className="inline-block animate-float">📘</span> Novo Livro
      </motion.h2>

      <AnimatePresence>
        {status.error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 bg-red-50 text-red-800 p-4 rounded-xl border border-red-200"
          >
            <Cross2Icon className="text-red-600" />
            <span>{status.error}</span>
          </motion.div>
        )}

        {status.success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 bg-emerald-50 text-emerald-800 p-4 rounded-xl border border-emerald-200"
          >
            <CheckIcon className="text-emerald-600" />
            <span>Livro cadastrado com sucesso!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {['title', 'author', 'year', 'genre'].map((field, index) => (
        <motion.div 
          key={field}
          transition={{ delay: index * 0.1 }}
        >
          <label className="block text-sm font-medium text-gray-600 mb-1">
            {{
              title: 'Título',
              author: 'Autor',
              year: 'Ano',
              genre: 'Gênero'
            }[field]}
          </label>
          <input
            name={field}
            value={formData[field as keyof typeof formData]}
            onChange={handleChange}
            required
            className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 bg-white/70 shadow-sm transition-all duration-200 text-gray-800 placeholder-gray-400"
            placeholder={{
              title: 'Dom Casmurro',
              author: 'Machado de Assis',
              year: '1899',
              genre: 'Romance'
            }[field]}
          />
        </motion.div>
      ))}

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium py-4 rounded-xl transition-all duration-300 shadow-lg"
      >
        Cadastrar Livro
      </motion.button>
    </motion.form>
  );
}