import React from 'react';

export function BookCard({book}) {
  return (
    <article className="book-card" data-testid="book-card">
      <div
        className="book-card-cover"
        style={{background: book.cover}}
        aria-hidden="true"
      />
      <h2 className="book-card-title">{book.title}</h2>
      <p className="book-card-author">{book.author}</p>
      <p className="book-card-rating">★ {book.rating.toFixed(1)}</p>
      <p className="book-card-description">{book.description}</p>
      <p className="book-card-price">{book.price} ₽</p>
    </article>
  );
}
