import './App.css'
import Popup from './components/popup'
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function FilmDetails(){
    const {id} = useParams();
    const [film, setFilm] = useState([])
    const [isRentalOpen, setIsRentalOpen] = useState(false);

    const [rentalForm, setRentalForm] = useState({
      customer_id: '',
      first_name: '',
      last_name: '',
      email: '',
      rental_rate: '',
      rental_duration: ''
    });

    useEffect(() => {
    fetch(`/api/film-details/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setFilm(data);
      })
      .catch(err => console.error("Fetch error:", err))
  }, [id])

  const handleInputChange = (e) => {
    setRentalForm({ ...rentalForm, [e.target.name]: e.target.value });
  };
  

 const handleRentalSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      customer_id: parseInt(rentalForm.customer_id) || 0,
      inventory_id: parseInt(id) || 0, 
      rental_rate: parseFloat(rentalForm.rental_rate) || 0.0,
      rental_duration: parseInt(rentalForm.rental_duration) || 0
    };
    const response = await axios.post('/api/rentals', payload);

    if (response.status === 201) {
      alert("Rental successfully added to MySQL!");
    }
  };
 
  return (
    <div className="bg-black min-h-screen w-full relative overflow-x-hidden font-sans selection:bg-amber-500/30">
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-40"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/5 via-transparent to-transparent pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-7xl mx-auto p-8 md:p-16 text-white">
        <header className="border-b border-zinc-800 pb-12 mb-12">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <h1 className="font-tomorrow text-6xl font-black uppercase italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-[#FDE68A] via-[#F59E0B] to-[#B45309] drop-shadow-[0_0_15px_rgba(245,158,11,0.3)]">
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
                <h3 className="text-amber-500 font-mono text-[10px] uppercase tracking-widest mb-6 border-b border-amber-500/20 pb-2">
                  Special Features
                </h3>      
                <div className="flex flex-wrap gap-3">
                  {film.special_features ? (
                    film.special_features.split(',').map((feature) => (
                      <span 
                        key={feature} 
                        className="text-[10px] font-mono bg-zinc-800 border border-zinc-700 px-3 py-1.5 rounded text-zinc-300 uppercase tracking-tighter hover:border-amber-500/50 transition-colors"
                      >
                        {feature.trim()}
                      </span>
                    ))
                  ) : (
                    <span className="text-zinc-600 font-mono text-[10px] italic">No special features recorded</span>
                  )}
                </div>
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
        <div className="p-10 bg-[#121214] text-white max-w-lg rounded-2xl">
          <div className="border border-zinc-800 p-8 rounded-xl bg-black shadow-2xl">
            <h2 className="text-xl font-semibold mb-6 text-white">Rent Film</h2>
            
            <form onSubmit={handleRentalSubmit} className="space-y-4">
              <div>
                <label className="text-zinc-500 text-xs uppercase tracking-widest block mb-2">Customer ID</label>
                <input 
                  name="customer_id"
                  type="number" 
                  value={rentalForm.customer_id}
                  onChange={handleInputChange}
                  placeholder="e.g. 123"
                  required
                  className="w-full bg-[#121214] border border-zinc-800 p-3 rounded-lg focus:outline-none focus:border-[#D4AF37] transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-zinc-500 text-xs uppercase tracking-widest block mb-2">First Name</label>
                  <input 
                    name="first_name"
                    type="text" 
                    value={rentalForm.first_name}
                    onChange={handleInputChange}
                    placeholder="First Name"
                    className="w-full bg-[#121214] border border-zinc-800 p-3 rounded-lg focus:outline-none focus:border-[#D4AF37] transition-colors"
                  />
                </div>
                <div>
                  <label className="text-zinc-500 text-xs uppercase tracking-widest block mb-2">Last Name</label>
                  <input 
                    name="last_name"
                    type="text" 
                    value={rentalForm.last_name}
                    onChange={handleInputChange}
                    placeholder="Last Name"
                    className="w-full bg-[#121214] border border-zinc-800 p-3 rounded-lg focus:outline-none focus:border-[#D4AF37] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-zinc-900 pt-4">
                <div>
                  <label className="text-zinc-500 text-xs uppercase tracking-widest block mb-2 text-[#D4AF37]">Rental Rate ($)</label>
                  <input 
                    name="rental_rate"
                    type="number" 
                    step="0.01"
                    value={rentalForm.rental_rate}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    required
                    className="w-full bg-[#121214] border border-zinc-800 p-3 rounded-lg focus:outline-none focus:border-[#D4AF37] transition-colors"
                  />
                </div>
                <div>
                  <label className="text-zinc-500 text-xs uppercase tracking-widest block mb-2 text-[#D4AF37]">Duration (Days)</label>
                  <input 
                    name="rental_duration"
                    type="number" 
                    value={rentalForm.rental_duration}
                    onChange={handleInputChange}
                    placeholder="7"
                    required
                    className="w-full bg-[#121214] border border-zinc-800 p-3 rounded-lg focus:outline-none focus:border-[#D4AF37] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-500 text-xs uppercase tracking-widest block mb-2">Email Address</label>
                <input 
                  name="email"
                  type="email" 
                  value={rentalForm.email}
                  onChange={handleInputChange}
                  placeholder="customer@email.com"
                  className="w-full bg-[#121214] border border-zinc-800 p-3 rounded-lg focus:outline-none focus:border-[#D4AF37] transition-colors"
                />
              </div>

              <div className="pt-6 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setIsRentalOpen(false)}
                  className="flex-1 border border-zinc-800 p-3 rounded-lg hover:bg-zinc-900 transition-colors text-zinc-400"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-[#D4AF37] text-black font-bold p-3 rounded-lg hover:bg-[#B8962E] transition-colors"
                >
                  Confirm Rental
                </button>
              </div>
            </form>
          </div>
        </div>
      </Popup>
    </div>
  );
};

export default FilmDetails;