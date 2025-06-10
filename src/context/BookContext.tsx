'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export type Review = {
  rating: number;
  comment: string;
  createdAt: Date;
};

export type Book = {
  title: string;
  author: string;
  year: string;
  genre: string;
  reviews?: Review[];
};

type BookContextType = {
  books: Book[];
  addBook: (book: Book) => void;
  addReview: (bookId: number, review: Review) => void;
};

const BookContext = createContext<BookContextType | undefined>(undefined);

export const BookProvider = ({ children }: { children: ReactNode }) => {
  const [books, setBooks] = useState<Book[]>([]);

  const addBook = (book: Book) => {
    setBooks(prev => [...prev, book]);
  };

  const addReview = (bookId: number, review: Review) => {
    setBooks(prev =>
      prev.map((book, index) =>
        index === bookId
          ? { ...book, reviews: [...(book.reviews || []), review] }
          : book
      )
    );
  };

  return (
    <BookContext.Provider value={{ books, addBook, addReview }}>
      {children}
    </BookContext.Provider>
  );
};

export const useBookContext = () => {
  const context = useContext(BookContext);
  if (!context) throw new Error('useBookContext must be used within BookProvider');
  return context;
};
