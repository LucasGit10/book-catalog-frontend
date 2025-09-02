'use client';

import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ArrowLeft, BookOpen, Loader2, MessageSquare, Calendar } from 'lucide-react';

interface Review {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
}

interface Livro {
  id: number;
  title: string;
  author: string;
  year: string;
  genre: string;
  description?: string;
  reviews?: Review[];
}

export default function DetalheDoLivro() {
  const params = useParams();
  const id = Number(params?.id);

  const [book, setBook] = useState<Livro | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isNaN(id) || id < 0) {
      notFound();
      return;
    }

    api.obterLivro(id)
      .then((data) => setBook(data as Livro))
      .catch(() => setError('Livro não encontrado ou erro ao carregar'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        className="text-indigo-600"
      >
        <Loader2 size={48} className="animate-spin" />
      </motion.div>
    </div>
  );

  if (error || !book) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-md p-6 bg-white rounded-xl shadow-lg border border-red-200">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="text-red-600" size={32} />
          <h2 className="text-xl font-bold text-red-800">Erro ao carregar</h2>
        </div>
        <p className="text-red-700">{error || 'Livro não encontrado'}</p>
        <Link
          href="/livros"
          className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <ArrowLeft className="mr-2" size={16} />
          Voltar para a lista de livros
        </Link>
      </div>
    </div>
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsSubmitting(true);
    try {
      const newReview = { rating, comment };
      await api.adicionarReview(book.id, newReview);

      setBook({
        ...book,
        reviews: [
          ...(book.reviews || []), 
          { 
            ...newReview, 
            id: Math.random(), // ID temporário até a resposta do servidor
            createdAt: new Date().toISOString() 
          }
        ],
      });

      setRating(5);
      setComment('');
    } catch (err: unknown) { // CORREÇÃO AQUI
      // Verifica se o erro é uma instância de Error antes de acessar a propriedade 'message'
      if (err instanceof Error) {
        alert('Erro ao enviar avaliação: ' + err.message);
      } else {
        alert('Erro ao enviar avaliação.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Cabeçalho */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <Link
                href="/livros"
                className="flex items-center gap-2 hover:bg-white/20 p-2 rounded-full transition-colors"
              >
                <ArrowLeft size={20} />
                <span className="hidden sm:inline">Voltar</span>
              </Link>
              <h1 className="text-2xl md:text-3xl font-bold text-center flex-1">
                Detalhes do Livro
              </h1>
              <div className="w-8"></div> {/* Espaçador */}
            </div>
          </div>

          {/* Corpo */}
          <div className="p-6 md:p-8">
            {/* Informações do Livro */}
            <div className="flex flex-col md:flex-row gap-8 mb-12">
              <div className="flex-shrink-0">
                <div className="w-48 h-64 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl shadow-md flex items-center justify-center">
                  <BookOpen className="h-16 w-16 text-indigo-600" />
                </div>
              </div>

              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{book.title}</h2>
                <p className="text-lg text-gray-600 mb-4">{book.author}</p>

                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="bg-indigo-50 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                    {book.genre}
                  </div>
                  <div className="bg-purple-50 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                    {book.year}
                  </div>
                </div>

                {book.description && (
                  <div className="prose max-w-none text-gray-700 mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Sinopse</h3>
                    <p>{book.description}</p>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const avgRating =
                        book.reviews && book.reviews.length > 0
                          ? book.reviews.reduce((acc, curr) => acc + Number(curr.rating), 0) / book.reviews.length
                          : 0;
                      return (
                        <Star
                          key={star}
                          className={`h-5 w-5 ${
                            star <= Math.round(avgRating)
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      );
                    })}
                  </div>
                  <span className="text-sm text-gray-600">
                    {book.reviews?.length || 0} avaliações
                  </span>
                </div>
              </div>
            </div>

            {/* Seção de Avaliações */}
            <section className="border-t border-gray-200 pt-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <MessageSquare className="text-indigo-600" />
                Avaliações
              </h2>

              {/* Formulário de Avaliação */}
              <motion.form
                onSubmit={handleSubmit}
                className="bg-gray-50 rounded-xl p-6 mb-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Deixe sua avaliação
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sua nota
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className={`p-1 rounded-full ${
                            star <= rating
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        >
                          <Star
                            className={`h-6 w-6 ${
                              star <= rating ? 'fill-yellow-400' : ''
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-sm text-gray-600 ml-2">
                        {rating} estrela{rating !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="comment"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Comentário
                    </label>
                    <textarea
                      id="comment"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all"
                      rows={4}
                      placeholder="O que você achou deste livro?"
                      required
                    />
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium py-3 rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1 }}
                          className="h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                        />
                        Enviando...
                      </div>
                    ) : (
                      'Enviar Avaliação'
                    )}
                  </motion.button>
                </div>
              </motion.form>

              {/* Lista de Avaliações */}
              <div className="space-y-6">
                <AnimatePresence>
                  {(book.reviews || []).length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-8 text-gray-500"
                    >
                      <MessageSquare className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                      <p>Nenhuma avaliação ainda. Seja o primeiro a avaliar!</p>
                    </motion.div>
                  ) : (
                    book.reviews?.map((review) => (
                      <motion.div
                        key={review.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-5 w-5 ${
                                  star <= review.rating
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {new Date(review.createdAt).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-800 whitespace-pre-line">
                          {review.comment}
                        </p>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}