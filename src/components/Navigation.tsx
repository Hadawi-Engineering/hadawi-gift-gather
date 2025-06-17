
import React from 'react';

const Navigation = () => {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-emerald-600">🎁 Hadawi</h1>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#how-it-works" className="text-gray-700 hover:text-emerald-600 transition-colors">How it Works</a>
            <a href="#gifts" className="text-gray-700 hover:text-emerald-600 transition-colors">Gifts</a>
            <a href="#features" className="text-gray-700 hover:text-emerald-600 transition-colors">Features</a>
            <a href="#faq" className="text-gray-700 hover:text-emerald-600 transition-colors">FAQ</a>
            <button className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
              Register Interest
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
