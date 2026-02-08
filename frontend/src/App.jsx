import { useState, useEffect } from 'react'
import './App.css'
import Popup from './components/popup'
import { Popcorn, Star } from 'lucide-react';
import SearchBar from './components/searchbar'

function App() {
  const [movies, setMovies] = useState([])
  const [actorMovies, setActorMovies] = useState([])
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    fetch('/api/landing-page')
      .then((res) => res.json())
      .then((data) => {
        setMovies(data.movies || [])
        setActorMovies(data.actorMovies || [])
      })
      .catch(err => console.error("Fetch error:", err))
  }, [])

  useEffect(() => {
  if (searchQuery) {
    fetch(`/api/search/${searchQuery}`) 
      .then(res => res.json())
      .then(data => setSearchResults(data))
      .catch(err => console.error("Search error:", err));
  } else {
    setSearchResults([]);   
  }
}, [searchQuery])

  function handleClick(id) {    
    fetch(`/api/film/${id}`)
      .then(res => res.json())
      .then(data => {
        setSelectedDetail(data);
        setOpen(true);
      });
  }

  function handleActorClick(actorId) {
    fetch(`/api/actor/${actorId}`)
      .then(res => res.json())
      .then(data => {
        setSelectedDetail(data);
        setOpen(true);
    });
  }



