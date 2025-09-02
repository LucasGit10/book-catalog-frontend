'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Loader2, AlertCircle, ArrowLeft, Plus, X, Pencil, Trash } from 'lucide-react';
import BookForm from '@/components/BookForm';

interface Livro {
  id: number;
  title: string;
  author: string;
  year: string;
  genre: string;
}

export default function ListaLivros() {
  const router = useRouter();

  const [books, setBooks] = useState<Livro[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editBook, setEditBook] = useState<Livro | null>(null);
  const [editMode, setEditMode] = useState(false);

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

  // Atualiza lista após criar ou editar
  const refreshBooks = async () => {
    setLoading(true);
    try {
      const data = await api.listarLivros();
      setBooks(data as Livro[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  // Callback após criar livro
  const handleNewBookSuccess = () => {
    setShowForm(false);
    setEditBook(null);
    refreshBooks();
  };

  // Callback após editar livro
  const handleEditBookSuccess = () => {
    setShowForm(false);
    setEditBook(null);
    refreshBooks();
  };

  const handleEditClick = (book: Livro) => {
    setEditBook(book);
    setShowForm(true);
  };

  const toggleEditMode = () => {
    setEditMode(prev => !prev);
  };

  const handleDeleteClick = async (book: Livro) => {
    if (confirm(`Tem certeza que deseja deletar o livro "${book.title}"?`)) {
      try {
        await api.removerLivro(book.id);
        refreshBooks();
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Erro ao deletar');
      }
    }
  };

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
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeft className="mr-1" size={16} />
          Tentar novamente
        </button>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6 relative">
      <div className="max-w-7xl mx-auto">
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

          <div className="flex gap-3">
            <button
              onClick={toggleEditMode}
              className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
            >
              {editMode ? 'Cancelar Edição' : 'Editar Livros'}
            </button>

            <button
              onClick={() => {
                setEditBook(null);
                setShowForm(true);
              }}
              className="flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg"
            >
              <Plus size={18} />
              <span>Adicionar Livro</span>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowForm(false)}
            >
              <motion.div
                initial={{ y: 20, scale: 0.98 }}
                animate={{ y: 0, scale: 1 }}
                exit={{ y: 20, opacity: 0 }}
                className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setShowForm(false)}
                  className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Fechar"
                >
                  <X className="h-6 w-6 text-gray-500" />
                </button>

                <BookForm
                  onSuccess={editBook ? handleEditBookSuccess : handleNewBookSuccess}
                  bookToEdit={editBook ? { ...editBook, description: (editBook.description || '') } : null}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {books.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-8 text-center bg-white rounded-xl shadow-sm border border-gray-200"
            >
              <p className="text-gray-500 text-lg">Nenhum livro cadastrado ainda.</p>
              <button
                onClick={() => {
                  setEditBook(null);
                  setShowForm(true);
                }}
                className="mt-4 inline-flex items-center px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="mr-2" size={16} />
                Adicionar primeiro livro
              </button>
            </motion.div>
          ) : (
            <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {books.map((book, index) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => router.push(`/livros/${book.id}`)}
                >
                  <div className="h-48 bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center">
                    <BookOpen className="text-indigo-400" size={48} />
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-bold text-gray-800 line-clamp-2">{book.title}</h3>
                      <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full whitespace-nowrap">
                        {book.year}
                      </span>
                    </div>

                    <div className="space-y-2 text-gray-600">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Autor</p>
                        <p className="text-gray-800 line-clamp-1">{book.author}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Gênero</p>
                        <p className="text-gray-800">{book.genre}</p>
                      </div>
                    </div>

                    {editMode && (
                      <div className="flex justify-end gap-2 mt-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditClick(book);
                          }}
                          className="text-indigo-600 hover:text-indigo-800 transition-colors"
                          aria-label="Editar livro"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(book);
                          }}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          aria-label="Deletar livro"
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
