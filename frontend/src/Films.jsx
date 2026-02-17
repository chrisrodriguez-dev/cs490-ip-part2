import './App.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react'; // Ensure you have lucide-react installed
import SearchBar from './components/searchbar';

function Films() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [films, setFilms] = useState([]); // Renamed from customers
  const navigate = useNavigate();

  useEffect(() => {
    if (searchQuery) {
      fetch(`/api/search/${searchQuery}`)
        .then((res) => res.json())
        .then((data) => setSearchResults(data))
        .catch((err) => console.error("Search error:", err));
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetch('/api/films') // Pointing to films endpoint now
      .then((res) => res.json())
      .then((data) => {
        setFilms(data || []);
      })
      .catch(err => console.error("Fetch error:", err));
  }, []);

  return (
  <div className="bg-[#09090B] min-h-screen w-full relative overflow-x-hidden font-sans selection:bg-amber-500/30">
    <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-40"></div>
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/5 via-transparent to-transparent pointer-events-none"></div>

    <div className="relative z-10 flex flex-col items-center p-6 md:p-12 text-white">
      
      <header className="mb-10 mt-10 text-center w-full max-w-2xl flex flex-col items-center">
        <h1 className="font-tomorrow text-6xl font-black uppercase tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-b from-[#FDE68A] via-[#F59E0B] to-[#B45309] drop-shadow-[0_0_15px_rgba(245,158,11,0.3)] mb-4 italic">
          FILM ARCHIVE
        </h1>
        <p className="text-zinc-500 font-mono tracking-[0.3em] uppercase text-xs mt-2 mb-8">Database Directory</p>
        
        <div className="relative w-full">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          
          {searchQuery && searchResults.length > 0 && (
            <div className="absolute z-50 w-full mt-2 bg-zinc-900/95 backdrop-blur-xl border border-zinc-800 rounded-xl shadow-2xl max-h-60 overflow-y-auto custom-scrollbar">
              {searchResults.map((movie) => (
                <button
                  key={movie.film_id}
                  onClick={() => {
                    navigate(`/film-details/${movie.film_id}`);
                    setSearchQuery('');
                  }}
                  className="w-full text-left p-4 hover:bg-amber-500/10 border-b border-zinc-800 last:border-0 transition-colors flex justify-between items-center group"
                >
                  <div>
                    <p className="text-zinc-200 font-bold uppercase text-sm group-hover:text-amber-400">
                      {movie.title}
                    </p>
                    <p className="text-zinc-500 text-[10px] font-mono">{movie.genre}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      <main className="w-full max-w-4xl">
        <section className="bg-black/60 backdrop-blur-md border border-zinc-800 rounded-2xl p-8 shadow-2xl">
          <div className="flex justify-between items-end mb-8 border-b border-zinc-800 pb-4">
            <h2 className="text-xl font-bold font-mono text-zinc-100 uppercase tracking-widest">Master Records</h2>
            <span className="text-[10px] text-zinc-500 font-mono italic">{films.length} Entries</span>
          </div>

          <ul className="space-y-4">
            {films.map(film => (
              <li key={film.film_id} className="group">
                <div className="w-full flex items-center justify-between p-4 rounded-lg bg-zinc-900/40 border border-zinc-800/50 hover:border-amber-500/30 hover:bg-amber-500/5 transition-all duration-300">
                  <div className="flex items-center gap-6">
                    <span className="text-amber-500 font-mono text-xs font-bold w-12 text-center bg-amber-500/10 py-1 rounded">
                      ID: {film.film_id}
                    </span>
                    <div>
                      <p className="text-zinc-200 group-hover:text-amber-400 transition-all font-bold uppercase tracking-tight">
                        {film.title}
                      </p>
                      <div className="flex items-center gap-2 text-zinc-500 mt-1">
                        <span className="text-[11px] font-mono uppercase tracking-tighter text-zinc-600">
                          Released: {film.release_year || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate(`/film-details/${film.film_id}`)}
                    className="text-[10px] font-mono text-zinc-500 border border-zinc-800 px-3 py-1 rounded hover:bg-zinc-800 hover:text-white transition-colors"
                  >
                    VIEW_DATA
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  </div>
);
}

export default Films;