return (
    <div className="bg-[#09090B] min-h-screen w-full relative overflow-x-hidden font-sans selection:bg-amber-500/30">
      
      
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none"></div>
      
      
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/5 via-transparent to-transparent pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center p-6 md:p-12 text-white">
        
        <header className="mb-20 mt-10 text-center">
          <h1 className="font-tomorrow text-7xl font-black uppercase tracking-[0.4em] text-transparent bg-clip-text bg-gradient-to-b from-[#FDE68A] via-[#F59E0B] to-[#B45309] drop-shadow-[0_0_15px_rgba(245,158,11,0.3)] mb-4 italic">
            SAKILA
          </h1>
          
            <header className="mb-20 mt-10 text-center relative w-full max-w-md mx-auto">
  
  
  <div className="relative w-full">
    <SearchBar value={searchQuery} onChange={setSearchQuery} />
    
    {searchQuery && searchResults.length > 0 && (
      <div className="absolute z-50 w-full mt-2 bg-zinc-900/95 backdrop-blur-xl border border-zinc-800 rounded-xl shadow-2xl max-h-60 overflow-y-auto custom-scrollbar">
        {searchResults.map((movie) => (
          <button
            key={movie.film_id}
            onClick={() => {
        
              console.log("Movie selected:", movie.film_id);
              setSearchQuery(''); 
            }}
            className="w-full text-left p-4 hover:bg-amber-500/10 border-b border-zinc-800 last:border-0 transition-colors flex justify-between items-center group"
          >
            <div>
              <p className="text-zinc-200 font-bold uppercase text-sm group-hover:text-amber-400 transition-colors">
                {movie.title}
              </p>
              <p className="text-zinc-500 text-[10px] font-mono">{movie.genre}</p>
            </div>
            <Popcorn className="w-4 h-4 text-amber-500/50" />
          </button>
        ))}
      </div>
    )}
  </div>
  
</header>
          <p className="text-zinc-500 font-mono tracking-[0.3em] uppercase text-xs mt-2">Sakila Inventory Management</p>
        </header>

        <main className="grid md:grid-cols-2 gap-8 w-full max-w-6xl">
          
         
          <section className="bg-black/60 backdrop-blur-md border border-zinc-800 rounded-2xl p-8 hover:border-amber-500/30 transition-all duration-500 shadow-2xl">
            <div className="flex justify-between items-end mb-8 border-b border-zinc-800 pb-4">
              <h2 className="text-xl font-bold font-mono text-zinc-100 uppercase tracking-widest">Top 5 Films</h2>
              <span className="text-[10px] text-zinc-500 font-mono italic">Total Rentals</span>
            </div>
            
        <ul className="space-y-3">
        
        {movies.map((movie) => (
          <li key={movie.film_id} className="group">
            <button 
              onClick={() => handleClick(movie.film_id)}
              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-amber-500/5 transition-all text-left border border-transparent hover:border-amber-500/10"
            >
              <div className="flex items-center gap-4">
                <div className="relative flex items-center justify-center">
                  <Popcorn className="w-5 h-5 text-amber-500 blur-[2px] absolute inset-0 opacity-70 animate-flicker" />
                  <Popcorn className="w-5 h-5 text-amber-400 relative z-10" />
                </div>
                <span className="text-zinc-300 group-hover:text-amber-400 transition-all font-medium uppercase tracking-tight">
                  {movie.title}
                </span>
              </div>
              <span className="text-zinc-600 font-mono text-sm">{movie.TimesRented}</span>
            </button> 
          </li>
        ))}
      </ul>
          </section>

        
          <section className="bg-black/60 backdrop-blur-md border border-zinc-800 rounded-2xl p-8 hover:border-amber-500/30 transition-all duration-500 shadow-2xl">
            <div className="flex justify-between items-end mb-8 border-b border-zinc-800 pb-4">
              <h2 className="text-xl font-bold font-mono text-zinc-100 uppercase tracking-widest">Top 5 Actors</h2>
              <span className="text-[10px] text-zinc-500 font-mono italic">Appearances</span>
            </div>

            <ul className="space-y-3">
              {actorMovies.map((actor) => (
                <li key={actor.actor_id} className="group">
                  <button 
                    onClick={() => handleActorClick(actor.actor_id)}
                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-amber-500/5 transition-all text-left border border-transparent hover:border-amber-500/10"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative flex items-center justify-center">
                        <Star className="w-5 h-5 text-amber-500 blur-[2px] absolute inset-0 opacity-70 animate-flicker" />
                        <Star className="w-5 h-5 text-amber-400 relative z-10 fill-amber-400/20" />
                      </div>
                      <span className="text-zinc-300 group-hover:text-amber-400 transition-all font-medium">
                        {actor.first_name} {actor.last_name}
                      </span>
                    </div>
                    <span className="text-zinc-600 font-mono text-sm">{actor.total_rentals}</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </main>

        
        <Popup open={open} onClose={() => setOpen(false)}>
          {selectedDetail && (
            <div className="p-8 text-white relative bg-[#121214]">
              {Array.isArray(selectedDetail) ? (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-1 bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
                    <h3 className="text-3xl font-black uppercase italic tracking-tighter">
                      {selectedDetail[0].first_name} {selectedDetail[0].last_name}
                    </h3>
                  </div>
                  <ul className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                    {selectedDetail.map((movie, index) => (
                      <li key={index} className="flex justify-between items-center border-b border-zinc-800/50 pb-2">
                        <div>
                          <p className="font-bold text-zinc-200 leading-tight">{movie.title}</p>
                          <p className="text-[10px] text-zinc-500 font-mono uppercase">{movie.release_year}</p>
                        </div>
                        <span className="text-amber-500 font-mono text-xs font-bold">{movie.total_rentals} RENTALS</span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-4xl font-black uppercase leading-none tracking-tighter w-2/3 text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500">
                      {selectedDetail.title}
                    </h3>
                    <span className="border border-amber-500/50 text-amber-500 px-3 py-1 text-[10px] font-mono rounded-full bg-amber-500/10">
                      {selectedDetail.rating}
                    </span>
                  </div>

                  <div className="flex gap-4 mb-6 text-[10px] font-bold font-mono text-amber-500 uppercase tracking-widest">
                    <span>{selectedDetail.category}</span>
                    <span className="text-zinc-700">•</span>
                    <span>{selectedDetail.length} MINS</span>
                    <span className="text-zinc-700">•</span>
                    <span>{selectedDetail.release_year}</span>
                  </div>

                  <p className="text-zinc-400 text-sm leading-relaxed mb-8 border-l-2 border-amber-500/30 pl-4 italic">
                    "{selectedDetail.description}"
                  </p>

                  <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
                    <p className="text-[10px] text-amber-500 font-mono uppercase mb-2 tracking-widest">Special Features</p>
                    <p className="text-xs font-medium text-zinc-300 leading-relaxed">{selectedDetail.special_features}</p>
                  </div>
                </div>
              )}

              <button 
                onClick={() => setOpen(false)}
                className="mt-8 w-full bg-white text-black py-3 rounded-xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-amber-500 transition-all duration-300"
              >
                Close Program
              </button>
            </div>
          )}
        </Popup>
      </div>
    </div>
  );
}

export default App;