import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTheme } from '@/contexts/ThemeContext';
import ThemeToggle from '@/components/ThemeToggle';

const HomePage: React.FC = () => {
  const { isDark } = useTheme();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen animated-bg overflow-hidden relative">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        <div className="absolute -bottom-8 -left-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -top-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className={`text-2xl font-bold text-white transition-all duration-500 ${isLoaded ? 'animate-fade-in-left' : 'opacity-0'}`}>
            <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              FullStack App
            </span>
          </div>
          <div className={`transition-all duration-500 ${isLoaded ? 'animate-fade-in-right' : 'opacity-0'}`}>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-4xl w-full text-center">
          <div className={`transition-all duration-700 ${isLoaded ? 'animate-fade-in-up' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse-slow">
                Future
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed">
              Experience the next generation of web applications with our complete 
              <span className="font-semibold text-blue-200"> authentication system</span> built with 
              <span className="font-semibold text-purple-200"> Django</span> and 
              <span className="font-semibold text-pink-200"> Next.js</span>
            </p>
          </div>
          
          <div className={`flex flex-col sm:flex-row gap-6 justify-center items-center transition-all duration-700 delay-200 ${isLoaded ? 'animate-fade-in-up' : 'opacity-0 translate-y-10'}`}>
            <Link 
              href="/login"
              className="group relative px-8 py-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-2xl font-semibold text-white text-lg transition-all duration-300 hover:scale-105 hover:shadow-glow glass hover-lift btn-animate min-w-[200px]"
            >
              <span className="relative z-10 flex items-center justify-center">
                <svg className="w-5 h-5 mr-2 group-hover:animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Sign In
              </span>
            </Link>
            
            <Link 
              href="/register"
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-2xl font-semibold text-white text-lg transition-all duration-300 hover:scale-105 hover:shadow-glow-lg hover-lift btn-animate min-w-[200px]"
            >
              <span className="relative z-10 flex items-center justify-center">
                <svg className="w-5 h-5 mr-2 group-hover:animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                Get Started
              </span>
            </Link>
          </div>

          {/* Features section */}
          <div className={`mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 transition-all duration-700 delay-400 ${isLoaded ? 'animate-fade-in-up' : 'opacity-0 translate-y-10'}`}>
            <div className="glass rounded-2xl p-6 hover-lift group">
              <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center group-hover:animate-bounce">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Secure Authentication</h3>
              <p className="text-white/80">JWT-based authentication with refresh tokens for maximum security</p>
            </div>

            <div className="glass rounded-2xl p-6 hover-lift group">
              <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center group-hover:animate-bounce">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15.586 13H14a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Responsive Design</h3>
              <p className="text-white/80">Beautiful UI that works perfectly on all devices and screen sizes</p>
            </div>

            <div className="glass rounded-2xl p-6 hover-lift group">
              <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-pink-400 to-pink-600 rounded-xl flex items-center justify-center group-hover:animate-bounce">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Lightning Fast</h3>
              <p className="text-white/80">Optimized performance with modern technologies and best practices</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 p-6 text-center">
        <p className="text-white/60 text-sm">
          Built with ❤️ using Django, Next.js, and PostgreSQL
        </p>
      </footer>
    </div>
  );
};

export default HomePage;
