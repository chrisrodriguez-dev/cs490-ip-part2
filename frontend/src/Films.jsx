import './App.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from './components/searchbar';
import ReactPaginate from 'react-paginate';

function Films() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [films, setFilms] = useState([]);
  const navigate = useNavigate();

  // pagination state
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    fetch('/api/films')
      .then((res) => res.json())
      .then((data) => setFilms(data || []))
      .catch(err => console.error("Fetch error:", err));
  }, []);

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

  // pagination logic
  const endOffset = itemOffset + itemsPerPage;
  const currentItems = films.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(films.length / itemsPerPage);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % films.length;
    setItemOffset(newOffset);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-[#09090B] min-h-screen w-full relative overflow-x-hidden font-sans">
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-40"></div>
      
      <div className="relative z-10 flex flex-col items-center p-6 md:p-12 text-white">
        <header className="mb-10 mt-10 text-center w-full max-w-2xl flex flex-col items-center">
          <h1 className="font-tomorrow text-6xl font-black uppercase tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-b from-[#FDE68A] via-[#F59E0B] to-[#B45309] drop-shadow-[0_0_15px_rgba(245,158,11,0.3)] mb-4 italic">
            FILM ARCHIVE
          </h1>
          
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
              <h2 className="text-xl font-bold font-mono text-zinc-100 uppercase tracking-widest">List of Films</h2>
              <span className="text-zinc-500 text-[10px] font-mono">{films.length} films found</span> 
            </div>

            <ul className="space-y-4">
              {currentItems.map(film => (
                <li key={film.film_id} className="group">
                  <div className="w-full flex items-center justify-between p-4 rounded-lg bg-zinc-900/40 border border-zinc-800/50 hover:border-amber-500/30 hover:bg-amber-500/5 transition-all">
                    <div className="flex items-center gap-6">
                      <span className="text-amber-500 font-mono text-xs font-bold w-12 text-center bg-amber-500/10 py-1 rounded">ID: {film.film_id}</span>
                      <p className="text-zinc-200 font-bold uppercase tracking-tight">{film.title}</p>
                    </div>
                    <button onClick={() => navigate(`/film-details/${film.film_id}`)} className="text-[10px] font-mono text-zinc-500 border border-zinc-800 px-3 py-1 rounded hover:bg-zinc-800 hover:text-white transition-colors">View</button>
                  </div>
                </li>
              ))}
            </ul>

            <ReactPaginate
              breakLabel="..."
              nextLabel="NEXT →"
              onPageChange={handlePageClick}
              pageRangeDisplayed={2}
              pageCount={pageCount}
              previousLabel="< PREV"
              containerClassName="flex justify-center gap-2 mt-12 font-mono text-[10px] uppercase tracking-widest items-center"
              pageLinkClassName="px-3 py-2 border border-zinc-800 rounded hover:border-amber-500/50 hover:bg-amber-500/10 transition-colors"
              previousLinkClassName="px-3 py-2 border border-zinc-800 rounded hover:text-amber-500"
              nextLinkClassName="px-3 py-2 border border-zinc-800 rounded hover:text-amber-500"
              activeLinkClassName="bg-amber-500/20 border-amber-500 text-amber-500 font-bold"
              disabledLinkClassName="opacity-30 cursor-not-allowed"
            />
          </section>
        </main>
      </div>
    </div>
  );
}

export default Films;