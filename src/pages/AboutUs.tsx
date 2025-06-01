// src/pages/About.tsx
import React from "react";

const AboutUs = () => {
  return (
    <div className="container mx-auto px-4 py-10 text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-center">About Lootara</h1>

      <div className="max-w-3xl mx-auto space-y-6">
        <p>
          At <strong>Lootara</strong>, we're passionate collectors who turned
          our love for pop culture, gaming, and rare finds into a curated shop
          for like-minded enthusiasts. Our mission is to bring joy to collectors
          by offering authentic, high-quality items—from rare Pokémon cards to
          unique Bearbrick figures.
        </p>

        <p>
          What started as a small idea among friends has grown into a thriving
          store built on trust, quality, and community. Whether you're just
          starting your collection or searching for that elusive grail item,
          Lootara is here to help you build a collection you love.
        </p>

        <p>
          We believe in transparency, fair pricing, and stellar customer
          service. Every item we list is carefully verified, stored securely,
          and shipped promptly to ensure it arrives in top condition.
        </p>

        <p>
          Got a question or need help finding something? Reach out to us via our
          <a href="/contact" className="text-blue-600 underline ml-1">
            contact page
          </a>
          . We're always happy to chat, trade stories, or help out fellow
          collectors.
        </p>

        <div className="text-center mt-10">
          <h2 className="text-xl font-semibold mb-2">
            Join the Lootara community!
          </h2>
          <p>
            Follow us on social media and never miss a drop, sale, or
            collectible spotlight.
          </p>
          <div className="flex justify-center space-x-6 mt-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-blue-500"
            >
              <i className="fab fa-facebook fa-2x"></i>
            </a>
            <a
              href="https://www.instagram.com/shop.lootara/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-pink-500"
            >
              <i className="fab fa-instagram fa-2x"></i>
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-blue-400"
            >
              <i className="fab fa-x-twitter fa-2x"></i>
            </a>
            <a
              href="https://whatnot.com/invite/lootara"
              target="_blank"
              rel="noreferrer"
              className="hover:text-yellow-400"
            >
              <i className="fas fa-store fa-2x"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
