import React from "react";
import { Home, Heart } from "lucide-react";

export default function Sidebar({ activeView, onNavigate, favoritesCount }) {
  return (
    <div className="sidebar">
      <div className="sidebar-content">
        <div className="logo">
          <div className="logo-icon">OS</div>
          <span className="logo-text">OpenShelf</span>
        </div>

        <nav className="sidebar-nav">
          <div
            className={`nav-item ${activeView === "home" ? "active" : ""}`}
            onClick={() => onNavigate("home")}
          >
            <Home size={20} />
            <span>Home</span>
          </div>
          <div
            className={`nav-item ${activeView === "favorites" ? "active" : ""}`}
            onClick={() => onNavigate("favorites")}
          >
            <Heart size={20} />
            <span>Favorites</span>
            {favoritesCount > 0 && (
              <span className="badge">{favoritesCount}</span>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
}
