'use client';

import { useEffect, useState } from 'react';
import { CheckIcon, Cross2Icon, Pencil2Icon, PlusIcon } from '@radix-ui/react-icons';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { BookOpen } from 'lucide-react';

interface BookFormProps {
  onSuccess?: () => void;
  bookToEdit?: FormDataWithId | null;
}

interface FormData {
  title: string;
  author: string;
  year: string;
  genre: string;
  description: string;
}

interface FormDataWithId extends FormData {
  id: number;
}

export default function BookForm({ onSuccess, bookToEdit }: BookFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    title: '',
    author: '',
    year: '',
    genre: '',
    description: ''
  });

  const [status, setStatus] = useState<{
    success: boolean;
    error: string | null;
    loading: boolean;
  }>({
    success: false,
    error: null,
    loading: false
  });

  // Preenche form quando bookToEdit mudar (modo edição)
  useEffect(() => {
    if (bookToEdit) {
      const { title, author, year, genre, description } = bookToEdit;
      setFormData({ title, author, year, genre, description });
    } else {
      // Limpa form quando não estiver editando
      setFormData({ title: '', author: '', year: '', genre: '', description: '' });
    }
  }, [bookToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (status.error) setStatus(prev => ({ ...prev, error: null }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ success: false, error: null, loading: true });

    try {
      if (bookToEdit) {
        // Chamar API para atualizar livro (não obter)
        await api.editarLivro(bookToEdit.id, formData);
      } else {
        await api.criarLivro(formData);
      }

      setStatus({ success: true, error: null, loading: false });

      if (!bookToEdit) {
        // Limpa o form só se for cadastro (evita apagar em edição)
        setFormData({ title: '', author: '', year: '', genre: '', description: '' });
      }

      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/livros');
        }
      }, 1500);
    } catch (error) {
      setStatus({
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao salvar livro',
        loading: false
      });
    }
  };

  const isEditing = !!bookToEdit;

  return (
    <div className="p-6">
      <div className="flex items-center justify-center mb-6">
        <div className="p-4 bg-indigo-100 rounded-full">
          <BookOpen className="h-8 w-8 text-indigo-600" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        {isEditing ? 'Editar Livro' : 'Adicionar Novo Livro'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {status.error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 bg-red-50 text-red-800 p-4 rounded-lg border border-red-200"
          >
            <Cross2Icon className="h-5 w-5 mt-0.5 text-red-600 flex-shrink-0" />
            <span>{status.error}</span>
          </motion.div>
        )}

        {status.success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 bg-emerald-50 text-emerald-800 p-4 rounded-lg border border-emerald-200"
          >
            <CheckIcon className="h-5 w-5 mt-0.5 text-emerald-600 flex-shrink-0" />
            <span>{isEditing ? 'Livro atualizado com sucesso!' : 'Livro cadastrado com sucesso!'}</span>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: 'title', label: 'Título', placeholder: 'Dom Casmurro', type: 'text' },
            { name: 'author', label: 'Autor', placeholder: 'Machado de Assis', type: 'text' },
            { name: 'year', label: 'Ano de Publicação', placeholder: '1899', type: 'number' },
            { name: 'genre', label: 'Gênero', placeholder: 'Romance', type: 'text' }
          ].map((field) => (
            <div key={field.name} className="space-y-1">
              <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                {field.label}
              </label>
              <input
                id={field.name}
                name={field.name}
                type={field.type}
                value={formData[field.name as keyof FormData]}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-gray-400 bg-white text-gray-800 placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition-all"
                placeholder={field.placeholder}
              />
            </div>
          ))}
        </div>

        <div className="space-y-1">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Descrição (Opcional)
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2.5 border border-gray-400 bg-white text-gray-800 placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition-all"
            placeholder="Uma breve descrição sobre o livro..."
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={status.loading || status.success}
          className="mt-6 w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-medium py-3.5 rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {status.loading ? (
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="h-5 w-5 border-2 border-white border-t-transparent rounded-full"
            />
          ) : isEditing ? (
            <>
              <Pencil2Icon className="h-5 w-5" />
              <span>Salvar Alterações</span>
            </>
          ) : (
            <>
              <PlusIcon className="h-5 w-5" />
              <span>Cadastrar Livro</span>
            </>
          )}
        </motion.button>
      </form>
    </div>
  );
}
