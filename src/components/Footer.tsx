// src/components/Footer.tsx
import { useEffect, useState } from "react";

const Footer: React.FC = () => {
  const [year, setYear] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="text-white py-8 mt-12 bg-[#111111]">
      <div className="container mx-auto px-4">
        {/* Social Links */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">Connect with Us</h3>
          <div className="flex space-x-6">
            <a
              href="https://facebook.com"
              target="_blank"
              className="hover:text-blue-400 flex items-center space-x-2"
              rel="noreferrer"
            >
              <i className="fab fa-facebook-f fa-lg"></i>
              <span>Facebook</span>
            </a>
            <a
              href="https://www.instagram.com/shop.lootara/"
              target="_blank"
              className="hover:text-pink-400 flex items-center space-x-2"
              rel="noreferrer"
            >
              <i className="fab fa-instagram fa-lg"></i>
              <span>Instagram</span>
            </a>
            <a
              href="https://x.com"
              target="_blank"
              className="hover:text-blue-300 flex items-center space-x-2"
              rel="noreferrer"
            >
              <i className="fab fa-x-twitter fa-lg"></i>
              <span>X</span>
            </a>
            <a
              href="https://whatnot.com/invite/lootara"
              target="_blank"
              className="hover:text-yellow-400 flex items-center space-x-2"
              rel="noreferrer"
            >
              <i className="fas fa-store fa-lg"></i>
              <span>Whatnot</span>
            </a>
          </div>
        </div>

        {/* Site Links */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mt-6 text-sm text-gray-300">
          <a href="/terms" className="hover:underline">
            Terms & Conditions
          </a>
          <a href="/shipping" className="hover:underline">
            Shipping & Returns
          </a>
          <a href="/faq" className="hover:underline">
            FAQs
          </a>
          <a href="/privacy" className="hover:underline">
            Privacy Policy
          </a>
          <a href="/about" className="hover:underline">
            About Us
          </a>
          <a href="/reviews" className="hover:underline">
            Reviews
          </a>
        </div>

        <div className="mt-6 text-sm text-gray-500 text-center">
          &copy; {year} Lootara. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
