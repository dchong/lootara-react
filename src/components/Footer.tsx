declare const __APP_VERSION__: string; // TypeScript global declaration

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  const version = __APP_VERSION__;

  return (
    <footer className="text-white py-8 mt-12 bg-[#111111]">
      <div className="container mx-auto px-4">
        {/* Social Links */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3 text-center sm:text-left">
            Connect with Us
          </h3>
          <div className="flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-6">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 flex items-center space-x-2"
              aria-label="Facebook"
            >
              <i className="fab fa-facebook-f fa-lg"></i>
              <span>Facebook</span>
            </a>
            <a
              href="https://www.instagram.com/shop.lootara/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-400 flex items-center space-x-2"
              aria-label="Instagram"
            >
              <i className="fab fa-instagram fa-lg"></i>
              <span>Instagram</span>
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-300 flex items-center space-x-2"
              aria-label="X (formerly Twitter)"
            >
              <i className="fab fa-x-twitter fa-lg"></i>
              <span>X</span>
            </a>
            <a
              href="https://whatnot.com/invite/lootara"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-yellow-400 flex items-center space-x-2"
              aria-label="Whatnot"
            >
              <i className="fas fa-store fa-lg"></i>
              <span>Whatnot</span>
            </a>
          </div>
        </div>

        {/* Site Links */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mt-6 text-sm text-gray-300">
          <a href="#/terms-and-condition" className="hover:underline">
            Terms & Conditions
          </a>
          <a href="#/shipping-returns" className="hover:underline">
            Shipping & Returns
          </a>
          <a href="#/faqs" className="hover:underline">
            FAQs
          </a>
          <a href="#/privacy" className="hover:underline">
            Privacy Policy
          </a>
          <a href="#/about-us" className="hover:underline">
            About Us
          </a>
          <a href="#/reviews" className="hover:underline">
            Reviews
          </a>
        </div>

        <div className="mt-6 text-sm text-gray-500 text-center">
          &copy; {year} Lootara. All rights reserved.
        </div>

        <div className="text-xs text-gray-500 text-center mt-1">
          Version {version}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
