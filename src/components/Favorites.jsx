import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Trash2 } from "lucide-react";
import BookCard from "./BookCard";
import BookModal from "./BookModel";

export default function Favorites({
  favorites,
  onRemoveFromFavorites,
  onAddToFavorites,
  isBookFavorite,
}) {
  const [selectedBook, setSelectedBook] = useState(null);

  if (favorites.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">❤️</div>
        <h3>No favorites yet</h3>
        <p>Start adding books to your favorites by clicking the heart icon</p>
      </div>
    );
  }

  return (
    <div className="favorites-container">
      <div className="favorites-header">
        <h2>Your Favorite Books</h2>
        <span className="favorites-count">
          {favorites.length} book{favorites.length !== 1 ? "s" : ""}
        </span>
      </div>

      <motion.div
        className="book-grid"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.05 }}
      >
        <AnimatePresence>
          {favorites.map((book) => (
            <motion.div
              key={book.key}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <div className="favorite-book-card">
                <BookCard
                  book={book}
                  onClick={() => setSelectedBook(book)}
                  onAddToFavorites={onAddToFavorites}
                  onRemoveFromFavorites={onRemoveFromFavorites}
                  isBookFavorite={isBookFavorite}
                />
                <button
                  className="remove-favorite-btn"
                  onClick={() => onRemoveFromFavorites(book.key)}
                  aria-label="Remove from favorites"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
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
    </div>
  );
}
