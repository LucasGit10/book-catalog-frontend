'use client';

import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface Review {
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

  if (loading) return <p className="p-10">Carregando detalhes do livro...</p>;
  if (error || !book) return <p className="p-10 text-red-600">{error || 'Livro não encontrado'}</p>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      const newReview = { rating, comment };
      await api.adicionarReview(book.id, newReview);

      // Atualiza localmente a lista de reviews (assumindo que o backend retorna a lista atualizada ou não)
      setBook({
        ...book,
        reviews: [...(book.reviews || []), { ...newReview, createdAt: new Date().toISOString() }],
      });

      setRating(5);
      setComment('');
    } catch (err: any) {
      alert('Erro ao enviar avaliação: ' + err.message);
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Detalhes do Livro</h1>
      <div className="border p-4 rounded shadow max-w-md">
        <p><strong>Título:</strong> {book.title}</p>
        <p><strong>Autor:</strong> {book.author}</p>
        <p><strong>Ano:</strong> {book.year}</p>
        <p><strong>Gênero:</strong> {book.genre}</p>
      </div>

      <Link
        href="/livros"
        className="inline-block mt-6 text-blue-600 hover:underline"
      >
        ← Voltar para a lista
      </Link>

      <hr className="my-8" />
      <section className="max-w-xl">
        <h2 className="text-xl font-semibold mb-4">Avaliações</h2>

        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div>
            <label className="block font-medium">Nota (1 a 5):</label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="border p-2 rounded w-full"
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium">Comentário:</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="border p-2 rounded w-full"
              rows={3}
              placeholder="Escreva sua avaliação..."
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Enviar avaliação
          </button>
        </form>

        <div className="space-y-4">
          {(book.reviews || []).length === 0 ? (
            <p className="text-gray-600">Nenhuma avaliação ainda.</p>
          ) : (
            book.reviews?.map((rev, i) => (
              <div key={i} className="border p-3 rounded bg-gray-50">
                <p className="font-medium">Nota: {rev.rating} ⭐</p>
                <p className="text-gray-800">{rev.comment}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(rev.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
