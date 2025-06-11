import './globals.css';
import { ReactNode } from 'react';
import { BookProvider } from '@/context/BookContext';
import Drawer from '@/components/Drawer';

export const metadata = {
  title: 'Cadastro de Livros',
  description: 'App para cadastrar e visualizar livros',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <BookProvider>
          <header className="sticky top-0 z-50 p-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-lg">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="animate-bounce">
                  <span className="text-3xl">📚</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                  <span className="animate-pulse inline-block">App</span>{' '}
                  <span 
                    className="bg-clip-text text-transparent bg-white bg-opacity-80 hover:bg-opacity-100 transition-all duration-300"
                  >
                    Livros
                  </span>
                </h1>
              </div>
            </div>
          </header>
          <main>{children}</main>
        </BookProvider>
      </body>
    </html>
  );
}