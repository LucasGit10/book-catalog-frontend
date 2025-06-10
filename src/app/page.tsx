// app/page.tsx (ou pages/index.tsx)
import BookForm from '@/components/BookForm';

export default function Home() {
  return (
    <main className="p-10">
      <h1 className="text-2xl font-bold mb-4">Cadastro de Livros</h1>
      <BookForm />
    </main>
  );
}
