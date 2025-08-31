import React, { useState, useEffect } from "react";
import BookCard from "./BookCard";
import BookModal from "./BookModel";

export default function BookList({
  query,
  onAddToFavorites,
  onRemoveFromFavorites,
  isBookFavorite,
}) {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [shelfNumbers, setShelfNumbers] = useState({});

  // Fetch books logic stays the same
  useEffect(() => {
    if (!query) {
      setBooks([]);
      return;
    }
    fetch(`https://openlibrary.org/search.json?title=${query}&limit=12`)
      .then((res) => res.json())
      .then((data) => setBooks(data.docs || []));
  }, [query]);

  const handleBookClick = (book) => {
    // Generate shelf number if not assigned
    if (!shelfNumbers[book.key]) {
      const newShelf = Math.floor(Math.random() * 100) + 1; // Random shelf number
      setShelfNumbers((prev) => ({ ...prev, [book.key]: newShelf }));
    }
    setSelectedBook(book);
  };

  return (
    <>
      <div className="book-grid">
        {books.map((book, index) => (
          <BookCard
            key={book.key || index}
            book={book}
            onClick={() => handleBookClick(book)}
            onAddToFavorites={onAddToFavorites}
            onRemoveFromFavorites={onRemoveFromFavorites}
            isBookFavorite={isBookFavorite}
          />
        ))}
      </div>

      {selectedBook && (
        <BookModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          onAddToFavorites={onAddToFavorites}
          onRemoveFromFavorites={onRemoveFromFavorites}
          isBookFavorite={isBookFavorite}
          shelfNumber={shelfNumbers[selectedBook.key]}
        />
      )}
    </>
  );
}
