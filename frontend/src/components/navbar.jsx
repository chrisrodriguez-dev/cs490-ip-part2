import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Film Details', href: '/film-details' },
    { name: 'Customers', href: '/customers' },
  ];

  return (
    <nav className="sticky top-0 z-[100] bg-black border-b border-zinc-800/80 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/20 to-transparent pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-12 relative z-10">
        <div className="flex justify-between items-center h-16">
          
          <div className="flex items-center">
            <Link to="/" className="text-white text-xl font-black uppercase italic tracking-[0.2em] hover:text-amber-500 transition-all">
              SAKILA<span className="text-amber-600">.</span>
            </Link>
          </div>

          <div className="flex items-center space-x-12">
            {navItems.map((item) => (
              <Link 
                key={item.name} 
                to={item.href} 
                className="text-zinc-500 hover:text-white font-mono text-[11px] uppercase tracking-[0.3em] transition-colors duration-300"
              >
                {item.name}
              </Link>
            ))}
          </div>
          
        </div>
      </div>
    </nav>
  );
};

export default Navbar;