import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-2">Livro não encontrado</h1>
      <p className="text-gray-600 mb-4">O livro que você tentou acessar não existe.</p>
      <Link href="/livros" className="text-blue-600 hover:underline">← Voltar para a lista</Link>
    </div>
  );
}
