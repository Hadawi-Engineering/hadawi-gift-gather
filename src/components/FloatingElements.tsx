
import React from 'react';

const FloatingElements = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {/* Floating geometric shapes */}
      <div className="absolute top-20 left-10 w-4 h-4 border border-cyan-400 rotate-45 animate-pulse opacity-30"></div>
      <div className="absolute top-40 right-20 w-6 h-6 border border-purple-400 animate-spin opacity-20" style={{ animationDuration: '8s' }}></div>
      <div className="absolute bottom-32 left-1/4 w-3 h-3 bg-blue-400 rounded-full animate-bounce opacity-40" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/3 right-1/3 w-5 h-5 border-2 border-pink-400 rounded-full animate-ping opacity-25"></div>
      <div className="absolute bottom-20 right-10 w-8 h-1 bg-gradient-to-r from-cyan-400 to-transparent animate-pulse opacity-30"></div>
      
      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/2 w-2 h-2 bg-cyan-400 rounded-full opacity-60 animate-pulse shadow-lg shadow-cyan-400/50"></div>
      <div className="absolute bottom-1/4 left-1/4 w-3 h-3 bg-purple-400 rounded-full opacity-40 animate-pulse shadow-lg shadow-purple-400/50" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-pink-400 rounded-full opacity-80 animate-pulse shadow-lg shadow-pink-400/50" style={{ animationDelay: '3s' }}></div>
      
      {/* Scanning lines */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      {/* Moving grid pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400 to-transparent transform -skew-y-12 animate-pulse" style={{ height: '1px', top: '20%' }}></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-400 to-transparent transform -skew-y-12 animate-pulse" style={{ height: '1px', top: '40%', animationDelay: '1s' }}></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400 to-transparent transform -skew-y-12 animate-pulse" style={{ height: '1px', top: '60%', animationDelay: '2s' }}></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-400 to-transparent transform -skew-y-12 animate-pulse" style={{ height: '1px', top: '80%', animationDelay: '3s' }}></div>
      </div>
    </div>
  );
};

export default FloatingElements;
