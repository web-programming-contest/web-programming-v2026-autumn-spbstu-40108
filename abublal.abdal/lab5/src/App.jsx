import React, {useState} from 'react';
import {books} from './data.js';
import {BookCard} from './components/BookCard.jsx';
import {Pagination} from './components/Pagination.jsx';

const BOOKS_PER_PAGE = 3;

export function App() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(books.length / BOOKS_PER_PAGE));
  const startIndex = (currentPage - 1) * BOOKS_PER_PAGE;
  const visibleBooks = books.slice(startIndex, startIndex + BOOKS_PER_PAGE);

  function handlePageChange(page) {
    if (page < 1 || page > totalPages) {
      return;
    }
    setCurrentPage(page);
  }

  return (
    <section className="book-store">
      <h1 className="book-store-title">Книжный магазин</h1>
      <div className="book-list" data-testid="book-list">
        {visibleBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onChange={handlePageChange}
      />
    </section>
  );
}
