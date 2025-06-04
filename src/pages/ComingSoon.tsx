import React from "react";

export default function ComingSoon() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white text-center px-4">
      <img
        src="/images/logo.png"
        alt="Lootara Logo"
        className="w-48 h-auto mb-6 animate-pulse"
      />
      <h1 className="text-3xl md:text-5xl font-bold">Coming Soon</h1>
    </div>
  );
}
