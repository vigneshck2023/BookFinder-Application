import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Star, BookOpen, Heart, Share2, Download } from "lucide-react";

export default function BookModal({
  book,
  onClose,
  onAddToFavorites,
  onRemoveFromFavorites,
  isBookFavorite,
  shelfNumber,
}) {
  const [similarBooks, setSimilarBooks] = useState([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);
  const [readingOptions, setReadingOptions] = useState([]);
  const [isLoadingReadingOptions, setIsLoadingReadingOptions] = useState(false);

  const coverUrl = book.cover_i
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
    : "https://via.placeholder.com/200x300?text=No+Cover";

  // ✅ Fetch similar books
  useEffect(() => {
    if (book && (book.subject || book.author_name)) {
      setLoadingSimilar(true);
      const searchTerm = book.subject?.[0] || book.author_name?.[0];

      fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(
          searchTerm
        )}&limit=4`
      )
        .then((res) => res.json())
        .then((data) => {
          setSimilarBooks(
            data.docs.filter((b) => b.key !== book.key).slice(0, 3)
          );
          setLoadingSimilar(false);
        })
        .catch(() => setLoadingSimilar(false));
    }
  }, [book]);

  // ✅ Fetch reading options
  useEffect(() => {
    const fetchReadingOptions = async () => {
      if (!book.key) return;

      setIsLoadingReadingOptions(true);
      try {
        const response = await fetch(`https://openlibrary.org${book.key}.json`);
        const bookData = await response.json();

        const options = [];

        if (bookData.covers) {
          options.push({
            type: "read_online",
            label: "Read Online",
            url: `https://openlibrary.org${book.key}`,
            icon: <BookOpen size={16} />,
          });
        }

        if (book.first_publish_year && book.first_publish_year < 1928) {
          options.push({
            type: "download_pdf",
            label: "Download PDF",
            url: `https://openlibrary.org${book.key}`,
            icon: <Download size={16} />,
          });
        }

        if (book.availability?.epub) {
          options.push({
            type: "download_epub",
            label: "Download EPUB",
            url: book.availability.epub,
            icon: <Download size={16} />,
          });
        }

        setReadingOptions(options);
      } catch (error) {
        setReadingOptions([
          {
            type: "read_online",
            label: "Read Online",
            url: `https://openlibrary.org${book.key}`,
            icon: <BookOpen size={16} />,
          },
        ]);
      } finally {
        setIsLoadingReadingOptions(false);
      }
    };

    fetchReadingOptions();
  }, [book.key, book.first_publish_year]);

  const handleFavoriteClick = () => {
    if (isBookFavorite(book.key)) {
      onRemoveFromFavorites(book.key);
    } else {
      onAddToFavorites(book);
    }
  };

  const handleShareClick = async (platform = null) => {
    const shareData = {
      title: book.title,
      text: `Check out "${book.title}" by ${
        book.author_name ? book.author_name.join(", ") : "Unknown Author"
      }`,
      url: `https://openlibrary.org${book.key}`,
    };

    try {
      if (platform === "twitter") {
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            shareData.text
          )}&url=${encodeURIComponent(shareData.url)}`,
          "_blank"
        );
      } else if (platform === "facebook") {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            shareData.url
          )}`,
          "_blank"
        );
      } else if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        alert("Link copied to clipboard!");
      }
    } catch (err) {
      console.log("Error sharing:", err);
    }
  };

  const handleReadBook = (option) => {
    window.open(option.url, "_blank");
  };

  const renderReadingButton = () => {
    if (isLoadingReadingOptions) {
      return (
        <button className="read-button loading" disabled>
          <div className="loading-spinner-small"></div>
          Checking availability...
        </button>
      );
    }

    if (readingOptions.length === 0) {
      return (
        <button className="read-button disabled" disabled>
          <BookOpen size={18} />
          Not Available Online
        </button>
      );
    }

    if (readingOptions.length === 1) {
      const option = readingOptions[0];
      return (
        <button className="read-button" onClick={() => handleReadBook(option)}>
          {option.icon}
          {option.label}
        </button>
      );
    }

    return (
      <div className="reading-options-dropdown">
        <button className="read-button dropdown-toggle">
          <BookOpen size={18} />
          Start Reading ▼
        </button>
        <div className="reading-options-menu">
          {readingOptions.map((option, index) => (
            <button
              key={index}
              className="reading-option"
              onClick={() => handleReadBook(option)}
            >
              {option.icon}
              {option.label}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="modal-content"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="modal-body">
          <div className="modal-cover-container">
            <img src={coverUrl} alt={book.title} className="modal-cover" />

            <div className="modal-actions">
              <button
                className={`action-btn favorite ${
                  isBookFavorite(book.key) ? "active" : ""
                }`}
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

              <div className="share-dropdown">
                <button
                  className="action-btn share"
                  aria-label="Share this book"
                >
                  <Share2 size={20} />
                </button>
                <div className="share-options">
                  <button onClick={() => handleShareClick()}>Copy Link</button>
                  <button onClick={() => handleShareClick("twitter")}>
                    Twitter
                  </button>
                  <button onClick={() => handleShareClick("facebook")}>
                    Facebook
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-details">
            <h2 className="modal-title">{book.title}</h2>
            <p className="modal-author">
              {book.author_name
                ? book.author_name.join(", ")
                : "Unknown Author"}
            </p>

            {/* ✅ Show Shelf Number */}
            <div className="modal-shelf">
              <strong>Shelf:</strong>{" "}
              {shelfNumber ? `#${shelfNumber}` : "Not on any shelf"}
            </div>

            <div className="modal-stats">
              {book.first_publish_year && (
                <div className="stat">
                  <span className="stat-label">First Published</span>
                  <span className="stat-value">{book.first_publish_year}</span>
                </div>
              )}

              {book.ratings_average && (
                <div className="stat">
                  <span className="stat-label">Rating</span>
                  <span className="stat-value">
                    <Star size={16} fill="currentColor" />
                    {book.ratings_average.toFixed(1)}
                  </span>
                </div>
              )}

              {book.number_of_pages_median && (
                <div className="stat">
                  <span className="stat-label">Pages</span>
                  <span className="stat-value">
                    {book.number_of_pages_median}
                  </span>
                </div>
              )}
            </div>

            {book.publisher && (
              <div className="modal-publisher">
                <span className="publisher-label">Publisher</span>
                <span className="publisher-value">
                  {book.publisher.join(", ")}
                </span>
              </div>
            )}

            {book.subject && (
              <div className="modal-subjects">
                <span className="subjects-label">Subjects</span>
                <div className="subjects-list">
                  {book.subject.slice(0, 5).map((subject, index) => (
                    <span key={index} className="subject-tag">
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="modal-buttons">{renderReadingButton()}</div>

            {similarBooks.length > 0 && (
              <div className="similar-books">
                <h4>Similar Books</h4>
                <div className="similar-books-grid">
                  {similarBooks.map((similarBook, index) => (
                    <div key={index} className="similar-book">
                      <img
                        src={
                          similarBook.cover_i
                            ? `https://covers.openlibrary.org/b/id/${similarBook.cover_i}-S.jpg`
                            : "https://via.placeholder.com/60x90?text=No+Cover"
                        }
                        alt={similarBook.title}
                        className="similar-book-cover"
                      />
                      <div className="similar-book-info">
                        <p className="similar-book-title">
                          {similarBook.title}
                        </p>
                        <p className="similar-book-author">
                          {similarBook.author_name
                            ? similarBook.author_name[0]
                            : "Unknown Author"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
