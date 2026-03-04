import React from 'react';
import { Search, Command } from 'lucide-react';

const searchbar = ({ value, onChange }) => {
  return (
    <div className="relative mt-8 group w-full max-w-xl mx-auto">
     
      <div className="absolute inset-0 bg-amber-500/5 blur-2xl rounded-full group-focus-within:bg-amber-500/15 transition-all duration-500"></div>
      
      <div className="relative flex items-center">
        
        <Search className="absolute left-4 w-4 h-4 text-white group-focus-within:text-amber-500 transition-colors duration-300" />
        
       
        <input 
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter name, film, or genre..."
          className="w-full bg-white/10 border border-zinc-800 rounded-xl py-4 pl-12 pr-16 font-mono text-xs tracking-widest text-zinc-300 outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all backdrop-blur-md placeholder:text-zinc-700"
        />
        
     
        <div className="absolute right-4 flex items-center gap-1 px-2 py-1 border border-zinc-800 bg-zinc-900/50 rounded text-[10px] text-zinc-600 font-mono pointer-events-none">
          <Command className="w-2.5 h-2.5" />
          <span>K</span>
        </div>
      </div>
    </div>
  );
};

export default searchbar;