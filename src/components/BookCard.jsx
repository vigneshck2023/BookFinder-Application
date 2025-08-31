import React from "react";
import { motion } from "framer-motion";
import { Heart, Star } from "lucide-react";

export default function BookCard({
  book,
  shelfNumber,
  onClick,
  onAddToFavorites,
  onRemoveFromFavorites,
  isBookFavorite,
  showAddButton = true,
}) {
  const coverUrl = book.cover_i
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
    : "https://via.placeholder.com/150x200?text=No+Cover";

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (isBookFavorite(book.key)) {
      onRemoveFromFavorites(book.key);
    } else {
      onAddToFavorites(book);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.98 }}
      className="book-card"
      onClick={onClick}
    >
      <div className="book-cover-container">
        <img src={coverUrl} alt={book.title} className="book-cover" />
        <div className="book-shine"></div>

        <button
          className={`favorite-btn ${isBookFavorite(book.key) ? "active" : ""}`}
          onClick={handleFavoriteClick}
          aria-label={
            isBookFavorite(book.key)
              ? "Remove from favorites"
              : "Add to favorites"
          }
        >
          <Heart
            size={20}
            fill={isBookFavorite(book.key) ? "currentColor" : "none"}
          />
        </button>
      </div>

      <div className="book-info">
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">
          {book.author_name ? book.author_name.join(", ") : "Unknown Author"}
        </p>

        <div className="book-meta">
          <span className="book-year">{book.first_publish_year || "N/A"}</span>
          {book.ratings_average && (
            <span className="book-rating">
              <Star size={14} fill="currentColor" />
              {book.ratings_average.toFixed(1)}
            </span>
          )}
        </div>

        {showAddButton && (
          <button
            className={`add-to-favorites-btn ${
              isBookFavorite(book.key) ? "added" : ""
            }`}
            onClick={handleFavoriteClick}
          >
            {isBookFavorite(book.key) ? (
              <>
                <Heart size={16} fill="currentColor" />
                Added to Favorites
              </>
            ) : (
              <>
                <Heart size={16} />
                Add to Favorites
              </>
            )}
          </button>
        )}
      </div>
    </motion.div>
  );
}
