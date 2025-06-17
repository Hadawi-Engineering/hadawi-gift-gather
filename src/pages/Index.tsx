
import React from 'react';
import ParticleBackground from '../components/ParticleBackground';
import FloatingElements from '../components/FloatingElements';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 relative">
      <ParticleBackground />
      <FloatingElements />
      
      <div className="relative z-20 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-4xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 animate-pulse">
              HADAWI
            </h1>
            <div className="h-1 w-32 bg-gradient-to-r from-cyan-400 to-purple-400 mx-auto mb-8 animate-pulse"></div>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 font-light tracking-wide">
              The Future of Group Gifting is Here
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-black/20 backdrop-blur-sm border border-cyan-400/20 rounded-xl p-6 hover:border-cyan-400/40 transition-all duration-300 group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">🎁</div>
              <h3 className="text-xl font-semibold text-white mb-2">Smart Collection</h3>
              <p className="text-gray-400">AI-powered payment tracking and automated reminders</p>
            </div>
            
            <div className="bg-black/20 backdrop-blur-sm border border-purple-400/20 rounded-xl p-6 hover:border-purple-400/40 transition-all duration-300 group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">⚡</div>
              <h3 className="text-xl font-semibold text-white mb-2">Instant Links</h3>
              <p className="text-gray-400">Generate shareable payment links in seconds</p>
            </div>
            
            <div className="bg-black/20 backdrop-blur-sm border border-pink-400/20 rounded-xl p-6 hover:border-pink-400/40 transition-all duration-300 group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">🚀</div>
              <h3 className="text-xl font-semibold text-white mb-2">Premium Delivery</h3>
              <p className="text-gray-400">Elegant wrapping and doorstep delivery</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-cyan-500/25">
              Launch Beta Access
            </button>
            <button className="px-8 py-4 border-2 border-cyan-400 text-cyan-400 font-semibold rounded-xl hover:bg-cyan-400 hover:text-black transition-all duration-300">
              Explore Features
            </button>
          </div>
          
          <div className="mt-16 text-center">
            <p className="text-gray-500 text-sm">
              Powered by quantum-grade security • Available across the GCC
            </p>
          </div>
        </div>
      </div>
      
      {/* Animated corner accents */}
      <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-cyan-400/30 animate-pulse"></div>
      <div className="absolute top-0 right-0 w-32 h-32 border-r-2 border-t-2 border-purple-400/30 animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 border-l-2 border-b-2 border-pink-400/30 animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-blue-400/30 animate-pulse" style={{ animationDelay: '3s' }}></div>
    </div>
  );
};

export default Index;
