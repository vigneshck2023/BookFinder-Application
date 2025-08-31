import React, { useState, useEffect } from "react";
import Sidebar from "./components/SideBar";
import BookList from "./components/BookList";
import Favorites from "./components/Favorites";
import { Search, Heart, X } from "lucide-react";

export default function App() {
  const [query, setQuery] = useState("");
  const [activeView, setActiveView] = useState("home");
  const [favorites, setFavorites] = useState([]);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem("bookFinderFavorites");
      if (savedFavorites) {
        const parsedFavorites = JSON.parse(savedFavorites);
        if (Array.isArray(parsedFavorites)) {
          setFavorites(parsedFavorites);
        }
      }
    } catch (error) {
      console.error("Error loading favorites from localStorage:", error);
      localStorage.removeItem("bookFinderFavorites");
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("bookFinderFavorites", JSON.stringify(favorites));
    } catch (error) {
      console.error("Error saving favorites to localStorage:", error);
    }
  }, [favorites]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const addToFavorites = (book) => {
    const isAlreadyFavorite = favorites.some((fav) => fav.key === book.key);
    if (!isAlreadyFavorite) {
      const cleanBook = {
        key: book.key,
        title: book.title,
        author_name: book.author_name,
        cover_i: book.cover_i,
        first_publish_year: book.first_publish_year,
        ratings_average: book.ratings_average,
        publisher: book.publisher,
        subject: book.subject,
        number_of_pages_median: book.number_of_pages_median,
      };
      setFavorites([...favorites, cleanBook]);
      showToast(`"${book.title}" added to favorites!`);
    } else {
      showToast(`"${book.title}" is already in favorites!`, "info");
    }
  };

  const removeFromFavorites = (bookKey) => {
    const bookToRemove = favorites.find((book) => book.key === bookKey);
    setFavorites(favorites.filter((book) => book.key !== bookKey));
    if (bookToRemove) {
      showToast(`"${bookToRemove.title}" removed from favorites!`, "error");
    }
  };

  const isBookFavorite = (bookKey) => {
    return favorites.some((book) => book.key === bookKey);
  };

  const handleNavigation = (view) => {
    setActiveView(view);
  };

  return (
    <div className="app">
      <Sidebar
        activeView={activeView}
        onNavigate={handleNavigation}
        favoritesCount={favorites.length}
      />

      <div className="main-content">
        <header className="header">
          <h1 className="title">
            <span className="title-icon">📚</span>
            OpenShelf
          </h1>

          {activeView === "home" && (
            <div className="search-container">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="Search for a book..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="search-input"
              />
            </div>
          )}
        </header>

        <main className="content">
          {activeView === "home" && (
            <BookList
              query={query}
              onAddToFavorites={addToFavorites}
              onRemoveFromFavorites={removeFromFavorites}
              isBookFavorite={isBookFavorite}
            />
          )}
          {activeView === "favorites" && (
            <Favorites
              favorites={favorites}
              onRemoveFromFavorites={removeFromFavorites}
            />
          )}
        </main>
      </div>

      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.type === "success" && <Heart size={18} />}
          {toast.type === "error" && <X size={18} />}
          <span>{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="toast-close"
            aria-label="Close notification"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
