// src/lib/api.ts

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${baseUrl}${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Erro na requisição');
  }

  return res.json();
}

export const api = {
  listarLivros: () => request('/livros'),

  obterLivro: (id: number) => request(`/livros/${id}`),

  criarLivro: (data: { title: string; author: string; year: string; genre: string }) =>
    request('/livros', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  adicionarReview: (id: number, review: { rating: number; comment: string }) =>
    request(`/livros/${id}/reviews`, {
      method: 'POST',
      body: JSON.stringify(review),
    }),

  removerLivro: (id: number) =>
    request(`/livros/${id}`, {
      method: 'DELETE',
    }),

  listarReviews: () => request('/livros/reviews'), // ✅ Adicionada aqui
};
