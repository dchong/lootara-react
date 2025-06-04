// src/components/Header.tsx
import { useState } from "react";
import { Link } from "react-router-dom"; // Or use <a> if not using React Router

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-10 h-20 bg-[#111111]">
      <div className="container mx-auto flex items-center h-full px-4">
        <a href="#/pokemon" className="flex items-center h-full mr-8">
          <img
            src="/images/logo.png"
            alt="Lootara Logo"
            className="h-12 sm:h-full w-auto object-contain"
          />
        </a>
        <nav className="hidden sm:flex space-x-6 text-white" id="nav-links">
          <a href="#/pokemon" className="hover:text-blue-400">
            Pokémon
          </a>
          <a href="#/bearbricks" className="hover:text-blue-400">
            Bearbricks
          </a>
          <a href="#/contacts" className="hover:text-blue-400">
            Contacts
          </a>
        </nav>
        <button
          id="hamburger"
          className="sm:hidden ml-auto text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
      {menuOpen && (
        <div id="mobile-menu" className="sm:hidden px-4 pb-4 bg-[#111111]">
          <a
            href="/pokemon"
            className="block text-white py-2 hover:text-blue-400"
          >
            Pokémon
          </a>
          <a
            href="/bearbricks"
            className="block text-white py-2 hover:text-blue-400"
          >
            Bearbricks
          </a>
          <a
            href="/contacts"
            className="block text-white py-2 hover:text-blue-400"
          >
            Contacts
          </a>
        </div>
      )}
    </header>
  );
};

export default Header;
