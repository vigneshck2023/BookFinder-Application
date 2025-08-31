import React, { useEffect, useState } from "react";
import BookCard from "./BookCard";
import BookModal from "./BookModel";
import { motion, AnimatePresence } from "framer-motion";

export default function BookList({
  query,
  onAddToFavorites,
  onRemoveFromFavorites,
  isBookFavorite,
}) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    if (!query) {
      setBooks([]);
      return;
    }

    setLoading(true);
    fetch(`https://openlibrary.org/search.json?title=${query}&limit=12`)
      .then((res) => res.json())
      .then((data) => {
        setBooks(data.docs || []);
        setLoading(false);
      })
      .catch(() => {
        setBooks([]);
        setLoading(false);
      });
  }, [query]);

  if (!query) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📚</div>
        <h3>Discover Your Next Read</h3>
        <p>Start typing to search for books</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p>Searching for books...</p>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🔍</div>
        <h3>No results found</h3>
        <p>Try a different search term</p>
      </div>
    );
  }

  return (
    <>
      <div className="results-header">
        <h2>Search Results</h2>
        <span className="results-count">
          {books.length} book{books.length !== 1 ? "s" : ""} found
        </span>
      </div>

      <motion.div
        className="book-grid"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.05 }}
      >
        {books.map((book, index) => (
          <BookCard
            key={book.key || index}
            book={book}
            onClick={() => setSelectedBook(book)}
            onAddToFavorites={onAddToFavorites}
            onRemoveFromFavorites={onRemoveFromFavorites}
            isBookFavorite={isBookFavorite}
          />
        ))}
      </motion.div>

      <AnimatePresence>
        {selectedBook && (
          <BookModal
            book={selectedBook}
            onClose={() => setSelectedBook(null)}
            onAddToFavorites={onAddToFavorites}
            onRemoveFromFavorites={onRemoveFromFavorites}
            isBookFavorite={isBookFavorite}
          />
        )}
      </AnimatePresence>
    </>
  );
}
