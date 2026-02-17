import './App.css'
import Popup from './components/popup'
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function FilmDetails(){
    const {id} = useParams();
    const [film, setFilm] = useState([])
    const [isRentalOpen, setIsRentalOpen] = useState(false);
    useEffect(() => {
    fetch(`/api/film-details/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setFilm(data);
      })
      .catch(err => console.error("Fetch error:", err))
  }, [id])
 
  return (
    <div className="bg-black min-h-screen w-full relative overflow-x-hidden font-sans selection:bg-amber-500/30">

  <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-40"></div>
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/5 via-transparent to-transparent pointer-events-none"></div>



  <div className="relative z-10 w-full max-w-7xl mx-auto p-8 md:p-16 text-white">

    <header className="border-b border-zinc-800 pb-12 mb-12">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <h1 className="font-tomorrow text-8xl font-black uppercase italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-[#FDE68A] via-[#F59E0B] to-[#B45309] drop-shadow-[0_0_15px_rgba(245,158,11,0.3)]">
          {film.title}
        </h1>
        <div className="flex gap-4">
          <span className="px-4 py-1 border border-amber-500/50 text-amber-500 font-mono text-xs rounded-full bg-amber-500/10">
            {film.rating}
          </span>
          <span className="px-4 py-1 border border-zinc-800 text-zinc-500 font-mono text-xs rounded-full bg-zinc-900">
            ID: {film.film_id}
          </span>
        </div>
      </div>
    </header>

    <main className="grid lg:grid-cols-3 gap-12">

      <section className="lg:col-span-2 space-y-8">
        <div>
          <h2 className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.4em] mb-4">Description</h2>
          <p className="text-3xl font-light leading-relaxed text-zinc-300 border-l-2 border-amber-500/30 pl-8 italic">
            "{film.description}"
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-8 border-t border-zinc-900">
          <div>
            <h3 className="text-zinc-600 font-mono text-[10px] uppercase mb-2">Duration</h3>
            <p className="text-2xl font-bold font-tomorrow">{film.length} MINS</p>
          </div>
          <div>
            <h3 className="text-zinc-600 font-mono text-[10px] uppercase mb-2">Release</h3>
            <p className="text-2xl font-bold font-tomorrow">{film.release_year}</p>
          </div>
          <div>
            <h3 className="text-zinc-600 font-mono text-[10px] uppercase mb-2">Language</h3>
            <p className="text-2xl font-bold font-tomorrow uppercase">{film.language}</p>
          </div>
        </div>
      </section>
      <aside className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-8 backdrop-blur-sm">
        <div className="space-y-10">
          <div>
            <h3 className="text-amber-500 font-mono text-[10px] uppercase tracking-widest mb-6 border-b border-amber-500/20 pb-2">Film special_features columns goes here</h3>
            <div className="flex flex-wrap gap-2">
              {film.special_features?.split(',').map(feature => (
                <span key={feature} className="text-[10px] font-mono bg-zinc-800 px-2 py-1 rounded text-zinc-400 uppercase">
                  {feature.trim()}
                </span>
              ))}
            </div>
          </div>

          <div>
            <ul className="space-y-4">
               <li className="flex items-center gap-3 group">
                 <div className="w-1 h-1 bg-amber-500 rounded-full group-hover:scale-150 transition-transform"></div>
                 <span className="text-sm font-bold text-zinc-400 group-hover:text-white transition-colors">"..."</span>
               </li>
            </ul>
          </div>
        </div>
      </aside>
    </main>
<footer className="mt-12 pt-12 border-t border-zinc-900">
  <button 
    onClick={() => setIsRentalOpen(true)}
    className="group relative w-full overflow-hidden rounded-2xl bg-zinc-900/50 p-1 transition-all hover:bg-zinc-900"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/40 to-amber-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
    <div className="relative flex items-center justify-center gap-4 rounded-xl bg-black px-8 py-10 border border-zinc-800 group-hover:border-amber-500/50 transition-colors">
      <div className="flex flex-col items-center">
        <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.5em] mb-2">Available Inventory System</span>
        <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white group-hover:text-amber-400 transition-colors">
          Rent this film to a customer
        </h2>
      </div>
      <div className="w-12 h-12 rounded-full border border-amber-500/20 flex items-center justify-center group-hover:border-amber-500 group-hover:shadow-[0_0_15px_rgba(245,158,11,0.4)] transition-all">
        <span className="text-amber-500 text-2xl">→</span>
      </div>
    </div>
  </button>
</footer>
  </div>
  <Popup open={isRentalOpen} onClose={() => setIsRentalOpen(false)}>
    <div className="p-10 bg-[#121214] text-white">
        <div className="border border-zinc-800 p-24 rounded-xl bg-black">
            <p className="text-zinc-600 text-xs uppercase tracking-widest">Form Logic Pending...</p>
        </div>
    </div>
  </Popup>
</div>
  );
};
  export default FilmDetails;